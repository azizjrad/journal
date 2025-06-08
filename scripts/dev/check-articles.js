const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

async function checkArticles() {
  try {
    const articles = await sql`SELECT id, title_en FROM articles LIMIT 5`;
    console.log("Articles in database:", articles);
  } catch (error) {
    console.error("Error:", error);
  }
}

checkArticles();
