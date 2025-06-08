"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar, Tag, TrendingUp } from "lucide-react";
import { Category, SearchFilters, SearchSuggestion } from "@/lib/db";

interface AdvancedSearchFormProps {
  categories: Category[];
  popularSearches: SearchSuggestion[];
  initialFilters: SearchFilters;
}

export function AdvancedSearchForm({
  categories,
  popularSearches,
  initialFilters,
}: AdvancedSearchFormProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tagInput, setTagInput] = useState("");
  // Check if advanced filters are active
  useEffect(() => {
    const hasAdvancedFilters = Boolean(
      initialFilters.categoryId ||
        initialFilters.dateFrom ||
        initialFilters.dateTo ||
        initialFilters.tags?.length
    );
    setShowAdvanced(hasAdvancedFilters);
  }, [initialFilters]);
  // Get search suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (filters.query && filters.query.length >= 2) {
        try {
          const response = await fetch(
            `/api/search/suggestions?q=${encodeURIComponent(filters.query)}`
          );
          if (response.ok) {
            const suggestions = await response.json();
            setSuggestions(suggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.query]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.query) params.set("q", filters.query);
    if (filters.categoryId)
      params.set("category", filters.categoryId.toString());
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.tags && filters.tags.length > 0)
      params.set("tags", filters.tags.join(","));
    if (filters.sortBy && filters.sortBy !== "date")
      params.set("sortBy", filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);

    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      categoryId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      tags: undefined,
      sortBy: "date",
      sortOrder: "desc",
    });
    router.push("/search");
  };

  const addTag = () => {
    if (tagInput && (!filters.tags || !filters.tags.includes(tagInput))) {
      setFilters((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "query") {
      setFilters((prev) => ({ ...prev, query: suggestion.text }));
    } else if (suggestion.type === "category") {
      const category = categories.find(
        (c) => c.name_en === suggestion.text || c.name_ar === suggestion.text
      );
      if (category) {
        setFilters((prev) => ({ ...prev, categoryId: category.id }));
      }
    } else if (suggestion.type === "tag") {
      setFilters((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), suggestion.text],
      }));
    }
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Main Search Input */}
      <div className="relative mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={t(
              "search_placeholder",
              "Search articles, categories, tags...",
              "ابحث في المقالات، الفئات، العلامات..."
            )}
            value={filters.query || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
            className="w-full pl-4 pr-12 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <Button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-red-600 hover:bg-red-700"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
              >
                <div className="flex-shrink-0">
                  {suggestion.type === "query" && (
                    <Search className="h-4 w-4 text-gray-400" />
                  )}
                  {suggestion.type === "category" && (
                    <Filter className="h-4 w-4 text-green-500" />
                  )}
                  {suggestion.type === "tag" && (
                    <Tag className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{suggestion.text}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {suggestion.type}
                  </div>
                </div>
                {suggestion.count && (
                  <div className="text-sm text-gray-400">
                    ({suggestion.count})
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {t("advanced_filters", "Advanced Filters", "الفلاتر المتقدمة")}
        </Button>

        {(filters.query ||
          filters.categoryId ||
          filters.dateFrom ||
          filters.dateTo ||
          filters.tags?.length) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            {t("clear_all", "Clear All", "مسح الكل")}
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>{t("popular", "Popular:", "شائع:")}</span>
          {popularSearches.slice(0, 3).map((search, index) => (
            <button
              key={index}
              onClick={() =>
                setFilters((prev) => ({ ...prev, query: search.text }))
              }
              className="text-red-600 hover:underline"
            >
              {search.text}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <Label htmlFor="category">
                {t("category", "Category", "الفئة")}
              </Label>{" "}
              <Select
                value={filters.categoryId?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: value === "all" ? undefined : parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "select_category",
                      "Select category",
                      "اختر الفئة"
                    )}
                  />
                </SelectTrigger>{" "}
                <SelectContent>
                  <SelectItem value="all">
                    {t("all_categories", "All Categories", "جميع الفئات")}
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {language === "ar" ? category.name_ar : category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div>
              <Label htmlFor="dateFrom">
                <Calendar className="h-4 w-4 inline mr-2" />
                {t("date_from", "From Date", "من تاريخ")}
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />
            </div>

            {/* Date To */}
            <div>
              <Label htmlFor="dateTo">
                <Calendar className="h-4 w-4 inline mr-2" />
                {t("date_to", "To Date", "إلى تاريخ")}
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sortBy">
                {t("sort_by", "Sort By", "ترتيب حسب")}
              </Label>
              <Select
                value={filters.sortBy || "date"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: value as "date" | "relevance" | "popularity",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">
                    {t("date", "Date", "التاريخ")}
                  </SelectItem>
                  <SelectItem value="relevance">
                    {t("relevance", "Relevance", "الصلة")}
                  </SelectItem>
                  <SelectItem value="popularity">
                    {t("popularity", "Popularity", "الشعبية")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <Label htmlFor="tags">
              <Tag className="h-4 w-4 inline mr-2" />
              {t("tags", "Tags", "العلامات")}
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                type="text"
                placeholder={t("add_tag", "Add tag...", "أضف علامة...")}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                {t("add", "Add", "إضافة")}
              </Button>
            </div>

            {/* Selected Tags */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={handleSearch} size="lg" className="px-8">
              <Search className="h-5 w-5 mr-2" />
              {t("search", "Search", "بحث")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
