const { neon } = require("@neondatabase/serverless");
const { readFileSync } = require("fs");
const { join } = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  console.error("Please check your .env.local file");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function createPerformanceIndexes() {
  try {
    console.log("🚀 Creating performance indexes...");

    const indexScript = readFileSync(
      join(process.cwd(), "scripts", "04-performance-indexes.sql"),
      "utf-8"
    );

    // Split the script into individual statements
    const statements = indexScript
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 100)}...`);
        await sql(statement);
        console.log("✅ Success");
      } catch (error) {
        console.warn(`⚠️ Warning for statement: ${error.message}`);
        // Continue with other indexes even if one fails
      }
    }

    console.log("🎉 Performance indexes created successfully!");

    // Test query performance
    console.log("\n📊 Testing query performance...");

    const start = Date.now();
    const testResult = await sql`
      SELECT COUNT(*) as total_articles
      FROM articles 
      WHERE is_published = true
    `;
    const queryTime = Date.now() - start;

    console.log(`Query executed in ${queryTime}ms`);
    console.log(`Total published articles: ${testResult[0].total_articles}`);
  } catch (error) {
    console.error("❌ Error creating performance indexes:", error);
    process.exit(1);
  }
}

createPerformanceIndexes();
