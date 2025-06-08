import { getCategories } from "@/lib/db";
import { EnhancedNewArticleForm } from "@/components/enhanced-new-article-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Article</h1>
        </div>

        <EnhancedNewArticleForm categories={categories} />
      </div>
    </div>
  );
}
