-- Analytics Tables for Enhanced Admin Dashboard
-- Run this script to add analytics capabilities

-- Article views tracking
CREATE TABLE IF NOT EXISTS article_views (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referer TEXT,
  country VARCHAR(2),
  city VARCHAR(100),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(255),
  reading_time INTEGER DEFAULT 0 -- in seconds
);

-- Article engagement tracking (likes, shares, etc.)
CREATE TABLE IF NOT EXISTS article_engagement (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  engagement_type VARCHAR(20) NOT NULL, -- 'like', 'share', 'bookmark', 'comment'
  ip_address VARCHAR(45),
  user_agent TEXT,
  platform VARCHAR(50), -- 'facebook', 'twitter', 'whatsapp', 'email', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content scheduling for future publication
CREATE TABLE IF NOT EXISTS scheduled_articles (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'published', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- Analytics summary cache (for performance)
CREATE TABLE IF NOT EXISTS analytics_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  cache_data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_article_engagement_article_id ON article_engagement(article_id);
CREATE INDEX IF NOT EXISTS idx_article_engagement_type ON article_engagement(engagement_type);
CREATE INDEX IF NOT EXISTS idx_scheduled_articles_scheduled_for ON scheduled_articles(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires ON analytics_cache(expires_at);

-- Add view count column to articles table for quick access
ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS engagement_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP;
