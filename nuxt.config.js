export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-sentry-issue',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/sentry'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  sentry: {
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Enter your project's DSN here
    config: {
      beforeSend(event, hint) {
        const ignoreErrorInBeforeSend = [
          {
            check: (event, hint) => {
              // Ignore fbevent.js postMessage error in iOS device
              if (hint?.originalException?.stack) {
                // eslint-disable-next-line dot-notation
                const errorStack = JSON.stringify(hint.originalException.stack)
                return /postMessage/.test(errorStack)
              }

              return false
            },
          },
        ]

        const shouldIgnoreError = ignoreErrorInBeforeSend.some((rule) =>
          rule.check(event, hint)
        )
        return shouldIgnoreError ? null : event
      },
    }, // Additional config
  },
}
