"use client";

import { useState, useEffect } from "react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Shield } from "lucide-react";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(undefined);
  const [scheduledArticles, setScheduledArticles] = useState([]);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch articles
        const articlesResponse = await fetch('/api/admin/articles');
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setArticles(articlesData);
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/admin/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        // Fetch analytics data
        const analyticsResponse = await fetch('/api/admin/analytics?days=30');
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalyticsData(analyticsData);
        }

        // Fetch scheduled articles
        const scheduleResponse = await fetch('/api/admin/schedule');
        if (scheduleResponse.ok) {
          const scheduleData = await scheduleResponse.json();
          setScheduledArticles(scheduleData);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Content Management System</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard
          articles={articles}
          categories={categories}
          initialAnalytics={analyticsData}
          initialScheduledArticles={scheduledArticles}
        />
      </main>
    </div>
  );
}
