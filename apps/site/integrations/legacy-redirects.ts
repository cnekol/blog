import type { AstroIntegration } from 'astro'
import { writeFile } from 'node:fs/promises'

/**
 * 旧博客（blog.neko.icu）的 URL 映射，构建时写入 dist/_redirects，由 Workers 静态资源处理。
 * blog.neko.icu 的 zone 级 Redirect Rule 只负责把整个域名保留路径跳到 neko.icu，
 * 逐篇的 /posts/<旧 id> → /writing/<slug> 在这里完成。
 *
 * 每条规则同时写原文和百分号编码两种形式、带与不带结尾斜杠，保证中文路径都能命中。
 */
const fixed: Record<string, string> = {
  '/atom.xml': '/rss.xml',
  '/archive': '/writing/',
  '/categories': '/writing/',
  '/categories/*': '/writing/',
  '/posts': '/writing/',
  '/2': '/writing/',
  '/3': '/writing/',
  '/4': '/writing/',
  '/5': '/writing/',
  '/6': '/writing/',
}

function variants(path: string): string[] {
  if (path.endsWith('*'))
    return [path]
  const forms = new Set([path, encodeURI(path)])
  return [...forms].flatMap(p => [p, `${p}/`])
}

export function legacyRedirects(map: Record<string, string>): AstroIntegration {
  return {
    name: 'legacy-redirects',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const rules = Object.entries({ ...map, ...fixed }).flatMap(([from, to]) => {
          const target = encodeURI(to.endsWith('/') || to.includes('.') ? to : `${to}/`)
          return variants(from).map(source => `${source} ${target} 301`)
        })
        await writeFile(new URL('_redirects', dir), `${rules.join('\n')}\n`)
        logger.info(`wrote ${rules.length} redirect rules`)
      },
    },
  }
}
