<template>
  <CrmModal
    :visible="visible"
    title="Criar Lembrete"
    width="500px"
    @update:visible="emit('update:visible', $event)"
    @close="onClose"
  >
    <div class="space-y-4">
      <!-- Info do Cliente -->
      <div v-if="card" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-brand-navy-dark rounded-lg">
        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
          <span class="text-white font-bold text-sm">
            {{ card.cliente.nome.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ card.cliente.nome }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatPhone(card.cliente.telefone) }}
          </p>
        </div>
      </div>

      <!-- Data e Hora -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data
          </label>
          <input
            v-model="form.data"
            type="date"
            :min="minDate"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hora
          </label>
          <input
            v-model="form.hora"
            type="time"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Mensagem -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mensagem do Lembrete
        </label>
        <textarea
          v-model="form.mensagem"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="O que você precisa lembrar?"
        />
      </div>

      <!-- Atalhos de Data -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Atalhos
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="atalho in atalhos"
            :key="atalho.label"
            @click="aplicarAtalho(atalho)"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-navy-dark border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-blue-500 transition-colors"
          >
            {{ atalho.label }}
          </button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          @click="onClose"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="onSubmit"
          :disabled="!isFormValid || isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">Criando...</span>
          <span v-else>Criar Lembrete</span>
        </button>
      </div>
    </template>
  </CrmModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CrmModal from './CrmModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  card: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const isLoading = ref(false)

const form = ref({
  data: '',
  hora: '',
  mensagem: ''
})

// Data mínima (hoje)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Atalhos de data/hora
const atalhos = [
  { label: 'Em 30 min', minutos: 30 },
  { label: 'Em 1 hora', minutos: 60 },
  { label: 'Em 2 horas', minutos: 120 },
  { label: 'Amanhã 9h', custom: () => {
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    amanha.setHours(9, 0, 0, 0)
    return amanha
  }},
  { label: 'Amanhã 14h', custom: () => {
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    amanha.setHours(14, 0, 0, 0)
    return amanha
  }},
  { label: 'Próxima semana', custom: () => {
    const proxSemana = new Date()
    proxSemana.setDate(proxSemana.getDate() + 7)
    proxSemana.setHours(9, 0, 0, 0)
    return proxSemana
  }}
]

const aplicarAtalho = (atalho) => {
  let dataHora

  if (atalho.custom) {
    dataHora = atalho.custom()
  } else {
    dataHora = new Date()
    dataHora.setMinutes(dataHora.getMinutes() + atalho.minutos)
  }

  form.value.data = dataHora.toISOString().split('T')[0]
  form.value.hora = dataHora.toTimeString().slice(0, 5)
}

// Reset form quando modal abre
watch(() => props.visible, (visible) => {
  if (visible) {
    // Padrão: daqui 1 hora
    const daquiUmaHora = new Date()
    daquiUmaHora.setHours(daquiUmaHora.getHours() + 1)
    
    form.value = {
      data: daquiUmaHora.toISOString().split('T')[0],
      hora: daquiUmaHora.toTimeString().slice(0, 5),
      mensagem: ''
    }
  }
})

const isFormValid = computed(() => {
  if (!form.value.data || !form.value.hora || !form.value.mensagem.trim()) {
    return false
  }

  // Verificar se a data/hora é no futuro
  const dataHora = new Date(`${form.value.data}T${form.value.hora}`)
  return dataHora > new Date()
})

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const onClose = () => {
  emit('update:visible', false)
}

const onSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    const dataHoraLembrete = new Date(`${form.value.data}T${form.value.hora}:00`).toISOString()

    emit('submit', {
      data_hora_lembrete: dataHoraLembrete,
      mensagem: form.value.mensagem.trim()
    })

    onClose()
  } finally {
    isLoading.value = false
  }
}
</script>
