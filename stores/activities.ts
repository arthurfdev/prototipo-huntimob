import { defineStore } from 'pinia'

export interface Activity {
  id: string
  type: 'lead' | 'visita' | 'negociacao' | 'proposta' | 'imovel' | 'comissao' | 'sistema'
  title: string
  message: string
  timestamp: Date
  read: boolean
  icon?: string
  color?: string
  link?: string
  metadata?: Record<string, any>
}

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: [] as Activity[],
    isOpen: true,
    unreadCount: 0
  }),

  getters: {
    recentActivities: (state) => {
      return state.activities
        .slice()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 50) // Limitar a 50 atividades mais recentes
    },
    
    unreadActivities: (state) => {
      return state.activities.filter(a => !a.read)
    }
  },

  actions: {
    addActivity(activity: Omit<Activity, 'id' | 'timestamp' | 'read'>) {
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false
      }
      
      this.activities.unshift(newActivity)
      this.updateUnreadCount()
      
      // Manter apenas as últimas 100 atividades
      if (this.activities.length > 100) {
        this.activities = this.activities.slice(0, 100)
      }
    },

    markAsRead(id: string) {
      const activity = this.activities.find(a => a.id === id)
      if (activity) {
        activity.read = true
        this.updateUnreadCount()
      }
    },

    markAllAsRead() {
      this.activities.forEach(a => a.read = true)
      this.updateUnreadCount()
    },

    removeActivity(id: string) {
      const index = this.activities.findIndex(a => a.id === id)
      if (index > -1) {
        this.activities.splice(index, 1)
        this.updateUnreadCount()
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.unreadActivities.length
    },

    toggleFeed() {
      this.isOpen = !this.isOpen
      localStorage.setItem('activityFeedOpen', JSON.stringify(this.isOpen))
    },

    setFeedOpen(open: boolean) {
      this.isOpen = open
      localStorage.setItem('activityFeedOpen', JSON.stringify(this.isOpen))
    },

    // Métodos auxiliares para criar atividades específicas
    addLeadActivity(data: { leadName: string; corretorName?: string; link?: string }) {
      this.addActivity({
        type: 'lead',
        title: 'Novo Lead',
        message: data.corretorName 
          ? `Lead "${data.leadName}" foi atribuído a ${data.corretorName}`
          : `Novo lead "${data.leadName}" chegou ao sistema`,
        icon: 'UserPlusIcon',
        color: 'green',
        link: data.link
      })
    },

    addVisitaActivity(data: { corretorName: string; leadName: string; dataVisita: string; link?: string }) {
      this.addActivity({
        type: 'visita',
        title: 'Visita Agendada',
        message: `${data.corretorName} agendou uma visita com ${data.leadName} para ${data.dataVisita}`,
        icon: 'CalendarIcon',
        color: 'blue',
        link: data.link
      })
    },

    addNegociacaoActivity(data: { corretorName: string; leadName: string; imovelName: string; link?: string }) {
      this.addActivity({
        type: 'negociacao',
        title: 'Nova Negociação',
        message: `${data.corretorName} iniciou uma negociação de ${data.imovelName} com ${data.leadName}`,
        icon: 'BriefcaseIcon',
        color: 'yellow',
        link: data.link
      })
    },

    addPropostaActivity(data: { corretorName: string; leadName: string; valor: string; link?: string }) {
      this.addActivity({
        type: 'proposta',
        title: 'Nova Proposta',
        message: `${data.corretorName} enviou uma proposta de R$ ${data.valor} para ${data.leadName}`,
        icon: 'DocumentTextIcon',
        color: 'purple',
        link: data.link
      })
    },

    addImovelActivity(data: { imovelName: string; tipo: 'cadastrado' | 'atualizado' | 'vendido' | 'alugado'; link?: string }) {
      const messages = {
        cadastrado: `Novo imóvel "${data.imovelName}" foi cadastrado`,
        atualizado: `Imóvel "${data.imovelName}" foi atualizado`,
        vendido: `Imóvel "${data.imovelName}" foi vendido`,
        alugado: `Imóvel "${data.imovelName}" foi alugado`
      }
      
      this.addActivity({
        type: 'imovel',
        title: 'Atualização de Imóvel',
        message: messages[data.tipo],
        icon: 'BuildingOfficeIcon',
        color: 'indigo',
        link: data.link
      })
    },

    addComissaoActivity(data: { corretorName: string; valor: string; link?: string }) {
      this.addActivity({
        type: 'comissao',
        title: 'Comissão Aprovada',
        message: `Comissão de R$ ${data.valor} foi aprovada para ${data.corretorName}`,
        icon: 'ReceiptPercentIcon',
        color: 'green',
        link: data.link
      })
    }
  }
})
