import { neon } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";
import { validateInput, sanitizeInput } from "./security";

const sql = neon(process.env.DATABASE_URL!);

export interface Article {
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
  published_at: string;
  created_at: string;
  updated_at: string;
  category_name_en?: string;
  category_name_ar?: string;
  category_slug?: string;
  view_count?: number;
  engagement_count?: number;
  scheduled_for?: string;
  // SEO fields
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
  reading_time_minutes?: number;
  word_count?: number;
  slug?: string;
  tags?: Tag[];
}

export interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  created_at: string;
  meta_description_en?: string;
  meta_description_ar?: string;
}

export interface Tag {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en?: string;
  description_ar?: string;
  created_at: string;
}

export interface ArticleTag {
  id: number;
  article_id: number;
  tag_id: number;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value_en: string;
  value_ar: string;
}

export interface SitemapEntry {
  id: number;
  url: string;
  last_modified: string;
  change_frequency: string;
  priority: number;
  page_type: string;
  created_at: string;
  updated_at: string;
}

// Analytics interfaces
export interface ArticleView {
  id: number;
  article_id: number;
  ip_address: string;
  user_agent?: string;
  referer?: string;
  country?: string;
  city?: string;
  viewed_at: string;
  session_id?: string;
  reading_time: number;
}

export interface ArticleEngagement {
  id: number;
  article_id: number;
  engagement_type: string;
  ip_address: string;
  user_agent?: string;
  platform?: string;
  created_at: string;
}

export interface ScheduledArticle {
  id: number;
  article_id: number;
  scheduled_for: string;
  status: string;
  created_at: string;
  published_at?: string;
  title_en?: string;
  title_ar?: string;
  category_name_en?: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalEngagements: number;
  popularArticles: Article[];
  popularCategories: { name: string; count: number; category_id: number }[];
  viewsTimeline: { date: string; views: number }[];
  engagementTimeline: { date: string; engagements: number }[];
  recentActivity: any[];
}

