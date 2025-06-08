#!/usr/bin/env node

/**
 * Secure Environment Setup Script
 * Generates secure environment variables for production deployment
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

console.log("🔐 Secure Environment Setup");
console.log("===========================\n");

// Generate secure JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Generate secure admin password hash
const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Generate secure admin token
const generateAdminToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate CSRF secret
const generateCSRFSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

async function setupSecureEnvironment() {
  try {
    console.log("1. Generating secure credentials...");

    // Read current environment file
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
      console.log("   📄 Found existing .env.local file");
    } else {
      console.log("   📄 Creating new .env.local file");
    }

    // Generate new secure values
    const jwtSecret = generateJWTSecret();
    const adminPassword = "admin123"; // You should change this to a secure password
    const adminPasswordHash = await generatePasswordHash(adminPassword);
    const adminToken = generateAdminToken();
    const csrfSecret = generateCSRFSecret();

    console.log("   ✅ JWT Secret generated");
    console.log("   ✅ Admin password hash generated");
    console.log("   ✅ Admin token generated");
    console.log("   ✅ CSRF secret generated");

    // Create secure environment configuration
    const secureEnvContent = `# Database Configuration
# Replace this with your actual Neon database URL
DATABASE_URL="${
      envContent.includes("DATABASE_URL")
        ? envContent.match(/DATABASE_URL="([^"]+)"/)?.[1] ||
          "your-database-url-here"
        : "your-database-url-here"
    }"

# Security Configuration
JWT_SECRET="${jwtSecret}"
CSRF_SECRET="${csrfSecret}"

# Admin Authentication (SECURE)
ADMIN_PASSWORD_HASH="${adminPasswordHash}"
ADMIN_TOKEN="${adminToken}"

# Legacy (for reference - remove in production)
# ADMIN_PASSWORD="${adminPassword}"

# Application Configuration
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_API_URL="https://your-domain.com/api"

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_MAX_API_REQUESTS="50"

# Session Configuration
SESSION_COOKIE_SECURE="true"
SESSION_COOKIE_HTTP_ONLY="true"
SESSION_COOKIE_SAME_SITE="strict"

# CORS Configuration
CORS_ALLOWED_ORIGINS="https://your-domain.com,https://www.your-domain.com"

# Upload Configuration
MAX_FILE_SIZE="5242880"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp,image/gif"

# Logging Configuration
LOG_LEVEL="info"
LOG_SECURITY_EVENTS="true"

# Email Configuration (if needed)
# SMTP_HOST="your-smtp-host"
# SMTP_PORT="587"
# SMTP_USER="your-email@domain.com"
# SMTP_PASS="your-email-password"

# Analytics Configuration (if needed)
# GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
# GOOGLE_SITE_VERIFICATION="your-verification-code"

# You can get your Neon database URL from:
# 1. Go to https://neon.tech/
# 2. Create an account or log in
# 3. Create a new project
# 4. Copy the connection string from your dashboard
# 5. Replace the DATABASE_URL above with your actual connection string

# Example format:
# DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
`;

    // Backup current environment file
    if (fs.existsSync(envPath)) {
      const backupPath = `${envPath}.backup.${Date.now()}`;
      fs.copyFileSync(envPath, backupPath);
      console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
    }

    // Write secure environment file
    fs.writeFileSync(envPath, secureEnvContent);
    console.log("   📝 Secure .env.local file created");

    // Create production environment template
    const prodEnvPath = path.join(process.cwd(), ".env.production.template");
    const prodEnvContent = secureEnvContent.replace(
      'NODE_ENV="production"',
      'NODE_ENV="production"\n# This is a template for production environment variables'
    );

    fs.writeFileSync(prodEnvPath, prodEnvContent);
    console.log("   📝 Production template created (.env.production.template)");

    console.log("\n2. Security Configuration Summary:");
    console.log("================================");
    console.log(`   🔑 JWT Secret: ${jwtSecret.substring(0, 16)}...`);
    console.log(
      `   🔐 Admin Password Hash: ${adminPasswordHash.substring(0, 20)}...`
    );
    console.log(`   🎟️  Admin Token: ${adminToken.substring(0, 16)}...`);
    console.log(`   🛡️  CSRF Secret: ${csrfSecret.substring(0, 16)}...`);

    console.log("\n3. Important Security Notes:");
    console.log("===========================");
    console.log("   ⚠️  Change the default admin password!");
    console.log("   ⚠️  Update NEXT_PUBLIC_SITE_URL to your domain");
    console.log("   ⚠️  Update DATABASE_URL to your actual database");
    console.log("   ⚠️  Review and customize all configuration values");
    console.log("   ⚠️  Never commit .env.local to version control");
    console.log("   ⚠️  Use different secrets for different environments");

    console.log("\n4. Next Steps:");
    console.log("=============");
    console.log("   1. Update DATABASE_URL with your actual database URL");
    console.log("   2. Change the admin password to something secure");
    console.log("   3. Update NEXT_PUBLIC_SITE_URL to your domain");
    console.log("   4. Review all configuration values");
    console.log("   5. Test the application with new settings");
    console.log("   6. Deploy with production environment variables");

    console.log("\n✅ Secure environment configuration complete!");
  } catch (error) {
    console.error("❌ Error setting up secure environment:", error);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupSecureEnvironment().catch(console.error);
}
