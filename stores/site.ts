import { defineStore } from 'pinia'

export interface SiteContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  search: {
    placeholder: string
    buttonText: string
  }
  featuredProperties: {
    title: string
    subtitle: string
    properties: Array<{
      id: string
      title: string
      image: string
      price: string
      location: string
    }>
  }
  services: {
    title: string
    subtitle: string
    items: Array<{
      id: string
      title: string
      description: string
      icon: string
    }>
  }
  footer: {
    companyName: string
    creci: string
    copyright: string
    links: Array<{
      id: string
      label: string
      url: string
    }>
  }
}

export const useSiteStore = defineStore('site', {
  state: (): { content: SiteContent } => ({
    content: {
      hero: {
        title: 'ENCONTRE O IMÓVEL DOS SEUS SONHOS',
        subtitle: 'A Beet Imoveis oferece as melhores oportunidades de compra, venda e locação com tecnologia de ponta e atendimento personalizado.',
        backgroundImage: '/images/logos/logo_cliente.png'
      },
      search: {
        placeholder: 'Localização, bairro ou endereço',
        buttonText: 'Buscar'
      },
      featuredProperties: {
        title: 'Imóveis em Destaque',
        subtitle: 'Confira nossa seleção especial de imóveis cuidadosamente escolhidos para você encontrar o lar perfeito.',
        properties: [
          {
            id: '1',
            title: 'Apartamento Premium 3 Quartos',
            image: '/images/imoveis/imovel1.jpg',
            price: 'R$ 850.000',
            location: 'Centro - São Paulo'
          },
          {
            id: '2',
            title: 'Casa com Piscina e Churrasqueira',
            image: '/images/imoveis/imovel2.jpg',
            price: 'R$ 1.200.000',
            location: 'Jardim América - São Paulo'
          },
          {
            id: '3',
            title: 'Cobertura Duplex com Vista Panorâmica',
            image: '/images/imoveis/imovel3.jpg',
            price: 'R$ 2.500.000',
            location: 'Zona Sul - São Paulo'
          },
          {
            id: '4',
            title: 'Apartamento 3 Quartos com Varanda',
            image: '/images/imoveis/imovel4.jpg',
            price: 'R$ 650.000',
            location: 'Centro - São Paulo'
          }
        ]
      },
      services: {
        title: 'Nossos Serviços',
        subtitle: 'A Beet Imoveis oferece soluções completas para todas as suas necessidades imobiliárias com excelência e comprometimento.',
        items: [
          {
            id: '1',
            title: 'Compra e Venda de Imóveis',
            description: 'Acompanhamos você em todo o processo, desde a busca do imóvel ideal até a assinatura do contrato, com total transparência e segurança.',
            icon: '🏠'
          },
          {
            id: '2',
            title: 'Locação e Aluguel',
            description: 'Encontre o imóvel perfeito para alugar ou coloque seu imóvel para locação com nossa equipe especializada.',
            icon: '🔑'
          },
          {
            id: '3',
            title: 'Avaliação de Imóveis',
            description: 'Avaliação profissional e gratuita do seu imóvel com relatório detalhado do valor de mercado atualizado.',
            icon: '💰'
          },
          {
            id: '4',
            title: 'Financiamento Imobiliário',
            description: 'Facilitamos o processo de financiamento com parcerias nas melhores instituições financeiras e condições especiais.',
            icon: '🏦'
          },
          {
            id: '5',
            title: 'Assessoria Jurídica',
            description: 'Equipe jurídica especializada para garantir segurança em todas as etapas da negociação imobiliária.',
            icon: '⚖️'
          },
          {
            id: '6',
            title: 'Marketing e Divulgação',
            description: 'Fotografia profissional, tour virtual 360° e estratégias digitais para maximizar a visibilidade do seu imóvel.',
            icon: '📸'
          }
        ]
      },
      footer: {
        companyName: 'BEET IMOVEIS',
        creci: 'CRECI SP 12345-J',
        copyright: '© 2026 Beet Imoveis — Todos os direitos reservados',
        links: [
          { id: '1', label: 'Início', url: '/' },
          { id: '2', label: 'Imóveis', url: '/imoveis' },
          { id: '3', label: 'Sobre', url: '/sobre' },
          { id: '4', label: 'Contato', url: '/contato' }
        ]
      }
    }
  }),

  getters: {
    getContent: (state) => state.content
  },

  actions: {
    updateHero(hero: Partial<SiteContent['hero']>) {
      this.content.hero = { ...this.content.hero, ...hero }
      this.saveToLocalStorage()
    },

    updateSearch(search: Partial<SiteContent['search']>) {
      this.content.search = { ...this.content.search, ...search }
      this.saveToLocalStorage()
    },

    updateFeaturedProperties(featuredProperties: Partial<SiteContent['featuredProperties']>) {
      this.content.featuredProperties = { ...this.content.featuredProperties, ...featuredProperties }
      this.saveToLocalStorage()
    },

    addProperty(property: SiteContent['featuredProperties']['properties'][0]) {
      this.content.featuredProperties.properties.push(property)
      this.saveToLocalStorage()
    },

    updateProperty(id: string, property: Partial<SiteContent['featuredProperties']['properties'][0]>) {
      const index = this.content.featuredProperties.properties.findIndex(p => p.id === id)
      if (index > -1) {
        this.content.featuredProperties.properties[index] = { ...this.content.featuredProperties.properties[index], ...property }
        this.saveToLocalStorage()
      }
    },

    removeProperty(id: string) {
      this.content.featuredProperties.properties = this.content.featuredProperties.properties.filter(p => p.id !== id)
      this.saveToLocalStorage()
    },

    updateServices(services: Partial<SiteContent['services']>) {
      this.content.services = { ...this.content.services, ...services }
      this.saveToLocalStorage()
    },

    addService(service: SiteContent['services']['items'][0]) {
      this.content.services.items.push(service)
      this.saveToLocalStorage()
    },

    updateService(id: string, service: Partial<SiteContent['services']['items'][0]>) {
      const index = this.content.services.items.findIndex(s => s.id === id)
      if (index > -1) {
        this.content.services.items[index] = { ...this.content.services.items[index], ...service }
        this.saveToLocalStorage()
      }
    },

    removeService(id: string) {
      this.content.services.items = this.content.services.items.filter(s => s.id !== id)
      this.saveToLocalStorage()
    },

    updateFooter(footer: Partial<SiteContent['footer']>) {
      this.content.footer = { ...this.content.footer, ...footer }
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('siteContent', JSON.stringify(this.content))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('siteContent')
      if (saved) {
        try {
          this.content = JSON.parse(saved)
        } catch (e) {
          console.error('Erro ao carregar conteúdo do site:', e)
        }
      }
    }
  }
})
