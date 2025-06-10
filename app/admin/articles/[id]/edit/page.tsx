import EnhancedEditArticleForm from "@/components/enhanced-edit-article-form";
import { getArticleById, getCategories } from "@/lib/db";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id);

  const [article, categories] = await Promise.all([
    getArticleById(articleId),
    getCategories(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <EnhancedEditArticleForm
        params={Promise.resolve({ id: resolvedParams.id })}
      />
    </div>
  );
}
