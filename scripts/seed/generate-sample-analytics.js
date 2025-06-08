const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function generateSampleAnalytics() {
  try {
    console.log("Generating sample analytics data...");

    // Get existing articles
    const articles = await sql`SELECT id FROM articles LIMIT 5`;

    if (articles.length === 0) {
      console.log("No articles found. Please add some articles first.");
      return;
    }

    // Generate sample views
    const sampleIPs = [
      "192.168.1.100",
      "10.0.0.50",
      "172.16.0.25",
      "203.0.113.10",
      "198.51.100.5",
    ];

    const sampleCountries = ["US", "CA", "GB", "DE", "FR", "ES", "IT", "AU"];
    const sampleCities = [
      "New York",
      "Toronto",
      "London",
      "Berlin",
      "Paris",
      "Madrid",
      "Rome",
      "Sydney",
    ];
    const sampleUserAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
      "Mozilla/5.0 (Android 11; Mobile; rv:94.0) Gecko/94.0 Firefox/94.0",
    ];

    // Generate views for the last 30 days
    const viewPromises = [];
    for (let i = 0; i < 500; i++) {
      const article = articles[Math.floor(Math.random() * articles.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const viewedAt = new Date();
      viewedAt.setDate(viewedAt.getDate() - daysAgo);

      viewPromises.push(
        sql`
          INSERT INTO article_views (
            article_id, ip_address, user_agent, country, city, viewed_at, reading_time
          ) VALUES (
            ${article.id},
            ${sampleIPs[Math.floor(Math.random() * sampleIPs.length)]},
            ${
              sampleUserAgents[
                Math.floor(Math.random() * sampleUserAgents.length)
              ]
            },
            ${
              sampleCountries[
                Math.floor(Math.random() * sampleCountries.length)
              ]
            },
            ${sampleCities[Math.floor(Math.random() * sampleCities.length)]},
            ${viewedAt.toISOString()},
            ${Math.floor(Math.random() * 300) + 30}
          )
        `
      );
    }

    await Promise.all(viewPromises);
    console.log("✓ Sample views generated");

    // Generate sample engagement
    const engagementTypes = ["like", "share", "bookmark"];
    const platforms = ["facebook", "twitter", "copy_link", "whatsapp"];

    const engagementPromises = [];
    for (let i = 0; i < 200; i++) {
      const article = articles[Math.floor(Math.random() * articles.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      engagementPromises.push(
        sql`
          INSERT INTO article_engagement (
            article_id, engagement_type, ip_address, platform, created_at
          ) VALUES (
            ${article.id},
            ${
              engagementTypes[
                Math.floor(Math.random() * engagementTypes.length)
              ]
            },
            ${sampleIPs[Math.floor(Math.random() * sampleIPs.length)]},
            ${platforms[Math.floor(Math.random() * platforms.length)]},
            ${createdAt.toISOString()}
          )
        `
      );
    }

    await Promise.all(engagementPromises);
    console.log("✓ Sample engagement generated");

    // Schedule some future articles
    const futureArticles = await sql`SELECT id FROM articles LIMIT 3`;
    const schedulePromises = [];

    for (let i = 0; i < futureArticles.length; i++) {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + i + 1);

      schedulePromises.push(
        sql`
          INSERT INTO scheduled_articles (article_id, scheduled_for, status)
          VALUES (${
            futureArticles[i].id
          }, ${scheduledFor.toISOString()}, 'pending')
        `
      );
    }

    await Promise.all(schedulePromises);
    console.log("✓ Sample scheduled articles created");

    console.log("🎉 Sample analytics data generated successfully!");
    console.log(
      "You can now test the analytics dashboard at http://localhost:3000/admin"
    );
  } catch (error) {
    console.error("Error generating sample analytics:", error);
    process.exit(1);
  }
}

generateSampleAnalytics();
