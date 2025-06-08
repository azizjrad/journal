import {
  advancedSearchArticles,
  getCategories,
  SearchFilters,
  getPopularSearches,
} from "@/lib/db";
import { Header } from "@/components/header";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { AdvancedSearchForm } from "@/components/advanced-search-form";

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;

  // Build search filters from URL params
  const filters: SearchFilters = {
    query: resolvedSearchParams.q || "",
    categoryId: resolvedSearchParams.category
      ? parseInt(resolvedSearchParams.category)
      : undefined,
    dateFrom: resolvedSearchParams.dateFrom || undefined,
    dateTo: resolvedSearchParams.dateTo || undefined,
    tags: resolvedSearchParams.tags
      ? resolvedSearchParams.tags.split(",")
      : undefined,
    sortBy:
      (resolvedSearchParams.sortBy as "date" | "relevance" | "popularity") ||
      "date",
    sortOrder: (resolvedSearchParams.sortOrder as "asc" | "desc") || "desc",
  };

  const hasFilters =
    filters.query ||
    filters.categoryId ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.tags?.length;
  const [searchResults, categories, popularSearches] = await Promise.all([
    hasFilters ? advancedSearchArticles(filters) : Promise.resolve([]),
    getCategories(),
    getPopularSearches(),
  ]);

  // Ensure searchResults is always an array
  const articleResults = Array.isArray(searchResults) ? searchResults : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header categories={categories} />
      <BreakingNewsTicker articles={articleResults.slice(0, 5)} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Advanced Search</h1>
          {/* Advanced Search Form */}
          <AdvancedSearchForm
            categories={categories}
            popularSearches={popularSearches}
            initialFilters={filters}
          />
        </div>
        {/* Search Results */}
        {hasFilters && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Search Results</h2>
              <div className="text-gray-600">
                {articleResults.length} results found
              </div>
            </div>
            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.query && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Query: "{filters.query}"
                </span>
              )}
              {filters.categoryId && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Category:{" "}
                  {categories.find((c) => c.id === filters.categoryId)?.name_en}
                </span>
              )}
              {filters.dateFrom && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  From: {new Date(filters.dateFrom).toLocaleDateString()}
                </span>
              )}
              {filters.dateTo && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  To: {new Date(filters.dateTo).toLocaleDateString()}
                </span>
              )}
              {filters.tags &&
                filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                  >
                    Tag: {tag}
                  </span>
                ))}
            </div>
            {articleResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No articles found matching your criteria.
                </p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articleResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
        {!hasFilters && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Start Your Search</h2>
            <p className="text-gray-600 mb-6">
              Use the advanced search form above to find specific articles, or
              browse popular searches below.
            </p>
            {/* Popular Searches */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search, index) => (
                  <a
                    key={index}
                    href={`/search?q=${encodeURIComponent(search.text)}`}
                    className="bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-full text-sm transition-colors duration-200"
                  >
                    {search.text}
                    {search.count && (
                      <span className="ml-2 text-gray-500">
                        ({search.count})
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer categories={categories} />
    </div>
  );
}
