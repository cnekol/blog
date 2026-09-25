# 部署：Cloudflare Workers（静态资源模式）

两个 app 各是一个只含静态资源的 Worker，由 Workers Builds 连接 GitHub 自动构建。

## 1. 创建 Worker（每个 app 一次）

Cloudflare 控制台 → Workers & Pages → Create → Import a repository → 选择本仓库。

| 设置 | neko.icu | work.neko.icu |
| --- | --- | --- |
| Worker 名称（须与 `wrangler.jsonc` 的 `name` 一致） | `neko-site` | `neko-work` |
| Root directory | `apps/site` | `apps/work` |
| Build command | `pnpm install --frozen-lockfile && pnpm build` | 同左 |
| Deploy command | `npx wrangler deploy` | 同左 |
| Build watch paths（include） | `apps/site/*`, `packages/design/*`, `pnpm-lock.yaml` | `apps/work/*`, `packages/design/*`, `pnpm-lock.yaml` |
| 构建环境变量 | `NODE_VERSION=22` | 同左 |

非生产分支的构建会生成预览地址（`*.workers.dev`），切换域名前先在预览地址上验证。

## 2. 挂域名

`wrangler.jsonc` 里的 `routes` 已写 `custom_domain: true`，部署后 Cloudflare 会自动建 DNS 记录并签证书。
挂域名前需先在 Netlify 移除 `neko.icu` / `blog.neko.icu` 的自定义域名，并删掉 DNS 里指向 Netlify 的旧记录
（Custom Domain 不能覆盖已有的同名 CNAME/A 记录）。

> 注意：在旧记录删掉之前，生产分支的首次部署会因域名冲突失败；可以先在 `wrangler.jsonc` 注释掉 `routes`
> 只用 workers.dev 地址验证，切换时再恢复。

## 3. 旧博客跳转（blog.neko.icu）

分两层：

1. **Zone 级 Redirect Rule**（只负责换域名，保留路径）：
   控制台 → neko.icu → Rules → Redirect Rules → Create rule（Single Redirect）
   - 条件（Custom filter expression）：`http.host eq "blog.neko.icu"`
   - URL redirect → Dynamic：
     - Expression：`concat("https://neko.icu", http.request.uri.path)`
     - Status code：`301`
     - Preserve query string：勾选
   - DNS 里保留 `blog` 记录并开启代理（橙色云），例如 `AAAA blog 100::`（proxied）。不需要挂 Worker。
2. **逐篇映射**：`apps/site/legacy-redirects.json` 在构建时生成 `dist/_redirects`，
   由 neko.icu 的 Worker 处理 `/posts/<旧 id>` → `/writing/<slug>/`、`/atom.xml` → `/rss.xml`、
   `/archive`、`/categories/*`、分页 `/2`…`/6` → `/writing/`。
   主题自带的示例文章（故乡、羅生門等）未迁移，旧链接跳到 `/writing/`。
   新增或修改映射只改这个 JSON。

验证：

```sh
curl -sI https://blog.neko.icu/posts/2015/传承/传承/   # 301 → https://neko.icu/posts/2015/传承/传承/
curl -sI https://neko.icu/posts/2015/传承/传承/        # 301 → /writing/传承/
curl -sIL https://blog.neko.icu/atom.xml               # 最终到 https://neko.icu/rss.xml
```

## 4. 下线 Netlify

确认两站与跳转都正常后，删除 Netlify 站点。

## 本地

```sh
pnpm install
pnpm dev:site                      # 或 pnpm dev:work
pnpm build
pnpm --filter @neko/site preview   # wrangler dev，本地模拟 Workers（含 _redirects）
```
