const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

// Use environment variable or fallback
require("dotenv").config({ path: ".env.local" });

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  console.log("Please create a .env.local file with your Neon database URL");
  console.log(
    "Format: DATABASE_URL=postgresql://username:password@host/database"
  );
  process.exit(1);
}

// Database configuration
const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log("Running SEO & Tags migration...");

    console.log("Step 1: Creating tags table...");
    await sql`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(100) NOT NULL,
        name_ar VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description_en TEXT,
        description_ar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Step 2: Creating article_tags junction table...");
    await sql`
      CREATE TABLE IF NOT EXISTS article_tags (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(article_id, tag_id)
      )
    `;

    console.log("Step 3: Adding SEO columns to articles table...");
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description_en TEXT`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description_ar TEXT`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_keywords_en TEXT`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_keywords_ar TEXT`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(500)`;

    console.log("Step 4: Adding SEO columns to categories table...");
    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description_en TEXT`;
    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description_ar TEXT`;

    console.log("Step 5: Creating sitemap cache table...");
    await sql`
      CREATE TABLE IF NOT EXISTS sitemap_cache (
        id SERIAL PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        last_modified TIMESTAMP NOT NULL,
        change_frequency VARCHAR(20) DEFAULT 'weekly',
        priority DECIMAL(2,1) DEFAULT 0.5,
        page_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Step 6: Creating indexes...");
    await sql`CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sitemap_cache_page_type ON sitemap_cache(page_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sitemap_cache_last_modified ON sitemap_cache(last_modified)`;

    console.log("Step 7: Inserting sample tags...");
    await sql`
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
      ON CONFLICT (slug) DO NOTHING
    `;

    console.log("✅ Migration completed successfully!");

    // Test if tables were created
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('tags', 'article_tags', 'sitemap_cache')
    `;

    console.log(
      "📋 Created tables:",
      result.map((row) => row.table_name)
    );

    // Check if columns were added
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'articles' 
      AND column_name IN ('meta_description_en', 'meta_description_ar', 'slug', 'reading_time_minutes', 'word_count')
    `;

    console.log(
      "📋 Added columns to articles:",
      columnCheck.map((row) => row.column_name)
    );

    // Count existing tags
    const tagCount = await sql`SELECT COUNT(*) as count FROM tags`;
    console.log("📋 Total tags in database:", tagCount[0].count);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error.stack);
  }
}

runMigration();
