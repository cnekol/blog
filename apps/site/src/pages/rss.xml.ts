import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import { siteDescription, siteName } from '~/lib/site'
import { getListedWriting, writingUrl } from '~/lib/writing'

export async function GET(context: APIContext) {
  const entries = await getListedWriting()
  return rss({
    title: siteName,
    description: siteDescription,
    site: context.site!,
    items: entries.map(entry => ({
      title: entry.data.title,
      link: writingUrl(entry),
      pubDate: entry.data.pubDate,
      description: entry.data.description,
    })),
    customData: '<language>zh-CN</language>',
  })
}
