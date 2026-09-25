import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  astro: true,
  ignores: ['**/dist/**', '**/.astro/**', 'apps/*/src/content/**', '**/*.md'],
})
