-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(500) NOT NULL,
  title_ar VARCHAR(500) NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_ar TEXT,
  image_url VARCHAR(500),
  category_id INTEGER REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value_en TEXT,
  value_ar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
