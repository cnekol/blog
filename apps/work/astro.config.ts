import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

// 与 src/lib/work.ts 的 isPlaceholder 保持一致：没有非 draft 作品时全站 noindex，sitemap 也不收录页面。
const projectsDir = './src/content/projects'
const hasPublishedProjects = readdirSync(projectsDir).some(file =>
  /^[^_].*\.mdx?$/.test(file)
  && !/^draft:\s*true\s*$/m.test(readFileSync(join(projectsDir, file), 'utf8')),
)

export default defineConfig({
  site: 'https://work.neko.icu',
  trailingSlash: 'ignore',
  prefetch: true,
  integrations: [sitemap({ filter: () => hasPublishedProjects })],
})
