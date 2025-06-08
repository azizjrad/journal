"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { memo } from "react";

interface Article {
  id: number;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  image_url: string;
  published_at: string;
  category_name_en?: string;
  category_name_ar?: string;
  category_slug?: string;
  tags?: { name_en: string; slug: string }[];
  reading_time_minutes?: number;
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard = memo(function ArticleCard({
  article,
  featured = false,
}: ArticleCardProps) {
  const { language } = useLanguage();

  const title = language === "ar" ? article.title_ar : article.title_en;
  const excerpt = language === "ar" ? article.excerpt_ar : article.excerpt_en;
  const categoryName =
    language === "ar" ? article.category_name_ar : article.category_name_en;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "ar"
      ? date.toLocaleDateString("ar-SA")
      : date.toLocaleDateString("en-US");
  };

  if (featured) {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 group">
        <Link href={`/article/${article.id}`} className="block" prefetch={true}>
          <div className="relative h-64 md:h-80">
            <Image
              src={article.image_url || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={featured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              {categoryName && (
                <Badge
                  variant="secondary"
                  className="mb-3 bg-red-600 text-white hover:bg-red-700 text-sm font-semibold"
                >
                  {categoryName}
                </Badge>
              )}
              <h2 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-red-200 transition-colors">
                {title}
              </h2>
              <p className="text-sm opacity-90 line-clamp-2 leading-relaxed mb-3">
                {excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 group bg-white">
      <Link href={`/article/${article.id}`} className="block" prefetch={true}>
        <div className="relative h-48">
          <Image
            src={article.image_url || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6">
          {categoryName && (
            <Badge
              variant="outline"
              className="mb-3 border-red-600 text-red-600 hover:bg-red-50 font-semibold"
            >
              {categoryName}
            </Badge>
          )}
          <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight text-gray-900 group-hover:text-red-700 transition-colors">
            {title}
          </h3>
          <p className="text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
          {/* Tags display */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {article.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="inline-block bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full"
                >
                  #{tag.name_en}
                </span>
              ))}
            </div>
          )}
          {/* Reading time and date */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.published_at}>
                {formatDate(article.published_at)}
              </time>
            </div>
            {article.reading_time_minutes && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {article.reading_time_minutes} min read
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});
