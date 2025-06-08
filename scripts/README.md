# Scripts Directory

This directory contains all utility scripts for the bilingual news website project, organized by purpose.

## Directory Structure

### `/db` - Database Scripts

Scripts for database setup, migration, and maintenance.

- **`setup-db.js`** - Initial database setup, creates all tables and basic structure
- **`run-migration.js`** - Migration runner for executing SQL migration files
- **`setup-analytics.js`** - Sets up analytics tables for tracking article views and engagement
- **`create-indexes.js`** - Creates performance indexes for better query performance

### `/dev` - Development Tools

Utilities for development and debugging.

- **`check-tables.js`** - Lists all database tables for inspection
- **`check-articles.js`** - Shows sample articles from the database for verification

### `/seed` - Sample Data

Scripts for generating test and sample data.

- **`add-sample-data.js`** - Adds minimal sample analytics data for testing
- **`generate-sample-analytics.js`** - Generates comprehensive sample analytics data

## SQL Migration Files

The root of the scripts directory contains SQL migration files:

- `01-create-tables.sql` - Initial table creation
- `02-seed-data.sql` - Seed data for categories and initial content
- `03-analytics-tables.sql` - Analytics and tracking tables
- `04-performance-indexes.sql` - Database performance indexes
- `05-seo-tags-system.sql` - SEO and tagging system tables

## Usage Examples

### Database Setup

```bash
# Initial database setup
node scripts/db/setup-db.js

# Run a specific migration
node scripts/db/run-migration.js

# Setup analytics tables
node scripts/db/setup-analytics.js

# Create performance indexes
node scripts/db/create-indexes.js
```

### Development Tools

```bash
# Check what tables exist
node scripts/dev/check-tables.js

# Verify articles in database
node scripts/dev/check-articles.js
```

### Sample Data Generation

```bash
# Add basic sample data
node scripts/seed/add-sample-data.js

# Generate comprehensive analytics data
node scripts/seed/generate-sample-analytics.js
```

## Prerequisites

All scripts require:

- Node.js installed
- `.env.local` file with `DATABASE_URL` configured
- Dependencies installed via `npm install`

## Environment Variables

Ensure your `.env.local` file contains:

```
DATABASE_URL=postgresql://username:password@host/database
```
