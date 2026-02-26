<template>
  <div v-if="configRelatorio" class="flex flex-col min-h-0 flex-1">
    <!-- Header -->
    <div class="shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-white/10 glass-card-light dark:glass-card rounded-t-xl">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ configRelatorio.titulo }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
          Configure os filtros e gere o relatório
        </p>
      </div>
      <NuxtLink
        to="/gestao/relatorios"
        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
      >
        <ArrowLeftIcon class="h-4 w-4" />
        Voltar
      </NuxtLink>
    </div>

    <!-- Conteúdo -->
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      <!-- Card de Filtros -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-4 md:p-5">
        <h2 class="text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400 mb-4">
          Filtros
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="filtro in configRelatorio.filtros"
            :key="filtro.key"
            class="space-y-2"
          >
            <span class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
              {{ filtro.label }}
              <span v-if="filtro.required" class="text-red-500">*</span>
            </span>

            <input
              v-if="filtro.type === 'date'"
              v-model="filtros[filtro.key]"
              type="date"
              :required="filtro.required"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              v-else-if="filtro.type === 'text'"
              v-model="filtros[filtro.key]"
              type="text"
              :placeholder="filtro.placeholder || 'Digite...'"
              :required="filtro.required"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div v-else-if="filtro.type === 'boolean'" class="flex items-center pt-2">
              <label :for="`filtro-${filtro.key}`" class="flex items-center gap-2 cursor-pointer">
                <input
                  :id="`filtro-${filtro.key}`"
                  v-model="filtros[filtro.key]"
                  type="checkbox"
                  :true-value="true"
                  :false-value="null"
                  class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Sim</span>
              </label>
            </div>

            <select
              v-else-if="filtro.type === 'select' && filtro.options"
              v-model="filtros[filtro.key]"
              :required="filtro.required"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione...</option>
              <option
                v-for="option in filtro.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <select
              v-else-if="filtro.type === 'select' && filtro.store"
              v-model="filtros[filtro.key]"
              :required="filtro.required"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione...</option>
              <option
                v-for="item in getStoreItems(filtro.store)"
                :key="item.id"
                :value="item.id"
              >
                {{ item.nome || item.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="mt-5 flex justify-end">
          <button
            @click="gerarRelatorio"
            :disabled="isLoading || !podeGerar"
            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:opacity-45 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <ArrowPathIcon v-if="isLoading" class="h-4 w-4 animate-spin" />
            <DocumentArrowDownIcon v-else class="h-4 w-4" />
            <span>{{ isLoading ? 'Gerando...' : 'Gerar Relatório' }}</span>
          </button>
        </div>
      </div>

      <!-- Tabela de Resultados -->
      <div v-if="dadosRelatorio.length > 0" class="glass-card-light dark:glass-card rounded-xl shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        <RelatorioTabela
          :colunas="colunasFormatadas"
          :dados="dadosRelatorio"
          :header="headerRelatorio"
        />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="erro" class="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex items-center gap-3">
          <ExclamationCircleIcon class="h-5 w-5 text-red-500 flex-shrink-0" />
          <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ erro }}</p>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-if="!isLoading && hasSearched && dadosRelatorio.length === 0 && !erro" class="glass-card-light dark:glass-card rounded-xl shadow-sm p-16 text-center">
        <DocumentChartBarIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-base font-bold text-gray-900 dark:text-white">Nenhum registro encontrado</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Ajuste os filtros e gere novamente</p>
      </div>
    </div>

    <!-- Footer Exportação (sticky) -->
    <div
      v-if="dadosRelatorio.length > 0"
      class="shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 py-4 border-t border-white/10 glass-card-light dark:glass-card rounded-b-xl"
    >
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
        {{ dadosRelatorio.length }} registro(s) · Pronto para exportar
      </p>
      <div class="flex gap-2">
        <button
          @click="exportarCSV"
          class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
        >
          <ArrowDownTrayIcon class="h-4 w-4" />
          CSV
        </button>
        <button
          @click="exportarPDF"
          class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 shadow-sm hover:shadow-md"
        >
          <DocumentArrowDownIcon class="h-4 w-4" />
          PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getRelatorioConfig } from '../../utils/configRelatorios'
import { exportToCSV, exportToPDF } from '../../utils/relatorios'
import { useClienteStore } from '../../stores/cliente'
import RelatorioTabela from './RelatorioTabela.vue'
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ExclamationCircleIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  tipo: {
    type: String,
    required: true
  }
})

const configRelatorio = computed(() => getRelatorioConfig(props.tipo))

const filtros = ref({})
const dadosRelatorio = ref([])
const isLoading = ref(false)
const erro = ref(null)
const hasSearched = ref(false)

const clienteStore = useClienteStore()

