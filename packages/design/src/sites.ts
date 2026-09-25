/** 两个站点的规范地址与互链信息，两边共用。 */
export const sites = {
  site: {
    name: 'Neko',
    url: 'https://neko.icu',
  },
  work: {
    name: 'Neko · 设计',
    url: 'https://work.neko.icu',
  },
} as const

export const author = 'Neko'
export const twitter = '@cnekol'

/** 公开联系邮箱（Cloudflare Email Routing 转发到私人邮箱） */
export const email = 'neko@neko.icu'
