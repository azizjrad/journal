"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Tag,
  FileText,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";
import { DeleteArticleButton } from "@/components/delete-article-button";
import { CategoryManagement } from "@/components/category-management";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { ContentCalendar } from "@/components/content-calendar";
import { AnalyticsData, ScheduledArticle } from "@/lib/db";

interface Article {
  id: number;
  title_en: string;
  title_ar: string;
  is_published: boolean;
  is_featured: boolean;
  category_name_en?: string;
  category_name_ar?: string;
  created_at: string;
}

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  created_at: string;
}

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  initialAnalytics?: AnalyticsData;
  initialScheduledArticles?: ScheduledArticle[];
}

export function AdminDashboard({
  articles,
  categories,
  initialAnalytics,
  initialScheduledArticles = [],
}: AdminDashboardProps) {
  const [currentArticles, setCurrentArticles] = useState(articles);
  const [currentCategories, setCurrentCategories] = useState(categories);
  const [scheduledArticles, setScheduledArticles] = useState(
    initialScheduledArticles
  );

  // Pagination state for articles
  const [articlesCurrentPage, setArticlesCurrentPage] = useState(1);
  const articlesPerPage = 10;

  // Calculate pagination for articles
  const totalArticlePages = Math.ceil(currentArticles.length / articlesPerPage);
  const startArticleIndex = (articlesCurrentPage - 1) * articlesPerPage;
  const endArticleIndex = startArticleIndex + articlesPerPage;
  const paginatedArticles = currentArticles.slice(
    startArticleIndex,
    endArticleIndex
  );
  const handleArticleDelete = (articleId: number) => {
    setCurrentArticles((prev) => {
      const filtered = prev.filter((article) => article.id !== articleId);
      // Reset to page 1 if current page becomes empty
      if (paginatedArticles.length === 1 && articlesCurrentPage > 1) {
        setArticlesCurrentPage(articlesCurrentPage - 1);
      }
      return filtered;
    });
  };

  const handleCategoryUpdate = (updatedCategories: Category[]) => {
    setCurrentCategories(updatedCategories);
  };

  const handleScheduleUpdate = async () => {
    try {
      const response = await fetch("/api/admin/schedule");
      if (response.ok) {
        const data = await response.json();
        setScheduledArticles(data);
      }
    } catch (error) {
      console.error("Failed to fetch scheduled articles:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Professional Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  Content Management System
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage articles, categories, and content publishing
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Site{" "}
                  </Button>
                </Link>
                {/* Authentication removed - no logout needed */}
              </div>
            </div>
          </div>

          {/* Professional Stats Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Articles
                    </p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {currentArticles.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      All content pieces
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Published
                    </p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {currentArticles.filter((a) => a.is_published).length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Live articles</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Featured
                    </p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {currentArticles.filter((a) => a.is_featured).length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Highlighted content
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <Zap className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Categories
                    </p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {currentCategories.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Content groups</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Tabbed Interface */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <Tabs defaultValue="articles" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
                <TabsTrigger
                  value="articles"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-600 hover:text-gray-900"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Articles
                </TabsTrigger>{" "}
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-600 hover:text-gray-900"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Categories
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-600 hover:text-gray-900"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-600 hover:text-gray-900"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Articles Tab */}
            <TabsContent value="articles" className="p-0">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Article Management
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Create, edit, and manage your news articles
                    </p>
                  </div>
                  <Link href="/admin/articles/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Article
                    </Button>
                  </Link>
                </div>{" "}
                <div className="space-y-4">
                  {currentArticles.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No articles yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Get started by creating your first article
                      </p>
                      <Link href="/admin/articles/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Article
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {paginatedArticles.map((article) => (
                          <div
                            key={article.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                      {article.title_en}
                                    </h3>
                                    <p className="text-gray-600 font-arabic mb-4 leading-relaxed">
                                      {article.title_ar}
                                    </p>

                                    <div className="flex items-center gap-3 mb-3">
                                      {article.is_published ? (
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                          Published
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                          Draft
                                        </Badge>
                                      )}

                                      {article.is_featured && (
                                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                          Featured
                                        </Badge>
                                      )}

                                      {article.category_name_en && (
                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                          {article.category_name_en}
                                        </Badge>
                                      )}
                                    </div>

                                    <p className="text-sm text-gray-500">
                                      Created{" "}
                                      {new Date(
                                        article.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-6">
                                <Link
                                  href={`/admin/articles/${article.id}/edit`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <DeleteArticleButton
                                  articleId={article.id}
                                  articleTitle={article.title_en}
                                  onDelete={handleArticleDelete}
                                />
                              </div>{" "}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination for articles */}
                      <Pagination
                        currentPage={articlesCurrentPage}
                        totalPages={totalArticlePages}
                        onPageChange={setArticlesCurrentPage}
                        itemsPerPage={articlesPerPage}
                        totalItems={currentArticles.length}
                      />
                    </>
                  )}
                </div>
              </div>
            </TabsContent>{" "}
            {/* Categories Tab */}
            <TabsContent value="categories" className="p-0">
              <div className="p-8">
                <CategoryManagement
                  categories={currentCategories}
                  onCategoriesUpdate={handleCategoryUpdate}
                />
              </div>
            </TabsContent>{" "}
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-0">
              <div className="p-8">
                {initialAnalytics ? (
                  <AnalyticsDashboard initialData={initialAnalytics} />
                ) : (
                  <div className="text-center py-16">
                    <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Analytics Starting Fresh
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No analytics data yet - ready to start tracking real user
                      activity!
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mb-6">
                      <h4 className="font-medium text-blue-900 mb-3">
                        To start collecting analytics:
                      </h4>
                      <ul className="text-blue-800 text-sm space-y-2 text-left">
                        <li>• Visit article pages to generate page views</li>
                        <li>• Interact with content (shares, likes)</li>
                        <li>• Analytics will automatically appear here</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-500 text-sm">
                        <strong>Next steps:</strong>
                      </p>
                      <p className="text-gray-500 text-sm">
                        1. Browse to{" "}
                        <Link
                          href="/"
                          className="text-blue-600 hover:underline"
                        >
                          your homepage
                        </Link>{" "}
                        to start generating real data
                      </p>
                      <p className="text-gray-500 text-sm">
                        2. Read some articles to create page views
                      </p>
                      <p className="text-gray-500 text-sm">
                        3. Return here to see your real analytics data
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            {/* Calendar Tab */}
            <TabsContent value="calendar" className="p-0">
              <div className="p-8">
                <ContentCalendar
                  scheduledArticles={scheduledArticles}
                  articles={currentArticles}
                  onScheduleUpdate={handleScheduleUpdate}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
