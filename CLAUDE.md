# Neko 个人网站 — 重构计划与已定决策

本仓库正从 fork 的 `astro-theme-typography` 博客主题，重构为 Neko 的个人网站。
以下决策已与站长确认，新会话请直接按此执行，不必重新讨论。

## 已定决策

- **身份**：只使用 “Neko” 一个名字。设计师是其中一个身份，生活/写作是另一个身份。
- **站点划分**：
  - `neko.icu` — 个人站：首页、写作（`/writing`）、关于（`/about`）、RSS（`/rss.xml`）
  - `work.neko.icu` — 设计师身份：作品案例、履历、联系方式
  - `blog.neko.icu/*` — 旧博客，301 跳转到 `neko.icu`（`/posts/*` → `/writing/*`，`/atom.xml` → `/rss.xml`）
  - 两站互相链接但主次分明；共享设计 token，版式各自不同（work 专业/网格化，site 文学/单栏）。
- **技术栈**：Astro（不用第三方主题，UI 全部自己写）；样式用手写 CSS（CSS 变量 token），去掉 UnoCSS；页面过渡用 Astro 自带 View Transitions，去掉 swup；保留 remark-math + rehype-katex、Shiki、RSS、sitemap。
- **仓库结构**：同一仓库、pnpm workspace monorepo：
  ```
  apps/site/        → neko.icu
  apps/work/        → work.neko.icu
  packages/design/  共享：tokens.css、字体、基础布局、SEO 组件
  ```
  仓库计划由 `blog` 改名为 `neko.icu`（站长在 GitHub 操作）。
- **内容模型**（apps/site）：collection `writing`（迁移自 `src/content/posts`），`pages`（about、now 等）；
  frontmatter 增加 `slug`（URL 固定，不依赖文件路径）和 `unlisted`（不进列表/RSS/sitemap，但链接可访问）。
  旧文章 URL 为 `/posts/<id>`（id 源自文件路径，如 `2025/镜子前/镜子前`），迁移时必须保证可一一跳转。
- **部署**：Cloudflare **Workers 静态资源模式**（不用 Pages；不再用 Netlify/Vercel）。
  - DNS 已在 Cloudflare。
  - 每个 app 一个 `wrangler.jsonc`（`assets.directory: ./dist`，`custom_domain: true`）；Workers Builds 连 GitHub，
    root directory 分别为 `apps/site`、`apps/work`，watch paths 包含 `packages/design/*`。
  - `blog.neko.icu` 的跳转用 Cloudflare Redirect Rules（zone 级），不挂 Worker；DNS 记录保持 proxied。
  - 可选：Web Analytics、Email Routing（如 `hi@neko.icu`）、R2 放作品大图/视频、联系表单用 Worker + Turnstile。
- **迁移顺序（不断站）**：分支上完成改造 → Cloudflare 建两个 Worker 用预览地址验证 → Netlify 移除自定义域名、
  Cloudflare 挂域名与跳转规则 → 确认后删除 Netlify 站点。

## 待办（按顺序）

1. 改造为 pnpm workspace，删除旧主题遗留（`scripts/update-theme.ts`、`theme:*` 脚本、主题 CHANGELOG/README、UnoCSS、swup、`.vercel` 相关）。
2. `apps/site`：迁移全部文章与图片，加 `slug`/`unlisted`，中文排版基础样式（行宽约 35–45 字、`text-autospace` 等）。
3. `apps/work`：最小骨架（作品列表、案例详情模板：背景→问题→角色→过程→结果→反思；关于/联系）。
4. `packages/design`：tokens、Base 布局、SEO 组件。
5. 两个 `wrangler.jsonc`；文档化 Redirect Rules 配置。

## 待站长决定 / 操作

- 视觉调性三个关键词（倾向：文学、东方、克制）——视觉设计由站长主导，代码先做简洁占位。
- 旧文章逐篇确认哪些设为 `unlisted`（部分含私人情绪/政治文本摘录）。
- GitHub 仓库改名；Cloudflare 建 Worker、挂域名、配置 Redirect Rules；下线 Netlify。
- 如需让 Claude 查看 Cloudflare 现状：在环境设置中添加只读的 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID`。
