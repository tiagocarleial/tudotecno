import PostCard from './PostCard';

export default function RelatedPosts({ posts }) {
  if (!posts?.length) return null;

  return (
    <section className="mt-10 pt-8 border-t border-[var(--border)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-brand-blue rounded-full" />
        <h2 className="text-xl font-bold text-[var(--text-strong)]">Veja também</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
