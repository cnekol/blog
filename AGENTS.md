# Neko 个人网站 — 重构计划与已定决策

本仓库正从 fork 的 `astro-theme-typography` 博客主题，重构为 Neko 的个人网站。
以下决策已与站长确认，新会话请直接按此执行，不必重新讨论。

## 协作约定

- 提交、PR 标题与描述、代码注释中**不加任何 agent 署名**（不写 `Co-Authored-By`、会话链接、"Generated with …"）。
  提交作者与提交者统一为 `cnekol <conan.neko.lin@gmail.com>`。
- PR 标题与描述用英文；提交信息用英文（Conventional Commits）。

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
  - 可选：Web Analytics、Email Routing（已有 `neko@neko.icu`）、R2 放作品大图/视频、联系表单用 Worker + Turnstile。
- **迁移顺序（不断站）**：分支上完成改造 → Cloudflare 建两个 Worker 用预览地址验证 → Netlify 移除自定义域名、
  Cloudflare 挂域名与跳转规则 → 确认后删除 Netlify 站点。

## 已定（2026-09-25 补充）

- 旧文章全部公开，不设 `unlisted`。
- 公开联系邮箱：`neko@neko.icu`（Cloudflare Email Routing），定义在 `packages/design/src/sites.ts`。
- work 暂无内容：没有公开作品时自动进入占位模式（首页只有简介、邮箱和 neko.icu 链接，隐藏导航，全站 noindex）；加入第一个非 draft 作品后自动恢复。
- `work.neko.icu` 由 `neko-work` Worker 的 Custom Domain 接管（`apps/work/wrangler.jsonc`），与旧博客迁移互不依赖，可先上线。

## 实施记录（已完成）

代码改造（原待办 1–5）已在分支 `claude/awesome-albattani-4wkrf1` 完成，`pnpm build` 与 `pnpm lint` 通过：

- 根目录为 pnpm workspace；旧主题、UnoCSS、swup、`.vercel`、主题脚本与示例文章已删除。
- `apps/site`：24 篇文章迁到 `src/content/writing/`（目录结构保留，URL 只看 `slug`）；
  slug 沿用旧 id 的最后一段（如 `/posts/2015/传承/传承` → `/writing/传承/`）。
  `pages` collection 有 `about`、`now`（内容待站长补）。
- 主题自带的示例文章（故乡、羅生門、容忍与自由、The Unbearable Lightness of Being、两篇 Example）不是 Neko 的文章，未迁移，旧链接跳到 `/writing/`。
- 旧链接跳转分两层（与原计划不同，更简单）：zone 级 Redirect Rule 只把 `blog.neko.icu/*` 保留路径跳到 `neko.icu`；
  逐篇映射由 `apps/site/legacy-redirects.json` 在构建时生成 `dist/_redirects`，由 site Worker 处理。已用 `wrangler dev` 验证中文路径。
- `apps/work`：作品列表、案例模板（`_template.md`，背景→问题→角色→过程→结果→反思）、履历/联系页；目前无作品，处于占位模式。
- `packages/design`：`tokens.css`、`base.css`、`BaseLayout.astro`（含 View Transitions）、`Seo.astro`、`sites.ts`。
- 部署与 Redirect Rules 操作步骤见 `docs/deploy.md`。

## 现状（2026-09-25 通过 Cloudflare / Netlify / Vercel 连接器只读查看）

- Cloudflare：账户下还没有任何 Worker。
- Netlify：站点 `blogneko` 服务 `blog.neko.icu`（待下线）；另有 `pelorus-apk`（apk.neko.icu）、`home-preview`（preview.neko.icu）、
  `n3ko`、`lucent-vacherin-42f756`，与本仓库无关，**不要动**。
- Vercel：还有一个 `blog` 项目（本仓库旧部署），计划不再用 Vercel，确认后可删除。
- 仓库根目录的 `netlify.toml`（ignore）和 `vercel.json`（关闭 Git 部署）是临时文件，让旧平台停止构建本仓库；删除对应站点/项目后一并删除。
- 连接器没有创建/部署 Worker、配置 Redirect Rules 的能力，这些需站长在控制台操作（或给环境加 `CLOUDFLARE_API_TOKEN` 后用 wrangler）。

## 待站长决定 / 操作

- 视觉调性三个关键词（倾向：文学、东方、克制）——视觉设计由站长主导，代码先做简洁占位。
- 补 `about.md`、`now.md` 正文，work 的真实案例与履历（`apps/work/src/pages/about.astro` 的 `experience`）。
- 邮箱：在 `_dmarc` 加 DMARC 记录（先 `p=none`）；Email Routing 的 catch-all 设为 Drop；如需以 `neko@neko.icu` 回信，另配发信服务。
- 合并本分支到 main；GitHub 仓库改名。
- 按 `docs/deploy.md`：Cloudflare 建 `neko-site`、`neko-work` 两个 Worker 并连 GitHub → 预览地址验证 →
  Netlify `blogneko` 移除自定义域名、删旧 DNS 记录 → 挂域名、配 Redirect Rule → 确认后删除 Netlify `blogneko` 与 Vercel `blog` 项目。
