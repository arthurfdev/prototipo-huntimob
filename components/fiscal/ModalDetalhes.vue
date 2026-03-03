<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="close"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm" @click="close"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              class="relative w-full max-w-3xl glass-card-light dark:glass-card rounded-xl shadow-2xl"
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    statusConfig.bgClass
                  ]">
                    <component :is="statusConfig.icon" :class="['h-6 w-6', statusConfig.iconClass]" />
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ nota?.tipo }} {{ nota?.numero ? `#${nota.numero}` : '' }}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(nota?.data_emissao || '') }}
                    </p>
                  </div>
                </div>

                <button
                  @click="close"
                  class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Loading -->
              <div v-if="loading" class="p-8 text-center">
                <ArrowPathIcon class="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400">Carregando detalhes...</p>
              </div>

              <!-- Conteúdo -->
              <div v-else-if="nota" class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <!-- Status -->
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <StatusBadge :status="nota.status" />
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      nota.ambiente === 1 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    ]">
                      {{ nota.ambiente === 1 ? 'Produção' : 'Homologação' }}
                    </span>
                  </div>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {{ formatCurrency(nota.valor_total) }}
                  </span>
                </div>

                <!-- Erro de rejeição -->
                <div
                  v-if="nota.status === 'rejeitada' && nota.motivo_rejeicao"
                  class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div class="flex items-start space-x-3">
                    <ExclamationCircleIcon class="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p class="font-medium text-red-800 dark:text-red-400">Nota Rejeitada</p>
                      <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ nota.motivo_rejeicao }}</p>
                    </div>
                  </div>
                </div>

                <!-- Informações do Tomador -->
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Tomador
                  </h3>
                  <div class="bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg p-4">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ nota.tomador?.razao_social || 'Não informado' }}
                    </p>
                    <p v-if="nota.tomador?.cnpj || nota.tomador?.cpf" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ nota.tomador.cnpj ? 'CNPJ' : 'CPF' }}: {{ formatDocument(nota.tomador.cnpj || nota.tomador.cpf) }}
                    </p>
                    <p v-if="nota.tomador?.email" class="text-sm text-gray-500 dark:text-gray-400">
                      {{ nota.tomador.email }}
                    </p>
                    <p v-if="nota.tomador?.endereco" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {{ formatEndereco(nota.tomador.endereco) }}
                    </p>
                  </div>
                </div>

                <!-- Serviços -->
                <div v-if="nota.servicos && nota.servicos.length > 0">
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Serviços
                  </h3>
                  <div class="space-y-2">
                    <div
                      v-for="(servico, index) in nota.servicos"
                      :key="index"
                      class="bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg p-4"
                    >
                      <div class="flex justify-between items-start">
                        <div>
                          <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Código {{ servico.codigo }}
                          </span>
                          <p class="text-gray-900 dark:text-white mt-1">{{ servico.descricao }}</p>
                        </div>
                        <span class="font-semibold text-gray-900 dark:text-white">
                          R$ {{ formatCurrency(servico.valor) }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>ISS: {{ servico.aliquota_iss || 5 }}%</span>
                        <span v-if="servico.cnae">CNAE: {{ servico.cnae }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Informações Técnicas -->
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Informações Técnicas
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg p-3">
                      <p class="text-xs text-gray-500 dark:text-gray-400">ID Interno</p>
                      <p class="text-sm font-mono text-gray-900 dark:text-white truncate">{{ nota.id }}</p>
                    </div>
                    <div v-if="nota.nuvem_fiscal_id_nota" class="bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg p-3">
                      <p class="text-xs text-gray-500 dark:text-gray-400">ID Nuvem Fiscal</p>
                      <p class="text-sm font-mono text-gray-900 dark:text-white truncate">{{ nota.nuvem_fiscal_id_nota }}</p>
                    </div>
                    <div v-if="nota.protocolo_autorizacao" class="bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg p-3">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Protocolo</p>
                      <p class="text-sm font-mono text-gray-900 dark:text-white truncate">{{ nota.protocolo_autorizacao }}</p>
                    </div>
                    <div v-if="nota.chave_acesso" class="bg-gray-50 dark:bg-brand-navy-dark/50 rounded-lg p-3 col-span-2">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Chave de Acesso</p>
                      <p class="text-sm font-mono text-gray-900 dark:text-white break-all">{{ nota.chave_acesso }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer com ações -->
              <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex space-x-3">
                  <button
                    v-if="nota?.status === 'autorizada'"
                    disabled
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 
                           bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed opacity-50"
                    title="Download de PDF em breve"
                  >
                    <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
                    PDF
                  </button>
                  <button
                    v-if="nota?.status === 'autorizada'"
                    disabled
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 
                           bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed opacity-50"
                    title="Download de XML em breve"
                  >
                    <CodeBracketIcon class="h-5 w-5 mr-2" />
                    XML
                  </button>
                </div>

                <div class="flex space-x-3">
                  <button
                    v-if="nota?.status === 'autorizada'"
                    @click="$emit('cancelar', nota)"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                           bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <NoSymbolIcon class="h-5 w-5 mr-2" />
                    Cancelar Nota
                  </button>
                  <button
                    v-if="nota?.status === 'processando'"
                    @click="$emit('refresh', nota)"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                           btn-gradient"
                  >
                    <ArrowPathIcon class="h-5 w-5 mr-2" />
                    Atualizar Status
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import {
  XMarkIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  CodeBracketIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  nota: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'cancelar', 'refresh'])

const statusConfig = computed(() => {
  switch (props.nota?.status) {
    case 'autorizada':
      return {
        icon: CheckCircleIcon,
        bgClass: 'bg-green-100 dark:bg-green-900/30',
        iconClass: 'text-green-600 dark:text-green-400'
      }
    case 'processando':
      return {
        icon: ArrowPathIcon,
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        iconClass: 'text-blue-600 dark:text-blue-400 animate-spin'
      }
    case 'rejeitada':
      return {
        icon: XCircleIcon,
        bgClass: 'bg-red-100 dark:bg-red-900/30',
        iconClass: 'text-red-600 dark:text-red-400'
      }
    case 'cancelada':
      return {
        icon: NoSymbolIcon,
        bgClass: 'bg-orange-100 dark:bg-orange-900/30',
        iconClass: 'text-orange-600 dark:text-orange-400'
      }
    default:
      return {
        icon: ClockIcon,
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        iconClass: 'text-gray-600 dark:text-gray-400'
      }
  }
})

function close() {
  emit('update:modelValue', false)
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatDocument(doc) {
  if (!doc) return ''
  const cleaned = doc.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return doc
}

function formatEndereco(endereco) {
  if (!endereco) return ''
  const parts = [
    endereco.logradouro,
    endereco.numero,
    endereco.complemento,
    endereco.bairro,
    `${endereco.cidade}/${endereco.uf}`,
    endereco.cep
  ].filter(Boolean)
  return parts.join(', ')
}
</script>
