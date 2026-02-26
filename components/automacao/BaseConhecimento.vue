<template>
  <div class="bg-white dark:bg-brand-navy rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/50 mb-6 overflow-hidden">
    <!-- Header sutil -->
    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Base de Conhecimento</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Gerencie informações que a IA deve saber sobre seus imóveis</p>
        </div>
        <button
          v-if="conhecimentos.length > 0"
          @click="confirmarLimparTodos"
          class="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-200/50 dark:border-red-800/30"
        >
          Limpar todos
        </button>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">

      <!-- Lista de Conhecimentos -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">Carregando conhecimentos...</p>
      </div>

      <div v-else-if="conhecimentos.length === 0" class="text-center py-10">
        <div class="bg-gray-50/50 dark:bg-gray-900/30 rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center">
            <DocumentTextIcon class="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Nenhum conhecimento adicionado ainda</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Adicione informações sobre imóveis, lançamentos, captações ou sobre a imobiliária.</p>
        </div>
      </div>

      <div v-else class="space-y-3 mb-6">
        <div 
          v-for="(conhecimento, index) in conhecimentos" 
          :key="conhecimento.id || index"
          class="group bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2.5 flex-wrap">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide',
                    getTipoClass(parseConhecimentoTexto(conhecimento.texto_original).tipo)
                  ]"
                >
                  {{ getTipoLabel(parseConhecimentoTexto(conhecimento.texto_original).tipo) }}
                </span>
                <span v-if="parseConhecimentoTexto(conhecimento.texto_original).nome" class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ parseConhecimentoTexto(conhecimento.texto_original).nome }}
                </span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed font-mono">
                {{ conhecimento.texto_original }}
              </p>
              <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 font-medium">
                {{ formatDate(conhecimento.criado_em) }}
              </p>
            </div>
            <button
              @click="deletarConhecimento(conhecimento.id)"
              class="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 flex-shrink-0"
              title="Remover"
            >
              <TrashIcon class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div
        v-if="conhecimentos.length > 0 && paginacao.total_paginas > 1"
        class="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/50 dark:border-gray-800/50"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Página {{ paginacao.pagina }} de {{ paginacao.total_paginas }} ({{ total }} conhecimento{{ total !== 1 ? 's' : '' }})
        </p>
        <div class="flex gap-1.5">
          <button
            @click="irPagina(paginacao.pagina - 1)"
            :disabled="paginacao.pagina <= 1 || isLoading"
            class="px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <button
            @click="irPagina(paginacao.pagina + 1)"
            :disabled="paginacao.pagina >= paginacao.total_paginas || isLoading"
            class="px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>

      <!-- Formulário para Adicionar Conhecimento -->
      <div class="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
        <ConhecimentoIAForm
          :is-loading="isLoading"
          @saved="loadConhecimentos"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  DocumentTextIcon, 
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useConhecimentosStore } from '@/stores/conhecimentos'
import ConhecimentoIAForm from './conhecimento-ia/ConhecimentoIAForm.vue'

const conhecimentosStore = useConhecimentosStore()

const conhecimentos = computed(() => conhecimentosStore.conhecimentos)
const total = computed(() => conhecimentosStore.total)
const paginacao = computed(() => conhecimentosStore.paginacao)
const isLoading = computed(() => conhecimentosStore.isLoading)

function parseConhecimentoTexto(texto) {
  if (!texto?.trim()) return { tipo: 'IMÓVEL', nome: undefined }
  const firstLine = texto.trim().split('\n')[0] || ''
  if (firstLine.startsWith('[IMÓVEL]')) {
    const match = firstLine.match(/Nome:\s*(.+)/i)
    return { tipo: 'IMÓVEL', nome: match ? match[1].trim() : undefined }
  }
  if (firstLine.startsWith('[LANÇAMENTO]')) {
    const match = firstLine.match(/Nome:\s*(.+)/i)
    return { tipo: 'LANÇAMENTO', nome: match ? match[1].trim() : undefined }
  }
  if (firstLine.startsWith('[CAPTAÇÃO]')) {
    const match = firstLine.match(/Nome:\s*(.+)/i)
    return { tipo: 'CAPTAÇÃO', nome: match ? match[1].trim() : undefined }
  }
  if (firstLine.startsWith('[IMOBILIÁRIA]')) {
    return { tipo: 'IMOBILIÁRIA', nome: 'Imobiliária' }
  }
  return { tipo: 'IMÓVEL', nome: undefined }
}

function getTipoLabel(tipo) {
  const map = {
    'IMÓVEL': 'Imóvel',
    'LANÇAMENTO': 'Lançamento',
    'CAPTAÇÃO': 'Captação',
    'IMOBILIÁRIA': 'Imobiliária'
  }
  return map[tipo] || tipo
}

function getTipoClass(tipo) {
  const map = {
    'IMÓVEL': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30',
    'LANÇAMENTO': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30',
    'CAPTAÇÃO': 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/30',
    'IMOBILIÁRIA': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30'
  }
  return map[tipo] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-800/30'
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}

async function loadConhecimentos() {
  try {
    await conhecimentosStore.loadConhecimentos(undefined, { page: paginacao.value.pagina, limit: paginacao.value.limite })
  } catch (error) {
    console.error('Erro ao carregar conhecimentos:', error)
  }
}

async function deletarConhecimento(id) {
  try {
    await ElMessageBox.confirm(
      'Tem certeza que deseja excluir este conhecimento?',
      'Confirmar Exclusão',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    await conhecimentosStore.deletarConhecimento(id)
    await loadConhecimentos()
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Erro ao deletar conhecimento:', err)
    }
  }
}

async function confirmarLimparTodos() {
  try {
    await ElMessageBox.confirm(
      'Tem certeza que deseja excluir TODOS os conhecimentos? Esta ação não pode ser desfeita.',
      'Confirmar Exclusão',
      {
        confirmButtonText: 'Excluir Todos',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    await conhecimentosStore.deletarTodos()
    await loadConhecimentos()
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Erro ao deletar todos os conhecimentos:', err)
    }
  }
}

async function irPagina(page) {
  if (page < 1 || page > paginacao.value.total_paginas) return
  await conhecimentosStore.loadConhecimentos(undefined, { page, limit: paginacao.value.limite })
}

onMounted(() => {
  loadConhecimentos()
})
</script>
