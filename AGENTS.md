# AGENTS.md

Neko 的个人网站。pnpm workspace monorepo，Astro 构建，部署在 Cloudflare Workers（静态资源模式）。

本文件只放长期有效的规则。其他内容看：

- `docs/decisions.md` — 已定决策及原因。已定的事不必重新讨论。
- `docs/roadmap.md` — 进度、待办、各平台现状。完成一项就更新一次。
- `docs/design.md` — 视觉与排版规范，和 `packages/design/src/tokens.css` 对应。
- `docs/deploy.md` — 部署、域名、跳转、邮箱的操作步骤。

## 结构

```
apps/site/        → neko.icu        写作、关于、近况、RSS
apps/work/        → work.neko.icu   设计作品、履历、联系
packages/design/  共享 tokens、基础样式、BaseLayout、Seo、站点常量（sites.ts）
```

## 命令

```sh
pnpm install
pnpm dev:site | pnpm dev:work
pnpm build                          # 两个 app，含 astro check
pnpm lint | pnpm lint:fix
pnpm --filter @neko/site preview    # wrangler dev，本地模拟 Workers（含 _redirects）
```

提交前必须 `pnpm build` 与 `pnpm lint` 都通过；CI（`.github/workflows/ci.yml`）在每个 PR 上跑同样的检查，红了不合并。

依赖由 dependabot 每月更新：小版本与补丁合成一个 PR，大版本单独提。合并前 CI 必须通过；大版本还要看一下更新说明。

## 规则

- **URL 不能坏**：文章 URL 只由 frontmatter 的 `slug` 决定，发布后不改。确实要改时，在
  `apps/site/legacy-redirects.json` 加旧路径到新路径的映射。
- 文章 frontmatter：`title`、`slug`、`pubDate` 必填；`unlisted: true` 不进列表/RSS/sitemap 但可访问；
  `draft: true` 只在 dev 可见。时间不带时区，按 UTC 解析和显示。
- 作品案例从 `apps/work/src/content/projects/_template.md` 复制；没有非 draft 作品时 work 站为占位模式。
- 样式只用 `tokens.css` 里的 CSS 变量和手写 CSS；不引入 UnoCSS/Tailwind、第三方主题或 swup。
- 共享的东西（颜色、字体、站点地址、邮箱）放 `packages/design`，不要在两个 app 里各写一份。
- 视觉方向由站长主导；未定稿前只做克制的占位，不自行定调。
- 部署只用 Cloudflare Workers。根目录的 `netlify.toml`、`vercel.json` 只是为了停掉旧平台的构建，不要往里加配置。
- Netlify 上除 `blogneko` 以外的站点（apk、preview 等）与本仓库无关，**不要动**。
- 删除站点/项目、改 DNS、改域名这类操作，先问站长。

## 协作约定

- 提交、PR、分支名、代码注释中**不加任何 agent 署名或痕迹**（不写 `Co-Authored-By`、会话链接、"Generated with …"）。
- 提交作者与提交者统一为 `Neko <conan.neko.lin@gmail.com>`。
- 提交信息用英文，Conventional Commits；PR 标题与描述用英文。
- 文档与代码注释用中文。
