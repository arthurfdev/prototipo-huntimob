<template>
  <CrmModal
    :visible="visible"
    :title="tituloModal"
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

      <!-- Formulário WhatsApp -->
      <template v-if="tipo === 'whatsapp'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensagem
          </label>
          <textarea
            v-model="form.mensagem"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Digite a mensagem para enviar via WhatsApp..."
          />
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          A mensagem será aberta no WhatsApp Web/App para você enviar manualmente.
        </p>
      </template>

      <!-- Formulário Observação -->
      <template v-else-if="tipo === 'observacao'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observação
          </label>
          <textarea
            v-model="form.observacao"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Adicione uma observação sobre este cliente..."
          />
        </div>
      </template>
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
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            tipo === 'whatsapp' 
              ? 'text-white bg-green-600 hover:bg-green-700' 
              : 'text-white bg-blue-500 hover:bg-blue-600'
          ]"
        >
          <span v-if="isLoading">Processando...</span>
          <span v-else>{{ botaoLabel }}</span>
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
  },
  tipo: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const isLoading = ref(false)

const form = ref({
  mensagem: '',
  observacao: ''
})

// Reset form quando modal abre
watch(() => props.visible, (visible) => {
  if (visible) {
    form.value = {
      mensagem: '',
      observacao: ''
    }
  }
})

const tituloModal = computed(() => {
  switch (props.tipo) {
    case 'whatsapp': return 'Enviar WhatsApp'
    case 'observacao': return 'Adicionar Observação'
    default: return 'Ação'
  }
})

const botaoLabel = computed(() => {
  switch (props.tipo) {
    case 'whatsapp': return 'Abrir WhatsApp'
    case 'observacao': return 'Salvar'
    default: return 'Confirmar'
  }
})

const isFormValid = computed(() => {
  if (props.tipo === 'whatsapp') {
    return form.value.mensagem.trim().length > 0
  }
  if (props.tipo === 'observacao') {
    return form.value.observacao.trim().length > 0
  }
  return false
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
    if (props.tipo === 'whatsapp') {
      const whatsappUrl = `https://wa.me/${props.card.cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(form.value.mensagem)}`
      window.open(whatsappUrl, '_blank')
    }
    
    emit('submit', {
      tipo: props.tipo,
      mensagem: form.value.mensagem,
      observacao: form.value.observacao
    })
    onClose()
  } finally {
    isLoading.value = false
  }
}
</script>
