const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function setupAnalytics() {
  try {
    console.log("Setting up analytics tables..."); // Read and execute the analytics SQL script
    const analyticsSQL = fs.readFileSync(
      path.join(__dirname, "scripts", "03-analytics-tables.sql"),
      "utf8"
    );

    // Execute each CREATE TABLE statement separately
    await sql`
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
        reading_time INTEGER DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS article_engagement (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        engagement_type VARCHAR(20) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        platform VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS scheduled_articles (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        scheduled_for TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS analytics_cache (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        cache_data JSONB NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views(viewed_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_article_engagement_article_id ON article_engagement(article_id)`;

    console.log("✓ Article views table created");
    console.log("✓ Article engagement table created");
    console.log("✓ Scheduled articles table created");
    console.log("✓ Analytics cache table created");
    console.log("✓ Indexes created");
    console.log("🎉 Analytics setup completed successfully!");
  } catch (error) {
    console.error("Error setting up analytics:", error);
    process.exit(1);
  }
}

setupAnalytics();
