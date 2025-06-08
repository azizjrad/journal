const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function addMissingColumns() {
  try {
    console.log("Adding missing columns to articles table...");

    // Add view_count column
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0`;
    console.log("✓ Added view_count column");

    // Add engagement_count column
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS engagement_count INTEGER DEFAULT 0`;
    console.log("✓ Added engagement_count column");

    // Add scheduled_for column
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP`;
    console.log("✓ Added scheduled_for column");

    console.log("\nAll columns added successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

addMissingColumns();
