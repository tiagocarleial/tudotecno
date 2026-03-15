/**
 * Skeleton screen para página de post
 * Mostra enquanto o post está sendo carregado
 */
export default function PostLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Article skeleton */}
        <article className="flex-1 min-w-0">
          {/* Cover image skeleton */}
          <div className="relative rounded-xl overflow-hidden aspect-video mb-6 bg-gray-200" />

          {/* Category badge skeleton */}
          <div className="mb-4 flex gap-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Excerpt skeleton */}
          <div className="space-y-2 mb-6 border-l-4 border-gray-200 pl-4">
            <div className="h-5 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Meta skeleton */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </article>

        {/* Sidebar skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-gray-200">
                  <div className="w-24 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
