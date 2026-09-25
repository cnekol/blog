import type { APIContext } from 'astro'
import { isPlaceholder } from '~/lib/work'

export async function GET(context: APIContext) {
  // 占位模式下不生成 sitemap，也就不在 robots.txt 里声明
  const sitemap = (await isPlaceholder()) ? '' : `\nSitemap: ${new URL('/sitemap-index.xml', context.site)}\n`
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`)
}
