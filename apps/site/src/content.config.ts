import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

// 文章 id 取 frontmatter 的 slug（glob loader 的默认行为），URL 不随文件路径变化。
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      pubDate: z.coerce.date(),
      modDate: z.coerce.date().optional(),
      description: z.string().optional(),
      cover: image().optional(),
      /** 不进列表 / RSS / sitemap，但链接仍可访问 */
      unlisted: z.boolean().default(false),
      /** 草稿：只在 dev 下出现 */
      draft: z.boolean().default(false),
    }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    modDate: z.coerce.date().optional(),
  }),
})

export const collections = { writing, pages }
