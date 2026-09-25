import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://work.neko.icu',
  trailingSlash: 'ignore',
  prefetch: true,
  integrations: [sitemap()],
})