export interface SearchFilters {
  query?: string;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: "date" | "relevance" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface SearchSuggestion {
  text: string;
  type: "query" | "category" | "tag";
  count?: number;
}

export async function getArticles(
  limit?: number,
  featured?: boolean
): Promise<Article[]> {
  if (featured && limit) {
    const result = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true AND a.is_featured = true
      ORDER BY a.published_at DESC
      LIMIT ${limit}
    `;
    return result as Article[];
  } else if (featured) {
    const result = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true AND a.is_featured = true
      ORDER BY a.published_at DESC
    `;
    return result as Article[];
  } else if (limit) {
    const result = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true
      ORDER BY a.published_at DESC
      LIMIT ${limit}
    `;
    return result as Article[];
  } else {
    const result = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true
      ORDER BY a.published_at DESC
    `;
    return result as Article[];
  }
}

export async function getArticleById(id: number): Promise<Article | null> {
  const result = await sql`
    SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ${id} AND a.is_published = true
  `;
  return (result[0] as Article) || null;
}

export async function getArticleByIdAdmin(id: number): Promise<Article | null> {
  const result = await sql`
    SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ${id}
  `;
  return (result[0] as Article) || null;
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit?: number
): Promise<Article[]> {
  if (limit) {
    const result = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE c.slug = ${categorySlug} AND a.is_published = true
      ORDER BY a.published_at DESC
      LIMIT ${limit}
    `;
    return result as Article[];
  } else {
    const result = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE c.slug = ${categorySlug} AND a.is_published = true
      ORDER BY a.published_at DESC
    `;
    return result as Article[];
  }
}

export async function searchArticles(query: string): Promise<Article[]> {
  const result = await sql`
    SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.is_published = true 
    AND (
      a.title_en ILIKE ${`%${query}%`} 
      OR a.title_ar ILIKE ${`%${query}%`}
      OR a.content_en ILIKE ${`%${query}%`}
      OR a.content_ar ILIKE ${`%${query}%`}
      OR a.excerpt_en ILIKE ${`%${query}%`}
      OR a.excerpt_ar ILIKE ${`%${query}%`}
    )
    ORDER BY a.published_at DESC
    LIMIT 50
  `;
  return result as Article[];
}

export async function advancedSearchArticles(
  filters: SearchFilters
): Promise<Article[]> {
  try {
    console.log("Search filters:", filters);

    // Use simple search if only query is provided
    if (
      filters.query &&
      !filters.categoryId &&
      !filters.dateFrom &&
      !filters.dateTo &&
      (!filters.tags || filters.tags.length === 0)
    ) {
      return await searchArticles(filters.query);
    }

    // For complex queries, build conditions step by step
    let baseQuery = `
      SELECT DISTINCT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
    `;

    let whereConditions = ["a.is_published = true"];
    let joinClause = "";

    // Handle text search if present
    if (filters.query && filters.query.trim()) {
      const searchTerm = `%${filters.query.trim()}%`;
      const result = await sql`
        SELECT DISTINCT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.is_published = true 
        AND (
          a.title_en ILIKE ${searchTerm} 
          OR a.title_ar ILIKE ${searchTerm}
          OR a.content_en ILIKE ${searchTerm}
          OR a.content_ar ILIKE ${searchTerm}
          OR a.excerpt_en ILIKE ${searchTerm}
          OR a.excerpt_ar ILIKE ${searchTerm}
        )
        ${
          filters.categoryId
            ? sql`AND a.category_id = ${filters.categoryId}`
            : sql``
        }
        ${
          filters.dateFrom
            ? sql`AND a.published_at >= ${filters.dateFrom}`
            : sql``
        }
        ${filters.dateTo ? sql`AND a.published_at <= ${filters.dateTo}` : sql``}
        ORDER BY a.published_at DESC
        LIMIT 50
      `;
      console.log("Search results:", result.length, "articles found");
      return result as Article[];
    }

    // Handle category-only search
    if (filters.categoryId && !filters.query) {
      const result = await sql`
        SELECT DISTINCT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.is_published = true AND a.category_id = ${filters.categoryId}
        ${
          filters.dateFrom
            ? sql`AND a.published_at >= ${filters.dateFrom}`
            : sql``
        }
        ${filters.dateTo ? sql`AND a.published_at <= ${filters.dateTo}` : sql``}
        ORDER BY a.published_at DESC
        LIMIT 50
      `;
      console.log("Search results:", result.length, "articles found");
      return result as Article[];
    }

    // Default: return recent articles if no filters
    const result = await sql`
      SELECT DISTINCT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true
      ORDER BY a.published_at DESC
      LIMIT 50
    `;
    console.log("Search results:", result.length, "articles found");
    return result as Article[];
  } catch (error) {
    console.error("Error in advancedSearchArticles:", error);
    return [];
  }
}

export async function getSearchSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const [articles, categories, tags] = await Promise.all([
    sql`
      SELECT DISTINCT 
        CASE 
          WHEN title_en ILIKE ${`%${query}%`} THEN title_en
          WHEN title_ar ILIKE ${`%${query}%`} THEN title_ar
        END as suggestion
      FROM articles 
      WHERE is_published = true 
      AND (title_en ILIKE ${`%${query}%`} OR title_ar ILIKE ${`%${query}%`})
      LIMIT 5
    `,
    sql`
      SELECT name_en as suggestion FROM categories 
      WHERE name_en ILIKE ${`%${query}%`} 
      UNION 
      SELECT name_ar as suggestion FROM categories 
      WHERE name_ar ILIKE ${`%${query}%`}
      LIMIT 3
    `,
    sql`
      SELECT name_en as suggestion FROM tags 
      WHERE name_en ILIKE ${`%${query}%`} 
      UNION 
      SELECT name_ar as suggestion FROM tags 
      WHERE name_ar ILIKE ${`%${query}%`}
      LIMIT 3
    `,
  ]);

  const suggestions: SearchSuggestion[] = [];

  // Add article title suggestions
  articles.forEach((item: any) => {
    if (item.suggestion) {
      suggestions.push({
        text: item.suggestion,
        type: "query",
      });
    }
  });

  // Add category suggestions
  categories.forEach((item: any) => {
    suggestions.push({
      text: item.suggestion,
      type: "category",
    });
  });

  // Add tag suggestions
  tags.forEach((item: any) => {
    suggestions.push({
      text: item.suggestion,
      type: "tag",
    });
  });

  return suggestions;
}

export async function getPopularSearches(): Promise<SearchSuggestion[]> {
  // This would typically come from analytics/search logs
  // For now, return some common terms
  return [
    { text: "Politics", type: "query", count: 156 },
    { text: "سياسة", type: "query", count: 134 },
    { text: "Sports", type: "query", count: 98 },
    { text: "رياضة", type: "query", count: 87 },
    { text: "Economy", type: "query", count: 76 },
    { text: "اقتصاد", type: "query", count: 65 },
  ];
}

