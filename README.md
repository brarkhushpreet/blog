# Khushpreet — Software Engineering Notes

A personal technical blog covering JavaScript, React, Node.js, real-time systems, Docker, AWS, and cloud infrastructure. The public frontend is built with Next.js and React; a dedicated Express API reads published articles from MongoDB. There are no accounts, paywalls, or public authoring tools.

## Stack

- Next.js 16 and React 19 frontend (`apps/web`)
- Express 5 API (`apps/api`)
- MongoDB with the official Node.js driver
- Markdown article rendering with GitHub-flavored Markdown
- Responsive light and dark themes

## Local development

1. Copy `apps/api/.env.example` to `apps/api/.env` and set `MONGO_URI` if your local database uses a different address.
2. Copy `apps/web/.env.example` to `apps/web/.env.local`.
3. Install dependencies with `npm install`.
4. Seed the ten sample technical articles with `npm run seed`.
5. Start the API in one terminal with `npm run dev:api`.
6. Start the frontend in a second terminal with `npm run dev:web`.
7. Open [http://localhost:3000](http://localhost:3000). The API runs independently on [http://localhost:4000](http://localhost:4000).

The API uses the bundled article set as a read-only fallback if MongoDB is temporarily unavailable, so the site can still render while the database is being restored.

The Node API keeps a normal connection pool. The Cloudflare build opens a request-scoped MongoDB connection because Workers do not allow network sockets created by one request to be reused by another request.

## Commands

```bash
npm run dev:api        # run only the Express API in watch mode
npm run dev:web        # run only the Next.js frontend
npm run dev:api:cloudflare  # run the API in the local Workers runtime
npm run dev:web:cloudflare  # run the frontend with vinext
npm run build:api      # build only the Express API
npm run build:web      # build only the Next.js frontend
npm run build:api:cloudflare  # validate the API Worker bundle
npm run build:web:cloudflare  # build the vinext Worker bundle
npm run start:api      # start only the production API
npm run start:web      # start only the production frontend
npm run preview:web:cloudflare # preview the built frontend Worker
npm run deploy:api:cloudflare  # deploy only the API Worker
npm run deploy:web:cloudflare  # build and deploy only the frontend Worker
npm run typecheck:api  # check only the API
npm run typecheck:web  # check only the frontend
npm run seed           # add or update the ten bundled articles
```

There is intentionally no root command that starts both applications. They are separate processes locally and separate services in production.

The seed upserts the bundled articles by slug. Its one-time content migration removes only the ten superseded demo slugs from the previous bundled set; it does not remove unrelated posts from the database.

## API

- `GET /api/health`
- `GET /api/posts`
- `GET /api/posts/:slug`
- `POST /api/contact`

Article endpoints are public and read-only. Publishing remains an owner-controlled database/content workflow, not a public blogging platform.

## Independent Docker images

Build and run the API image:

```bash
docker build -f apps/api/Dockerfile -t khushpreet-blog-api .
docker run --env-file apps/api/.env -p 4000:4000 khushpreet-blog-api
```

Build and run the frontend image separately. Public Next.js variables must be supplied while building:

```bash
docker build -f apps/web/Dockerfile --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api --build-arg NEXT_PUBLIC_SITE_URL=https://example.com -t khushpreet-blog-web .
docker run --env-file apps/web/.env.local -p 3000:3000 khushpreet-blog-web
```

The frontend runtime needs `API_URL` pointing to the deployed API. The API runtime needs `MONGO_URI` and `FRONTEND_URL`. Deploy the two images as independent services with independent health checks and scaling.

## Cloudflare deployment

The repository also produces two independent Cloudflare Workers:

- `khushpreet-blog-web` from `apps/web`, using vinext for Next.js 16
- `khushpreet-blog-api` from `apps/api`, using Cloudflare's Node.js HTTP adapter for Express 5

The committed custom domains are `blog.khushpreet.dev` and `blog-api.khushpreet.dev`. The root domain remains the portfolio. Cloudflare creates the subdomain DNS records and certificates from the Wrangler configurations; no separate domain purchase is needed. Worker preview URLs are disabled, matching the portfolio.

### Production values

Deployment follows the portfolio's public-source/private-operations setup. Add these values directly in the indicated dashboards:

| Location | Kind | Name | Value |
| --- | --- | --- | --- |
| GitHub `blog` repository | Secret | `OPS_DISPATCH_TOKEN` | Fine-grained GitHub token: only `portfolio-ops`, Actions read/write |
| GitHub `blog` repository | Variable | `AUTO_DEPLOY` | `true`, after initial setup |
| GitHub `portfolio-ops` repository | Secret | `CLOUDFLARE_API_TOKEN` | Existing portfolio deployment token, scoped to this account and zone |
| GitHub `portfolio-ops` repository | Secret | `CLOUDFLARE_ACCOUNT_ID` | Existing portfolio Cloudflare account ID |
| Cloudflare `khushpreet-blog-api` Worker | Secret | `MONGO_URI` | Atlas connection URI for a database user with access to `blog_db` |

The public `.github/workflows/ci-cd.yml` checks and packages both applications. Successful pushes to `main` request `deploy-blog.yml` in the private `portfolio-ops` repository when `AUTO_DEPLOY=true`. That workflow builds the selected source commit on GitHub, passes compiled artifacts to the existing `portfolio-deploy` runner, rejects stale commits, and deploys the API followed by the frontend. It verifies real Atlas connectivity and an article after deployment. The self-hosted runner must be online to deploy; the live Workers keep running when it is offline.

Public URLs, the API's allowed frontend origin, and the database name are already configured in code. `BLOG_SITE_URL`, `BLOG_API_URL`, and a GitHub `production` environment are no longer required. The MongoDB URI stays in Cloudflare; deploys preserve that secret.

### First deployment checklist

Follow [the deployment setup guide](docs/deployment.md) for the exact dashboard paths, token permissions, Atlas seed instructions, and first deployment order. The private deployment workflow has been prepared at `D:/projects/portfolio-ops/.github/workflows/deploy-blog.yml`; commit it in that repository separately.

Do not commit `.env`, `.dev.vars`, Atlas credentials, or Cloudflare API tokens. Wrangler configuration is committed; runtime secrets remain in Cloudflare and GitHub.
