"use client";

import { useLanguage } from "@/lib/language-context";
import {
  Newspaper,
  TrendingUp,
  Globe,
  Users,
  Briefcase,
  Gamepad2,
  Heart,
  Car,
  Laptop,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface QuickNavigationProps {
  categories: Category[];
}

export function QuickNavigation({ categories }: QuickNavigationProps) {
  const { language, t } = useLanguage();

  const getIconForCategory = (slug: string, index: number) => {
    const iconMap: { [key: string]: any } = {
      politics: Globe,
      business: Briefcase,
      technology: Laptop,
      sports: TrendingUp,
      entertainment: Gamepad2,
      health: Heart,
      automotive: Car,
      education: BookOpen,
    };

    const fallbackIcons = [
      Newspaper,
      Globe,
      TrendingUp,
      Users,
      Briefcase,
      Gamepad2,
      Heart,
      Car,
    ];

    return iconMap[slug] || fallbackIcons[index % fallbackIcons.length];
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-gray-900 mb-6">
          {t("quick_navigation", "Quick Navigation", "التنقل السريع")}
        </h3>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t(
            "navigation_description",
            "Jump directly to the topics that interest you most with our organized news sections",
            "انتقل مباشرة إلى المواضيع التي تهمك أكثر مع أقسام الأخبار المنظمة لدينا"
          )}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mt-8"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.slice(0, 8).map((category, index) => {
          const IconComponent = getIconForCategory(category.slug, index);

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-2xl transition-all duration-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-white transform hover:-translate-y-2 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100/50 to-transparent rounded-full transform translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-red-500 group-hover:to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                  <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h4 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors duration-300 mb-3">
                    {language === "ar" ? category.name_ar : category.name_en}
                  </h4>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mb-4 text-sm leading-relaxed">
                    {t(
                      "explore_section",
                      "Discover the latest updates and comprehensive coverage",
                      "اكتشف آخر التحديثات والتغطية الشاملة"
                    )}
                  </p>{" "}
                  {/* Arrow */}
                  <div className="flex items-center text-red-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <span className="mr-2">
                      {t("read_more", "Read More", "اقرأ المزيد")}
                    </span>
                    {language === "ar" ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
