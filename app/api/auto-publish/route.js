import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSuggestions, updateSuggestionStatus } from '@/lib/suggestions';
import { createPost } from '@/lib/posts';
import { slugify } from '@/lib/slugify';

export const maxDuration = 300; // 5 minutes timeout for processing multiple posts

async function callAI(endpoint, body) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API error' }));
    throw new Error(error.error || `Failed to call ${endpoint}`);
  }

  return response.json();
}

async function processOneSuggestion(suggestion) {
  const log = { suggestion_id: suggestion.id, title: suggestion.title, steps: [] };

  try {
    // Step 1: Generate excerpt (resumo)
    log.steps.push({ step: 'generate_excerpt', status: 'started' });
    const excerptResult = await callAI('/api/ai/generate-excerpt', {
      title: suggestion.title,
      content: suggestion.excerpt || '',
      category: suggestion.category_name,
    });
    const excerpt = excerptResult.excerpt;
    log.steps.push({ step: 'generate_excerpt', status: 'completed', length: excerpt.length });

    // Step 2: Generate title
    log.steps.push({ step: 'generate_title', status: 'started' });
    const titleResult = await callAI('/api/ai/generate-title', {
      title: suggestion.title,
      excerpt,
      category: suggestion.category_name,
    });
    const title = titleResult.title || suggestion.title;
    log.steps.push({ step: 'generate_title', status: 'completed', title });

    // Step 3: Generate content
    log.steps.push({ step: 'generate_content', status: 'started' });
    const contentResult = await callAI('/api/ai/generate-content', {
      title,
      excerpt,
      source_url: suggestion.source_url,
      category: suggestion.category_name,
    });
    const content = contentResult.content;
    log.steps.push({ step: 'generate_content', status: 'completed', length: content.length });

    // Step 4: Generate cover image
    log.steps.push({ step: 'generate_image', status: 'started' });
    const imageResult = await callAI('/api/ai/generate-image-ai', {
      title,
      category: suggestion.category_name,
      content: excerpt,
    });
    const cover_image = imageResult.image_url;
    log.steps.push({ step: 'generate_image', status: 'completed', prompt: imageResult.prompt });

    // Step 5: Create post
    log.steps.push({ step: 'create_post', status: 'started' });
    const slug = slugify(title);
    const post = await createPost({
      title,
      slug,
      content,
      excerpt,
      cover_image,
      category_id: suggestion.category_id || 1,
      status: 'published', // Publish immediately
      source_url: suggestion.source_url,
      author: 'Redação',
      tags: suggestion.category_name || '',
    });
    log.steps.push({ step: 'create_post', status: 'completed', post_id: post.id });

    // Revalidate cache to show new post immediately
    revalidatePath('/');
    revalidatePath(`/post/${slug}`);

    // Step 6: Mark suggestion as approved
    log.steps.push({ step: 'approve_suggestion', status: 'started' });
    await updateSuggestionStatus(suggestion.id, 'approved');
    log.steps.push({ step: 'approve_suggestion', status: 'completed' });

    log.status = 'success';
    log.post_id = post.id;
    log.post_slug = post.slug;
    return log;

  } catch (err) {
    log.status = 'failed';
    log.error = err.message;
    log.error_stack = err.stack;
    return log;
  }
}

export async function POST(request) {
  try {
    // Check for secret token (both query param and CRON_SECRET header)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const authHeader = request.headers.get('authorization');

    // Accept either query param token or CRON_SECRET from Vercel cron jobs
    const isValidToken = token === process.env.CRON_SECRET;
    const isValidCronSecret = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isValidToken && !isValidCronSecret) {
      console.error('[auto-publish] Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[auto-publish] Authentication successful');

    // Get parameters
    const body = await request.json().catch(() => ({}));
    const maxPosts = parseInt(searchParams.get('maxPosts') || '') || body.maxPosts || 8;

    console.log(`[auto-publish] Starting auto-publish process (max: ${maxPosts} posts)`);

    // Fetch pending suggestions
    const result = await getSuggestions({ page: 1, limit: maxPosts, status: 'pending' });
    const suggestions = result.data;

    if (suggestions.length === 0) {
      return NextResponse.json({
        message: 'No pending suggestions to process',
        processed: 0,
        successful: 0,
        failed: 0,
      });
    }

    console.log(`[auto-publish] Found ${suggestions.length} pending suggestions`);

    // Process each suggestion sequentially (to avoid rate limits)
    const results = [];
    for (const suggestion of suggestions) {
      console.log(`[auto-publish] Processing suggestion ${suggestion.id}: ${suggestion.title}`);
      const result = await processOneSuggestion(suggestion);
      results.push(result);

      // Add a small delay between posts to avoid rate limits
      if (results.length < suggestions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;

    console.log(`[auto-publish] Completed: ${successful} successful, ${failed} failed`);

    // Final revalidation to ensure home page is updated
    if (successful > 0) {
      revalidatePath('/');
    }

    return NextResponse.json({
      message: 'Auto-publish process completed',
      processed: results.length,
      successful,
      failed,
      results,
    });

  } catch (err) {
    console.error('[auto-publish] Error:', err);
    return NextResponse.json(
      { error: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}

// Also allow GET for manual testing
export async function GET(request) {
  return POST(request);
}
