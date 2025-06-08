"use client";

import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { LatestNewsSection } from "@/components/home/latest-news-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { QuickNavigation } from "@/components/home/quick-navigation";

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

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface HomeContentProps {
  featuredArticles: Article[];
  otherArticles: Article[];
  categories: Category[];
}

export function HomeContent({
  featuredArticles,
  otherArticles,
  categories,
}: HomeContentProps) {
  return (
    <main className="bg-white">
      {/* Hero Section with Breaking News and Featured Stories */}
      <HeroSection featuredArticles={featuredArticles} />

      {/* News Categories Navigation */}
      <CategoriesSection categories={categories} />

      {/* Latest News Grid */}
      <LatestNewsSection articles={otherArticles} />

      {/* Newsletter Subscription */}
      <NewsletterSection />

      {/* Quick Navigation to Categories */}
      <QuickNavigation categories={categories} />
    </main>
  );
}
