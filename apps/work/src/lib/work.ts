import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export type Project = CollectionEntry<'projects'>

export const siteName = 'Neko · 设计'

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft)
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year)
}

/** 还没有公开的作品时，整站以占位页形式出现（不进搜索索引）。 */
export async function isPlaceholder(): Promise<boolean> {
  return (await getProjects()).length === 0
}
