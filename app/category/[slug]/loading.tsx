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
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>

        {/* Articles grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
