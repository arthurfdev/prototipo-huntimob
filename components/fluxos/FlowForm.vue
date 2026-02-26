<template>
  <div class="flex flex-col h-full">
    <!-- Header com nome e ativo -->
    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center gap-3 flex-1">
        <button
          @click="$emit('cancel')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </button>
        <div class="flex-1">
          <input
            v-model="name"
            type="text"
            placeholder="Nome do Flow (ex: Agendamento, Resgate inativo)"
            class="w-full px-4 py-2 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="isLoading"
          />
        </div>
      </div>
      <label class="flex items-center gap-2 cursor-pointer ml-4">
        <input
          v-model="active"
          type="checkbox"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          :disabled="isLoading"
        />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Ativo</span>
      </label>
    </div>

    <!-- Editor Visual -->
    <div class="flex-1 flex min-h-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" style="height: calc(100vh - 250px); min-height: 600px;">
      <!-- Sidebar -->
      <div class="w-72 bg-white dark:bg-brand-navy border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4 shrink-0">
        <!-- Paleta de Nós -->
        <NodePalette @drag-start="handlePaletteDragStart" />

        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Entry Point</h4>
          <select
            v-model="entryPointId"
            class="w-full px-2 py-1.5 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded text-xs text-gray-900 dark:text-white"
            :disabled="isLoading || nodes.length === 0"
          >
            <option value="">Selecione o nó inicial</option>
            <option v-for="n in nodes" :key="n.id" :value="n.id">
              {{ n.data?.label || n.id }}
            </option>
          </select>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Nó onde a conversa começa
          </p>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contexto</h4>
            <button
              @click="adicionarCampoContext"
              type="button"
              class="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              :disabled="isLoading"
              title="Adicionar campo"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>
          
          <div v-if="contextFields.length === 0" class="text-xs text-gray-400 dark:text-gray-500 italic mb-2">
            Nenhum campo configurado
          </div>
          
          <div v-for="(field, idx) in contextFields" :key="idx" class="mb-2 space-y-2">
            <div class="flex gap-1">
              <input
                v-model="field.key"
                type="text"
                placeholder="Chave (ex: base_url)"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400"
                :disabled="isLoading"
              />
              <button
                @click="removerCampoContext(idx)"
                type="button"
                class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                :disabled="isLoading"
                title="Remover campo"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <input
              v-model="field.value"
              type="text"
              placeholder="Valor (ex: https://api.exemplo.com)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-400"
              :disabled="isLoading"
            />
          </div>
        </div>
      </div>

      <!-- Canvas Vue Flow -->
      <div class="flex-1 relative bg-gray-50 dark:bg-gray-900" @drop="onDrop" @dragover.prevent @dragenter.prevent>
        <ClientOnly>
          <VueFlow
            v-model="nodes"
            v-model:edges="edges"
            :node-types="nodeTypes"
            :nodes-draggable="true"
            :nodes-connectable="true"
            :elements-selectable="true"
            :fit-view-on-init="true"
            :default-edge-options="{ type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }"
            class="w-full h-full vue-flow-container"
            @node-click="onNodeClick"
            @connect="onConnect"
            @pane-ready="onPaneReady"
          >
            <Background pattern-color="#94a3b8" :gap="16" />
            <Controls />
          </VueFlow>
          <template #fallback>
            <div class="w-full h-full flex items-center justify-center">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="flex gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
      <button
        @click="handleSubmit"
        :disabled="isLoading || !name || nodes.length === 0 || !entryPointId"
        class="px-6 py-3 text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {{ isLoading ? 'Salvando...' : 'Salvar Fluxo' }}
      </button>
      <button
        @click="$emit('cancel')"
        :disabled="isLoading"
        class="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy transition-colors disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>

    <!-- Modal de edição de nó -->
    <ModalEditarNoFlow
      v-if="showModalEditarNo && noEditando"
      v-model:visible="showModalEditarNo"
      :node="noEditando"
      :nodes="nodes"
      @salvar="handleSalvarNo"
      @remover="handleRemoverNo"
    />

    <!-- Modal de criar condição -->
    <ModalEditarCondicional
      v-model:visible="showModalEditarCondicional"
      :source-node-id="conexaoPendente?.source"
      :nodes="nodes"
      @save="handleSalvarCondicional"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { VueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { PlusIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { ElMessage } from 'element-plus'
import FlowNode from './nodes/FlowNode.vue'
import NodeConditional from './nodes/NodeConditional.vue'
import NodePalette from './NodePalette.vue'
import ModalEditarNoFlow from './ModalEditarNoFlow.vue'
import ModalEditarCondicional from './ModalEditarCondicional.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const name = ref('')
const active = ref(true)
const nodes = ref([])
const edges = ref([])
const entryPointId = ref('')
const showModalEditarNo = ref(false)
const noEditando = ref(null)
const contextFields = ref([])
const showModalEditarCondicional = ref(false)
const conexaoPendente = ref(null)
const vueFlowStore = ref(null)

const nodeTypes = {
  default: FlowNode,
  generic_classify: FlowNode,
  generic_respond: FlowNode,
  generic_extract: FlowNode,
  generic_fetch: FlowNode,
  generic_choice: FlowNode,
  generic_clear: FlowNode,
  generic_api_call: FlowNode,
  END: FlowNode,
  noop: FlowNode,
  conditional: NodeConditional
}

// Carregar dados do flow se existir
watch(() => props.modelValue, (flow) => {
  if (flow) {
    name.value = flow.name || ''
    active.value = flow.active !== false
    
    // Converter config para nodes e edges do Vue Flow
    if (flow.config?.nodes) {
      nodes.value = flow.config.nodes.map((node) => ({
        id: node.id || `node-${Date.now()}`,
        type: node.type || 'generic_respond',
        position: node.position || { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        data: {
          label: node.label || node.id || 'Nó',
          type: node.type || 'generic_respond',
          config: node.config || {},
          isEntryPoint: node.id === flow.config.entry_point,
          variable: node.variable,
          caseValue: node.caseValue
        }
      }))
    } else {
      nodes.value = []
    }
    
    if (flow.config?.edges) {
      edges.value = flow.config.edges.map((edge) => ({
        id: edge.id || `edge-${edge.source}-${edge.target}-${Date.now()}`,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed }
      }))
    } else {
      edges.value = []
    }
    
    entryPointId.value = flow.config?.entry_point || ''
    
    if (flow.context_default) {
      contextFields.value = Object.entries(flow.context_default).map(([key, value]) => ({
        key,
        value: String(value)
      }))
    }
  } else {
    // Novo flow
    name.value = ''
    active.value = true
    nodes.value = []
    edges.value = []
    entryPointId.value = ''
    contextFields.value = []
  }
}, { immediate: true })

// Atualizar isEntryPoint nos nós quando entryPointId mudar
watch(entryPointId, (newId) => {
  nodes.value.forEach((n) => {
    if (n.data) {
      n.data.isEntryPoint = n.id === newId
    }
  })
}, { immediate: true })

function adicionarNo(tipo = 'generic_respond', position) {
  const novoId = `node-${Date.now()}`
  
  // Se for condicional, criar nó condicional e abrir modal
  if (tipo === 'conditional') {
    const conditionalNode = {
      id: novoId,
      type: 'conditional',
      position: position || {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100
      },
      data: {
        label: 'Condição',
        type: 'conditional',
        variable: '',
        caseValue: '',
        config: {}
      }
    }
    nodes.value.push(conditionalNode)
    
    nextTick(() => {
      noEditando.value = conditionalNode
      showModalEditarCondicional.value = true
      conexaoPendente.value = {
        source: '',
        target: '',
        sourceHandle: null,
        targetHandle: null
      }
    })
    return
  }
  
  const novoNo = {
    id: novoId,
    type: tipo,
    position: position || {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100
    },
    data: {
      label: `Nó ${nodes.value.length + 1}`,
      type: tipo,
      config: {},
      isEntryPoint: nodes.value.length === 0
    }
  }
  nodes.value.push(novoNo)
  if (nodes.value.length === 1) {
    entryPointId.value = novoId
  }
}

function handlePaletteDragStart() {
  // Não precisa fazer nada aqui
}

function onPaneReady(store) {
  vueFlowStore.value = store
}

function onDrop(event) {
  if (!event.dataTransfer) return
  
  const data = event.dataTransfer.getData('application/vueflow')
  if (!data) return
  
  try {
    const nodeData = JSON.parse(data)
    if (!nodeData.type) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    let position
    if (vueFlowStore.value && typeof vueFlowStore.value.screenToFlowCoordinate === 'function') {
      // Converter coordenadas da tela para coordenadas do canvas
      position = vueFlowStore.value.screenToFlowCoordinate({ x, y })
    } else {
      // Fallback: usar posição relativa simples baseada no viewport
      const viewportX = (x / rect.width) * 2000 - 500
      const viewportY = (y / rect.height) * 1500 - 300
      position = { x: viewportX, y: viewportY }
    }
    
    // Criar nó na posição do drop
    adicionarNo(nodeData.type, position)
  } catch (e) {
    console.error('Erro ao processar drop:', e)
    // Fallback: criar em posição aleatória
    try {
      const nodeData = JSON.parse(data)
      adicionarNo(nodeData.type)
    } catch {
      // Se falhar tudo, criar um nó genérico
      adicionarNo('generic_respond')
    }
  }
}

function onNodeClick(event) {
  // Se for nó condicional, abrir modal de edição de condição
  if (event.node.type === 'conditional') {
    nextTick(() => {
      const nodeAtualizado = nodes.value.find(n => n.id === event.node.id)
      if (nodeAtualizado) {
        noEditando.value = JSON.parse(JSON.stringify(nodeAtualizado))
        showModalEditarCondicional.value = true
        conexaoPendente.value = {
          source: nodeAtualizado.data?.sourceNodeId || '',
          target: '',
          sourceHandle: null,
          targetHandle: null
        }
      }
    })
    return
  }
  
  nextTick(() => {
    const nodeAtualizado = nodes.value.find(n => n.id === event.node.id)
    if (nodeAtualizado) {
      noEditando.value = JSON.parse(JSON.stringify(nodeAtualizado))
    } else {
      noEditando.value = JSON.parse(JSON.stringify(event.node))
    }
    showModalEditarNo.value = true
  })
}

function onConnect(connection) {
  if (connection.source && connection.target) {
    // Verificar se já existe essa conexão
    const conexaoExistente = edges.value.find(
      (e) => 
        e.source === connection.source && 
        e.target === connection.target
    )
    
    if (conexaoExistente) {
      return
    }
    
    // Se conectar para um nó condicional, atualizar sourceNodeId
    const targetNode = nodes.value.find(n => n.id === connection.target)
    if (targetNode?.type === 'conditional') {
      if (targetNode.data) {
        targetNode.data.sourceNodeId = connection.source
        if (targetNode.data.type === 'generic_classify' && !targetNode.data.variable) {
          targetNode.data.variable = 'intent'
        }
      }
    }
    
    // Criar edge
    const newEdge = {
      id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed }
    }
    edges.value.push(newEdge)
  }
}

function handleSalvarNo(nodeData) {
  const index = nodes.value.findIndex(n => n.id === nodeData.id)
  if (index !== -1) {
    nodes.value[index] = {
      ...nodes.value[index],
      ...nodeData,
      data: {
        ...nodes.value[index].data,
        ...nodeData.data
      }
    }
  }
  showModalEditarNo.value = false
  noEditando.value = null
}

function handleRemoverNo(nodeId) {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
  if (entryPointId.value === nodeId) {
    entryPointId.value = nodes.value[0]?.id || ''
  }
  showModalEditarNo.value = false
  noEditando.value = null
}

function handleSalvarCondicional(config) {
  if (noEditando.value && noEditando.value.type === 'conditional') {
    const conditionalNode = nodes.value.find(n => n.id === noEditando.value.id)
    
    if (conditionalNode) {
      conditionalNode.data = {
        ...conditionalNode.data,
        label: `${config.variable} = ${config.caseValue}`,
        variable: config.variable,
        caseValue: config.caseValue,
        targetNodeId: config.targetNode
      }
    }
  }
  showModalEditarCondicional.value = false
  noEditando.value = null
  conexaoPendente.value = null
}

function adicionarCampoContext() {
  contextFields.value.push({ key: '', value: '' })
}

function removerCampoContext(idx) {
  contextFields.value.splice(idx, 1)
}

function handleSubmit() {
  if (!name.value || nodes.value.length === 0 || !entryPointId.value) {
    ElMessage.warning('Preencha todos os campos obrigatórios')
    return
  }

  const contextDefault = {}
  contextFields.value.forEach(field => {
    if (field.key && field.value) {
      contextDefault[field.key] = field.value
    }
  })

  emit('submit', {
    name: name.value,
    active: active.value,
    config: {
      nodes: nodes.value.map(n => ({
        id: n.id,
        type: n.type,
        label: n.data?.label || n.id,
        position: n.position,
        config: n.data?.config || {}
      })),
      edges: edges.value.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target
      })),
      entry_point: entryPointId.value
    },
    context_default: Object.keys(contextDefault).length > 0 ? contextDefault : undefined
  })
}
</script>
