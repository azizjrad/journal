const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function clearAnalyticsData() {
  try {
    console.log("🧹 Clearing all analytics data...");

    // Clear all analytics tables
    await sql`DELETE FROM article_views`;
    console.log("✅ Cleared article_views table");

    await sql`DELETE FROM article_engagement`;
    console.log("✅ Cleared article_engagement table");

    await sql`DELETE FROM analytics_cache`;
    console.log("✅ Cleared analytics_cache table");

    // Optional: Reset auto-increment counters (if using PostgreSQL sequences)
    try {
      await sql`ALTER SEQUENCE article_views_id_seq RESTART WITH 1`;
      await sql`ALTER SEQUENCE article_engagement_id_seq RESTART WITH 1`;
      console.log("✅ Reset sequence counters");
    } catch (e) {
      // Sequences might not exist or be named differently
      console.log(
        "ℹ️  Note: Could not reset sequences (this is normal for some databases)"
      );
    }

    console.log("");
    console.log("🎉 All analytics data has been cleared!");
    console.log(
      "📊 Your analytics will now start fresh with real user data only."
    );
    console.log("🌐 Visit: http://localhost:3000/admin → Analytics tab");
    console.log("");
    console.log("💡 From now on, analytics will only track:");
    console.log("   - Real page views when you visit articles");
    console.log("   - Real engagements when you interact with content");
    console.log("   - No more mock/test data");
  } catch (error) {
    console.error("❌ Error clearing analytics data:", error);
    process.exit(1);
  }
}

clearAnalyticsData();
