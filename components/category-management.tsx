"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  created_at: string;
}

interface CategoryManagementProps {
  categories: Category[];
  onCategoriesUpdate: (categories: Category[]) => void;
}

export function CategoryManagement({
  categories,
  onCategoriesUpdate,
}: CategoryManagementProps) {
  const [currentCategories, setCurrentCategories] = useState(categories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
  });

  // Pagination state for categories
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  // Calculate pagination for categories
  const totalCategoryPages = Math.ceil(
    currentCategories.length / categoriesPerPage
  );
  const startCategoryIndex = (categoriesCurrentPage - 1) * categoriesPerPage;
  const endCategoryIndex = startCategoryIndex + categoriesPerPage;
  const paginatedCategories = currentCategories.slice(
    startCategoryIndex,
    endCategoryIndex
  );

  const router = useRouter();

  const resetForm = () => {
    setFormData({ name_en: "", name_ar: "" });
  };

  const handleCreate = async () => {
    if (!formData.name_en.trim() || !formData.name_ar.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newCategory = await response.json();
        const updatedCategories = [...currentCategories, newCategory];
        setCurrentCategories(updatedCategories);
        onCategoriesUpdate(updatedCategories);
        setIsCreateOpen(false);
        resetForm();
        router.refresh();
        toast.success("Category created successfully!", {
          description: `${formData.name_en} has been added to your categories.`,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Failed to create category", {
          description: errorData.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (
      !editingCategory ||
      !formData.name_en.trim() ||
      !formData.name_ar.trim()
    )
      return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedCategory = await response.json();
        const updatedCategories = currentCategories.map((cat) =>
          cat.id === editingCategory.id ? updatedCategory : cat
        );
        setCurrentCategories(updatedCategories);
        onCategoriesUpdate(updatedCategories);
        setEditingCategory(null);
        resetForm();
        router.refresh();
        toast.success("Category updated successfully!", {
          description: `${formData.name_en} has been updated.`,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Failed to update category", {
          description: errorData.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (categoryId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedCategories = currentCategories.filter(
          (cat) => cat.id !== categoryId
        );
        setCurrentCategories(updatedCategories);
        onCategoriesUpdate(updatedCategories);

        // Handle pagination when deleting the last item on current page
        const newTotalPages = Math.ceil(
          updatedCategories.length / categoriesPerPage
        );
        if (categoriesCurrentPage > newTotalPages && newTotalPages > 0) {
          setCategoriesCurrentPage(newTotalPages);
        } else if (updatedCategories.length === 0) {
          setCategoriesCurrentPage(1);
        }
        router.refresh();
        toast.success("Category deleted successfully!", {
          description: "The category has been removed from your system.",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Failed to delete category", {
          description: errorData.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_ar: category.name_ar,
    });
  };
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Category Management</h2>
          <p className="text-gray-300 mt-1">
            Organize your content with custom categories
          </p>
        </div>{" "}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Create New Category
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Add a new category for organizing articles.
              </DialogDescription>
            </DialogHeader>{" "}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name_en"
                  className="text-sm font-medium text-gray-200"
                >
                  English Name
                </Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name_en: e.target.value,
                    }))
                  }
                  placeholder="Category name in English"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="name_ar"
                  className="text-sm font-medium text-gray-200"
                >
                  Arabic Name
                </Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name_ar: e.target.value,
                    }))
                  }
                  placeholder="اسم التصنيف بالعربية"
                  className="font-arabic text-right bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50"
                />
              </div>
            </div>{" "}
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
                className="border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  loading ||
                  !formData.name_en.trim() ||
                  !formData.name_ar.trim()
                }
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
              >
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>{" "}
      {/* Categories List */}
      <div className="space-y-4">
        {currentCategories.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No categories yet
            </h3>
            <p className="text-gray-300 mb-6">
              Create your first category to organize content
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          </div>
        ) : (
          <>
            {" "}
            <div className="space-y-4">
              {paginatedCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl backdrop-blur-sm">
                          <Tag className="h-5 w-5 text-purple-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {category.name_en}
                          </h3>
                          <p className="text-gray-300 font-arabic mb-4 leading-relaxed">
                            {category.name_ar}
                          </p>

                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 backdrop-blur-sm">
                              Category
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-400">
                            Created{" "}
                            {new Date(category.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="flex items-center gap-2 ml-6">
                      <Dialog
                        open={editingCategory?.id === category.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setEditingCategory(null);
                            resetForm();
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(category)}
                            className="text-gray-300 border-white/20 hover:bg-white/10 hover:border-white/30"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border border-white/20">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-white">
                              Edit Category
                            </DialogTitle>
                            <DialogDescription className="text-gray-300">
                              Update the category information.
                            </DialogDescription>
                          </DialogHeader>{" "}
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label
                                htmlFor="edit_name_en"
                                className="text-sm font-medium text-gray-200"
                              >
                                English Name
                              </Label>
                              <Input
                                id="edit_name_en"
                                value={formData.name_en}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    name_en: e.target.value,
                                  }))
                                }
                                placeholder="Category name in English"
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="edit_name_ar"
                                className="text-sm font-medium text-gray-200"
                              >
                                Arabic Name
                              </Label>
                              <Input
                                id="edit_name_ar"
                                value={formData.name_ar}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    name_ar: e.target.value,
                                  }))
                                }
                                placeholder="اسم التصنيف بالعربية"
                                className="font-arabic text-right bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50"
                              />
                            </div>
                          </div>{" "}
                          <DialogFooter className="gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(null);
                                resetForm();
                              }}
                              className="border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleEdit}
                              disabled={loading}
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
                            >
                              {loading ? "Updating..." : "Update Category"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>{" "}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-red-400/30 hover:bg-red-500/10 hover:border-red-400/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border border-white/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-400">
                              Delete Category
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete the category "
                              {category.name_en}"? This action cannot be undone
                              and may affect articles using this category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category.id)}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>{" "}
                </div>
              ))}
            </div>
            {/* Pagination for categories */}
            <Pagination
              currentPage={categoriesCurrentPage}
              totalPages={totalCategoryPages}
              onPageChange={setCategoriesCurrentPage}
              itemsPerPage={categoriesPerPage}
              totalItems={currentCategories.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
