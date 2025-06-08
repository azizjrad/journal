const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

async function addMinimalSampleData() {
  try {
    console.log("Adding minimal sample analytics data...");

    // Add a few views for article 1
    await sql`
      INSERT INTO article_views (article_id, ip_address, country, city, reading_time, viewed_at)
      VALUES 
        (1, '192.168.1.100', 'US', 'New York', 120, NOW() - INTERVAL '1 day'),
        (1, '10.0.0.50', 'CA', 'Toronto', 90, NOW() - INTERVAL '2 days'),
        (2, '172.16.0.25', 'GB', 'London', 150, NOW() - INTERVAL '1 day'),
        (3, '203.0.113.10', 'DE', 'Berlin', 180, NOW() - INTERVAL '3 hours')
    `;

    // Add some engagement
    await sql`
      INSERT INTO article_engagement (article_id, engagement_type, platform, created_at)
      VALUES 
        (1, 'share', 'facebook', NOW() - INTERVAL '1 day'),
        (1, 'like', 'website', NOW() - INTERVAL '2 hours'),
        (2, 'share', 'twitter', NOW() - INTERVAL '1 day'),
        (3, 'bookmark', 'website', NOW() - INTERVAL '1 hour')
    `;

    // Add a scheduled article
    await sql`
      INSERT INTO scheduled_articles (article_id, scheduled_for, status)
      VALUES (4, NOW() + INTERVAL '1 day', 'pending')
    `;

    console.log("✓ Minimal sample data added successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

addMinimalSampleData();
