# Bilingual News Website

A modern, SEO-optimized bilingual news website built with Next.js 14, featuring Arabic and English content support, advanced analytics, and comprehensive SEO features.

## 🚀 Features

### Core Features

- **Bilingual Support**: Full Arabic and English content with RTL/LTR text direction
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Admin Dashboard**: Complete content management system
- **SEO Optimized**: Dynamic meta tags, sitemaps, and structured data
- **Analytics**: Real-time article views and engagement tracking
- **Image Upload**: Secure image handling with file management

### SEO & Performance

- **Dynamic Meta Tags**: Auto-generated SEO-friendly descriptions
- **XML Sitemap**: Automatic sitemap generation (`/api/sitemap.xml`)
- **Article Tags System**: Keyword tagging for better categorization
- **Reading Time**: Automatic reading time estimation
- **Performance Indexes**: Optimized database queries
- **Open Graph & Twitter Cards**: Social media optimization

### Content Management

- **Rich Text Editor**: Easy content creation and editing
- **Category Management**: Organize articles by categories
- **Image Upload**: Direct image upload with preview
- **Article Scheduling**: Plan content publication
- **Bulk Operations**: Efficient content management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **TypeScript**: Full type safety
- **Authentication**: Custom admin authentication

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard pages
│   ├── article/           # Article pages
│   ├── category/          # Category pages
│   └── search/            # Search functionality
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature-specific components
├── lib/                   # Utility libraries
├── public/               # Static assets
├── scripts/              # Database and utility scripts
│   ├── db/              # Database setup and migration
│   ├── dev/             # Development tools
│   └── seed/            # Sample data generation
└── *.sql                # SQL migration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bilingual-news-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your database URL:

   ```
   DATABASE_URL=postgresql://username:password@host/database
   ```

4. **Database Setup**

   ```bash
   # Initial database setup
   node scripts/db/setup-db.js

   # Run migrations
   node scripts/db/run-migration.js

   # Setup analytics
   node scripts/db/setup-analytics.js

   # Create performance indexes
   node scripts/db/create-indexes.js
   ```

5. **Add Sample Data (Optional)**

   ```bash
   node scripts/seed/add-sample-data.js
   node scripts/seed/generate-sample-analytics.js
   ```

6. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Core Tables

- **articles**: Main content with bilingual fields and SEO data
- **categories**: Content categorization
- **tags**: Article tagging system
- **article_tags**: Many-to-many relationship for tags

### Analytics Tables

- **article_views**: Track article page views
- **engagement_events**: User interaction tracking
- **sitemap_cache**: Cached sitemap data

### SEO Fields

- `meta_description_en/ar`: SEO descriptions
- `meta_keywords_en/ar`: SEO keywords
- `reading_time_minutes`: Auto-calculated reading time
- `word_count`: Auto-calculated word count
- `slug`: SEO-friendly URLs

## 🔧 Scripts & Tools

See [scripts/README.md](scripts/README.md) for detailed documentation of all utility scripts.

### Quick Commands

```bash
# Database management
node scripts/db/setup-db.js              # Initial setup
node scripts/db/run-migration.js         # Run migrations

# Development tools
node scripts/dev/check-tables.js         # List database tables
node scripts/dev/check-articles.js       # Verify articles

# Sample data
node scripts/seed/add-sample-data.js     # Add sample data
```

## 🌐 API Endpoints

### Public APIs

- `GET /api/sitemap.xml` - XML sitemap
- `POST /api/track/view` - Track article views
- `POST /api/track/engagement` - Track user engagement

### Admin APIs

- `GET/POST /api/admin/articles` - Article management
- `GET/POST /api/admin/categories` - Category management
- `GET/POST /api/admin/tags` - Tag management
- `GET /api/admin/analytics` - Analytics data

## 🎨 Components

### UI Components (`components/ui/`)

- Reusable components built with Radix UI
- Fully accessible and customizable
- Consistent design system

### Feature Components

- `article-card.tsx` - Article display cards
- `enhanced-new-article-form.tsx` - Article creation
- `enhanced-edit-article-form.tsx` - Article editing
- `analytics-dashboard.tsx` - Analytics display
- `admin-dashboard.tsx` - Admin interface

## 🔍 SEO Features

### Meta Tags

- Dynamic Open Graph tags
- Twitter Card optimization
- Auto-generated descriptions
- Keyword optimization

### Sitemap

- Automatic XML sitemap generation
- Real-time updates
- Search engine optimization

### Performance

- Database indexing
- Optimized queries
- Caching strategies

## 📱 Responsive Design

- Mobile-first approach
- RTL/LTR text direction support
- Touch-friendly interfaces
- Cross-browser compatibility

## 🚦 Development

### Code Quality

- TypeScript for type safety
- ESLint configuration
- Consistent code formatting

### Testing

- Development utilities in `scripts/dev/`
- Database verification tools
- Sample data for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the [scripts documentation](scripts/README.md)
- Review the database schema
- Examine the API endpoints
- Test with sample data

## 🔄 Recent Updates

- ✅ Complete SEO implementation with meta tags and sitemaps
- ✅ Article tagging system with keyword support
- ✅ Reading time estimation and word count tracking
- ✅ Enhanced admin interface with tag management
- ✅ Performance optimization with database indexes
- ✅ Organized script structure for better maintainability

## 🛡️ Security Features

The Bilingual News Website is built with enterprise-grade security, following best practices and industry standards. Below is a summary of the implemented security features:

### Authentication & Authorization

- JWT-based secure authentication for admin users
- Bcrypt password hashing (12 rounds)
- Secure cookie management (HTTP-only, SameSite)
- Automatic token expiration and renewal
- Admin route protection and session validation

### CSRF Protection

- Token-based CSRF validation for all forms and sensitive API endpoints
- Dynamic token generation (`/api/csrf`)
- Server-side token verification and automatic rotation

### Input Validation & Sanitization

- Comprehensive input validation framework for all API endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (content sanitization)
- File upload security validation
- URL and email validation
- HTML content sanitization

### Rate Limiting & DDoS Protection

- IP-based API rate limiting
- Dynamic rate limit headers
- Endpoint-specific limits
- Authentication attempt limiting
- File upload rate limiting

### Security Headers

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- Referrer Policy configuration
- Permissions Policy

### Secure Error Handling

- No internal information disclosure
- Structured error responses
- Security event logging and IP tracking
- Graceful error fallbacks

### Security Monitoring

- Real-time security dashboard (admin panel)
- Security metrics API
- Automated security auditing
- Threat detection and analysis
- Comprehensive security logging

### File Security

- File type validation and size restrictions
- Malicious file detection
- Secure file naming and upload directory protection

### Security Documentation

- See `SECURITY.md` and `SECURITY-COMPLETE.md` for full details
- Security testing and production setup scripts in `scripts/security/`

---

For more information, see the [SECURITY-COMPLETE.md](SECURITY-COMPLETE.md) file for a full breakdown of all security features, coverage, and deployment recommendations.
