import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 在配置阶段（拿不到 content collection）读取 frontmatter，
 * 返回 unlisted / draft 文章的路径，用于 sitemap 过滤。
 */
export function unlistedPaths(dir: string): Set<string> {
  const paths = new Set<string>()
  for (const file of readdirSync(dir, { recursive: true, encoding: 'utf8' })) {
    if (!/\.mdx?$/.test(file))
      continue
    const text = readFileSync(join(dir, file), 'utf8')
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
    const slug = frontmatter.match(/^slug:[ \t]*['"]?([^'"\n]+)/m)?.[1]?.trim()
    if (slug && /^(?:unlisted|draft):\s*true\s*$/m.test(frontmatter)) {
      paths.add(`/writing/${slug}`)
      paths.add(`/writing/${slug}/`)
    }
  }
  return paths
}
