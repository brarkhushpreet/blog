# Blog deployment: Cloudflare + Atlas + private GitHub operations

## What is configured

| Application | Cloudflare Worker | Address |
| --- | --- | --- |
| Next.js frontend | `khushpreet-blog-web` | `https://blog.khushpreet.dev` |
| Express API | `khushpreet-blog-api` | `https://blog-api.khushpreet.dev` |

This uses the portfolio's existing `brarkhushpreet/portfolio-ops` private repository and `[self-hosted, linux, x64, portfolio-deploy]` runner. No new VPS or runner is needed. Keep the existing runner online during deployment; the website runs on Cloudflare after deployment and does not depend on your computer staying on.

The public `brarkhushpreet/blog` repository checks the code. The private `Deploy blog` workflow checks out the requested main commit, builds without production credentials, and sends compiled files to the deployment runner. The runner uses Cloudflare credentials only while deploying. It deploys API then frontend and verifies Atlas and article responses. The existing portfolio workflow is unchanged.

## 1. Atlas: create the production database

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/) and select/create a project.
2. Create a **Free / M0** cluster, or reuse an existing suitable cluster. Choose a nearby region and confirm it is the free tier.
3. Open **Security → Database Access → Add New Database User**. This is separate from your Atlas website login.
4. Choose password authentication and a strong unique password. Grant the built-in `readWrite` role for **`blog_db` only** using specific privileges.
5. Under **Security → Network Access → IP Access List**, allow the connections required by the deployment. Workers do not have one dedicated outbound IP in this setup. For this small demo, the broad option is `0.0.0.0/0`; it allows connection attempts from any IP, so retain TLS, strong credentials, and the database-specific role. Configure this yourself; do not apply a guessed small IP range that will randomly block Workers.
6. Open the cluster's **Connect → Drivers → Node.js** panel. Copy its `mongodb+srv://...` URI, replace the username/password placeholders, and put `/blog_db` before the query string. Percent-encode reserved characters in the username/password. Keep the provided Atlas hostname and query parameters.

Do not paste the real URI into chat, source code, screenshots, or command history. If the old tracked `.env` contained a live credential, rotate that credential first; removing a file from the next commit does not remove earlier versions from Git history.

### Seed the ten articles once

On your own machine, privately edit the ignored `apps/api/.env`: set `MONGO_URI` to the Atlas URI and `MONGO_DB_NAME=blog_db`. Then run from the blog project:

```powershell
npm run seed
```

The seed creates the collection/indexes and upserts the ten bundled articles by slug. It also removes the ten explicitly superseded demo slugs from the earlier seed set, so use the intended blog database. Verify the posts in Atlas **Browse Collections → blog_db → posts**, then restore your local development URI in the ignored file. Seeding is deliberately not run on every deployment because it overwrites bundled article content.

## 2. Cloudflare: prepare the API secret

Use the same account and active `khushpreet.dev` zone as the portfolio.

1. In **Workers & Pages → Create application**, choose a starter/Hello World Worker and name it exactly **`khushpreet-blog-api`**. If it already exists, open it instead.
2. Open that Worker's **Settings → Variables and Secrets → Add**.
3. Choose type **Secret**, name **`MONGO_URI`**, and enter the Atlas URI privately. Save/deploy the setting.
4. Do not connect GitHub through Cloudflare Workers Builds; GitHub Actions already manages deployment.

This one-time starter lets you add the required secret before the real code is deployed. The workflow will replace the starter. The frontend Worker is created automatically by its first deployment and needs no database secret.

Do not manually create `blog` or `blog-api` CNAME records. The committed Wrangler `custom_domain` routes provision their DNS and HTTPS certificates. Existing records on those exact hostnames can cause conflicts; do not alter the portfolio's root/www records.

## 3. Cloudflare credentials in the private repository

