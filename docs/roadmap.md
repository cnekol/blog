# 路线图

## 已完成

- 改造为 pnpm workspace；移除旧主题、UnoCSS、swup、主题脚本与示例文章。
- `apps/site`：24 篇文章迁入 `writing`，加 `slug` / `unlisted` / `draft`；首页、写作列表、文章页、关于、近况、RSS、sitemap、404；中文排版基础样式。
- 旧链接映射 `legacy-redirects.json` → `_redirects`，已用 `wrangler dev` 验证中文路径。
- `apps/work`：作品网格、案例模板、履历页、占位模式。
- `packages/design`：tokens、基础样式、BaseLayout（含 View Transitions）、Seo、站点常量。
- 两个 `wrangler.jsonc`；部署文档 `docs/deploy.md`。
- 临时 `netlify.toml` / `vercel.json` 停掉旧平台对本仓库的构建。
- 合并 [cnekol/neko.icu#12](https://github.com/cnekol/neko.icu/pull/12)；关闭旧的 dependabot PR。
- 2026-09-25：GitHub 仓库由 `blog` 改名为 `neko.icu`。

## 待办

按顺序：

1. Cloudflare 建 `neko-work` Worker 并上线 work.neko.icu（占位页）。
2. 建 `neko-site` Worker，用 `*.workers.dev` 预览地址检查文章与旧链接跳转。
3. 切换：Netlify `blogneko` 移除 `blog.neko.icu`，删旧 DNS 记录 → `neko-site` 挂 `neko.icu` → 加 `blog` 的代理记录和 Redirect Rule → 按 `docs/deploy.md` 验证。
4. 邮箱：加 DMARC（先 `p=none`），Email Routing 的 catch-all 设为 Drop；需要回信时另配发信服务。
5. 确认无误后删除 Netlify `blogneko`、Vercel `blog`，并删掉根目录的 `netlify.toml`、`vercel.json`。

## 待站长

- 视觉调性（倾向：文学、东方、克制），定稿后更新 `docs/design.md` 与 `tokens.css`。
- `apps/site/src/content/pages/` 的 `about.md`、`now.md` 正文。
- work 的真实案例与履历（`apps/work/src/pages/about.astro` 的 `experience`）。

## 各平台现状（2026-09-25，经连接器只读查看）

- **Cloudflare**：账户下还没有 Worker。连接器不能建 Worker、改 DNS 或配 Redirect Rules；需在控制台操作，或给环境加 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 后用 wrangler。
- **Netlify**：`blogneko` 服务 `blog.neko.icu`，待下线。`pelorus-apk`（apk.neko.icu）、`home-preview`（preview.neko.icu）、`n3ko`、`lucent-vacherin-42f756` 与本仓库无关，不要动。
- **Vercel**：`blog` 项目为本仓库旧部署，已关闭 Git 部署，待删除。
