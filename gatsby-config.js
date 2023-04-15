module.exports = {
  siteMetadata: {
    title: 'Neko',
    description: 'A blog from Neko',
    keywords: 'blog,neko',
    lang: 'zh',
  },
  pathPrefix: `/gtc`,
  plugins: [
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Carbon Design Gatsby Theme',
        icon: 'src/images/favicon.svg',
        short_name: 'Gatsby Theme Carbon',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#161616',
        display: 'browser',
      },
    },
    {
      resolve: 'gatsby-theme-carbon',
      options: {
        /*mediumAccount: 'Neko',
        repository: {
          baseUrl:
            'https://github.com/n3kol/blog',
          subDirectory: '/packages/example',
        },*/
        isSwitcherEnabled: false,
        isSearchEnabled: false
      },
    },
  ],
};
