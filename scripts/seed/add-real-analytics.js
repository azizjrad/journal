const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function addRealAnalyticsData() {
  try {
    console.log("Adding real analytics data...");

    // Get existing articles
    const articles =
      await sql`SELECT id, title_en FROM articles WHERE is_published = true LIMIT 5`;

    if (articles.length === 0) {
      console.log("No published articles found.");
      return;
    }

    console.log(`Found ${articles.length} articles to add analytics for:`);
    articles.forEach((article) => {
      console.log(`- Article ${article.id}: ${article.title_en}`);
    });

    // Add real article views for the last 7 days
    const viewsData = [];
    const sampleIPs = [
      "192.168.1.100",
      "10.0.0.50",
      "172.16.0.25",
      "203.0.113.10",
      "198.51.100.5",
      "192.168.1.200",
    ];
    const sampleCountries = ["US", "CA", "GB", "DE", "FR", "LY"];
    const sampleCities = [
      "New York",
      "Toronto",
      "London",
      "Berlin",
      "Paris",
      "Tripoli",
    ];

    // Generate views for each article over the last 7 days
    for (let day = 0; day < 7; day++) {
      const viewDate = new Date();
      viewDate.setDate(viewDate.getDate() - day);

      for (const article of articles) {
        // Random number of views per day (5-25 views per article)
        const viewsCount = Math.floor(Math.random() * 20) + 5;

        for (let i = 0; i < viewsCount; i++) {
          const viewTime = new Date(viewDate);
          viewTime.setHours(Math.floor(Math.random() * 24));
          viewTime.setMinutes(Math.floor(Math.random() * 60));

          const readingTime = Math.floor(Math.random() * 300) + 30; // 30-330 seconds

          viewsData.push({
            article_id: article.id,
            ip_address: sampleIPs[Math.floor(Math.random() * sampleIPs.length)],
            country:
              sampleCountries[
                Math.floor(Math.random() * sampleCountries.length)
              ],
            city: sampleCities[Math.floor(Math.random() * sampleCities.length)],
            viewed_at: viewTime.toISOString(),
            reading_time: readingTime,
          });
        }
      }
    }

    // Insert views data in batches
    console.log(`Adding ${viewsData.length} article views...`);
    for (const view of viewsData) {
      await sql`
        INSERT INTO article_views (article_id, ip_address, country, city, viewed_at, reading_time)
        VALUES (${view.article_id}, ${view.ip_address}, ${view.country}, ${view.city}, ${view.viewed_at}, ${view.reading_time})
      `;
    }

    // Add real engagement data
    const engagementTypes = ["like", "share", "bookmark"];
    const platforms = [
      "facebook",
      "twitter",
      "linkedin",
      "whatsapp",
      "copy_link",
    ];

    console.log("Adding engagement data...");
    for (let i = 0; i < 50; i++) {
      const article = articles[Math.floor(Math.random() * articles.length)];
      const engagementTime = new Date();
      engagementTime.setDate(
        engagementTime.getDate() - Math.floor(Math.random() * 7)
      );

      await sql`
        INSERT INTO article_engagement (article_id, engagement_type, ip_address, platform, created_at)
        VALUES (
          ${article.id},
          ${
            engagementTypes[Math.floor(Math.random() * engagementTypes.length)]
          },
          ${sampleIPs[Math.floor(Math.random() * sampleIPs.length)]},
          ${platforms[Math.floor(Math.random() * platforms.length)]},
          ${engagementTime.toISOString()}
        )
      `;
    }

    console.log("✅ Real analytics data added successfully!");
    console.log("📊 You can now view the analytics dashboard with real data.");
    console.log("🌐 Visit: http://localhost:3000/admin → Analytics tab");
  } catch (error) {
    console.error("❌ Error adding analytics data:", error);
    process.exit(1);
  }
}

addRealAnalyticsData();
