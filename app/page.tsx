import {
  getArticles,
  getCategories,
  getCategoriesCached,
  getFeaturedArticlesCached,
  getRecentArticlesCached,
} from "@/lib/db";
import { Header } from "@/components/header";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { HomeBreadcrumb } from "@/components/home-breadcrumb";
import { HomeContent } from "@/components/home-content";
import { Footer } from "@/components/footer";

export default async function HomePage() {
  const [otherArticles, featuredArticles, categories, allArticles] =
    await Promise.all([
      getArticles(12), // Get more regular articles
      getFeaturedArticlesCached(5), // Get 5 featured articles for hero
      getCategoriesCached(),
      getRecentArticlesCached(10), // Get recent articles for breaking news ticker
    ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header categories={categories} />
      <BreakingNewsTicker articles={allArticles} />
      <HomeBreadcrumb />
      <HomeContent
        featuredArticles={featuredArticles}
        otherArticles={otherArticles}
        categories={categories}
      />
      <Footer categories={categories} />
    </div>
  );
}
