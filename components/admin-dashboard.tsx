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
  Users,
  Zap,
  BarChart3,
  LogOut,
} from "lucide-react";
import { DeleteArticleButton } from "@/components/delete-article-button";
import { CategoryManagement } from "@/components/category-management";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { LogoutButton } from "@/components/logout-button";
import { AnalyticsData } from "@/lib/db";
import { useAuth } from "@/lib/admin-auth";

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
}

export function AdminDashboard({
  articles,
  categories,
  initialAnalytics,
}: AdminDashboardProps) {
  const [currentArticles, setCurrentArticles] = useState(articles);
  const [currentCategories, setCurrentCategories] = useState(categories);

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern - matching website hero */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Header with Brand Identity */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl mb-8">
          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    Akhbarna Dashboard
                  </h1>
                  <p className="text-red-300 mt-1 font-medium">
                    Content Management System
                  </p>
                </div>
              </div>{" "}
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="text-white border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Site
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Total Articles
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {currentArticles.length}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      All content pieces
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6 text-blue-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Published
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {currentArticles.filter((a) => a.is_published).length}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Live articles</p>
                  </div>{" "}
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6 text-green-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Featured
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {currentArticles.filter((a) => a.is_featured).length}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Highlighted content
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl backdrop-blur-sm">
                    <Zap className="h-6 w-6 text-amber-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      Categories
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {currentCategories.length}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Content groups</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6 text-purple-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Enhanced Tabbed Interface */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <Tabs defaultValue="articles" className="w-full">
            <div className="border-b border-white/10 bg-gradient-to-r from-red-600/10 to-red-700/10 rounded-t-2xl">
              <TabsList className="h-auto p-0 bg-transparent w-full justify-start rounded-none">
                <TabsTrigger
                  value="articles"
                  className="data-[state=active]:bg-red-600/20 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-red-400 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Articles
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Categories
                </TabsTrigger>{" "}
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-green-600/20 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-400 rounded-none border-b-2 border-transparent px-8 py-4 font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Articles Tab */}
            <TabsContent value="articles" className="p-0">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Article Management
                    </h2>
                    <p className="text-gray-300 mt-1">
                      Create, edit, and manage your news articles
                    </p>
                  </div>
                  <Link href="/admin/articles/new">
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                      <Plus className="h-4 w-4 mr-2" />
                      New Article
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {currentArticles.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        No articles yet
                      </h3>
                      <p className="text-gray-300 mb-6">
                        Get started by creating your first article
                      </p>
                      <Link href="/admin/articles/new">
                        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold">
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
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                      {article.title_en}
                                    </h3>
                                    <p className="text-gray-300 font-arabic mb-4 leading-relaxed">
                                      {article.title_ar}
                                    </p>

                                    <div className="flex items-center gap-3 mb-3">
                                      {article.is_published ? (
                                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30 backdrop-blur-sm">
                                          Published
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30 backdrop-blur-sm">
                                          Draft
                                        </Badge>
                                      )}

                                      {article.is_featured && (
                                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 backdrop-blur-sm">
                                          Featured
                                        </Badge>
                                      )}

                                      {article.category_name_en && (
                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 backdrop-blur-sm">
                                          {article.category_name_en}
                                        </Badge>
                                      )}
                                    </div>

                                    <p className="text-sm text-gray-400">
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
                                    className="text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white transition-all duration-200"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <DeleteArticleButton
                                  articleId={article.id}
                                  articleTitle={article.title_en}
                                  onDelete={handleArticleDelete}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Enhanced Pagination */}
                      <div className="mt-8">
                        <Pagination
                          currentPage={articlesCurrentPage}
                          totalPages={totalArticlePages}
                          onPageChange={setArticlesCurrentPage}
                          itemsPerPage={articlesPerPage}
                          totalItems={currentArticles.length}
                        />
                      </div>
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
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BarChart3 className="h-10 w-10 text-green-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Analytics Starting Fresh
                      </h3>
                      <p className="text-gray-300 mb-6 text-lg">
                        No analytics data yet - ready to start tracking real
                        user activity!
                      </p>

                      <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-400/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
                        <h4 className="font-semibold text-blue-300 mb-4 text-lg">
                          To start collecting analytics:
                        </h4>
                        <ul className="text-blue-200 text-sm space-y-3 text-left">
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Visit article pages to generate page views
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Interact with content (shares, likes)
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Analytics will automatically appear here
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <p className="text-gray-400 text-sm font-semibold">
                          Next steps:
                        </p>
                        <p className="text-gray-300 text-sm">
                          1. Browse to{" "}
                          <Link
                            href="/"
                            className="text-red-400 hover:text-red-300 underline font-medium"
                          >
                            your homepage
                          </Link>{" "}
                          to start generating real data
                        </p>
                        <p className="text-gray-300 text-sm">
                          2. Read some articles to create page views
                        </p>
                        <p className="text-gray-300 text-sm">
                          3. Return here to see your real analytics data
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