export async function getCategories(): Promise<Category[]> {
  const result = await sql`SELECT * FROM categories ORDER BY name_en`;
  return result as Category[];
}

// Cached version of getCategories for better performance
export const getCategoriesCached = unstable_cache(
  async () => {
    return getCategories();
  },
  ["categories"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["categories"],
  }
);

// Cached version for breaking news
export const getRecentArticlesCached = unstable_cache(
  async (limit: number = 10) => {
    return getArticles(limit);
  },
  ["recent-articles"],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ["articles"],
  }
);

// Cached version for featured articles
export const getFeaturedArticlesCached = unstable_cache(
  async (limit: number = 6) => {
    return getArticles(limit, true);
  },
  ["featured-articles"],
  {
    revalidate: 180, // Cache for 3 minutes
    tags: ["articles", "featured"],
  }
);

// Cached version for category articles
export const getArticlesByCategoryCached = unstable_cache(
  async (categorySlug: string, limit?: number) => {
    return getArticlesByCategory(categorySlug, limit);
  },
  ["category-articles"],
  {
    revalidate: 120, // Cache for 2 minutes
    tags: ["articles", "categories"],
  }
);

// Cached version for individual articles
export const getArticleByIdCached = unstable_cache(
  async (id: number) => {
    return getArticleById(id);
  },
  ["article-by-id"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["articles"],
  }
);

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const result = await sql`SELECT * FROM categories WHERE slug = ${slug}`;
  return (result[0] as Category) || null;
}

export async function getSettings(): Promise<Setting[]> {
  const result = await sql`SELECT * FROM settings`;
  return result as Setting[];
}

// Admin functions
export async function getAllArticlesAdmin(): Promise<Article[]> {
  const result = await sql`
    SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.created_at DESC
  `;
  return result as Article[];
}

export async function createArticle(
  article: Omit<Article, "id" | "created_at" | "updated_at">
) {
  // Input validation
  if (!article.title_en || !article.title_ar) {
    throw new Error("Title in both languages is required");
  }

  if (!article.content_en || !article.content_ar) {
    throw new Error("Content in both languages is required");
  }

  if (!article.excerpt_en || !article.excerpt_ar) {
    throw new Error("Excerpt in both languages is required");
  }

  // Validate all text inputs for security
  const textFields = [
    article.title_en,
    article.title_ar,
    article.content_en,
    article.content_ar,
    article.excerpt_en,
    article.excerpt_ar,
    article.meta_description_en || "",
    article.meta_description_ar || "",
    article.meta_keywords_en || "",
    article.meta_keywords_ar || "",
    article.slug || "",
  ];

  for (const field of textFields) {
    if (field && !validateInput(field)) {
      throw new Error(
        "Invalid input detected - contains potentially malicious content"
      );
    }
  }

  // Validate category_id is a positive integer
  if (!Number.isInteger(article.category_id) || article.category_id <= 0) {
    throw new Error("Invalid category ID");
  }

  // Sanitize inputs
  const sanitizedArticle = {
    ...article,
    title_en: sanitizeInput(article.title_en),
    title_ar: sanitizeInput(article.title_ar),
    excerpt_en: sanitizeInput(article.excerpt_en),
    excerpt_ar: sanitizeInput(article.excerpt_ar),
    meta_description_en: article.meta_description_en
      ? sanitizeInput(article.meta_description_en)
      : null,
    meta_description_ar: article.meta_description_ar
      ? sanitizeInput(article.meta_description_ar)
      : null,
    meta_keywords_en: article.meta_keywords_en
      ? sanitizeInput(article.meta_keywords_en)
      : null,
    meta_keywords_ar: article.meta_keywords_ar
      ? sanitizeInput(article.meta_keywords_ar)
      : null,
    slug: article.slug ? sanitizeInput(article.slug) : null,
  };

  const result = await sql`
    INSERT INTO articles (
      title_en, title_ar, content_en, content_ar, excerpt_en, excerpt_ar,
      image_url, category_id, is_featured, is_published, published_at,
      meta_description_en, meta_description_ar, meta_keywords_en, meta_keywords_ar, slug
    )
    VALUES (
      ${sanitizedArticle.title_en}, ${sanitizedArticle.title_ar}, 
      ${sanitizedArticle.content_en}, ${sanitizedArticle.content_ar},
      ${sanitizedArticle.excerpt_en}, ${sanitizedArticle.excerpt_ar}, 
      ${sanitizedArticle.image_url}, ${sanitizedArticle.category_id},
      ${sanitizedArticle.is_featured}, ${sanitizedArticle.is_published}, 
      ${sanitizedArticle.published_at}, ${sanitizedArticle.meta_description_en},
      ${sanitizedArticle.meta_description_ar}, ${sanitizedArticle.meta_keywords_en},
      ${sanitizedArticle.meta_keywords_ar}, ${sanitizedArticle.slug}
    )
    RETURNING *
  `;
  return result[0];
}

