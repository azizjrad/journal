"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteArticleButtonProps {
  articleId: number;
  articleTitle: string;
  onDelete?: (articleId: number) => void;
}

export function DeleteArticleButton({
  articleId,
  articleTitle,
  onDelete,
}: DeleteArticleButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        if (onDelete) {
          onDelete(articleId);
        } else {
          router.refresh(); // Refresh the page to show updated data
        }
        setOpen(false);
        toast.success("Article deleted successfully!", {
          description: `"${articleTitle}" has been removed.`,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Failed to delete article", {
          description: errorData.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Error deleting article", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {" "}
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Delete Article
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            article "{articleTitle}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 hover:border-gray-400">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
