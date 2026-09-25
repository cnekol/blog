# neko.icu

Neko 的个人网站，pnpm workspace monorepo。

```
apps/site/        → neko.icu        写作、关于、近况、RSS
apps/work/        → work.neko.icu   设计作品与履历
packages/design/  共享 tokens、基础布局、SEO 组件
```

## 开发

```sh
pnpm install
pnpm dev:site
pnpm dev:work
pnpm build        # 两个 app 都构建（含 astro check）
pnpm lint
```

## 写作

文章放在 `apps/site/src/content/writing/`，文件位置随意，URL 只由 frontmatter 的 `slug` 决定：

```yaml
---
title: 标题
slug: url-slug        # 必填，发布后不要改
pubDate: 2026-01-01
description: 一句话摘要
unlisted: false       # true：不进列表 / RSS / sitemap，但链接可访问
draft: false          # true：只在本地 dev 可见
---
```

独立页面（关于、近况）放在 `apps/site/src/content/pages/`，文件名即路径。

作品案例放在 `apps/work/src/content/projects/`，从 `_template.md` 复制。

## 文档

- [docs/decisions.md](docs/decisions.md) — 决策记录
- [docs/roadmap.md](docs/roadmap.md) — 进度与待办
- [docs/design.md](docs/design.md) — 设计规范
- [docs/deploy.md](docs/deploy.md) — 部署
