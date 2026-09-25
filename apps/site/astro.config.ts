import { readFileSync } from 'node:fs'
import { unified } from '@astrojs/markdown-remark'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { legacyRedirects } from './integrations/legacy-redirects'
import { unlistedPaths } from './integrations/unlisted'

const site = 'https://neko.icu'
const unlisted = unlistedPaths('./src/content/writing')

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  prefetch: true,
  markdown: {
    // Astro 7 默认用 Sätteri；数学公式依赖 remark/rehype 插件，所以显式用 unified 处理器
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  integrations: [
    sitemap({
      filter: page => !unlisted.has(decodeURI(new URL(page).pathname)),
    }),
    legacyRedirects(JSON.parse(readFileSync('./legacy-redirects.json', 'utf8'))),
  ],
})
