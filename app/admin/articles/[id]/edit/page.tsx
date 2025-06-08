"use client";

import EnhancedEditArticlePage from "@/components/enhanced-edit-article-form";

export default function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EnhancedEditArticlePage params={Promise.resolve({ id: params.id })} />
  );
}
