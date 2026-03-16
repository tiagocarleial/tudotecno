import Groq from 'groq-sdk';

/**
 * Tries multiple LLM providers in sequence until one succeeds
 * @param {string} prompt - The prompt to send to the LLM
 * @param {object} options - Options like max_tokens, temperature
 * @returns {Promise<string>} - The generated text
 */
export async function callLLMWithFallback(prompt, options = {}) {
  const { max_tokens = 500, temperature = 0.7 } = options;

  // List of providers to try in order
  const providers = [
    {
      name: 'Groq (Llama 3.3 70B)',
      async call() {
        if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await client.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens,
          temperature,
        });

        return completion.choices[0]?.message?.content?.trim() || '';
      }
    },
    {
      name: 'Groq (Llama 3.1 8B - Faster)',
      async call() {
        if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await client.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens,
          temperature,
        });

        return completion.choices[0]?.message?.content?.trim() || '';
      }
    },
    {
      name: 'Groq (Mixtral 8x7B)',
      async call() {
        if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await client.chat.completions.create({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          max_tokens,
          temperature,
        });

        return completion.choices[0]?.message?.content?.trim() || '';
      }
    },
    {
      name: 'Groq (Gemma 7B)',
      async call() {
        if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await client.chat.completions.create({
          model: 'gemma2-9b-it',
          messages: [{ role: 'user', content: prompt }],
          max_tokens,
          temperature,
        });

        return completion.choices[0]?.message?.content?.trim() || '';
      }
    },
  ];

  let lastError = null;

  // Try each provider until one succeeds
  for (const provider of providers) {
    try {
      console.log(`[ai-fallback] Trying: ${provider.name}`);
      const result = await provider.call();
      console.log(`[ai-fallback] Success with: ${provider.name}`);
      return result;
    } catch (error) {
      console.warn(`[ai-fallback] Failed with ${provider.name}:`, error.message);
      lastError = error;
      // Continue to next provider
    }
  }

  // If all providers failed, throw the last error
  throw new Error(`All LLM providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