const getStoreItems = (storeName) => {
  // Mock data - será substituído por stores reais quando disponíveis
  switch (storeName) {
    case 'colaboradores':
      return [
        { id: 1, nome: 'Carlos Mendes' },
        { id: 2, nome: 'Ana Costa' },
        { id: 3, nome: 'Roberto Alves' }
      ]
    case 'clientes':
      return [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    case 'imoveis':
    case 'lancamentos':
    case 'captacoes':
      return [
        { id: 1, nome: 'Apartamento Centro' },
        { id: 2, nome: 'Casa Jardim' }
      ]
    default:
      return []
  }
}

const podeGerar = computed(() => {
  if (!configRelatorio.value) return false
  for (const filtro of configRelatorio.value.filtros) {
    if (filtro.required && (!filtros.value[filtro.key] && filtros.value[filtro.key] !== false)) return false
  }
  return true
})

const gerarRelatorio = async () => {
  if (!configRelatorio.value || !props.tipo) return
  erro.value = null
  isLoading.value = true
  try {
    // Mock: Simular busca de dados
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data baseado no tipo de relatório
    const mockData = gerarMockData(props.tipo)
    dadosRelatorio.value = mockData
  } catch (error) {
    erro.value = error.message || 'Erro ao gerar relatório'
    dadosRelatorio.value = []
  } finally {
    isLoading.value = false
    hasSearched.value = true
  }
}

const gerarMockData = (tipo) => {
  // Gerar dados mock baseados no tipo de relatório
  const baseData = []
  for (let i = 1; i <= 10; i++) {
    const item = {}
    if (configRelatorio.value) {
      configRelatorio.value.colunas.forEach(col => {
        if (col.key.includes('nome')) {
          item[col.key] = `Item ${i}`
        } else if (col.key.includes('valor') || col.key.includes('total') || col.key.includes('receita')) {
          item[col.key] = Math.random() * 100000
        } else if (col.key.includes('quantidade') || col.key.includes('qtd')) {
          item[col.key] = Math.floor(Math.random() * 100)
        } else if (col.key.includes('data') || col.key.includes('periodo')) {
          item[col.key] = new Date().toISOString()
        } else if (col.key.includes('status')) {
          item[col.key] = ['Ativo', 'Inativo', 'Pendente'][Math.floor(Math.random() * 3)]
        } else if (col.key.includes('percentual') || col.key.includes('taxa')) {
          item[col.key] = Math.random() * 100
        } else {
          item[col.key] = `Valor ${i}`
        }
      })
    }
    baseData.push(item)
  }
  return baseData
}

const colunasFormatadas = computed(() => {
  if (!configRelatorio.value) return []
  return configRelatorio.value.colunas.map(col => ({
    key: col.key,
    label: col.label,
    align: col.align || 'left',
    format: col.format
  }))
})

const headerRelatorio = computed(() => {
  const config = configRelatorio.value
  if (!config) return { titulo: '' }
  
  const formatDate = (value) => {
    if (!value) return '—'
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) return '—'
      return date.toLocaleDateString('pt-BR')
    } catch {
      return '—'
    }
  }
  
  let periodo
  if (filtros.value.data_inicio && filtros.value.data_fim) {
    periodo = `${formatDate(filtros.value.data_inicio)} a ${formatDate(filtros.value.data_fim)}`
  } else if (filtros.value.data_inicio) {
    periodo = `A partir de ${formatDate(filtros.value.data_inicio)}`
  } else if (filtros.value.data_fim) {
    periodo = `Até ${formatDate(filtros.value.data_fim)}`
  }
  
  const filtrosAplicados = {}
  config.filtros.forEach(filtro => {
    const valor = filtros.value[filtro.key]
    if (valor !== null && valor !== undefined && valor !== '') {
      if (filtro.type === 'select' && filtro.store) {
        const items = getStoreItems(filtro.store)
        const item = items.find(i => i.id === valor)
        filtrosAplicados[filtro.label] = item ? (item.nome || item.name) : valor
      } else if (filtro.type === 'boolean') {
        filtrosAplicados[filtro.label] = valor ? 'Sim' : 'Não'
      } else {
        filtrosAplicados[filtro.label] = valor
      }
    }
  })
  
  return {
    titulo: config.titulo,
    periodo,
    imobiliaria: clienteStore.clienteNome ? {
      nome: clienteStore.clienteNome
    } : undefined,
    filtros: filtrosAplicados
  }
})

const exportarCSV = () => {
  if (!configRelatorio.value || dadosRelatorio.value.length === 0) return
  exportToCSV(dadosRelatorio.value, props.tipo, colunasFormatadas.value, headerRelatorio.value)
}

const exportarPDF = async () => {
  if (!configRelatorio.value || dadosRelatorio.value.length === 0) return
  await exportToPDF({
    header: headerRelatorio.value,
    colunas: colunasFormatadas.value,
    dados: dadosRelatorio.value,
    filename: props.tipo
  })
}

watch(() => props.tipo, () => {
  filtros.value = {}
  dadosRelatorio.value = []
  erro.value = null
  hasSearched.value = false
})

onMounted(() => {
  // Inicializar filtros vazios
  if (configRelatorio.value) {
    configRelatorio.value.filtros.forEach(filtro => {
      filtros.value[filtro.key] = filtro.type === 'boolean' ? null : ''
    })
  }
})
</script>
