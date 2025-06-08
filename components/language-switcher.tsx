"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 border border-gray-200">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className={`px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 ${
          language === "en"
            ? "bg-white text-red-700 shadow-sm border border-red-200"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        EN
      </Button>
      <Button
        variant={language === "ar" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("ar")}
        className={`px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 ${
          language === "ar"
            ? "bg-white text-red-700 shadow-sm border border-red-200"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        عربي
      </Button>
    </div>
  );
}
