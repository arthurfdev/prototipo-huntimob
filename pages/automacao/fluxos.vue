<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Fluxos de Automação
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Grafos de conversa para WhatsApp com IA
        </p>
      </div>
      <button
        v-if="!flowFormVisible"
        @click="novo"
        class="btn-gradient flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <PlusIcon class="h-4 w-4" />
        Novo Flow
      </button>
    </div>

    <!-- Listagem Flow -->
    <div v-if="!flowFormVisible" class="flex-1 overflow-y-auto flex flex-col">
      <div v-if="isLoading" class="flex items-center justify-center flex-1">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
      </div>

      <div v-else-if="flows.length === 0" class="flex flex-col items-center justify-center flex-1 py-16">
        <CircleStackIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum Flow</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
          Crie um grafo de conversa (Flow) para usar em ações de WhatsApp com IA.
        </p>
        <button
          @click="novo"
          class="btn-gradient flex items-center gap-2 px-4 py-2 text-sm font-medium"
        >
          <PlusIcon class="h-4 w-4" />
          Novo Flow
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="f in flows"
          :key="f.id"
          class="glass-card-light dark:glass-card rounded-3xl p-6 sm:p-7 border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/50 relative overflow-hidden"
        >
          <!-- overlay de brilho suave -->
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-emerald-500/5 opacity-80"></div>

          <div class="relative z-10 flex flex-col h-full">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {{ f.name }}
                </h3>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-[11px] font-bold glass-card-light dark:glass-card border',
                  f.active
                    ? 'border-emerald-400/60 text-emerald-400 bg-emerald-500/5'
                    : 'border-gray-400/40 text-gray-400 bg-gray-500/5'
                ]"
              >
                {{ f.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span class="flex items-center gap-1">
                <CircleStackIcon class="h-4 w-4" />
                {{ f.config?.nodes?.length ?? '—' }} nós
              </span>
              <span class="text-xs opacity-80">entry: {{ f.config?.entry_point || '—' }}</span>
            </div>

            <div class="mt-auto flex items-center gap-2 pt-4 border-t border-white/10">
              <button
                @click.stop="editarFlow(f)"
                class="btn-gradient flex-1 px-3 py-2 text-sm font-semibold text-center"
              >
                Editar
              </button>
              <button
                @click.stop="toggleFlowActive(f)"
                :class="[
                  'flex-1 px-3 py-2 text-sm font-semibold rounded-full transition-all glass-card-light dark:glass-card border',
                  f.active
                    ? 'border-amber-400/60 text-amber-400 hover:bg-amber-500/10'
                    : 'border-emerald-400/60 text-emerald-400 hover:bg-emerald-500/10'
                ]"
              >
                {{ f.active ? 'Desativar' : 'Ativar' }}
              </button>
              <button
                @click.stop="deletarFlow(f)"
                class="icon-glass px-3 py-2 rounded-full flex items-center justify-center text-red-400 hover:scale-105 transition-transform"
                title="Excluir fluxo"
              >
                <TrashIcon class="h-4 w-4 stroke-2 relative z-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Flow -->
    <div v-else class="flex-1 min-h-0">
      <FlowForm
        :model-value="flowEditando ?? undefined"
        :is-loading="isSaving"
        @submit="handleSubmitFlow"
        @cancel="cancelarFlow"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PlusIcon, TrashIcon, CircleStackIcon } from '@heroicons/vue/24/outline'
import FlowForm from '@/components/fluxos/FlowForm.vue'

const flows = ref([])
const isLoading = ref(false)
const flowFormVisible = ref(false)
const flowEditando = ref(null)
const isSaving = ref(false)

onMounted(async () => {
  await loadFlows()
})

