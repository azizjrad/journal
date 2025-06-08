"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const { language, t } = useLanguage();

  return (
    <div className="border-y border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("explore_categories", "Explore Categories", "استكشف الفئات")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t(
              "categories_description",
              "Discover news across different topics and stay updated on what matters to you",
              "اكتشف الأخبار عبر مواضيع مختلفة وابق محدثاً حول ما يهمك"
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6 text-center bg-gradient-to-br from-white to-gray-50">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${getGradientColor(
                      index
                    )} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Newspaper className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                    {language === "ar" ? category.name_ar : category.name_en}
                  </h3>
                  <div className="mt-3 w-8 h-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t("view_all_categories", "View All Categories", "عرض جميع الفئات")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function getGradientColor(index: number): string {
  const gradients = [
    "from-red-500 to-red-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
    "from-indigo-500 to-indigo-600",
  ];
  return gradients[index % gradients.length];
}
