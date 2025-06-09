"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Clock,
  Hash,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface Article {
  id: number;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  image_url: string;
  category_id: number;
  is_featured: boolean;
  is_published: boolean;
  // SEO fields
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
  slug?: string;
  reading_time_minutes?: number;
  tags?: Tag[];
}

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Tag {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

export default function EnhancedEditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [article, setArticle] = useState<Article>({
    id: 0,
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    excerpt_en: "",
    excerpt_ar: "",
    image_url: "",
    category_id: 0,
    is_featured: false,
    is_published: false,
    meta_description_en: "",
    meta_description_ar: "",
    meta_keywords_en: "",
    meta_keywords_ar: "",
    slug: "",
    tags: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = await params;
        // Fetch article, categories, and tags in parallel
        const [articleRes, categoriesRes, tagsRes] = await Promise.all([
          fetch(`/api/admin/articles/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          }),
          fetch("/api/admin/categories"),
          fetch("/api/admin/tags"),
        ]);

        if (!articleRes.ok) {
          throw new Error("Failed to fetch article");
        }
        const [articleData, categoriesData, tagsData] = await Promise.all([
          articleRes.json(),
          categoriesRes.json(),
          tagsRes.json(),
        ]);

        setArticle(articleData);
        setCategories(categoriesData);
        setTags(tagsData);
        // CSRF token no longer required - authentication removed

        // Set selected tags if article has tags
        if (articleData.tags) {
          setSelectedTags(articleData.tags.map((tag: Tag) => tag.id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load article data");
      }
    }

    fetchData();
  }, [params]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setArticle({ ...article, image_url: data.url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...article,
        tags: selectedTags,
        slug: article.slug || generateSlug(article.title_en),
        // CSRF token no longer required - authentication removed
      };

      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      toast.success("Article updated successfully");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 225;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
              <p className="text-gray-600">
                Update article content and settings
              </p>
            </div>
          </div>
          {article.reading_time_minutes && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time_minutes} min read</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title_en">Title (English)</Label>
                      <Input
                        id="title_en"
                        value={article.title_en}
                        onChange={(e) =>
                          setArticle({ ...article, title_en: e.target.value })
                        }
                        placeholder="Enter English title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title_ar">Title (Arabic)</Label>
                      <Input
                        id="title_ar"
                        value={article.title_ar}
                        onChange={(e) =>
                          setArticle({ ...article, title_ar: e.target.value })
                        }
                        placeholder="Enter Arabic title"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="excerpt_en">Excerpt (English)</Label>
                      <Textarea
                        id="excerpt_en"
                        value={article.excerpt_en}
                        onChange={(e) =>
                          setArticle({ ...article, excerpt_en: e.target.value })
                        }
                        placeholder="Brief description in English"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt_ar">Excerpt (Arabic)</Label>
                      <Textarea
                        id="excerpt_ar"
                        value={article.excerpt_ar}
                        onChange={(e) =>
                          setArticle({ ...article, excerpt_ar: e.target.value })
                        }
                        placeholder="Brief description in Arabic"
                        rows={3}
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="content_en">Content (English)</Label>
                      <Textarea
                        id="content_en"
                        value={article.content_en}
                        onChange={(e) =>
                          setArticle({ ...article, content_en: e.target.value })
                        }
                        placeholder="Full article content in English"
                        rows={12}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Est. reading time:{" "}
                        {estimateReadingTime(article.content_en)} min
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="content_ar">Content (Arabic)</Label>
                      <Textarea
                        id="content_ar"
                        value={article.content_ar}
                        onChange={(e) =>
                          setArticle({ ...article, content_ar: e.target.value })
                        }
                        placeholder="Full article content in Arabic"
                        rows={12}
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    SEO & Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={article.slug || ""}
                      onChange={(e) =>
                        setArticle({ ...article, slug: e.target.value })
                      }
                      placeholder="url-friendly-slug (auto-generated if empty)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for auto-generation from title
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="meta_description_en">
                        Meta Description (English)
                      </Label>
                      <Textarea
                        id="meta_description_en"
                        value={article.meta_description_en || ""}
                        onChange={(e) =>
                          setArticle({
                            ...article,
                            meta_description_en: e.target.value,
                          })
                        }
                        placeholder="SEO description for search engines"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(article.meta_description_en || "").length}/160
                        characters
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="meta_description_ar">
                        Meta Description (Arabic)
                      </Label>
                      <Textarea
                        id="meta_description_ar"
                        value={article.meta_description_ar || ""}
                        onChange={(e) =>
                          setArticle({
                            ...article,
                            meta_description_ar: e.target.value,
                          })
                        }
                        placeholder="SEO description for search engines"
                        rows={3}
                        maxLength={160}
                        dir="rtl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(article.meta_description_ar || "").length}/160
                        characters
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="meta_keywords_en">
                        Keywords (English)
                      </Label>
                      <Input
                        id="meta_keywords_en"
                        value={article.meta_keywords_en || ""}
                        onChange={(e) =>
                          setArticle({
                            ...article,
                            meta_keywords_en: e.target.value,
                          })
                        }
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meta_keywords_ar">
                        Keywords (Arabic)
                      </Label>
                      <Input
                        id="meta_keywords_ar"
                        value={article.meta_keywords_ar || ""}
                        onChange={(e) =>
                          setArticle({
                            ...article,
                            meta_keywords_ar: e.target.value,
                          })
                        }
                        placeholder="keyword1, keyword2, keyword3"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Select Tags</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                      {tags.map((tag) => (
                        <div
                          key={tag.id}
                          className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedTags.includes(tag.id)
                              ? "bg-blue-100 border-blue-300"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                            className="mr-2"
                          />
                          <span className="text-sm">{tag.name_en}</span>
                        </div>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <div>
                        <Label className="text-sm text-gray-600">
                          Selected Tags:
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId);
                            return tag ? (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag.name_en}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-8">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {article.image_url && (
                      <div className="relative">
                        <Image
                          src={article.image_url}
                          alt="Article image"
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            setArticle({ ...article, image_url: "" })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        "Uploading..."
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {article.image_url ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={article.category_id.toString()}
                      onValueChange={(value) =>
                        setArticle({ ...article, category_id: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured">Featured Article</Label>
                    <Switch
                      id="is_featured"
                      checked={article.is_featured}
                      onCheckedChange={(checked) =>
                        setArticle({ ...article, is_featured: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_published">Published</Label>
                    <Switch
                      id="is_published"
                      checked={article.is_published}
                      onCheckedChange={(checked) =>
                        setArticle({ ...article, is_published: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Updating..." : "Update Article"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/admin")}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
