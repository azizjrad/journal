console.log("Environment variables check:");
console.log("ADMIN_USERNAME:", process.env.ADMIN_USERNAME);
console.log("ADMIN_PASSWORD_HASH:", process.env.ADMIN_PASSWORD_HASH);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");

// Test the default hash
const defaultHash =
  "$2b$12$NlAbE8qrYUaM2CMzciweDO66DRj0lpa5W381WCqFB5E8gm6rtlqTu";
console.log("Default hash:", defaultHash);
console.log("Default hash length:", defaultHash.length);

if (process.env.ADMIN_PASSWORD_HASH) {
  console.log("Env hash length:", process.env.ADMIN_PASSWORD_HASH.length);
}
