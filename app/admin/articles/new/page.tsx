import { EnhancedNewArticleForm } from "@/components/enhanced-new-article-form";
import { getCategories } from "@/lib/db";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <EnhancedNewArticleForm categories={categories} />
    </div>
  );
}
