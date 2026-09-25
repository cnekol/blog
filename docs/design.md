# 设计规范

视觉方向由站长主导。当前实现是克制的占位，定稿后更新本文件和 `packages/design/src/tokens.css`，两者保持一致。

## 方向

- 关键词（待定稿）：文学、东方、克制。
- 两站同源不同形：共享颜色、字体、间距 token；site 文学、单栏，work 专业、网格化。
- 支持浅色 / 深色，跟随系统（`prefers-color-scheme`）；尊重 `prefers-reduced-motion`。

## Token（`tokens.css`）

| 类别 | 变量 | 说明 |
| --- | --- | --- |
| 颜色 | `--color-bg` `--color-surface` `--color-text` `--color-muted` `--color-line` `--color-accent` `--color-selection` | 暖白纸色底、墨色文字、朱红强调；深色模式下另有一组 |
| 字体 | `--font-serif` `--font-sans` `--font-mono` | 只用系统字体栈，不加载网络字体 |
| 字号 | `--text-xs` … `--text-3xl` | 比例约 1.2 |
| 行高 | `--leading-tight` `--leading-body` | 标题 1.35，正文 1.85 |
| 间距 | `--space-1` … `--space-24` | 以 0.25rem 为单位 |
| 版心 | `--measure-prose` `--measure-wide` `--gutter` | 正文 40rem，work 72rem |

新增颜色、字号等一律先加 token，再在组件里引用。

## neko.icu（文学、单栏）

- 正文衬线体，字号约 17px，每行约 35–45 个汉字（`--measure-prose`）。
- 中文排版：两端对齐、`text-autospace`（中西文间距）、`text-spacing-trim`、`line-break: strict`、`hanging-punctuation`。
- 分隔线显示为 `* * *`；引用用左侧细线和次要文字色。
- 导航、日期等辅助信息用无衬线小字、次要色，退到正文后面。

## work.neko.icu（专业、网格化）

- 无衬线体，宽版心，作品卡片自适应网格（最小 20rem）、4:3 封面。
- 案例页：标题 → 摘要 → 元信息（年份、角色、客户、领域）→ 封面 → 正文六段。
- 二级标题用小号、字距加宽、强调色，作为段落标签而不是大标题。