export async function updateArticle(id: number, article: Partial<Article>) {
  // Validate article ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid article ID");
  }

  // Validate text inputs for security
  const textFields = [
    article.title_en,
    article.title_ar,
    article.content_en,
    article.content_ar,
    article.excerpt_en,
    article.excerpt_ar,
    article.meta_description_en,
    article.meta_description_ar,
    article.meta_keywords_en,
    article.meta_keywords_ar,
    article.slug,
  ].filter(Boolean); // Remove null/undefined values

  for (const field of textFields) {
    if (field && !validateInput(field)) {
      throw new Error(
        "Invalid input detected - contains potentially malicious content"
      );
    }
  }

  // Validate category_id if provided
  if (article.category_id !== undefined) {
    if (!Number.isInteger(article.category_id) || article.category_id <= 0) {
      throw new Error("Invalid category ID");
    }
  }

  // Sanitize inputs
  const sanitizedArticle: Partial<Article> = { ...article };
  if (article.title_en)
    sanitizedArticle.title_en = sanitizeInput(article.title_en);
  if (article.title_ar)
    sanitizedArticle.title_ar = sanitizeInput(article.title_ar);
  if (article.excerpt_en)
    sanitizedArticle.excerpt_en = sanitizeInput(article.excerpt_en);
  if (article.excerpt_ar)
    sanitizedArticle.excerpt_ar = sanitizeInput(article.excerpt_ar);
  if (article.meta_description_en)
    sanitizedArticle.meta_description_en = sanitizeInput(
      article.meta_description_en
    );
  if (article.meta_description_ar)
    sanitizedArticle.meta_description_ar = sanitizeInput(
      article.meta_description_ar
    );
  if (article.meta_keywords_en)
    sanitizedArticle.meta_keywords_en = sanitizeInput(article.meta_keywords_en);
  if (article.meta_keywords_ar)
    sanitizedArticle.meta_keywords_ar = sanitizeInput(article.meta_keywords_ar);
  if (article.slug) sanitizedArticle.slug = sanitizeInput(article.slug);

  const result = await sql`
    UPDATE articles SET
      title_en = COALESCE(${sanitizedArticle.title_en}, title_en),
      title_ar = COALESCE(${sanitizedArticle.title_ar}, title_ar),
      content_en = COALESCE(${sanitizedArticle.content_en}, content_en),
      content_ar = COALESCE(${sanitizedArticle.content_ar}, content_ar),
      excerpt_en = COALESCE(${sanitizedArticle.excerpt_en}, excerpt_en),
      excerpt_ar = COALESCE(${sanitizedArticle.excerpt_ar}, excerpt_ar),
      image_url = COALESCE(${sanitizedArticle.image_url}, image_url),
      category_id = COALESCE(${sanitizedArticle.category_id}, category_id),
      is_featured = COALESCE(${sanitizedArticle.is_featured}, is_featured),
      is_published = COALESCE(${sanitizedArticle.is_published}, is_published),
      meta_description_en = COALESCE(${sanitizedArticle.meta_description_en}, meta_description_en),
      meta_description_ar = COALESCE(${sanitizedArticle.meta_description_ar}, meta_description_ar),
      meta_keywords_en = COALESCE(${sanitizedArticle.meta_keywords_en}, meta_keywords_en),
      meta_keywords_ar = COALESCE(${sanitizedArticle.meta_keywords_ar}, meta_keywords_ar),
      slug = COALESCE(${sanitizedArticle.slug}, slug),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}

export async function deleteArticle(id: number) {
  // Validate article ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid article ID");
  }

  // Check if article exists before deletion
  const existingArticle = await getArticleByIdAdmin(id);
  if (!existingArticle) {
    throw new Error("Article not found");
  }

  return await sql`DELETE FROM articles WHERE id = ${id}`;
}

export async function createCategory(
  category: Omit<Category, "id" | "created_at">
) {
  // Input validation
  if (!category.name_en || !category.name_ar) {
    throw new Error("Category name in both languages is required");
  }

  if (!category.slug) {
    throw new Error("Category slug is required");
  }

  // Validate text inputs for security
  const textFields = [
    category.name_en,
    category.name_ar,
    category.slug,
    category.meta_description_en || "",
    category.meta_description_ar || "",
  ];

  for (const field of textFields) {
    if (field && !validateInput(field)) {
      throw new Error(
        "Invalid input detected - contains potentially malicious content"
      );
    }
  }

  // Sanitize inputs
  const sanitizedCategory = {
    ...category,
    name_en: sanitizeInput(category.name_en),
    name_ar: sanitizeInput(category.name_ar),
    slug: sanitizeInput(category.slug),
    meta_description_en: category.meta_description_en
      ? sanitizeInput(category.meta_description_en)
      : null,
    meta_description_ar: category.meta_description_ar
      ? sanitizeInput(category.meta_description_ar)
      : null,
  };

  const result = await sql`
    INSERT INTO categories (name_en, name_ar, slug, meta_description_en, meta_description_ar)
    VALUES (${sanitizedCategory.name_en}, ${sanitizedCategory.name_ar}, ${sanitizedCategory.slug}, 
            ${sanitizedCategory.meta_description_en}, ${sanitizedCategory.meta_description_ar})
    RETURNING *
  `;
  return result[0];
}

export async function updateCategory(id: number, category: Partial<Category>) {
  // Validate category ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid category ID");
  }

  // Validate text inputs for security
  const textFields = [
    category.name_en,
    category.name_ar,
    category.slug,
    category.meta_description_en,
    category.meta_description_ar,
  ].filter(Boolean); // Remove null/undefined values

  for (const field of textFields) {
    if (field && !validateInput(field)) {
      throw new Error(
        "Invalid input detected - contains potentially malicious content"
      );
    }
  }

  // Sanitize inputs
  const sanitizedCategory: Partial<Category> = { ...category };
  if (category.name_en)
    sanitizedCategory.name_en = sanitizeInput(category.name_en);
  if (category.name_ar)
    sanitizedCategory.name_ar = sanitizeInput(category.name_ar);
  if (category.slug) sanitizedCategory.slug = sanitizeInput(category.slug);
  if (category.meta_description_en)
    sanitizedCategory.meta_description_en = sanitizeInput(
      category.meta_description_en
    );
  if (category.meta_description_ar)
    sanitizedCategory.meta_description_ar = sanitizeInput(
      category.meta_description_ar
    );

  const result = await sql`
    UPDATE categories SET
      name_en = COALESCE(${sanitizedCategory.name_en}, name_en),
      name_ar = COALESCE(${sanitizedCategory.name_ar}, name_ar),
      slug = COALESCE(${sanitizedCategory.slug}, slug),
      meta_description_en = COALESCE(${sanitizedCategory.meta_description_en}, meta_description_en),
      meta_description_ar = COALESCE(${sanitizedCategory.meta_description_ar}, meta_description_ar)
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}

