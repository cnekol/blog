import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export type Writing = CollectionEntry<'writing'>

/** 所有可访问的文章（含 unlisted），新到旧。 */
export async function getAllWriting(): Promise<Writing[]> {
  const entries = await getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft)
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

/** 进入列表 / RSS 的文章。 */
export async function getListedWriting(): Promise<Writing[]> {
  return (await getAllWriting()).filter(entry => !entry.data.unlisted)
}

export function writingUrl(entry: Writing): string {
  return `/writing/${entry.id}/`
}

// frontmatter 里的时间不带时区，按 UTC 解析，所以也按 UTC 显示，保证日期与原文一致
const dateFormat = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

export function formatDate(date: Date): string {
  return dateFormat.format(date)
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
