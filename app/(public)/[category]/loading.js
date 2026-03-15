/**
 * Skeleton screen para página de categoria
 * Mostra enquanto os posts da categoria estão sendo carregados
 */
export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Posts grid skeleton */}
        <div className="flex-1 min-w-0">
          {/* Category title skeleton */}
          <div className="h-10 bg-gray-200 rounded w-64 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-20" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
