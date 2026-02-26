<template>
  <CrmModal
    :visible="visible"
    :title="coluna ? 'Editar Coluna' : 'Nova Coluna'"
    width="550px"
    @update:visible="emit('update:visible', $event)"
    @close="onClose"
  >
    <div class="space-y-5">
      <!-- Nome -->
      <div class="space-y-2">
        <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
          Nome da Coluna *
        </label>
        <input
          v-model="form.nome"
          type="text"
          class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Novos Leads, Em Negociação..."
          maxlength="100"
        />
      </div>

      <!-- Cor -->
      <div class="space-y-2">
        <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
          Cor
        </label>
        <div class="flex items-center gap-3">
          <div class="flex gap-2">
            <button
              v-for="cor in coresPredefinidas"
              :key="cor"
              @click="form.cor = cor"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                form.cor === cor ? 'border-blue-500 scale-110' : 'border-transparent'
              ]"
              :style="{ backgroundColor: cor }"
            />
          </div>
          <input
            v-model="form.cor"
            type="color"
            class="w-10 h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <!-- Regra de Distribuição -->
      <div class="space-y-2">
        <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
          Regra de Distribuição
        </label>
        <select
          v-model="form.regra_distribuicao"
          class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="manual">Manual - Sem atribuição automática</option>
          <option value="roleta">Roleta - Sorteia aleatoriamente</option>
          <option value="menor_carga">Menor Carga - Atribui ao que tem menos cards</option>
          <option value="round_robin">Round Robin - Alternado sequencial</option>
        </select>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {{ descricaoDistribuicao }}
        </p>
      </div>

      <!-- Manter Associação ao Mover -->
      <div class="flex items-start gap-3">
        <input
          v-model="form.manter_associacao_ao_mover"
          type="checkbox"
          id="manter-associacao"
          class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <label for="manter-associacao" class="text-sm text-gray-900 dark:text-white">
          <span class="font-semibold">Manter responsável ao mover</span>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Quando um card é movido para esta coluna, mantém o responsável atual.
          </p>
        </label>
      </div>

      <!-- Ações Disponíveis -->
      <div class="space-y-2">
        <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
          Ações Disponíveis
        </label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="acao in acoesOpcoes"
            :key="acao.value"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer border transition-colors',
              form.acoes_disponiveis?.includes(acao.value)
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-50 dark:bg-brand-navy-dark border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500/30'
            ]"
          >
            <input
              type="checkbox"
              :value="acao.value"
              v-model="form.acoes_disponiveis"
              class="sr-only"
            />
            <component :is="acao.icon" class="h-4 w-4" :style="{ color: acao.cor }" />
            <span class="text-sm">{{ acao.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          @click="onClose"
          class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
        >
          Cancelar
        </button>
        <button
          @click="onSubmit"
          :disabled="!isFormValid || isLoading"
          class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Salvando...</span>
          <span v-else>{{ coluna ? 'Salvar' : 'Criar Coluna' }}</span>
        </button>
      </div>
    </template>
  </CrmModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import CrmModal from './CrmModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  coluna: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const isLoading = ref(false)

const coresPredefinidas = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6B7280'  // Gray
]

const acoesOpcoes = [
  { value: 'whatsapp', label: 'WhatsApp', icon: ChatBubbleLeftEllipsisIcon, cor: '#25D366' },
  { value: 'observacao', label: 'Observação', icon: DocumentTextIcon, cor: '#6B7280' },
  { value: 'lembrete', label: 'Lembrete', icon: BellIcon, cor: '#F59E0B' }
]

const form = ref({
  nome: '',
  cor: '#3B82F6',
  regra_distribuicao: 'manual',
  manter_associacao_ao_mover: false,
  acoes_disponiveis: ['whatsapp', 'observacao', 'lembrete'],
  mensagem_notificacao: ''
})

// Reset form quando modal abre
watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.coluna) {
      form.value = {
        nome: props.coluna.nome,
        cor: props.coluna.cor,
        regra_distribuicao: props.coluna.regra_distribuicao || 'manual',
        manter_associacao_ao_mover: props.coluna.manter_associacao_ao_mover || false,
        acoes_disponiveis: [...(props.coluna.acoes_disponiveis || [])],
        mensagem_notificacao: props.coluna.mensagem_notificacao || ''
      }
    } else {
      form.value = {
        nome: '',
        cor: '#3B82F6',
        regra_distribuicao: 'manual',
        manter_associacao_ao_mover: false,
        acoes_disponiveis: ['whatsapp', 'observacao', 'lembrete'],
        mensagem_notificacao: ''
      }
    }
  }
})

const descricaoDistribuicao = computed(() => {
  const descricoes = {
    manual: 'Cards entram sem responsável. Você atribui manualmente.',
    roleta: 'Sistema sorteia aleatoriamente entre colaboradores ativos.',
    menor_carga: 'Atribui ao colaborador com menos cards nesta coluna.',
    round_robin: 'Alternado: A, B, C, A, B, C...'
  }
  return descricoes[form.value.regra_distribuicao || 'manual']
})

const isFormValid = computed(() => {
  return form.value.nome.trim().length > 0
})

const onClose = () => {
  emit('update:visible', false)
}

const onSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    emit('submit', {
      ...form.value,
      nome: form.value.nome.trim(),
      mensagem_notificacao: form.value.mensagem_notificacao?.trim() || null
    })
    onClose()
  } finally {
    isLoading.value = false
  }
}
</script>
