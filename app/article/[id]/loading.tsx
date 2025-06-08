import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
      </div>

      {/* Breaking news skeleton */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-red-500 rounded animate-pulse w-64"></div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            {/* Article image skeleton */}
            <div className="aspect-video bg-gray-200 animate-pulse rounded-lg mb-6"></div>

            {/* Article title skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>

            {/* Article meta skeleton */}
            <div className="flex items-center space-x-4 mb-8 pb-4 border-b">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>

            {/* Article content skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
