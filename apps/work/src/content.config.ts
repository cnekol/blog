import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

/**
 * 作品案例。正文按固定结构书写：
 * 背景 → 问题 → 角色 → 过程 → 结果 → 反思（各为一个二级标题）。
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string(),
      year: z.number().int(),
      role: z.string(),
      client: z.string().optional(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      /** 列表排序，越小越靠前 */
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
})

export const collections = { projects }