export async function deleteCategory(id: number) {
  // Validate category ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid category ID");
  }

  // Check if category exists before deletion
  const existingCategory = await sql`SELECT * FROM categories WHERE id = ${id}`;
  if (!existingCategory || existingCategory.length === 0) {
    throw new Error("Category not found");
  }

  // Check if category is being used by articles
  const articlesUsingCategory =
    await sql`SELECT COUNT(*) as count FROM articles WHERE category_id = ${id}`;
  if (articlesUsingCategory[0].count > 0) {
    throw new Error("Cannot delete category that is being used by articles");
  }

  return await sql`DELETE FROM categories WHERE id = ${id}`;
}

// Tags functions
export async function getTags(): Promise<Tag[]> {
  const result = await sql`SELECT * FROM tags ORDER BY name_en`;
  return result as Tag[];
}

export async function createTag(tag: Omit<Tag, "id" | "created_at">) {
  // Input validation
  if (!tag.name_en || !tag.name_ar) {
    throw new Error("Tag name in both languages is required");
  }

  if (!tag.slug) {
    throw new Error("Tag slug is required");
  }

  // Validate text inputs for security
  const textFields = [
    tag.name_en,
    tag.name_ar,
    tag.slug,
    tag.description_en || "",
    tag.description_ar || "",
  ];

  for (const field of textFields) {
    if (field && !validateInput(field)) {
      throw new Error(
        "Invalid input detected - contains potentially malicious content"
      );
    }
  }

  // Sanitize inputs
  const sanitizedTag = {
    ...tag,
    name_en: sanitizeInput(tag.name_en),
    name_ar: sanitizeInput(tag.name_ar),
    slug: sanitizeInput(tag.slug),
    description_en: tag.description_en
      ? sanitizeInput(tag.description_en)
      : null,
    description_ar: tag.description_ar
      ? sanitizeInput(tag.description_ar)
      : null,
  };

  const result = await sql`
    INSERT INTO tags (name_en, name_ar, slug, description_en, description_ar)
    VALUES (${sanitizedTag.name_en}, ${sanitizedTag.name_ar}, ${
    sanitizedTag.slug
  }, ${sanitizedTag.description_en || null}, ${
    sanitizedTag.description_ar || null
  })
    RETURNING *
  `;
  return result[0];
}

