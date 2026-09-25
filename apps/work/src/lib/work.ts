import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export type Project = CollectionEntry<'projects'>

export const siteName = 'Neko · 设计'

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft)
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year)
}
