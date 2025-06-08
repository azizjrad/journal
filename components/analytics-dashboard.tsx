"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  Clock,
  Target,
  RefreshCw,
} from "lucide-react";
import { AnalyticsData } from "@/lib/db";

interface AnalyticsDashboardProps {
  initialData: AnalyticsData;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  color = "blue",
}: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">
                  +{trend.value}%
                </span>
                <span className="text-gray-500 ml-1">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <div className={`text-${color}-600`}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimelineChartProps {
  data:
    | { date: string; views: number }[]
    | { date: string; engagements: number }[];
  type: "views" | "engagements";
}

function TimelineChart({ data, type }: TimelineChartProps) {
  const maxValue = Math.max(
    ...data.map((d) => ("views" in d ? d.views : d.engagements))
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 h-32">
        {data.slice(-7).map((item, index) => {
          const value = "views" in item ? item.views : item.engagements;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex flex-col justify-end">
              <div
                className={`bg-${
                  type === "views" ? "blue" : "green"
                }-500 rounded-t transition-all hover:opacity-80 cursor-pointer`}
                style={{
                  height: `${height}%`,
                  minHeight: value > 0 ? "4px" : "0px",
                }}
                title={`${item.date}: ${value} ${type}`}
              />
              <div className="text-xs text-center mt-1 text-gray-600">
                {new Date(item.date).getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PopularArticlesListProps {
  articles: any[];
}

function PopularArticlesList({ articles }: PopularArticlesListProps) {
  return (
    <div className="space-y-3">
      {articles.slice(0, 5).map((article, index) => (
        <div
          key={article.id}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {index + 1}
            </span>
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {article.title_en}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {article.category_name_en}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.view_count || 0} views
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface RecentActivityProps {
  activities: any[];
}

function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((activity, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 border-l-2 border-gray-200 pl-4"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              activity.type === "view" ? "bg-blue-500" : "bg-green-500"
            }`}
          />
          <div className="flex-grow">
            <p className="text-sm text-gray-900">
              <span className="font-medium">
                {activity.type === "view" ? "View" : "Engagement"}
              </span>{" "}
              on "{activity.title_en}"
            </p>
            <p className="text-xs text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics?days=${selectedPeriod}`
      );
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } catch (error) {
      console.error("Failed to refresh analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor your content performance and engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Button
            onClick={refreshData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={formatNumber(data.totalViews)}
          icon={<Eye className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Total Engagements"
          value={formatNumber(data.totalEngagements)}
          icon={<Activity className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Popular Articles"
          value={data.popularArticles.length}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
        <MetricCard
          title="Active Categories"
          value={data.popularCategories.length}
          icon={<Target className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Views Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineChart data={data.viewsTimeline} type="views" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Engagement Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineChart
                  data={data.engagementTimeline}
                  type="engagements"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <PopularArticlesList articles={data.popularArticles} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.popularCategories.map((category, index) => (
                  <div
                    key={category.category_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="secondary">{category.count} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={data.recentActivity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
