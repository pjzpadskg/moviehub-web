import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
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
