# 🌍 Akhbarna - Bilingual News Website

<div align="center">

![Akhbarna Logo](public/favicon.svg)

**A cutting-edge bilingual news platform delivering real-time Arabic and English content with modern web technologies**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🌐 Live Demo](#) | [📖 Documentation](#installation) | [🚀 Quick Start](#quick-start)

</div>

---

## ✨ Features That Set Us Apart

### 🌏 **True Bilingual Experience**

- **Seamless Language Switching**: Switch between Arabic and English with a single click
- **RTL/LTR Support**: Perfect text direction handling for both languages
- **Cultural Localization**: Content adapted for different cultural contexts
- **Dynamic Font Optimization**: Optimized typography for both Arabic and Latin scripts

### 🎨 **Modern Design & UX**

- **Glass Morphism UI**: Beautiful translucent design elements
- **Dark Theme**: Eye-friendly dark mode with glass effects
- **Mobile-First**: Responsive design that works perfectly on all devices
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation support
- **Smooth Animations**: Elegant transitions and micro-interactions

### 📰 **Advanced Content Management**

- **Rich Article Editor**: WYSIWYG editor with bilingual content support
- **Smart Image Handling**: Drag-and-drop upload with automatic optimization
- **Category Management**: Hierarchical content organization
- **Tag System**: Advanced tagging for better content discovery
- **Content Scheduling**: Plan and schedule article publications
- **Bulk Operations**: Efficient management of multiple articles

### 🔍 **Search & Discovery**

- **Advanced Search**: Multi-language search with filters
- **Auto-complete**: Smart search suggestions
- **Category Browsing**: Intuitive content navigation
- **Related Articles**: AI-powered content recommendations
- **Trending Topics**: Real-time trending content tracking

### 📊 **Analytics & Insights**

- **Real-time Analytics**: Live view counts and engagement metrics
- **Performance Dashboard**: Comprehensive admin analytics
- **User Engagement Tracking**: Article interaction monitoring
- **SEO Performance**: Search engine optimization insights
- **Content Performance**: Article success metrics

### 🔒 **Enterprise-Grade Security**

- **Secure Authentication**: Protected admin access
- **Input Validation**: XSS and injection protection
- **File Upload Security**: Safe image handling with validation
- **Rate Limiting**: API protection against abuse
- **Data Sanitization**: Clean and secure content processing

### ⚡ **Performance & SEO**

- **Lightning Fast**: Optimized for Core Web Vitals
- **SEO Optimized**: Dynamic meta tags and structured data
- **XML Sitemaps**: Automatic search engine indexing
- **Social Media Ready**: Open Graph and Twitter Card support
- **PWA Ready**: Progressive Web App capabilities
- **CDN Integration**: Global content delivery optimization

## 🛠️ **Cutting-Edge Tech Stack**

<div align="center">

| Frontend     | Backend     | Database    | Deployment |
| ------------ | ----------- | ----------- | ---------- |
| Next.js 14   | Node.js     | PostgreSQL  | Vercel     |
| TypeScript   | API Routes  | Neon DB     | Docker     |
| Tailwind CSS | Serverless  | Redis Cache | AWS S3     |
| Radix UI     | Next.js API | Prisma ORM  | CloudFlare |

</div>

### 🎯 **Core Technologies**

- **Next.js 14**: Latest App Router with Server Components
- **TypeScript**: Full type safety and developer experience
- **PostgreSQL**: Robust relational database with advanced features
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Radix UI**: Unstyled, accessible UI components

## 🏗️ **Architecture & Structure**

```
📁 akhbarna-news/
├── 🌐 app/                    # Next.js App Router
│   ├── 🔌 api/               # RESTful API endpoints
│   │   ├── admin/            # Admin management APIs
│   │   ├── search/           # Search functionality
│   │   ├── track/            # Analytics tracking
│   │   └── sitemap.xml/      # SEO sitemap generation
│   ├── 👑 admin/             # Admin dashboard pages
│   │   ├── layout.tsx        # Admin layout wrapper
│   │   ├── page.tsx          # Main dashboard
│   │   └── articles/         # Article management
│   ├── 📄 article/[id]/      # Dynamic article pages
│   ├── 📂 category/[slug]/   # Category listing pages
│   ├── 🔍 search/            # Search results page
│   └── 📰 news/              # News listing page
├── 🧩 components/            # React components
│   ├── 🎨 ui/               # Reusable UI components
│   │   ├── button.tsx        # Custom button components
│   │   ├── dialog.tsx        # Modal dialogs
│   │   ├── card.tsx          # Content cards
│   │   └── ...               # More UI primitives
│   ├── admin-dashboard.tsx   # Main admin interface
│   ├── article-card.tsx      # Article preview cards
│   ├── language-switcher.tsx # Bilingual toggle
│   ├── hero-carousel.tsx     # Featured content slider
│   └── share-buttons.tsx     # Social sharing
├── 📚 lib/                   # Core utilities
│   ├── db.ts                 # Database operations
│   ├── admin-auth.tsx        # Authentication logic
│   ├── language-context.tsx  # Internationalization
│   └── utils.ts              # Helper functions
├── 🎯 public/               # Static assets
│   ├── uploads/              # User-uploaded images
│   ├── *.svg                # Vector icons
│   └── favicon.ico           # Site favicon
└── 🛠️ scripts/              # Database & tools
    ├── db/                   # Database migrations
    ├── seed/                 # Sample data
    └── *.sql                # Schema definitions
```

## 🚀 **Quick Start Guide**

### 📋 **Prerequisites**

```bash
Node.js 18.0+ ✅
PostgreSQL 13+ ✅
Git ✅
```

### ⚡ **One-Click Setup**

```bash
# 🔽 Clone the repository
git clone <repository-url>
cd akhbarna-news

# 📦 Install dependencies
npm install

# ⚙️ Environment setup
cp .env.local.example .env.local
```

### 🔧 **Environment Configuration**

Create your `.env.local` file:

```env
# 🗄️ Database Configuration
DATABASE_URL=postgresql://username:password@host/database

# 🔒 Security Keys
ADMIN_PASSWORD_HASH=your_secure_hash_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 📊 Analytics (Optional)
ANALYTICS_API_KEY=your_analytics_key
```

### 🗄️ **Database Setup**

```bash
# 🚀 Quick database setup
npm run db:setup

# 📊 Create tables and indexes
npm run db:migrate

# 🌱 Seed with sample data
npm run db:seed

# 🔧 Setup analytics tables
npm run db:analytics
```

### 🏃‍♂️ **Launch the Application**

```bash
# 🌟 Start development server
npm run dev

# 🔗 Open your browser
# Navigate to: http://localhost:3000
```

## 🎯 **Key Features Showcase**

### 🌍 **Multi-Language Content Management**

```typescript
// Seamless language switching
const article = {
  title_en: "Breaking News from Libya",
  title_ar: "أخبار عاجلة من ليبيا",
  content_en: "English content...",
  content_ar: "المحتوى العربي...",
  slug: "auto-generated-seo-friendly-url",
};
```

### 📊 **Real-Time Analytics Dashboard**

- **Live View Tracking**: Monitor article views in real-time
- **Engagement Metrics**: Track user interactions and time spent
- **Popular Content**: Identify trending articles and categories
- **Performance Insights**: Page load times and user behavior

### 🎨 **Modern Admin Interface**

- **Glass Morphism Design**: Beautiful translucent UI elements
- **Dark Theme**: Professional dark mode with accent colors
- **Responsive Dashboard**: Works perfectly on desktop and mobile
- **Drag & Drop**: Intuitive file uploads and content management

### 🔍 **Advanced Search Capabilities**

```typescript
// Multi-language search with filters
const searchResults = await searchArticles({
  query: "Libya Economy", // Works in Arabic too: "اقتصاد ليبيا"
  language: "en", // or "ar"
  category: "business",
  dateRange: "last-month",
  sortBy: "relevance",
});
```

node scripts/db/setup-analytics.js

# Create performance indexes

node scripts/db/create-indexes.js

````

5. **Add Sample Data (Optional)**

```bash
node scripts/seed/add-sample-data.js
node scripts/seed/generate-sample-analytics.js
````

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
