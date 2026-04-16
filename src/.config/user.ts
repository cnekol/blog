import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  site: {
    title: '随笔',
    subtitle: 'Neko',
    author: 'Neko',
    description: '八百里分麾下炙',
    website: 'https://astro-theme-typography.vercel.app/',
    socialLinks: [],
    categoryMap: [{ name: 'Neko', path: 'neko' }],
  },
  appearance: {
    theme: 'system',
    locale: 'zh-cn',
    colorsLight: {
      primary: '#1C2024',
      background: '#FCFCFD',
    },
    colorsDark: {
      primary: '#EDEEF0',
      background: '#111113',
    },
  },
  seo: {
    twitter: '@cnekol',
  },
}
