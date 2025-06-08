"use client";

import { useLanguage } from "@/lib/language-context";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title_en: string;
  title_ar: string;
  published_at: string;
}

interface BreakingNewsTickerProps {
  articles?: Article[];
}

export const BreakingNewsTicker = memo(function BreakingNewsTicker({
  articles = [],
}: BreakingNewsTickerProps) {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Memoize sorted articles to prevent unnecessary recalculations
  const sortedArticles = useMemo(() => {
    return articles
      .sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      )
      .slice(0, 5);
  }, [articles]);

  // Default breaking news if no articles provided - memoized
  const defaultItems: Article[] = useMemo(
    () => [
      {
        id: 1,
        title_en: "Latest updates from Libya's economic developments",
        title_ar: "آخر التحديثات حول التطورات الاقتصادية في ليبيا",
        published_at: new Date().toISOString(),
      },
      {
        id: 2,
        title_en: "International diplomatic meetings continue in Tripoli",
        title_ar: "الاجتماعات الدبلوماسية الدولية تتواصل في طرابلس",
        published_at: new Date().toISOString(),
      },
      {
        id: 3,
        title_en: "Regional cooperation initiatives show positive progress",
        title_ar: "مبادرات التعاون الإقليمي تظهر تقدماً إيجابياً",
        published_at: new Date().toISOString(),
      },
    ],
    []
  );

  const newsItems = useMemo(() => {
    return sortedArticles.length > 0 ? sortedArticles : defaultItems;
  }, [sortedArticles, defaultItems]);

  // Memoize scroll handler
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    if (newsItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [newsItems.length]);

  // Handle scroll behavior to hide/show breaking news
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (newsItems.length === 0) return null;
  const currentItem = newsItems[currentIndex];
  const displayText =
    language === "ar" ? currentItem.title_ar : currentItem.title_en;
  return (
    <div
      className={`bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden transition-all duration-300 ${
        isVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      }`}
      role="banner"
      aria-label="Breaking news"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center py-3">
          <div className="flex items-center gap-3 mr-4 rtl:mr-0 rtl:ml-4">
            <div className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide shadow-sm border border-red-200">
              {t("breaking", "Breaking", "عاجل")}
            </div>
            <div className="flex gap-1" aria-hidden="true">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-red-300 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>{" "}
          <div className="flex-1 overflow-hidden">
            <div className="relative h-10 flex items-center">
              <Link
                href={`/article/${currentItem.id}`}
                className="absolute inset-0 flex items-center text-lg font-semibold animate-in slide-in-from-right-4 duration-700 hover:text-red-100 transition-colors cursor-pointer"
                role="alert"
                aria-live="polite"
              >
                <span className="whitespace-nowrap overflow-hidden text-ellipsis pr-4">
                  {displayText}
                </span>
              </Link>
            </div>
          </div>
          {newsItems.length > 1 && (
            <div
              className="flex gap-2 ml-4 rtl:ml-0 rtl:mr-4"
              role="tablist"
              aria-label="Breaking news navigation"
            >
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 ${
                    index === currentIndex
                      ? "bg-white shadow-sm"
                      : "bg-red-300 hover:bg-red-200"
                  }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to news item ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
});
