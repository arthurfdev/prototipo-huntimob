import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

interface Conhecimento {
  id: string
  cliente_id?: string
  texto_original: string
  pinecone_vector_ids?: string[] | null
  criado_em: string
  atualizado_em?: string
}

interface Paginacao {
  total: number
  pagina: number
  limite: number
  total_paginas: number
}

export const useConhecimentosStore = defineStore('conhecimentos', {
  state: () => ({
    conhecimentos: [] as Conhecimento[],
    total: 0,
    paginacao: {
      pagina: 1,
      limite: 20,
      total_paginas: 1
    } as Paginacao,
    isLoading: false
  }),

  actions: {
    async loadConhecimentos(
      clienteId?: string,
      opts?: { page?: number; limit?: number }
    ) {
      // TODO: Substituir por chamada real à API
      // const id = clienteId || useClienteStore().clienteId
      // if (!id) throw new Error('Cliente não selecionado')

      this.isLoading = true
      try {
        const page = opts?.page ?? this.paginacao.pagina
        const limit = opts?.limit ?? this.paginacao.limite

        // Mock - simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock data
        const mockConhecimentos: Conhecimento[] = [
          {
            id: '1',
            texto_original: '[IMÓVEL] Nome: Apartamento Centro\nValor: R$ 450.000\nDescrição: Apartamento de 3 quartos, 2 banheiros, área de 120m², localizado no centro da cidade.',
            criado_em: new Date().toISOString()
          }
        ]

        this.conhecimentos = mockConhecimentos
        this.total = mockConhecimentos.length
        this.paginacao = {
          pagina: page,
          limite: limit,
          total_paginas: Math.max(1, Math.ceil(mockConhecimentos.length / limit))
        }

        return { rows: this.conhecimentos, total: this.total }
      } catch (error) {
        console.error('Erro ao carregar conhecimentos:', error)
        ElMessage.error('Erro ao carregar conhecimentos')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async criarConhecimento(
      clienteId: string | undefined,
      payload: { texto_original: string }
    ) {
      if (!payload.texto_original?.trim()) {
        throw new Error('Texto do conhecimento é obrigatório')
      }

      this.isLoading = true
      try {
        // TODO: Substituir por chamada real à API
        // const response = await $fetch(`/conhecimentos?cliente_id=${clienteId}`, {
        //   method: 'POST',
        //   body: { texto_original: payload.texto_original.trim() }
        // })

        await new Promise(resolve => setTimeout(resolve, 1000))

        const novoConhecimento: Conhecimento = {
          id: String(Date.now()),
          texto_original: payload.texto_original.trim(),
          criado_em: new Date().toISOString()
        }

        this.conhecimentos.unshift(novoConhecimento)
        this.total += 1

        ElMessage.success('Conhecimento adicionado com sucesso!')
        return novoConhecimento
      } catch (error: any) {
        console.error('Erro ao criar conhecimento:', error)
        ElMessage.error(error?.response?.data?.error || error?.message || 'Erro ao adicionar conhecimento')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deletarConhecimento(conhecimentoId: string, clienteId?: string) {
      this.isLoading = true
      try {
        // TODO: Substituir por chamada real à API
        // await $fetch(`/conhecimentos/${conhecimentoId}?cliente_id=${clienteId}`, {
        //   method: 'DELETE'
        // })

        await new Promise(resolve => setTimeout(resolve, 500))

        this.conhecimentos = this.conhecimentos.filter((c) => c.id !== conhecimentoId)
        this.total = Math.max(0, this.total - 1)

        ElMessage.success('Conhecimento removido com sucesso!')
      } catch (error: any) {
        console.error('Erro ao deletar conhecimento:', error)
        ElMessage.error(error?.response?.data?.error || error?.message || 'Erro ao remover conhecimento')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deletarTodos(clienteId?: string) {
      this.isLoading = true
      try {
        // TODO: Substituir por chamada real à API
        // await $fetch(`/conhecimentos?cliente_id=${clienteId}`, {
        //   method: 'DELETE'
        // })

        await new Promise(resolve => setTimeout(resolve, 500))

        this.conhecimentos = []
        this.total = 0

        ElMessage.success('Todos os conhecimentos foram removidos!')
      } catch (error: any) {
        console.error('Erro ao deletar todos os conhecimentos:', error)
        ElMessage.error(error?.response?.data?.error || error?.message || 'Erro ao remover conhecimentos')
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
