"use client";

import { useLanguage } from "@/lib/language-context";
import { HeroCarousel } from "@/components/hero-carousel";
import { TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

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
  is_featured: boolean;
}

interface HeroSectionProps {
  featuredArticles: Article[];
}

export function HeroSection({ featuredArticles }: HeroSectionProps) {
  const { language, t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="container mx-auto px-4 lg:px-6 py-16 relative">
        {/* Breaking News Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="tracking-wider">
              {t("breaking_news", "BREAKING NEWS", "أخبار عاجلة")}
            </span>
          </div>

          {/* Masthead */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t("digital_journal", "DIGITAL JOURNAL", "المجلة الرقمية")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t(
              "latest_updates",
              "Stay informed with breaking news, in-depth analysis, and exclusive insights from around the globe",
              "ابق على اطلاع بالأخبار العاجلة والتحليلات المتعمقة والرؤى الحصرية من جميع أنحاء العالم"
            )}
          </p>
        </div>

        {/* Featured Articles Grid */}
        {featuredArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            {/* Main Featured Story */}
            <div className="lg:col-span-2">
              <HeroCarousel articles={featuredArticles.slice(0, 3)} />
            </div>

            {/* Trending Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-bold">
                    {t("trending_now", "Trending Now", "الأكثر رواجاً")}
                  </h3>
                </div>

                <div className="space-y-5">
                  {featuredArticles.slice(3, 6).map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.id}`}
                      className="group block"
                    >
                      <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-base font-semibold leading-tight group-hover:text-red-300 transition-colors line-clamp-2">
                            {language === "ar"
                              ? article.title_ar
                              : article.title_en}
                          </h4>
                          <div className="flex items-center mt-3 text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              {new Date(
                                article.published_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
