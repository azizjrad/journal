"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Image as ImageIcon, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Tag {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface NewArticleFormProps {
  categories: Category[];
}

export function EnhancedNewArticleForm({ categories }: NewArticleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    excerpt_en: "",
    excerpt_ar: "",
    image_url: "",
    category_id: "",
    is_featured: false,
    is_published: true,
    meta_description_en: "",
    meta_description_ar: "",
    meta_keywords_en: "",
    meta_keywords_ar: "",
  }); // Fetch available tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tags
        const tagsResponse = await fetch("/api/admin/tags");

        if (tagsResponse.ok) {
          const tags = await tagsResponse.json();
          setAvailableTags(tags);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if one is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          category_id: Number.parseInt(formData.category_id),
          published_at: new Date().toISOString(),
          tags: selectedTags,
          // CSRF token no longer required - authentication removed
        }),
      });

      if (response.ok) {
        toast.success("Article created successfully!", {
          description: "Your new article has been published.",
        });
        router.push("/admin");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Failed to create article", {
          description: errorData.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Error creating article", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gray-600" />
              Article Image
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or GIF (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* English Content */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">English Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label
                  htmlFor="title_en"
                  className="text-sm font-medium text-gray-700"
                >
                  Title
                </Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) =>
                    setFormData({ ...formData, title_en: e.target.value })
                  }
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter article title in English"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="excerpt_en"
                  className="text-sm font-medium text-gray-700"
                >
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt_en"
                  value={formData.excerpt_en}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt_en: e.target.value })
                  }
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>
              <div>
                <Label
                  htmlFor="meta_description_en"
                  className="text-sm font-medium text-gray-700"
                >
                  Meta Description (SEO)
                </Label>
                <Textarea
                  id="meta_description_en"
                  value={formData.meta_description_en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description_en: e.target.value,
                    })
                  }
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="SEO meta description (max 160 characters)"
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description_en.length}/160 characters
                </p>
              </div>
              <div>
                <Label
                  htmlFor="meta_keywords_en"
                  className="text-sm font-medium text-gray-700"
                >
                  Meta Keywords (SEO)
                </Label>
                <Input
                  id="meta_keywords_en"
                  value={formData.meta_keywords_en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_keywords_en: e.target.value,
                    })
                  }
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>
              <div>
                <Label
                  htmlFor="content_en"
                  className="text-sm font-medium text-gray-700"
                >
                  Content
                </Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en}
                  onChange={(e) =>
                    setFormData({ ...formData, content_en: e.target.value })
                  }
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Full article content in English"
                  rows={12}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">Arabic Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label
                  htmlFor="title_ar"
                  className="text-sm font-medium text-gray-700"
                >
                  العنوان
                </Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, title_ar: e.target.value })
                  }
                  className="mt-1 text-right font-arabic border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ادخل عنوان المقال باللغة العربية"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="excerpt_ar"
                  className="text-sm font-medium text-gray-700"
                >
                  المقتطف
                </Label>
                <Textarea
                  id="excerpt_ar"
                  value={formData.excerpt_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt_ar: e.target.value })
                  }
                  className="mt-1 text-right font-arabic border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ملخص موجز للمقال"
                  rows={3}
                />
              </div>
              <div>
                <Label
                  htmlFor="meta_description_ar"
                  className="text-sm font-medium text-gray-700"
                >
                  وصف السيو (SEO)
                </Label>
                <Textarea
                  id="meta_description_ar"
                  value={formData.meta_description_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description_ar: e.target.value,
                    })
                  }
                  className="mt-1 text-right font-arabic border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="وصف السيو (أقصى 160 حرف)"
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description_ar.length}/160 حرف
                </p>
              </div>
              <div>
                <Label
                  htmlFor="meta_keywords_ar"
                  className="text-sm font-medium text-gray-700"
                >
                  كلمات السيو المفتاحية
                </Label>
                <Input
                  id="meta_keywords_ar"
                  value={formData.meta_keywords_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_keywords_ar: e.target.value,
                    })
                  }
                  className="mt-1 text-right font-arabic border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="كلمة1، كلمة2، كلمة3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  افصل الكلمات المفتاحية بفواصل
                </p>
              </div>
              <div>
                <Label
                  htmlFor="content_ar"
                  className="text-sm font-medium text-gray-700"
                >
                  المحتوى
                </Label>
                <Textarea
                  id="content_ar"
                  value={formData.content_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, content_ar: e.target.value })
                  }
                  className="mt-1 text-right font-arabic border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="محتوى المقال الكامل باللغة العربية"
                  rows={12}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags Selection */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-gray-600" />
              Article Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {tag.name_en}
                  </Label>
                </div>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = availableTags.find((t) => t.id === tagId);
                    return tag ? (
                      <span
                        key={tagId}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag.name_en}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">Article Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select a category" />
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
              <div>
                <Label
                  htmlFor="image_url"
                  className="text-sm font-medium text-gray-700"
                >
                  Image URL (Optional)
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if you uploaded an image above
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label
                  htmlFor="is_featured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured Article
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label
                  htmlFor="is_published"
                  className="text-sm font-medium text-gray-700"
                >
                  Publish Immediately
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-4">
          <Link href="/admin">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Creating..." : "Create Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
