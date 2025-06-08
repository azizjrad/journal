const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

async function checkTables() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(
      "Tables in database:",
      tables.map((t) => t.table_name)
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTables();
