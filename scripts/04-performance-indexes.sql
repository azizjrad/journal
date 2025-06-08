-- Performance indexes for faster queries
-- Add these indexes to improve navigation performance

-- Index for articles by category (category page queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_category_published 
ON articles(category_id, is_published, published_at DESC);

-- Index for published articles ordered by date (homepage queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_published_date 
ON articles(is_published, published_at DESC) 
WHERE is_published = true;

-- Index for featured articles (hero section queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_featured_published 
ON articles(is_featured, is_published, published_at DESC) 
WHERE is_featured = true AND is_published = true;

-- Index for category slug lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_slug 
ON categories(slug);

-- Composite index for article views tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_article_views_article_date 
ON article_views(article_id, viewed_at DESC);

-- Index for article engagement tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_article_engagements_article_type 
ON article_engagements(article_id, engagement_type, created_at DESC);

-- Index for scheduled articles
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scheduled_articles_status_date 
ON scheduled_articles(status, scheduled_for);

-- Full text search indexes for article content
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_title_en_fts 
ON articles USING gin(to_tsvector('english', title_en));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_title_ar_fts 
ON articles USING gin(to_tsvector('arabic', title_ar));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_content_en_fts 
ON articles USING gin(to_tsvector('english', content_en));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_content_ar_fts 
ON articles USING gin(to_tsvector('arabic', content_ar));

-- Analyze tables to update statistics
ANALYZE articles;
ANALYZE categories;
ANALYZE article_views;
ANALYZE article_engagements;
ANALYZE scheduled_articles;
