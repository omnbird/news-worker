import { Hono } from 'hono'
import { fetchNews, processNewsForStorage, storeNews, processAndStoreWordCloud } from './services/news'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>()

// 添加 CORS 中间件
app.use('/*', cors({
  origin: ['http://localhost:8788'], // 允许前端开发服务器的域名
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true
}))

// 处理定时任务的函数
async function handleScheduled(env: Env) {
  console.log('Scheduled task started...')
  try {
    console.log('Fetching news...')
    const news = await fetchNews(env)
    console.log(`Fetched ${news.length} articles`)
    const results = []

    for (const item of news) {
      const processedNews = await processNewsForStorage(item)
      await storeNews(env.DB, processedNews)
      results.push(processedNews)
    }

    // 处理词云
    const wordCloud = await processAndStoreWordCloud(news, env)

    console.log(`Processed and saved ${results.length} articles and updated word cloud`)
    return {
      success: true,
      message: `Processed ${results.length} news items`,
      wordCloud
    }
  } catch (error) {
    console.error('Error while handling scheduled task:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

app.get('/', (c) => {
  return c.text('News Worker Running!')
})

// API 端点
app.post('/fetch-news', async (c) => {
  const result = await handleScheduled(c.env)
  return c.json(result)
})

// 修改获取词云的端点，不再需要日期参数
app.get('/wordcloud', async (c) => {
  const data = await c.env.NEWS_WORDCLOUD.get('latest_word_cloud');

  if (!data) {
    return c.json({ error: 'No word cloud data found' }, 404);
  }

  return c.json(JSON.parse(data));
});

// 处理定时任务
export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    console.log("Scheduled event triggered")
    await ctx.waitUntil(handleScheduled(env))
  },

  // 默认处理 fetch 请求
  fetch: app.fetch,
}
