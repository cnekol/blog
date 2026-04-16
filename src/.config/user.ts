import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  site: {
    title: '随笔',
    subtitle: 'Neko',
    author: 'Neko',
    description: '八百里分麾下炙',
    website: 'https://blog.neko.icu/',
    socialLinks: [],
    categoryMap: [{ name: 'Neko', path: 'neko' }],
  },
  seo: {
    twitter: '@cnekol',
  },
}