export async function updateTag(id: number, tag: Partial<Tag>) {
  // Validate tag ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid tag ID");
  }

  // Validate text inputs for security
  const textFields = [
    tag.name_en,
    tag.name_ar,
    tag.slug,
    tag.description_en,
    tag.description_ar,
  ].filter(Boolean); // Remove null/undefined values

  for (const field of textFields) {
    if (field && !validateInput(field)) {
      throw new Error(
        "Invalid input detected - contains potentially malicious content"
      );
    }
  }

  // Sanitize inputs
  const sanitizedTag: Partial<Tag> = { ...tag };
  if (tag.name_en) sanitizedTag.name_en = sanitizeInput(tag.name_en);
  if (tag.name_ar) sanitizedTag.name_ar = sanitizeInput(tag.name_ar);
  if (tag.slug) sanitizedTag.slug = sanitizeInput(tag.slug);
  if (tag.description_en)
    sanitizedTag.description_en = sanitizeInput(tag.description_en);
  if (tag.description_ar)
    sanitizedTag.description_ar = sanitizeInput(tag.description_ar);

  const result = await sql`
    UPDATE tags SET
      name_en = COALESCE(${sanitizedTag.name_en}, name_en),
      name_ar = COALESCE(${sanitizedTag.name_ar}, name_ar),
      slug = COALESCE(${sanitizedTag.slug}, slug),
      description_en = COALESCE(${sanitizedTag.description_en}, description_en),
      description_ar = COALESCE(${sanitizedTag.description_ar}, description_ar)
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}

export async function deleteTag(id: number) {
  // Validate tag ID
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid tag ID");
  }

  // Check if tag exists before deletion
  const existingTag = await sql`SELECT * FROM tags WHERE id = ${id}`;
  if (!existingTag || existingTag.length === 0) {
    throw new Error("Tag not found");
  }

  // Check if tag is being used by articles
  const articlesUsingTag =
    await sql`SELECT COUNT(*) as count FROM article_tags WHERE tag_id = ${id}`;
  if (articlesUsingTag[0].count > 0) {
    throw new Error("Cannot delete tag that is being used by articles");
  }

  return await sql`DELETE FROM tags WHERE id = ${id}`;
}

// Scheduled Articles functions
export async function getAllScheduledArticles(): Promise<ScheduledArticle[]> {
  const result = await sql`
    SELECT sa.*, a.title_en, a.title_ar, c.name_en as category_name_en
    FROM scheduled_articles sa
    LEFT JOIN articles a ON sa.article_id = a.id
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY sa.scheduled_for ASC
  `;
  return result as ScheduledArticle[];
}

export async function createScheduledArticle(
  scheduledArticle: Omit<ScheduledArticle, "id" | "created_at">
) {
  const result = await sql`
    INSERT INTO scheduled_articles (article_id, scheduled_for, status)
    VALUES (${scheduledArticle.article_id}, ${scheduledArticle.scheduled_for}, ${scheduledArticle.status})
    RETURNING *
  `;
  return result[0];
}

export async function updateScheduledArticle(
  id: number,
  scheduledArticle: Partial<ScheduledArticle>
) {
  const result = await sql`
    UPDATE scheduled_articles SET
      article_id = COALESCE(${scheduledArticle.article_id}, article_id),
      scheduled_for = COALESCE(${scheduledArticle.scheduled_for}, scheduled_for),
      status = COALESCE(${scheduledArticle.status}, status),
      published_at = COALESCE(${scheduledArticle.published_at}, published_at)
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}

