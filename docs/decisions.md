# 决策记录

已与站长确认的决策。新决策追加在对应小节，写明日期和原因；推翻旧决策时保留原文并注明。

## 身份与站点划分

- **只用 “Neko” 一个名字。** 设计师是一个身份，写作/生活是另一个身份。
- **两个站点，主次分明，互相链接：**
  - `neko.icu` — 个人站：首页、写作 `/writing`、关于 `/about`、近况 `/now`、RSS `/rss.xml`。
  - `work.neko.icu` — 设计师身份：作品案例、履历、联系。
  - 共享设计 token，版式各自不同：site 文学、单栏；work 专业、网格化。
- **旧博客 `blog.neko.icu` 全部 301 到 `neko.icu`**，旧文章链接必须一一可达。

## 技术

- **Astro，不用第三方主题，UI 自己写。** 原先 fork 的 `astro-theme-typography` 已整体移除。
- **样式用手写 CSS + CSS 变量 token**，去掉 UnoCSS：两站共享 token 更直接，也不需要学工具类语法。
- **页面过渡用 Astro 自带的 View Transitions**（`ClientRouter`），去掉 swup。
- **保留** remark-math + rehype-katex、Shiki、RSS、sitemap。
- **同一仓库、pnpm workspace monorepo**（`apps/site`、`apps/work`、`packages/design`）。仓库计划由 `blog` 改名为 `neko.icu`。

## 内容模型

- `apps/site` 的 collection：`writing`（文章）、`pages`（关于、近况等独立页）。
- 文章 frontmatter 有 `slug`（URL 固定，不随文件路径变）和 `unlisted`（不进列表/RSS/sitemap，但链接可访问）。
- 迁移时 slug 沿用旧 id 的最后一段（如 `/posts/2015/传承/传承` → `/writing/传承/`）。
- 主题自带的示例文章（故乡、羅生門、容忍与自由、The Unbearable Lightness of Being、两篇 Example）不是 Neko 的文章，不迁移；旧链接跳到 `/writing/`。
- 2026-09-25：旧文章全部公开，不设 `unlisted`。

## 部署

- **Cloudflare Workers 静态资源模式**，不用 Pages，不再用 Netlify / Vercel。DNS 已在 Cloudflare。
- 每个 app 一个 Worker（`neko-site`、`neko-work`），各自一个 `wrangler.jsonc`，用 Custom Domain 挂域名，Workers Builds 连 GitHub。
- **旧链接跳转分两层**（2026-09-25，替代原先“全部用 Redirect Rules”的方案，更简单）：
  - zone 级 Redirect Rule 只把 `blog.neko.icu/*` 保留路径跳到 `neko.icu`，blog 不挂 Worker；
  - 逐篇映射由 `apps/site/legacy-redirects.json` 在构建时生成 `_redirects`，由 site Worker 处理。
- **迁移不断站：** 分支改造 → 建 Worker 用预览地址验证 → Netlify 移除自定义域名 → Cloudflare 挂域名与跳转 → 确认后删除 Netlify 站点。
- 2026-09-25：`work.neko.icu` 与旧博客迁移互不依赖，可以先上线。

## work 站

- 2026-09-25：暂无作品。没有非 draft 作品时自动进入占位模式：首页只有简介、邮箱和 neko.icu 链接，隐藏导航，全站 noindex；加入第一个作品后自动恢复。
- 案例结构固定：背景 → 问题 → 角色 → 过程 → 结果 → 反思。

## 联系方式

- 2026-09-25：公开邮箱为 `neko@neko.icu`（Cloudflare Email Routing 转发），定义在 `packages/design/src/sites.ts`。
  用这个地址而不是 `hi@`：与“只用 Neko 一个名字”一致。垃圾邮件多了再加一个可停用的别名或 Turnstile 联系表单。

## 协作

- 2026-09-25：提交、PR 与分支名不出现 agent 署名；提交者为 `Neko`；提交信息与 PR 用英文。
- 2026-09-25：`AGENTS.md` 只放长期规则；决策、进度、设计规范分别放 `docs/` 下。
