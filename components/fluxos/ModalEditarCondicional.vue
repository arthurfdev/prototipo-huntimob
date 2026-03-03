<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="absolute inset-0 bg-black/60 dark:bg-black/75" />
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="visible"
            class="relative w-full glass-card-light dark:glass-card rounded-xl shadow-2xl overflow-hidden max-w-md flex flex-col"
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Configurar Condição</h3>
              <button
                @click="handleClose"
                class="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variável</label>
                <input
                  v-model="form.variable"
                  type="text"
                  class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                  placeholder="Ex: intent, service, collaborator"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                <input
                  v-model="form.caseValue"
                  type="text"
                  class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                  placeholder="Ex: cancel, confirm, greeting"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nó de Destino (opcional)</label>
                <select
                  v-model="form.targetNode"
                  class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Selecione um nó...</option>
                  <option
                    v-for="node in nodes"
                    :key="node.id"
                    :value="node.id"
                  >
                    {{ node.data?.label || node.id }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-brand-navy">
              <button
                @click="handleSave"
                class="btn-gradient flex-1 px-5 py-2.5 text-sm font-semibold"
              >
                Salvar
              </button>
              <button
                @click="handleClose"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  sourceNodeId: {
    type: String,
    default: ''
  },
  nodes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'save'])

const form = ref({
  variable: '',
  caseValue: '',
  targetNode: ''
})

watch(() => props.visible, (visible) => {
  if (visible) {
    form.value = {
      variable: '',
      caseValue: '',
      targetNode: ''
    }
  }
})

const handleClose = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  emit('save', { ...form.value })
  handleClose()
}
</script>
