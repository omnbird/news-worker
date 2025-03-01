import type { MediaStackNews, MediaStackResponse, NewsRecord } from '../types/news';
import { generateHash } from '../utils/hash';
import { generateWordCloud } from '../utils/wordcloud';

export async function fetchNews(env: Env): Promise<MediaStackNews[]> {
    const response = await fetch(
        `http://api.mediastack.com/v1/news?${new URLSearchParams({
            access_key: env.MEDIASTACK_API_KEY,
            languages: 'en',
            keywords: '"your keywords"',
            limit: '100'
        })}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data: MediaStackResponse = await response.json();
    return data.data.filter(news => news.image !== null && news.image !== '');
}

export async function processNewsForStorage(news: MediaStackNews): Promise<NewsRecord> {
    const [titleHash, urlHash] = await Promise.all([
        generateHash(news.title),
        generateHash(news.url)
    ]);

    return {
        ...news,
        title_hash: titleHash,
        url_hash: urlHash
    };
}

export async function storeNews(db: D1Database, news: NewsRecord): Promise<void> {
    const stmt = db.prepare(`
        INSERT INTO news (
            title, title_hash, description, url, url_hash,
            source, image, published_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT (title_hash) DO NOTHING
    `);

    await stmt.bind(
        news.title,
        news.title_hash,
        news.description,
        news.url,
        news.url_hash,
        news.source,
        news.image,
        news.published_at
    ).run();
}

export async function processAndStoreWordCloud(news: MediaStackNews[], env: Env) {
    // 收集所有非空的描述文本
    const descriptions = news
        .map(item => item.description)
        .filter((desc): desc is string => !!desc);

    // 生成词云数据
    const wordCloud = generateWordCloud(descriptions);

    // 使用固定的 key
    const data = {
        updated_at: new Date().toISOString(),
        total_articles: news.length,
        words: wordCloud
    };

    // 存储到 KV，使用固定的 key
    await env.NEWS_WORDCLOUD.put('latest_word_cloud', JSON.stringify(data));

    return data;
} 