export async function deleteScheduledArticle(id: number) {
  return await sql`DELETE FROM scheduled_articles WHERE id = ${id}`;
}

// Article Tags functions
export async function addTagToArticle(articleId: number, tagId: number) {
  // Validate IDs
  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new Error("Invalid article ID");
  }

  if (!Number.isInteger(tagId) || tagId <= 0) {
    throw new Error("Invalid tag ID");
  }

  // Check if article and tag exist
  const [article, tag] = await Promise.all([
    sql`SELECT id FROM articles WHERE id = ${articleId}`,
    sql`SELECT id FROM tags WHERE id = ${tagId}`,
  ]);

  if (!article || article.length === 0) {
    throw new Error("Article not found");
  }

  if (!tag || tag.length === 0) {
    throw new Error("Tag not found");
  }

  const result = await sql`
    INSERT INTO article_tags (article_id, tag_id)
    VALUES (${articleId}, ${tagId})
    ON CONFLICT (article_id, tag_id) DO NOTHING
    RETURNING *
  `;
  return result[0];
}

export async function removeTagFromArticle(articleId: number, tagId: number) {
  // Validate IDs
  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new Error("Invalid article ID");
  }

  if (!Number.isInteger(tagId) || tagId <= 0) {
    throw new Error("Invalid tag ID");
  }

  return await sql`
    DELETE FROM article_tags 
    WHERE article_id = ${articleId} AND tag_id = ${tagId}
  `;
}

export async function getArticleTags(articleId: number): Promise<Tag[]> {
  // Validate article ID
  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new Error("Invalid article ID");
  }

  const result = await sql`
    SELECT t.* FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${articleId}
    ORDER BY t.name_en
  `;
  return result as Tag[];
}

// Remove all tags from an article
export async function removeArticleTags(articleId: number) {
  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw new Error("Invalid article ID");
  }
  return await sql`DELETE FROM article_tags WHERE article_id = ${articleId}`;
}

// Cancel a scheduled article (set status to 'cancelled')
export async function cancelScheduledArticle(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid scheduled article ID");
  }
  return await sql`
    UPDATE scheduled_articles SET status = 'cancelled' WHERE id = ${id}
  `;
}

// Publish a scheduled article (set status to 'published' and published_at to now)
export async function publishScheduledArticle(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid scheduled article ID");
  }
  return await sql`
    UPDATE scheduled_articles SET status = 'published', published_at = CURRENT_TIMESTAMP WHERE id = ${id}
  `;
}

// Get sitemap entries from sitemap_cache
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const result =
    await sql`SELECT * FROM sitemap_cache ORDER BY last_modified DESC`;
  return result as SitemapEntry[];
}

// Security wrapper for SQL queries
export function secureSQL(strings: TemplateStringsArray, ...values: any[]) {
  // Validate all string inputs for SQL injection
  values.forEach((value, index) => {
    if (typeof value === "string") {
      if (!validateInput(value)) {
        throw new Error(`Invalid input detected at parameter ${index + 1}`);
      }
    }
  });

  return sql(strings, ...values);
}

// Validation helpers
export function validateId(id: any): number {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error("Invalid ID parameter");
  }
  return numId;
}

