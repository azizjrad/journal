import {
  getArticles,
  getCategoriesCached,
  getRecentArticlesCached,
  type Article,
  type Category,
} from "@/lib/db";
import { Header } from "@/components/header";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { Breadcrumb } from "@/components/breadcrumb";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import { NewsPageContent } from "@/components/news-page-content";

export const metadata: Metadata = {
  title: "All News - Digital Journal - الجريدة الرقمية",
  description:
    "Browse all news articles from Digital Journal. Stay updated with the latest breaking news, politics, business, technology, and more from around the world - تصفح جميع الأخبار من الجريدة الرقمية",
  keywords: [
    "news",
    "all articles",
    "latest news",
    "breaking news",
    "digital journal",
    "أخبار",
    "جميع الأخبار",
    "آخر الأخبار",
  ],
  openGraph: {
    title: "All News - Digital Journal",
    description:
      "Browse all news articles from Digital Journal. Latest breaking news and updates from around the world.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All News - Digital Journal",
    description:
      "Browse all news articles from Digital Journal. Latest breaking news and updates from around the world.",
  },
};

interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ARTICLES_PER_PAGE = 24;

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const [allArticles, categories, recentArticles] = await Promise.all([
    getArticles(), // Get all articles
    getCategoriesCached(),
    getRecentArticlesCached(10),
  ]);

  // Calculate pagination
  const totalArticles = allArticles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const paginatedArticles = allArticles.slice(
    offset,
    offset + ARTICLES_PER_PAGE
  );

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "All News" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header categories={categories} />
      <BreakingNewsTicker articles={recentArticles} />
      <Breadcrumb items={breadcrumbItems} />
      <NewsPageContent
        paginatedArticles={paginatedArticles}
        currentPage={currentPage}
        totalPages={totalPages}
        totalArticles={totalArticles}
      />

      <Footer categories={categories} />
    </div>
  );
}
