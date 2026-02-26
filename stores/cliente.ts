import { defineStore } from 'pinia'

export interface Filial {
  id: string
  nome: string
  cidade?: string
  estado?: string
}

export const useClienteStore = defineStore('cliente', {
  state: () => ({
    clienteNome: 'Beet Imóveis',
    filialSelecionada: '1',
    filiais: [
      { id: '1', nome: 'Matriz - Jardim Goiás', cidade: 'Goiânia', estado: 'GO' },
      { id: '2', nome: 'Filial - Aparecida de Goiânia', cidade: 'Goiânia', estado: 'GO' },
      { id: '3', nome: 'Filial - Zona Norte SP', cidade: 'São Paulo', estado: 'SP' }
    ] as Filial[]
  }),

  getters: {
    filialAtual: (state) => {
      return state.filiais.find(f => f.id === state.filialSelecionada) || state.filiais[0]
    },
    clienteInicial: (state) => {
      return state.clienteNome.charAt(0).toUpperCase()
    }
  },

  actions: {
    setClienteNome(nome: string) {
      this.clienteNome = nome
      localStorage.setItem('clienteNome', nome)
    },

    setFilialSelecionada(filialId: string) {
      this.filialSelecionada = filialId
      localStorage.setItem('filialSelecionada', filialId)
    },

    addFilial(filial: Filial) {
      this.filiais.push(filial)
    },

    removeFilial(filialId: string) {
      const index = this.filiais.findIndex(f => f.id === filialId)
      if (index > -1) {
        this.filiais.splice(index, 1)
      }
    }
  }
})