const loadFlows = async () => {
  isLoading.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    flows.value = [
      {
        id: '1',
        name: 'Venda de Imóvel - Jornada Completa',
        active: true,
        config: {
          nodes: [
            { 
              id: 'inicio', 
              type: 'generic_classify', 
              label: 'Início - Classificar Intenção',
              position: { x: 100, y: 200 },
              config: { 
                mensagem: 'Olá! 👋 Bem-vindo à Beet Imóveis! Sou seu assistente virtual. Como posso ajudá-lo hoje?',
                variavel: 'intent'
              }
            },
            { 
              id: 'info_imovel', 
              type: 'generic_respond', 
              label: 'Enviar Informações do Imóvel',
              position: { x: 500, y: 50 },
              config: { 
                mensagem: 'Ótimo! Vou enviar as informações do imóvel. 📋\n\n*Características:*\n• Área: 120m²\n• Quartos: 3\n• Banheiros: 2\n• Vagas: 2\n• Valor: R$ 450.000\n\nDeseja agendar uma visita? 🏠'
              }
            },
            { 
              id: 'agendar_visita', 
              type: 'generic_extract', 
              label: 'Coletar Dados para Agendamento',
              position: { x: 500, y: 200 },
              config: { 
                campo: 'data_visita',
                mensagem: 'Perfeito! Para agendar sua visita, preciso de algumas informações:\n\n📅 Qual data você prefere?\n⏰ Qual horário?\n📱 Seu nome completo\n📧 Seu e-mail'
              }
            },
            { 
              id: 'extrair_dados_cliente', 
              type: 'generic_extract', 
              label: 'Extrair Dados do Cliente',
              position: { x: 500, y: 350 },
              config: { 
                campos: ['nome', 'telefone', 'email', 'renda'],
                mensagem: 'Para continuarmos, preciso de alguns dados:\n\n👤 Nome completo\n📱 Telefone\n📧 E-mail\n💰 Renda aproximada'
              }
            },
            { 
              id: 'confirmar_agendamento', 
              type: 'generic_respond', 
              label: 'Confirmar Agendamento',
              position: { x: 500, y: 500 },
              config: { 
                mensagem: '✅ Agendamento confirmado!\n\n📅 Data: {{data_visita}}\n⏰ Horário: {{horario}}\n📍 Endereço: Rua Exemplo, 123 - Centro\n\nNos vemos em breve! 🏠✨'
              }
            },
            { 
              id: 'enviar_proposta', 
              type: 'generic_respond', 
              label: 'Enviar Proposta Comercial',
              position: { x: 500, y: 650 },
              config: { 
                mensagem: '📄 Enviando proposta comercial...\n\n*Detalhes da Proposta:*\n• Valor: R$ 450.000\n• Entrada: R$ 90.000 (20%)\n• Financiamento: R$ 360.000\n• Parcelas: 360x R$ 2.100\n\nDeseja agendar uma reunião para discutir? 💼'
              }
            },
            { 
              id: 'condicao_interesse', 
              type: 'conditional', 
              label: 'Cliente Interessado?',
              position: { x: 900, y: 200 },
              config: { 
                variavel: 'interesse',
                valor: 'sim'
              }
            },
            { 
              id: 'condicao_agendamento', 
              type: 'conditional', 
              label: 'Quer Agendar?',
              position: { x: 900, y: 350 },
              config: { 
                variavel: 'agendar',
                valor: 'sim'
              }
            },
            { 
              id: 'condicao_proposta', 
              type: 'conditional', 
              label: 'Quer Proposta?',
              position: { x: 900, y: 500 },
              config: { 
                variavel: 'proposta',
                valor: 'sim'
              }
            },
            { 
              id: 'buscar_imoveis', 
              type: 'generic_fetch', 
              label: 'Buscar Imóveis Disponíveis',
              position: { x: 1300, y: 200 },
              config: { 
                url: '/api/imoveis/disponiveis',
                metodo: 'GET',
                parametros: { tipo: '{{tipo_imovel}}', valor_max: '{{valor_maximo}}' }
              }
            },
            { 
              id: 'enviar_lista_imoveis', 
              type: 'generic_respond', 
              label: 'Enviar Lista de Imóveis',
              position: { x: 1300, y: 350 },
              config: { 
                mensagem: 'Encontrei {{quantidade}} imóveis que podem te interessar! 🏘️\n\nVou enviar os detalhes...'
              }
            },
            { 
              id: 'finalizar_venda', 
              type: 'generic_respond', 
              label: 'Finalizar Venda',
              position: { x: 500, y: 800 },
              config: { 
                mensagem: '🎉 Parabéns! Sua proposta foi aprovada!\n\nVamos agendar a assinatura do contrato. Um de nossos corretores entrará em contato em breve.\n\nObrigado por escolher a Beet Imóveis! 🏠✨'
              }
            },
            { 
              id: 'encerrar', 
              type: 'END', 
              label: 'FIM',
              position: { x: 500, y: 950 },
              config: {}
            },
            { 
              id: 'nao_interessado', 
              type: 'generic_respond', 
              label: 'Cliente Não Interessado',
              position: { x: 1300, y: 50 },
              config: { 
                mensagem: 'Entendo perfeitamente! 😊\n\nSe mudar de ideia ou precisar de mais informações, estarei aqui para ajudar.\n\nTenha um ótimo dia! 👋'
              }
            }
          ],
          edges: [
            { id: 'edge-1', source: 'inicio', target: 'condicao_interesse' },
            { id: 'edge-2', source: 'condicao_interesse', target: 'info_imovel' },
            { id: 'edge-3', source: 'condicao_interesse', target: 'nao_interessado' },
            { id: 'edge-4', source: 'info_imovel', target: 'condicao_agendamento' },
            { id: 'edge-5', source: 'condicao_agendamento', target: 'agendar_visita' },
            { id: 'edge-6', source: 'condicao_agendamento', target: 'buscar_imoveis' },
            { id: 'edge-7', source: 'agendar_visita', target: 'extrair_dados_cliente' },
            { id: 'edge-8', source: 'extrair_dados_cliente', target: 'confirmar_agendamento' },
            { id: 'edge-9', source: 'confirmar_agendamento', target: 'condicao_proposta' },
            { id: 'edge-10', source: 'condicao_proposta', target: 'enviar_proposta' },
            { id: 'edge-11', source: 'condicao_proposta', target: 'buscar_imoveis' },
            { id: 'edge-12', source: 'enviar_proposta', target: 'finalizar_venda' },
            { id: 'edge-13', source: 'buscar_imoveis', target: 'enviar_lista_imoveis' },
            { id: 'edge-14', source: 'enviar_lista_imoveis', target: 'condicao_agendamento' },
            { id: 'edge-15', source: 'finalizar_venda', target: 'encerrar' },
            { id: 'edge-16', source: 'nao_interessado', target: 'encerrar' }
          ],
          entry_point: 'inicio'
        },
        context_default: {
          base_url: 'https://api.huntimob.com.br',
          empresa: 'Beet Imóveis',
          telefone_contato: '(62) 99999-9999'
        }
      },
      {
        id: '2',
        name: 'Qualificação de Lead',
        active: true,
        config: {
          nodes: [
            { 
              id: 'inicio_qualificacao', 
              type: 'generic_classify', 
              label: 'Início - Qualificar Lead',
              position: { x: 200, y: 150 },
              config: { 
                mensagem: 'Olá! 👋 Obrigado pelo interesse em nossos imóveis!\n\nPara te ajudar da melhor forma, preciso entender seu perfil. Vamos começar?'
              }
            },
            { 
              id: 'perguntar_orcamento', 
              type: 'generic_extract', 
              label: 'Perguntar Orçamento',
              position: { x: 700, y: 50 },
              config: { 
                campo: 'orcamento',
                mensagem: '💰 Qual é o valor máximo que você pretende investir?'
              }
            },
            { 
              id: 'perguntar_tipo', 
              type: 'generic_extract', 
              label: 'Perguntar Tipo de Imóvel',
              position: { x: 700, y: 200 },
              config: { 
                campo: 'tipo_imovel',
                mensagem: '🏠 Que tipo de imóvel você procura?\n\n• Casa\n• Apartamento\n• Terreno\n• Comercial'
              }
            },
            { 
              id: 'perguntar_localizacao', 
              type: 'generic_extract', 
              label: 'Perguntar Localização',
              position: { x: 700, y: 350 },
              config: { 
                campo: 'regiao',
                mensagem: '📍 Em qual região você prefere?\n\n• Centro\n• Norte\n• Sul\n• Leste\n• Oeste'
              }
            },
            { 
              id: 'buscar_match', 
              type: 'generic_fetch', 
              label: 'Buscar Imóveis Compatíveis',
              position: { x: 700, y: 500 },
              config: { 
                url: '/api/imoveis/buscar',
                metodo: 'POST',
                body: {
                  orcamento: '{{orcamento}}',
                  tipo: '{{tipo_imovel}}',
                  regiao: '{{regiao}}'
                }
              }
            },
            { 
              id: 'enviar_resultados', 
              type: 'generic_respond', 
              label: 'Enviar Resultados',
              position: { x: 700, y: 650 },
              config: { 
                mensagem: '🎯 Encontrei {{quantidade}} imóveis perfeitos para você!\n\nVou enviar os detalhes agora... 📋'
              }
            },
            { 
              id: 'fim_qualificacao', 
              type: 'END', 
              label: 'FIM',
              position: { x: 700, y: 800 },
              config: {}
            }
          ],
          edges: [
            { id: 'edge-q1', source: 'inicio_qualificacao', target: 'perguntar_orcamento' },
            { id: 'edge-q2', source: 'perguntar_orcamento', target: 'perguntar_tipo' },
            { id: 'edge-q3', source: 'perguntar_tipo', target: 'perguntar_localizacao' },
            { id: 'edge-q4', source: 'perguntar_localizacao', target: 'buscar_match' },
            { id: 'edge-q5', source: 'buscar_match', target: 'enviar_resultados' },
            { id: 'edge-q6', source: 'enviar_resultados', target: 'fim_qualificacao' }
          ],
          entry_point: 'inicio_qualificacao'
        },
        context_default: {
          base_url: 'https://api.huntimob.com.br'
        }
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar flows:', error)
    ElMessage.error('Erro ao carregar flows')
  } finally {
    isLoading.value = false
  }
}

const novo = () => {
  flowEditando.value = null
  flowFormVisible.value = true
}

const editarFlow = (f) => {
  flowEditando.value = { ...f }
  flowFormVisible.value = true
}

const cancelarFlow = () => {
  flowFormVisible.value = false
  flowEditando.value = null
}

const handleSubmitFlow = async (payload) => {
  isSaving.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (flowEditando.value?.id) {
      const index = flows.value.findIndex(f => f.id === flowEditando.value.id)
      if (index !== -1) {
        flows.value[index] = {
          ...flowEditando.value,
          name: payload.name,
          active: payload.active,
          config: payload.config,
          context_default: payload.context_default
        }
      }
      ElMessage.success('Flow atualizado com sucesso!')
    } else {
      const newId = String(Math.max(...flows.value.map(f => parseInt(f.id) || 0), 0) + 1)
      flows.value.push({
        id: newId,
        name: payload.name,
        active: payload.active,
        config: payload.config,
        context_default: payload.context_default
      })
      ElMessage.success('Flow criado com sucesso!')
    }
    cancelarFlow()
    await loadFlows()
  } catch (error) {
    console.error('Erro ao salvar flow:', error)
    ElMessage.error('Erro ao salvar flow')
  } finally {
    isSaving.value = false
  }
}

const toggleFlowActive = async (f) => {
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 300))
    f.active = !f.active
    ElMessage.success(`Flow ${f.active ? 'ativado' : 'desativado'} com sucesso!`)
    await loadFlows()
  } catch (error) {
    console.error('Erro ao atualizar flow:', error)
    ElMessage.error('Erro ao atualizar flow')
  }
}

const deletarFlow = async (f) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja excluir o Flow "${f.name}"?`,
      'Confirmar Exclusão',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 300))
    flows.value = flows.value.filter(flow => flow.id !== f.id)
    ElMessage.success('Flow excluído com sucesso!')
    await loadFlows()
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Erro ao excluir flow:', err)
      ElMessage.error('Erro ao excluir flow')
    }
  }
}
</script>
