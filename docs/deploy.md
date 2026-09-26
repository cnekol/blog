# 部署：Cloudflare Workers（静态资源模式）

两个 app 各是一个只含静态资源的 Worker，由 Workers Builds 连接 GitHub 自动构建。

## 1. 创建 Worker（每个 app 一次）

Cloudflare 控制台 → Workers & Pages → Create → Import a repository → 选择本仓库。

| 设置 | neko.icu | work.neko.icu |
| --- | --- | --- |
| Worker 名称（须与 `wrangler.jsonc` 的 `name` 一致） | `neko-site` | `neko-work` |
| Root directory | `apps/site` | `apps/work` |
| Build command | `pnpm install --frozen-lockfile && pnpm build` | 同左 |
| Preview command | `npx wrangler preview`（默认值） | 同左 |
| Deploy command | `npx wrangler deploy` | 同左 |
| Build watch paths（include） | `apps/site/*`, `packages/design/*`, `pnpm-lock.yaml` | `apps/work/*`, `packages/design/*`, `pnpm-lock.yaml` |
| 构建变量 | `NODE_VERSION=24`、`PNPM_VERSION=12.6.0`、`SKIP_DEPENDENCY_INSTALL=1` | 同左 |

API token（构建令牌）：两个 Worker 共用一个 `Workers Builds · cnekol/neko.icu · 2026-09`。
Workers Builds 目前只支持个人账号下的 token，无法限定到单个 Worker，分开建不增加隔离。

- 下拉框里列的是 Workers Builds 的“构建令牌登记”（UUID + 名字 + 指向的 API token），不是 My Profile 里的全部 token。
  新 token 必须在 Settings → Build → API token 里用 **Create new token** 生成；在 My Profile 手动建的不会出现，改名也不会同步。
- 名字不唯一。在 My Profile 删除或 Roll 了对应的 API token 后，登记仍以原名留在下拉框里，选中后构建报
  `The build token selected for this build has been deleted or rolled`。所以新建时名字带上日期，避免与失效登记同名。
- 生产构建与预览构建各有一个 API token 设置，换 token 时两处都要改；Deploy Hook 只走生产，成功不代表预览也正常。
- 调整权限只用 **Edit**，不要 **Roll**；Roll 会换掉 token 值，两个 Worker 的构建都会失败。
- 需要换 token 时：在一个 Worker 里 Create new token（新名字）→ 另一个 Worker 改选它（生产、预览两处都改）→ 两边各触发一次构建确认 → 再删旧 token。
- 可选加固：去掉 Workers KV Storage 与 Workers R2 Storage（两站用不到；构建会运行第三方依赖，token 泄露时不波及账户里其他数据），
  Workers Routes 只给 `neko.icu`。改完触发一次构建确认。

断开再重连 Git 后，旧构建不能 Retry。手动触发构建用 Settings → Build → Deploy Hooks 建一个指向 `main` 的 hook，
`curl -X POST "<hook URL>"`；URL 本身就是凭证，不要公开或提交进仓库，用完可删。

`SKIP_DEPENDENCY_INSTALL=1`：Root directory 下没有锁文件，自动安装可能误用 npm 而无法解析 `workspace:*`，所以关掉自动安装，改由 build command 里的 `pnpm install` 按仓库根目录的 `pnpm-lock.yaml` 安装整个 workspace。

创建后到 Settings → Build → Branch control：生产分支选 `main`，勾选 **Enable Preview Builds**。
之后非 `main` 分支的推送会跑 Preview command，生成预览地址（`*.workers.dev`），PR 里也会有预览链接；切换域名前先在预览地址上验证。
Worker Previews 要求 `wrangler.jsonc` 有 `previews` 块；预览不继承生产环境的变量与绑定，两站是纯静态资源，所以留空（`"previews": {}`）。

## 2. 挂域名

`wrangler.jsonc` 里的 `routes` 已写 `custom_domain: true`，部署后 Cloudflare 会自动建 DNS 记录并签证书。
挂域名前需先在 Netlify 移除 `neko.icu` / `blog.neko.icu` 的自定义域名，并删掉 DNS 里指向 Netlify 的旧记录
（Custom Domain 不能覆盖已有的同名 CNAME/A 记录）。

> 现状：`apps/site/wrangler.jsonc` 的 `routes` 暂时注释掉了（旧记录还在，挂域名会冲突导致部署失败），
> `neko-site` 目前只部署到 workers.dev。切换时：删掉旧 DNS 记录后，取消注释 `routes` 并合并到 `main`。

### work.neko.icu

`apps/work/wrangler.jsonc` 的 `routes` 为 `work.neko.icu`（`custom_domain: true`）。`neko-work` 首次部署到生产分支时，
Cloudflare 自动在 DNS 里建一条指向该 Worker 的只读代理记录并签发证书，不用手动加 DNS。
前提是 DNS 里没有已存在的 `work` 记录（有的话先删）。它不依赖 Netlify 下线，可以先于 neko.icu 上线。

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

## 4. 邮箱（neko@neko.icu，Cloudflare Email Routing）

- 路由：`neko@neko.icu` → 已验证的私人邮箱；Catch-all 设为 **Drop**，避免被随机地址轰炸。
- DNS：Email Routing 已自动加 MX、SPF（`v=spf1 include:_spf.mx.cloudflare.net ~all`）和 DKIM。
  另加 DMARC：`TXT _dmarc  "v=DMARC1; p=none; rua=mailto:neko@neko.icu"`，确认一切正常后改为 `p=quarantine`。
  根域名只能有一条 `v=spf1` 记录，接入其他发信服务时合并 `include:`。
- 回信：Email Routing 只收不发。要以 `neko@neko.icu` 身份回信，需要一个提供 SMTP 的发信服务
  （Gmail「以其他地址发送邮件」要填 SMTP），并把它的 SPF/DKIM 加到 DNS。
- 公开地址：页面上直接写 `mailto:`；如果垃圾邮件多，再加 Worker + Turnstile 的联系表单，或另开一个可随时停用的别名。

## 5. 下线 Netlify

确认两站与跳转都正常后，删除 Netlify 站点。

## 本地

```sh
pnpm install
pnpm dev:site                      # 或 pnpm dev:work
pnpm build
pnpm --filter @neko/site preview   # wrangler dev，本地模拟 Workers（含 _redirects）
```
