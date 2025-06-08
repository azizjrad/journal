#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * Generates secure environment variables for production deployment
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

console.log("🔐 Production Environment Setup");
console.log("================================\n");

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString("hex");
console.log("✅ Generated secure JWT secret");

// Get admin password from user or use default
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function setupProduction() {
  try {
    // Prompt for admin password
    const adminPassword = await new Promise((resolve) => {
      rl.question(
        "Enter admin password (or press Enter for 'admin123'): ",
        (answer) => {
          resolve(answer || "admin123");
        }
      );
    });

    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    console.log("✅ Generated secure password hash");

    // Generate production environment file
    const productionEnv = `# Production Environment Configuration
# Generated on ${new Date().toISOString()}

# Application
NODE_ENV=production

# Database (Update with your production database URL)
DATABASE_URL=postgresql://username:password@host:port/database

# Security
JWT_SECRET=${jwtSecret}
ADMIN_PASSWORD_HASH=${passwordHash}

# CORS Configuration (Update with your domain)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Upload
UPLOAD_DIR=/var/www/uploads
MAX_FILE_SIZE=5242880

# Optional: Redis for Rate Limiting
# REDIS_URL=redis://localhost:6379

# Optional: Email Configuration
# SMTP_HOST=your-smtp-host
# SMTP_PORT=587
# SMTP_USER=your-smtp-user
# SMTP_PASS=your-smtp-password

# Optional: Analytics
# GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Optional: Content Delivery Network
# CDN_URL=https://cdn.yourdomain.com
`;

    // Write to .env.production file
    const envPath = path.join(process.cwd(), ".env.production");
    fs.writeFileSync(envPath, productionEnv);

    console.log("✅ Created .env.production file");
    console.log(`📁 File location: ${envPath}`);

    // Create a secure credentials backup
    const credentialsBackup = `# Secure Credentials Backup
# Generated on ${new Date().toISOString()}
# KEEP THIS FILE SECURE AND DO NOT COMMIT TO VERSION CONTROL

JWT_SECRET=${jwtSecret}
ADMIN_PASSWORD_HASH=${passwordHash}
ADMIN_PASSWORD_PLAIN=${adminPassword}
`;

    const backupPath = path.join(
      process.cwd(),
      "scripts",
      "security",
      "production-credentials.txt"
    );
    fs.writeFileSync(backupPath, credentialsBackup);
    console.log("✅ Created credentials backup file");
    console.log(`📁 Backup location: ${backupPath}`);

    // Security recommendations
    console.log("\n🔧 Security Setup Complete!");
    console.log("============================");
    console.log("📋 Next Steps:");
    console.log("1. Update DATABASE_URL with your production database");
    console.log("2. Update NEXT_PUBLIC_SITE_URL with your domain");
    console.log("3. Configure HTTPS/SSL certificates");
    console.log("4. Set up reverse proxy (Nginx/Apache)");
    console.log("5. Configure backup procedures");
    console.log("6. Set up monitoring and alerting");

    console.log("\n⚠️  IMPORTANT SECURITY NOTES:");
    console.log("• Never commit .env.production to version control");
    console.log("• Store credentials backup in a secure location");
    console.log("• Change default admin password after first login");
    console.log("• Regularly rotate JWT secrets");
    console.log("• Monitor security logs daily");

    console.log("\n🚀 Your production environment is ready for deployment!");

    rl.close();
  } catch (error) {
    console.error("❌ Error setting up production environment:", error);
    rl.close();
    process.exit(1);
  }
}

// Additional utility functions
function generateCSRFSecret() {
  return crypto.randomBytes(32).toString("hex");
}

function generateSessionSecret() {
  return crypto.randomBytes(64).toString("hex");
}

// Export for programmatic use
module.exports = {
  setupProduction,
  generateCSRFSecret,
  generateSessionSecret,
};

// Run if called directly
if (require.main === module) {
  setupProduction();
}
