<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie seus clientes</p>
      </div>
      
      <button 
        @click="openCreateModal" 
        class="btn-gradient px-4 py-2 flex items-center gap-2"
      >
        <UserPlusIcon class="h-5 w-5 stroke-2" />
        <span>Novo Cliente</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome, Email ou CPF..."
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="Interessado">Interessado</option>
            <option value="Comprou">Comprou</option>
            <option value="Desistiu">Desistiu</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objetivo</label>
          <select
            v-model="filters.objetivo"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="Moradia">Moradia</option>
            <option value="Investimento">Investimento</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-white/10">
          <thead class="glass-card-light dark:glass-card bg-white/5 dark:bg-white/5 backdrop-blur-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contato</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Objetivo</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="cliente in paginatedClientes" :key="cliente.id" class="hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ cliente.nome }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ cliente.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': cliente.status === 'Interessado',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': cliente.status === 'Comprou',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': cliente.status === 'Desistiu'
                  }"
                >
                  {{ cliente.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ cliente.contato }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="cliente.objetivo" class="inline-flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <span class="w-2 h-2 rounded-full mr-2" :class="cliente.objetivo === 'Moradia' ? 'bg-blue-500' : 'bg-green-500'"></span>
                  {{ cliente.objetivo }}
                </span>
                <span v-else class="text-gray-400 dark:text-gray-500">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(cliente)" class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors" title="Editar">
                    <PencilIcon class="h-4 w-4 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
                  </button>
                  <button @click="confirmDelete(cliente)" class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors" title="Excluir">
                    <TrashIcon class="h-4 w-4 text-red-500 dark:text-red-400 relative z-10 stroke-2" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="glass-card-light dark:glass-card bg-white/5 dark:bg-white/5 backdrop-blur-sm px-4 py-3 border-t border-white/10 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> até 
            <span class="font-medium">{{ endIndex }}</span> de 
            <span class="font-medium">{{ totalItems }}</span> resultados
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <el-dialog
      v-model="showModal"
      :title="isEditing ? 'Editar Cliente' : 'Novo Cliente'"
      width="800px"
      @close="handleModalClose"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nome"
              type="text"
              required
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CPF <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.cpf"
              type="text"
              required
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contato <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.contato"
              type="text"
              required
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            >
              <option value="Interessado">Interessado</option>
              <option value="Comprou">Comprou</option>
              <option value="Desistiu">Desistiu</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objetivo</label>
            <select
              v-model="form.objetivo"
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
            >
              <option value="">Selecione...</option>
              <option value="Moradia">Moradia</option>
              <option value="Investimento">Investimento</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
          <textarea
            v-model="form.observacao"
            rows="3"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
          ></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 glass-card-light dark:glass-card border border-white/10 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            class="btn-gradient px-4 py-2"
          >
            Salvar
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserPlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

// Dados mockados
const mockClientes = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00', contato: '(11) 99999-9999', status: 'Interessado', objetivo: 'Moradia', observacao: '' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', cpf: '987.654.321-00', contato: '(11) 88888-8888', status: 'Comprou', objetivo: 'Investimento', observacao: '' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', cpf: '111.222.333-44', contato: '(11) 77777-7777', status: 'Interessado', objetivo: 'Moradia', observacao: '' },
  { id: 4, nome: 'Ana Costa', email: 'ana@email.com', cpf: '555.666.777-88', contato: '(11) 66666-6666', status: 'Desistiu', objetivo: '', observacao: '' },
]

const clientes = ref([...mockClientes])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const selectedClient = ref(null)

const filters = reactive({
  search: '',
  status: '',
  objetivo: ''
})

const form = reactive({
  nome: '',
  cpf: '',
  contato: '',
  email: '',
  status: 'Interessado',
  objetivo: '',
  observacao: ''
})

// Paginação
const currentPage = ref(1)
const perPage = 10

const filteredClientes = computed(() => {
  let filtered = [...clientes.value]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.nome.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.cpf.includes(search)
    )
  }
  
  if (filters.status) {
    filtered = filtered.filter(c => c.status === filters.status)
  }
  
  if (filters.objetivo) {
    filtered = filtered.filter(c => c.objetivo === filters.objetivo)
  }
  
  return filtered
})

const totalItems = computed(() => filteredClientes.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, totalItems.value))

const paginatedClientes = computed(() => {
  return filteredClientes.value.slice(startIndex.value, endIndex.value)
})

const handleSearch = () => {
  currentPage.value = 1
}

const openCreateModal = () => {
  isEditing.value = false
  selectedClient.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (cliente) => {
  isEditing.value = true
  selectedClient.value = cliente
  form.nome = cliente.nome
  form.cpf = cliente.cpf
  form.contato = cliente.contato
  form.email = cliente.email
  form.status = cliente.status
  form.objetivo = cliente.objetivo
  form.observacao = cliente.observacao
  showModal.value = true
}

const resetForm = () => {
  form.nome = ''
  form.cpf = ''
  form.contato = ''
  form.email = ''
  form.status = 'Interessado'
  form.objetivo = ''
  form.observacao = ''
}

const handleModalClose = () => {
  resetForm()
  showModal.value = false
}

const handleSubmit = () => {
  if (isEditing.value) {
    const index = clientes.value.findIndex(c => c.id === selectedClient.value.id)
    if (index !== -1) {
      clientes.value[index] = { ...selectedClient.value, ...form }
    }
    ElMessage.success('Cliente atualizado com sucesso')
  } else {
    const newId = Math.max(...clientes.value.map(c => c.id)) + 1
    clientes.value.push({ id: newId, ...form })
    ElMessage.success('Cliente criado com sucesso')
  }
  showModal.value = false
  resetForm()
}

const confirmDelete = (cliente) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja excluir este cliente?',
    'Confirmação',
    {
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      type: 'warning',
    }
  ).then(() => {
    const index = clientes.value.findIndex(c => c.id === cliente.id)
    if (index !== -1) {
      clientes.value.splice(index, 1)
      ElMessage.success('Cliente excluído com sucesso')
    }
  }).catch(() => {})
}
</script>