Open [portfolio-ops Actions secrets](https://github.com/brarkhushpreet/portfolio-ops/settings/secrets/actions). The portfolio may already have these **repository secrets**:

| Secret | How to obtain it |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard search (`Ctrl+K`) → **Copy account ID**, or Workers & Pages → Account Details |
| `CLOUDFLARE_API_TOKEN` | Cloudflare profile → API Tokens → Create Token → **Edit Cloudflare Workers** template |

If the existing token already deploys custom-domain Workers in this account and zone, reuse the stored secret. If you need a new token, scope the template to your Cloudflare account and only the `khushpreet.dev` zone. Retain the template's Workers deployment permissions and ensure it includes Workers Routes editing and Zone read for custom-domain deployment. Paste the token directly into the repository secret, not a repository variable. Never use the Global API Key.

Leave these at repository scope, matching the current portfolio workflow. This blog workflow does not reference a GitHub environment. Do not put Cloudflare credentials or the Atlas URI in the public blog repository.

## 4. GitHub dispatch token in the blog repository

1. Open your personal GitHub **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Choose resource owner **brarkhushpreet** and a suitable expiration date.
3. Under **Repository access**, select **Only select repositories → portfolio-ops**.
4. Under repository permissions, set **Actions → Read and write**. Metadata read access is included automatically. No source-code write permission is needed.
5. Generate the token. Paste it directly into [blog Actions secrets](https://github.com/brarkhushpreet/blog/settings/secrets/actions) using **New repository secret**, name **`OPS_DISPATCH_TOKEN`**.
6. At [blog Actions variables](https://github.com/brarkhushpreet/blog/settings/variables/actions), add **`AUTO_DEPLOY`** with value **`true`** only after the rest of setup is complete. Leave it unset/false until then.

This token permits dispatching workflows in the private operations repository; it does not give the public build a Cloudflare token. GitHub cannot reveal an existing secret value, so create a separate fine-grained token if you no longer have the portfolio dispatch token. Renew it before it expires.

No `BLOG_SITE_URL`, `BLOG_API_URL`, `FRONTEND_URL` or `NEXT_PUBLIC_*` GitHub variables are required. Their public values are committed in the build workflows and Worker configurations. No Atlas secret is needed in GitHub: it lives directly on the API Worker.

## 5. Commit and first deployment

There are changes in two repositories:

1. In `D:/projects/portfolio-ops`, commit and push the new **`.github/workflows/deploy-blog.yml`** to `main` first. Keep this repository private. The existing `deploy.yml` for the portfolio remains unchanged.
2. Check **portfolio-ops → Settings → Actions → Runners**: the existing runner with label **`portfolio-deploy`** must be online. Start the same WSL runner/service used for the portfolio if it is offline. Do not register it in the public blog repository.
3. Review and commit the prepared blog changes in `D:/projects/blog`, including `apps/`, `scripts/`, `docs/` and `.github/`. Push `main` once setup is ready and `AUTO_DEPLOY=true`.
4. Watch **blog → Actions → Blog CI**. Successful checks request the private deployment automatically.
5. Watch **portfolio-ops → Actions → Deploy blog**. Its build runs on GitHub, and its deployment runs on your self-hosted runner.

If the blog commit was pushed before auto-deploy was enabled, do not make a dummy code change: open **portfolio-ops → Actions → Deploy blog → Run workflow**, choose branch `main`, and enter the latest full blog commit SHA (`git rev-parse HEAD` in a checkout matching remote `main`). A manual run of **Blog CI** only checks the build; it does not dispatch deployment.

The first deployment provisions DNS/certificates; allow time for activation. It verifies `database: connected`, database-backed posts, the homepage, and one article. A green fallback article page alone is not proof Atlas is connected. If certificate activation takes longer than the workflow's retry window, check Cloudflare's domain status before retrying the same latest commit.

The two Worker deployments are sequential, not atomic: if the frontend step fails, the API may already have updated. Correct the reported issue and rerun the deployment for the latest `main` commit.

## Final settings map

| Dashboard | Setting | Value/source |
| --- | --- | --- |
| `blog` GitHub repository secrets | `OPS_DISPATCH_TOKEN` | Fine-grained GitHub token restricted to `portfolio-ops`, Actions read/write |
| `blog` GitHub repository variables | `AUTO_DEPLOY` | `true` when ready |
| `portfolio-ops` GitHub repository secrets | `CLOUDFLARE_API_TOKEN` | Existing portfolio token or scoped Workers token |
| `portfolio-ops` GitHub repository secrets | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| Cloudflare `khushpreet-blog-api` Worker secrets | `MONGO_URI` | Atlas Drivers connection string for `blog_db` |

## References

- [Cloudflare GitHub Actions authentication](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Cloudflare Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/)
- [GitHub fine-grained tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub workflow dispatch permissions](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event)
- [Atlas free cluster setup](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
- [Atlas network access](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/)
