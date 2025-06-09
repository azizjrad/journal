"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "./language-switcher";
import { FontSizeController } from "./font-size-controller";
import { DateTimeDisplay } from "./date-time-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Article {
  id: number;
  title_en: string;
  title_ar: string;
  published_at: string;
}

interface HeaderProps {
  categories: Category[];
}

// Search Component
function SearchComponent() {
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  if (!searchOpen) {
    return (
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setSearchOpen(true)}
        className="h-12 w-12 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-200"
        title={t("search", "Search", "بحث")}
      >
        <Search className="h-6 w-6 text-gray-700" />
      </Button>
    );
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder={t(
            "search_placeholder",
            "Search news...",
            "ابحث في الأخبار..."
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 pl-4 pr-20 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200"
          autoFocus
          onBlur={handleClose}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Search className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </form>
  );
}

// Navigation Component
function Navigation({ categories }: { categories: Category[] }) {
  const { language, t } = useLanguage();

  return (
    <div className="hidden md:flex items-center space-x-10 rtl:space-x-reverse">
      <Link
        href="/"
        className="text-lg font-bold text-gray-800 hover:text-red-700 transition-all duration-300 py-3 px-2 border-b-3 border-transparent hover:border-red-700 relative group"
        prefetch={true}
      >
        {t("home", "Home", "الرئيسية")}
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </Link>
      <Link
        href="/news"
        className="text-lg font-bold text-gray-800 hover:text-red-700 transition-all duration-300 py-3 px-2 border-b-3 border-transparent hover:border-red-700 relative group"
        prefetch={true}
      >
        {t("all_news", "All News", "جميع الأخبار")}
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="text-lg font-bold text-gray-800 hover:text-red-700 transition-all duration-300 py-3 px-2 border-b-3 border-transparent hover:border-red-700 relative group"
          prefetch={true}
        >
          {language === "ar" ? category.name_ar : category.name_en}
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
      ))}
    </div>
  );
}

// Mobile Menu Component
function MobileMenu({
  categories,
  isOpen,
  onClose,
}: {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-6 pb-6 border-t-2 border-red-100 pt-6 bg-gradient-to-b from-gray-50 to-white -mx-4 lg:-mx-6 px-4 lg:px-6 rounded-b-xl shadow-lg">
      <div className="flex flex-col space-y-2">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-4 px-4 border-b border-gray-200 rounded-lg"
          onClick={onClose}
          prefetch={true}
        >
          {t("home", "Home", "الرئيسية")}
        </Link>
        <Link
          href="/news"
          className="text-xl font-bold text-gray-800 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-4 px-4 border-b border-gray-200 rounded-lg"
          onClick={onClose}
          prefetch={true}
        >
          {t("all_news", "All News", "جميع الأخبار")}
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="text-xl font-bold text-gray-800 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-4 px-4 border-b border-gray-200 last:border-b-0 rounded-lg"
            onClick={onClose}
            prefetch={true}
          >
            {language === "ar" ? category.name_ar : category.name_en}
          </Link>
        ))}
        <div className="pt-6 mt-4 border-t-2 border-gray-200">
          <Link href="/admin" onClick={onClose}>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-lg font-bold py-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl"
            >
              {t("admin", "Admin", "الإدارة")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header({ categories }: HeaderProps) {
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Breaking news ticker (simulated for demo)
  const breakingNews = [
    t("breaking1", "Latest updates from Libya", "آخر التحديثات من ليبيا"),
    t(
      "breaking2",
      "Economic developments in the region",
      "التطورات الاقتصادية في المنطقة"
    ),
    t("breaking3", "International news coverage", "تغطية الأخبار الدولية"),
  ];

  return (
    <>
      <header className="bg-white border-b-3 border-red-600 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-5 border-b border-gray-200">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse group"
            >
              <div className="text-4xl font-black text-red-700 tracking-tight hover:text-red-800 transition-colors duration-300">
                {t("site_title", "Akhbarna", "أخبارنا")}
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="text-sm text-gray-600 font-medium">
                  {t("tagline", "Breaking News", "آخر الأخبار")}
                </div>
                <div className="text-xs text-gray-400">
                  {t(
                    "subtitle",
                    "Your trusted news source",
                    "مصدرك الموثوق للأخبار"
                  )}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:block relative">
                <SearchComponent />
              </div>

              <div className="hidden md:flex items-center gap-6">
                <FontSizeController />
                <LanguageSwitcher />
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base font-semibold px-6 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-lg"
                  >
                    {t("admin", "Admin", "الإدارة")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-4">
            <div className="flex items-center justify-between">
              <div className="hidden md:flex items-center space-x-10 rtl:space-x-reverse">
                <Link
                  href="/"
                  className="text-lg font-bold text-gray-800 hover:text-red-700 transition-all duration-300 py-3 px-2 border-b-3 border-transparent hover:border-red-700 relative group"
                >
                  {t("home", "Home", "الرئيسية")}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="text-lg font-bold text-gray-800 hover:text-red-700 transition-all duration-300 py-3 px-2 border-b-3 border-transparent hover:border-red-700 relative group"
                  >
                    {language === "ar" ? category.name_ar : category.name_en}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                ))}
              </div>

              {/* Date/Time Display */}
              <DateTimeDisplay />

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center gap-3">
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-xl hover:bg-gray-100 border border-gray-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title={t("menu", "Menu", "القائمة")}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 md:h-7 md:w-7 text-gray-700" />
                  ) : (
                    <Menu className="h-6 w-6 md:h-7 md:w-7 text-gray-700" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />

                {/* Mobile menu content */}
                <div className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden shadow-2xl border-b-4 border-red-600">
                  {/* Header in mobile menu */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="text-2xl font-black text-red-700">
                      {t("site_title", "Akhbarna", "أخبارنا")}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileMenuOpen(false)}
                      className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    >
                      <X className="h-6 w-6 text-gray-700" />
                    </Button>
                  </div>

                  {/* Scrollable menu content */}
                  <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-4 space-y-4">
                      {/* Search in mobile menu */}
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(
                              e.target as HTMLFormElement
                            );
                            const query = formData.get("search") as string;
                            if (query?.trim()) {
                              router.push(
                                `/search?q=${encodeURIComponent(query.trim())}`
                              );
                              setMobileMenuOpen(false);
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <div className="relative flex-1">
                            <Input
                              name="search"
                              type="text"
                              placeholder={t(
                                "search_placeholder",
                                "Search news...",
                                "ابحث في الأخبار..."
                              )}
                              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant="ghost"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-red-50"
                            >
                              <Search className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </form>
                      </div>

                      {/* Navigation links */}
                      <div className="space-y-2">
                        <Link
                          href="/"
                          className="block text-xl font-bold text-gray-800 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-4 px-4 border-b border-gray-200 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t("home", "Home", "الرئيسية")}
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="block text-xl font-bold text-gray-800 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-4 px-4 border-b border-gray-200 last:border-b-0 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {language === "ar"
                              ? category.name_ar
                              : category.name_en}
                          </Link>
                        ))}
                      </div>

                      {/* Bottom section */}
                      <div className="pt-6 mt-4 border-t-2 border-gray-200 space-y-3">
                        {/* Date/Time for mobile */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-3 border border-gray-200">
                          <DateTimeDisplay isMobile={true} />
                        </div>
                        <FontSizeController />
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-lg font-bold py-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl"
                          >
                            {t("admin", "Admin", "الإدارة")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
