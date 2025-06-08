-- SEO & Tags Enhancement Script
-- Run this script to add tags system and SEO features

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create article_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS article_tags (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(article_id, tag_id)
);

-- Add SEO fields to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description_en TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description_ar TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_keywords_en TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_keywords_ar TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(500);

-- Add SEO fields to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description_en TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description_ar TEXT;

-- Create sitemap cache table
CREATE TABLE IF NOT EXISTS sitemap_cache (
  id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  last_modified TIMESTAMP NOT NULL,
  change_frequency VARCHAR(20) DEFAULT 'weekly',
  priority DECIMAL(2,1) DEFAULT 0.5,
  page_type VARCHAR(50) NOT NULL, -- 'article', 'category', 'page'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_sitemap_cache_page_type ON sitemap_cache(page_type);
CREATE INDEX IF NOT EXISTS idx_sitemap_cache_last_modified ON sitemap_cache(last_modified);

-- Insert some common tags
INSERT INTO tags (name_en, name_ar, slug, description_en, description_ar) VALUES
('Breaking News', 'أخبار عاجلة', 'breaking-news', 'Latest breaking news and urgent updates', 'آخر الأخبار العاجلة والتحديثات المهمة'),
('Politics', 'سياسة', 'politics', 'Political news and government affairs', 'الأخبار السياسية وشؤون الحكومة'),
('Economy', 'اقتصاد', 'economy', 'Economic news and financial updates', 'الأخبار الاقتصادية والتحديثات المالية'),
('Sports', 'رياضة', 'sports', 'Sports news and athletic events', 'الأخبار الرياضية والأحداث الرياضية'),
('Technology', 'تكنولوجيا', 'technology', 'Technology news and innovations', 'أخبار التكنولوجيا والابتكارات'),
('Health', 'صحة', 'health', 'Health news and medical updates', 'الأخبار الصحية والتحديثات الطبية'),
('Education', 'تعليم', 'education', 'Education news and academic affairs', 'أخبار التعليم والشؤون الأكاديمية'),
('Culture', 'ثقافة', 'culture', 'Cultural news and social events', 'الأخبار الثقافية والأحداث الاجتماعية'),
('International', 'دولي', 'international', 'International news and global affairs', 'الأخبار الدولية والشؤون العالمية'),
('Local', 'محلي', 'local', 'Local news and community events', 'الأخبار المحلية وأحداث المجتمع')
ON CONFLICT (slug) DO NOTHING;

-- Create function to automatically generate slugs for articles
CREATE OR REPLACE FUNCTION generate_article_slug(title_en TEXT, article_id INTEGER DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert title to slug format
  base_slug := LOWER(TRIM(REGEXP_REPLACE(title_en, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := TRIM(base_slug, '-');
  
  -- Limit length to 100 characters
  base_slug := LEFT(base_slug, 100);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (
    SELECT 1 FROM articles 
    WHERE slug = final_slug 
    AND (article_id IS NULL OR id != article_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Count words (roughly)
  word_count := ARRAY_LENGTH(STRING_TO_ARRAY(TRIM(content_text), ' '), 1);
  
  -- Average reading speed is 200-250 words per minute, we'll use 225
  reading_time := CEIL(word_count::DECIMAL / 225);
  
  -- Minimum 1 minute
  IF reading_time < 1 THEN
    reading_time := 1;
  END IF;
  
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update article SEO fields
CREATE OR REPLACE FUNCTION update_article_seo_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_article_slug(NEW.title_en, NEW.id);
  END IF;
  
  -- Calculate reading time
  NEW.reading_time_minutes := calculate_reading_time(NEW.content_en);
  
  -- Calculate word count
  NEW.word_count := ARRAY_LENGTH(STRING_TO_ARRAY(TRIM(NEW.content_en), ' '), 1);
  
  -- Auto-generate meta description if not provided
  IF NEW.meta_description_en IS NULL OR NEW.meta_description_en = '' THEN
    NEW.meta_description_en := LEFT(NEW.excerpt_en, 160);
  END IF;
  
  IF NEW.meta_description_ar IS NULL OR NEW.meta_description_ar = '' THEN
    NEW.meta_description_ar := LEFT(NEW.excerpt_ar, 160);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_article_seo_fields ON articles;
CREATE TRIGGER trigger_update_article_seo_fields
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_article_seo_fields();

-- Update existing articles with SEO fields
UPDATE articles SET 
  slug = generate_article_slug(title_en, id),
  reading_time_minutes = calculate_reading_time(content_en),
  word_count = ARRAY_LENGTH(STRING_TO_ARRAY(TRIM(content_en), ' '), 1),
  meta_description_en = COALESCE(LEFT(excerpt_en, 160), LEFT(title_en, 160)),
  meta_description_ar = COALESCE(LEFT(excerpt_ar, 160), LEFT(title_ar, 160))
WHERE slug IS NULL;
