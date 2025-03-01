DROP TABLE IF EXISTS news;
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    title TEXT NOT NULL,
    title_hash TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    url_hash TEXT NOT NULL,
    source TEXT,
    image TEXT,
    category TEXT,
    language TEXT,
    country TEXT,
    published_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title_hash, url_hash)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_news_title_hash ON news(title_hash);
CREATE INDEX IF NOT EXISTS idx_news_url_hash ON news(url_hash);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at); 