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
- 2026-09-25：加入 CI（lint + build）；升级到 Node 24、pnpm 12、Astro 7 等最新依赖，版本统一放在 pnpm catalog；dependabot 改为根目录扫描、小版本合并提交。
- 2026-09-25：`main` 启用规则集（必须走 PR、CI「Lint and build」通过才能合并、禁止强推与删除）；合并后自动删除分支。
- 2026-09-26：Cloudflare 建好 `neko-work`、`neko-site` 两个 Worker（Workers Builds 连 GitHub，开启 Preview Builds，共用一个构建 token）；`neko-work` 挂 work.neko.icu，`neko-site` 切换前只部署到 workers.dev。

## 待办

按顺序：

1. 在 `https://neko-site.n3ko.workers.dev` 检查文章与旧链接跳转；确认 work.neko.icu 占位页正常。
   已知问题：`neko-work` 的预览构建（非 `main` 分支）在 2026-09-26 连续失败（`861a7f1` 等），生产部署正常；
   原因未查明，需要控制台里的构建日志。可先对 `neko-work` 断开再重连 Git（设置照 `docs/deploy.md` 填回）。
2. 切换：Netlify `blogneko` 移除 `blog.neko.icu`，删旧 DNS 记录 → 取消注释 `apps/site/wrangler.jsonc` 的 `routes`，让 `neko-site` 挂 `neko.icu` → 加 `blog` 的代理记录和 Redirect Rule → 按 `docs/deploy.md` 验证。
3. 邮箱：加 DMARC（先 `p=none`），Email Routing 的 catch-all 设为 Drop；需要回信时另配发信服务。
4. 确认无误后删除 Netlify `blogneko`、Vercel `blog`，并删掉根目录的 `netlify.toml`、`vercel.json`。

## 待站长

- 视觉调性（倾向：文学、东方、克制），定稿后更新 `docs/design.md` 与 `tokens.css`。
- `apps/site/src/content/pages/` 的 `about.md`、`now.md` 正文。
- work 的真实案例与履历（`apps/work/src/pages/about.astro` 的 `experience`）。

## 各平台现状（2026-09-26，经连接器只读查看）

- **Cloudflare**：已有 `neko-site`、`neko-work` 两个 Worker（2026-09-26）。连接器不能建 Worker、读写构建设置与日志、改 DNS 或配 Redirect Rules；需在控制台操作，或给环境加 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 后用 wrangler。云端开发环境的网络目前访问不到 `api.cloudflare.com`、`*.workers.dev` 与 `work.neko.icu`，线上效果需站长在浏览器确认。
- **Netlify**：`blogneko` 服务 `blog.neko.icu`，待下线。`pelorus-apk`（apk.neko.icu）、`home-preview`（preview.neko.icu）、`n3ko`、`lucent-vacherin-42f756` 与本仓库无关，不要动。
- **Vercel**：`blog` 项目为本仓库旧部署，已关闭 Git 部署，待删除。