export function validateString(input: any, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  if (input.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  if (!validateInput(input)) {
    throw new Error("Input contains invalid characters");
  }

  return sanitizeInput(input);
}

export function validateBoolean(input: any): boolean {
  if (typeof input === "boolean") {
    return input;
  }

  if (typeof input === "string") {
    return input.toLowerCase() === "true";
  }

  throw new Error("Input must be a boolean");
}

export async function trackArticleView(
  articleId: number,
  ipAddress: string,
  userAgent?: string,
  referer?: string,
  sessionId?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO article_views (article_id, ip_address, user_agent, referer, session_id)
      VALUES (${articleId}, ${ipAddress}, ${userAgent || null}, ${
      referer || null
    }, ${sessionId || null})
    `;

    // Update article view count
    await sql`
      UPDATE articles 
      SET view_count = COALESCE(view_count, 0) + 1 
      WHERE id = ${articleId}
    `;
  } catch (error) {
    console.error("Error tracking article view:", error);
  }
}

export async function trackArticleEngagement(
  articleId: number,
  engagementType: string,
  ipAddress: string,
  userAgent?: string,
  platform?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO article_engagement (article_id, engagement_type, ip_address, user_agent, platform)
      VALUES (${articleId}, ${engagementType}, ${ipAddress}, ${
      userAgent || null
    }, ${platform || null})
    `;

    // Update article engagement count
    await sql`
      UPDATE articles 
      SET engagement_count = COALESCE(engagement_count, 0) + 1 
      WHERE id = ${articleId}
    `;
  } catch (error) {
    console.error("Error tracking article engagement:", error);
  }
}

export async function getAnalyticsData(
  days: number = 30
): Promise<AnalyticsData> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total views
    const totalViewsResult = await sql`
      SELECT COUNT(*) as total
      FROM article_views
      WHERE viewed_at >= ${startDate.toISOString()}
    `;
    const totalViews = parseInt(totalViewsResult[0]?.total || "0");

    // Total engagements
    const totalEngagementsResult = await sql`
      SELECT COUNT(*) as total
      FROM article_engagement
      WHERE created_at >= ${startDate.toISOString()}
    `;
    const totalEngagements = parseInt(totalEngagementsResult[0]?.total || "0"); // Popular articles
    const popularArticles = await sql`
      SELECT a.*, c.name_en as category_name_en, c.name_ar as category_name_ar,
             COUNT(av.id) as view_count
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN article_views av ON a.id = av.article_id AND av.viewed_at >= ${startDate.toISOString()}
      WHERE a.is_published = true
      GROUP BY a.id, a.title_en, a.title_ar, a.content_en, a.content_ar, a.excerpt_en, a.excerpt_ar, 
               a.category_id, a.is_published, a.is_featured, a.created_at, a.updated_at, 
               c.name_en, c.name_ar
      ORDER BY COUNT(av.id) DESC
      LIMIT 10
    `;

    // Popular categories
    const popularCategories = await sql`
      SELECT c.name_en as name, c.id as category_id, COUNT(av.id) as count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id
      LEFT JOIN article_views av ON a.id = av.article_id AND av.viewed_at >= ${startDate.toISOString()}
      WHERE a.is_published = true
      GROUP BY c.id, c.name_en
      ORDER BY count DESC
      LIMIT 5
    `;

    // Views timeline
    const viewsTimeline = await sql`
      SELECT DATE(viewed_at) as date, COUNT(*) as views
      FROM article_views
      WHERE viewed_at >= ${startDate.toISOString()}
      GROUP BY DATE(viewed_at)
      ORDER BY date
    `;

    // Engagement timeline
    const engagementTimeline = await sql`
      SELECT DATE(created_at) as date, COUNT(*) as engagements
      FROM article_engagement
      WHERE created_at >= ${startDate.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    // Recent activity
    const recentActivity = await sql`
      SELECT 'view' as type, a.title_en, av.viewed_at as timestamp, av.country, av.city
      FROM article_views av
      JOIN articles a ON av.article_id = a.id
      WHERE av.viewed_at >= ${startDate.toISOString()}
      UNION ALL
      SELECT 'engagement' as type, a.title_en, ae.created_at as timestamp, null as country, ae.engagement_type as city
      FROM article_engagement ae
      JOIN articles a ON ae.article_id = a.id
      WHERE ae.created_at >= ${startDate.toISOString()}
      ORDER BY timestamp DESC
      LIMIT 20
    `;

    return {
      totalViews,
      totalEngagements,
      popularArticles: popularArticles as Article[],
      popularCategories: popularCategories.map((cat) => ({
        name: cat.name,
        count: parseInt(cat.count),
        category_id: cat.category_id,
      })),
      viewsTimeline: viewsTimeline.map((item) => ({
        date: item.date,
        views: parseInt(item.views),
      })),
      engagementTimeline: engagementTimeline.map((item) => ({
        date: item.date,
        engagements: parseInt(item.engagements),
      })),
      recentActivity: recentActivity,
    };
  } catch (error) {
    console.error("Error getting analytics data:", error);
    throw error;
  }
}
