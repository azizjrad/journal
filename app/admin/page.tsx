import { AdminDashboard } from "@/components/admin-dashboard";
import {
  getAllArticlesAdmin,
  getCategories,
  getCategoriesCached,
} from "@/lib/db";

export default async function AdminPage() {
  const [articles, categories] = await Promise.all([
    getAllArticlesAdmin(),
    getCategoriesCached(),
  ]);

  return (
    <AdminDashboard
      articles={articles}
      categories={categories}
      initialAnalytics={undefined}
      initialScheduledArticles={[]}
    />
  );
}
