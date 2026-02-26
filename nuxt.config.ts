// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@vite-pwa/nuxt'
  ],
  imports: {
    autoImport: true,
  },
  
  // Configuração de componentes
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  
  // Configuração de CSS global
  css: [
    '~/assets/css/main.css'
  ],
  
  // Configuração do app
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&display=swap'
        }
      ]
    }
  },
  
  // Configuração do Vite para CORS
  vite: {
    server: {
      cors: true,
      allowedHosts: ["all"]
    }
  },
  
  runtimeConfig: {
    // Variáveis privadas (só no servidor)
    // apiSecret: process.env.API_SECRET,
    
    // Variáveis públicas (expostas ao cliente)
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },

  // Configuração PWA
  // @ts-ignore
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      globIgnores: [
        '**/login-bg.png',
        '**/*login-bg*'
      ],
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB para permitir arquivos maiores
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/]
    },
    client: {
      installPrompt: true
    },
    meta: {
      title: 'HuntImob',
      author: 'Beet Sistemas',
      description: 'Sistema de gestão imobiliária',
      theme_color: '#000000',
      lang: 'pt-BR',
      ogTitle: 'HuntImob',
      ogDescription: 'Sistema de gestão imobiliária',
      ogImage: '/icon-512.png',
      ogUrl: '/',
      twitterCard: 'summary_large_image',
      twitterImage: '/icon-512.png'
    },
    manifest: {
      name: 'HuntImob',
      short_name: 'HuntImob',
      description: 'Sistema de gestão imobiliária',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      lang: 'pt-BR',
      categories: ['business', 'productivity'],
      display_override: ['window-controls-overlay'],
      related_applications: [
        {
          "platform": "webapp",
          "url": "/manifest.webmanifest"
        }
      ],
      prefer_related_applications: false,
      icons: [
        {
          src: 'icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: 'icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  }
})
