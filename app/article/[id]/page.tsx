import {
  getArticleByIdCached,
  getCategoriesCached,
  getRecentArticlesCached,
  type Article,
  type Category,
} from "@/lib/db";
import { Header } from "@/components/header";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { Breadcrumb } from "@/components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { ViewTracker } from "@/components/view-tracker";
import { ShareButtons } from "@/components/share-buttons";
import { notFound } from "next/navigation";
import { ArticleContent } from "./article-content";
import { ShareButtonsSection } from "./share-buttons-section";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleByIdCached(parseInt(id));

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // Combine keywords from meta_keywords and tags
  const keywords = [
    ...(article.meta_keywords_en ? article.meta_keywords_en.split(",") : []),
    ...(article.tags ? article.tags.map((t) => t.name_en) : []),
  ].join(", ");

  return {
    title: `${article.title_en} | News Portal`,
    description: article.meta_description_en || article.excerpt_en,
    keywords,
    openGraph: {
      title: article.title_en,
      description: article.meta_description_en || article.excerpt_en,
      images: [
        {
          url: article.image_url,
          width: 1200,
          height: 630,
          alt: article.title_en,
        },
      ],
      type: "article",
      publishedTime: article.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title_en,
      description: article.meta_description_en || article.excerpt_en,
      images: [article.image_url],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const [article, categories, recentArticles] = await Promise.all([
    getArticleByIdCached(Number.parseInt(resolvedParams.id)),
    getCategoriesCached(),
    getRecentArticlesCached(10), // Get recent articles for breaking news ticker
  ]);

  if (!article) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(article.category_name_en
      ? [
          {
            label: article.category_name_en,
            href: `/category/${article.category_slug}`,
          },
        ]
      : []),
    {
      label:
        article.title_en.length > 50
          ? article.title_en.substring(0, 50) + "..."
          : article.title_en,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewTracker articleId={article.id} title={article.title_en} />
      <Header categories={categories} />
      <BreakingNewsTicker articles={recentArticles} />
      <Breadcrumb items={breadcrumbItems} />

      <main className="container mx-auto px-4 lg:px-6 py-6">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Article Header */}
          <div className="relative h-64 md:h-96 bg-gray-100">
            <Image
              src={article.image_url || "/placeholder.svg"}
              alt={article.title_en}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Article Content with Language Support */}
          <ArticleContent article={article} />

          {/* Meta Information */}
          <div className="px-6 md:px-10 pb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {article.reading_time_minutes ||
                    estimateReadingTime(article.content_en)}{" "}
                  min read
                </span>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="border-t-2 border-gray-200 mt-4 bg-gray-50 px-6 md:px-10 py-6 rounded-b-xl">
            <ShareButtonsSection article={article} />
          </div>
        </article>
      </main>
      <Footer categories={categories} />
    </div>
  );
}
