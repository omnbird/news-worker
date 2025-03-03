# Trump & Musk News Worker

A Cloudflare Worker that automatically fetches and aggregates news about your keywords. Uses D1 database for news storage and generates word clouds stored in KV.

## Features

- 🔄 Scheduled news fetching (3 times daily)
- 📊 Automatic word cloud generation
- 🗃️ D1 database for news storage
- ⚡ Built on Cloudflare Workers
- 🔍 Deduplication and smart filtering

## Tech Stack

- Cloudflare Workers
- D1 Database (SQLite)
- KV Storage
- Hono (Web Framework)
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Wrangler CLI
- [MediaStack API Key](https://mediastack.com/)
- Cloudflare Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/omnbird/news-worker.git
cd news-worker
```

2. Install dependencies:
```bash
pnpm install
```

3. Create Cloudflare resources:
```bash
# Create D1 database
pnpm wrangler d1 create news

# Create KV namespace
pnpm wrangler kv:namespace create "NEWS_WORDCLOUD"
```

4. Set up configuration files:
```bash
# Copy configuration templates
cp wrangler.example.toml wrangler.toml
cp .dev.vars.example .dev.vars
```

5. Update configurations:
   - Fill in your database ID and KV ID in `wrangler.toml`
   - Add your MEDIASTACK_API_KEY to `.dev.vars`

6. Initialize database:
```bash
pnpm wrangler d1 execute news --file=./schema.sql
```

### Development

```bash
# Start development server
pnpm dev

```

### Deployment

1. Deploy the Worker:
```bash
pnpm cf-deploy
```

2. Set environment variables:
   - Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to Workers & Pages
   - Select your Worker
   - Navigate to "Settings" > "Variables"
   - Add environment variable:
     - `MEDIASTACK_API_KEY`: Your MediaStack API key

   Or using CLI:
   ```bash
   pnpm wrangler secret put MEDIASTACK_API_KEY
   # Then enter your API key
   ```

Note: Variables in `.dev.vars` are for local development only and need to be manually set in production.

### Scheduled Tasks

The Worker is configured with three automatic scheduled tasks:
- 9:00 AM ET
- 2:00 PM ET
- 8:00 PM ET

These schedules are configured in `wrangler.toml` and will be active after deployment.

## API Endpoints

- `GET /` - Health check
- `POST /fetch-news` - Manually trigger news fetching
- `GET /wordcloud` - Get latest word cloud data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MEDIASTACK_API_KEY | MediaStack API key | Yes |


## License

[MIT](LICENSE)

## Contact

omluna - [@omluna](https://twitter.com/omluna)

Project Link: [https://github.com/omnbird/news-worker](https://github.com/omnbird/news-worker)







