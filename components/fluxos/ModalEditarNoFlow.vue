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
            class="relative w-full glass-card-light dark:glass-card rounded-xl shadow-2xl overflow-hidden max-w-2xl max-h-[85vh] flex flex-col"
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Editar Nó</h3>
              <button
                @click="handleClose"
                class="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label do Nó <span class="text-red-500">*</span></label>
                <input
                  v-model="nodeLocal.label"
                  type="text"
                  class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                  placeholder="Ex: Início, Mensagem de boas-vindas"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Nó</label>
                <select
                  v-model="nodeType"
                  @change="updateNodeType"
                  class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                >
                  <option value="generic_classify">Classificar Intenção</option>
                  <option value="generic_respond">Responder</option>
                  <option value="generic_extract">Extrair Dados</option>
                  <option value="generic_fetch">Buscar Lista</option>
                  <option value="generic_choice">Escolher Item</option>
                  <option value="generic_clear">Limpar Dados</option>
                  <option value="generic_api_call">Chamada API</option>
                  <option value="END">FIM</option>
                  <option value="noop">Sem Operação</option>
                </select>
              </div>

              <!-- Campos específicos por tipo -->
              <div v-if="nodeType === 'generic_respond'" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
                  <textarea
                    v-model="nodeLocal.config.mensagem"
                    rows="4"
                    class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    placeholder="Digite a mensagem de resposta..."
                  />
                </div>
              </div>

              <div v-if="nodeType === 'generic_extract'" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campo a Extrair</label>
                  <input
                    v-model="nodeLocal.config.campo"
                    type="text"
                    class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    placeholder="Ex: data, telefone, email"
                  />
                </div>
              </div>

              <div v-if="nodeType === 'generic_fetch'" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL da API</label>
                  <input
                    v-model="nodeLocal.config.url"
                    type="text"
                    class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    placeholder="Ex: https://api.exemplo.com/servicos"
                  />
                </div>
              </div>

              <div v-if="nodeType === 'generic_api_call'" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Método HTTP</label>
                  <select
                    v-model="nodeLocal.config.method"
                    class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
                  <input
                    v-model="nodeLocal.config.url"
                    type="text"
                    class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    placeholder="Ex: https://api.exemplo.com/agendamento"
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-brand-navy">
              <button
                v-if="nodeLocal"
                @click="handleDelete"
                class="px-5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Remover
              </button>
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
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  node: {
    type: Object,
    default: null
  },
  nodes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'salvar', 'remover'])

const nodeLocal = ref({
  id: '',
  label: '',
  type: 'generic_respond',
  config: {}
})

const nodeType = computed({
  get: () => nodeLocal.value.type || 'generic_respond',
  set: (val) => {
    nodeLocal.value.type = val
    nodeLocal.value.data = { ...nodeLocal.value.data, type: val }
  }
})

watch(() => props.visible, (visible) => {
  if (visible && props.node) {
    nodeLocal.value = {
      id: props.node.id,
      label: props.node.data?.label || props.node.id,
      type: props.node.type || props.node.data?.type || 'generic_respond',
      config: props.node.data?.config || {}
    }
  }
}, { immediate: true })

watch(() => props.node, (newNode) => {
  if (newNode && props.visible) {
    nodeLocal.value = {
      id: newNode.id,
      label: newNode.data?.label || newNode.id,
      type: newNode.type || newNode.data?.type || 'generic_respond',
      config: newNode.data?.config || {}
    }
  }
}, { deep: true })

const updateNodeType = () => {
  nodeLocal.value.data = { ...nodeLocal.value.data, type: nodeType.value }
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  emit('salvar', {
    ...nodeLocal.value,
    data: {
      label: nodeLocal.value.label,
      type: nodeType.value,
      config: nodeLocal.value.config,
      isEntryPoint: props.node?.data?.isEntryPoint || false
    }
  })
  handleClose()
}

const handleDelete = () => {
  emit('remover', nodeLocal.value.id)
  handleClose()
}
</script>
