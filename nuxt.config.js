import axios from 'axios'
import _ from 'lodash'

const locale = process.env.NUXT_LOCALE || 'en'

export default {
  modern: 'client',
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver', body: true }
    ]
  },
  css: [
    'normalize.css',
    'highlight.js/styles/github.css',
    '~/assets/scss/main.scss'
  ],
  modules: [
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://github.com/Developmint/nuxt-svg-loader/
    'nuxt-svg-loader',
    // https://github.com/DreaMinder/nuxt-payload-extractor
    // 'nuxt-payload-extractor'
  ],
  plugins: [
    '~/plugins/init.js',
    { src: '~/plugins/ga.client.js', ssr: false },
    { src: '~/plugins/adblock.client.js', ssr: false }
  ],
  env: {
    githubToken: '4aa6bcf919d238504e7db59a66d32e78281c0ad3',
    docSearchApiKey: 'ff80fbf046ce827f64f06e16f82f1401',
    locale
  },
  loading: { color: '#41B883' },
  router: {
    // middleware: ['static'],
    scrollBehavior(to, from, savedPosition) {
      // savedPosition is only available for popstate navigations (back button)
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    }
  },
  generate: {
    fallback: true,
    interval: 100,
    routes() {
      return Promise.all(
        ['guide', 'api', 'examples', 'faq']
          .map((category) => {
            return axios.get(`https://docs.api.nuxtjs.org/menu/${locale}/${category}`)
              .then((res) => res.data || [])
              .then((menu) => {
                return _(menu)
                  .map('links')
                  .flatten()
                  .map((m) => m.to.slice(1))
                  .compact()
                  .map((slug) => {
                    return `/${category}/${slug}`
                  })
                  .value()
                  .concat(`/${category}`)
              })
          })
      )
        .then((routes) => _(routes).flatten().uniq().value())
    }
  },
  /*
  ** Build configuration
  */
  styleResources: {
    scss: [
      './assets/styles/variables/theme.scss'
    ]
  }
}
