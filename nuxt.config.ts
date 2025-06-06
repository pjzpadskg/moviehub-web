import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'MovieHub',
      link: [
        { rel: 'icon', type: 'image/png', href: '/moviehub-icon.png' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      dbBaseUrl: '',
      vidBaseUrl: '',
      dbImgBaseUrl: '',
      apiHeaderKey: ''
    }
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  shadcn: {
    prefix: 'Scn',
    componentDir: './components/ui'
  }
})
