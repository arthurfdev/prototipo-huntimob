<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Inquilinos</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie inquilinos e locatários</p>
      </div>
      
      <button 
        @click="openCreateModal" 
        class="btn-gradient px-4 py-2 flex items-center space-x-2"
      >
        <UserPlusIcon class="h-4 w-4 stroke-2" />
        <span>Novo Inquilino</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow p-4 sm:p-6 mb-6 border border-white/10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome, CPF ou Email..."
            class="w-full px-3 py-2 text-sm glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 text-sm glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Em Atraso">Em Atraso</option>
            <option value="Rescindido">Rescindido</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Imóvel</label>
          <input
            v-model="filters.imovel"
            type="text"
            placeholder="Código do imóvel..."
            class="w-full px-3 py-2 text-sm glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Período</label>
          <select
            v-model="filters.periodo"
            class="w-full px-3 py-2 text-sm glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="mes_atual">Este Mês</option>
            <option value="mes_anterior">Mês Anterior</option>
            <option value="ultimos_3_meses">Últimos 3 Meses</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow overflow-hidden border border-white/10">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-white/10">
          <thead class="bg-white/5 backdrop-blur-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Inquilino
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contato
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Imóvel
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Valor Aluguel
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vencimento
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 border-t-transparent"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedInquilinos.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <UserGroupIcon class="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3 stroke-2" />
                <p class="text-gray-500 dark:text-gray-400">Nenhum inquilino encontrado</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="inquilino in paginatedInquilinos"
              :key="inquilino.id"
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ getInicial(inquilino.nome) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ inquilino.nome }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      CPF: {{ inquilino.cpf }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ inquilino.telefone }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ inquilino.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ inquilino.imovel_codigo }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ inquilino.imovel_endereco }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(inquilino.valor_aluguel) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(inquilino.status)"
                >
                  {{ inquilino.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(inquilino.vencimento) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(inquilino)"
                    class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-4 w-4 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
                  </button>
                  <button
                    @click="handleDelete(inquilino.id)"
                    class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Excluir"
                  >
                    <TrashIcon class="h-4 w-4 text-red-500 dark:text-red-400 relative z-10 stroke-2" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="glass-card-light dark:glass-card px-4 py-3 border-t border-white/10 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> até 
            <span class="font-medium">{{ endIndex }}</span> de 
            <span class="font-medium">{{ totalItems }}</span> resultados
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="glass-card-light dark:glass-card px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-white/10 rounded-md hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="glass-card-light dark:glass-card px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-white/10 rounded-md hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
      :title="isEditing ? 'Editar Inquilino' : 'Novo Inquilino'"
      width="900px"
      @close="handleModalClose"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nome"
              type="text"
              required
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
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
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              placeholder="000.000.000-00"
              @input="formatCPF"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RG
            </label>
            <input
              v-model="form.rg"
              type="text"
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              placeholder="00.000.000-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.telefone"
              type="text"
              required
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              placeholder="(00) 00000-0000"
              @input="formatPhone"
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
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data de Nascimento
            </label>
            <input
              v-model="form.data_nascimento"
              type="date"
              class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Informações do Contrato</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imóvel <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.imovel_id"
                class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              >
                <option value="">Selecione um imóvel...</option>
                <option 
                  v-for="imovel in imoveisDisponiveis"
                  :key="imovel.id"
                  :value="imovel.id"
                >
                  {{ imovel.codigo }} - {{ imovel.endereco }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Aluguel (R$) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.valor_aluguel"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
                placeholder="0,00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Início <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.data_inicio"
                type="date"
                required
                class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Vencimento <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.vencimento"
                type="date"
                required
                class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prazo do Contrato (meses)
              </label>
              <input
                v-model.number="form.prazo_meses"
                type="number"
                class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
                placeholder="12"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                v-model="form.status"
                class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Em Atraso">Em Atraso</option>
                <option value="Rescindido">Rescindido</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
          <textarea
            v-model="form.observacao"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            placeholder="Observações sobre o inquilino..."
          ></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 glass-card-light dark:glass-card border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserPlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

// Mock de imóveis disponíveis
const imoveisDisponiveis = ref([
  { id: 1, codigo: 'APT-001', endereco: 'Rua das Flores, 123 - Centro' },
  { id: 2, codigo: 'APT-002', endereco: 'Av. Principal, 456 - Jardim' },
  { id: 3, codigo: 'CASA-003', endereco: 'Rua Nova, 789 - Bairro Novo' },
  { id: 4, codigo: 'APT-004', endereco: 'Rua das Palmeiras, 100 - Centro' },
  { id: 5, codigo: 'CASA-005', endereco: 'Av. dos Bandeirantes, 200 - Jardim América' },
])

// Dados mockados
const mockInquilinos = [
  {
    id: 1,
    nome: 'João Silva',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    data_nascimento: '1985-05-15',
    imovel_id: 1,
    imovel_codigo: 'APT-001',
    imovel_endereco: 'Rua das Flores, 123 - Centro',
    valor_aluguel: 1500.00,
    data_inicio: '2024-01-01',
    vencimento: '2024-04-05',
    prazo_meses: 12,
    status: 'Ativo',
    observacao: ''
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    telefone: '(11) 88888-8888',
    email: 'maria@email.com',
    data_nascimento: '1990-08-20',
    imovel_id: 2,
    imovel_codigo: 'APT-002',
    imovel_endereco: 'Av. Principal, 456 - Jardim',
    valor_aluguel: 2000.00,
    data_inicio: '2024-02-01',
    vencimento: '2024-04-05',
    prazo_meses: 24,
    status: 'Ativo',
    observacao: ''
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    cpf: '111.222.333-44',
    rg: '11.222.333-4',
    telefone: '(11) 77777-7777',
    email: 'pedro@email.com',
    data_nascimento: '1988-03-10',
    imovel_id: 3,
    imovel_codigo: 'CASA-003',
    imovel_endereco: 'Rua Nova, 789 - Bairro Novo',
    valor_aluguel: 2500.00,
    data_inicio: '2023-12-01',
    vencimento: '2024-04-03',
    prazo_meses: 12,
    status: 'Em Atraso',
    observacao: 'Pagamento em atraso há 2 dias'
  },
  {
    id: 4,
    nome: 'Ana Costa',
    cpf: '555.666.777-88',
    rg: '55.666.777-8',
    telefone: '(11) 66666-6666',
    email: 'ana@email.com',
    data_nascimento: '1992-11-25',
    imovel_id: 4,
    imovel_codigo: 'APT-004',
    imovel_endereco: 'Rua das Palmeiras, 100 - Centro',
    valor_aluguel: 1800.00,
    data_inicio: '2023-06-01',
    vencimento: '2024-05-05',
    prazo_meses: 12,
    status: 'Ativo',
    observacao: ''
  },
  {
    id: 5,
    nome: 'Carlos Mendes',
    cpf: '999.888.777-66',
    rg: '99.888.777-6',
    telefone: '(11) 55555-5555',
    email: 'carlos@email.com',
    data_nascimento: '1987-07-18',
    imovel_id: 5,
    imovel_codigo: 'CASA-005',
    imovel_endereco: 'Av. dos Bandeirantes, 200 - Jardim América',
    valor_aluguel: 3000.00,
    data_inicio: '2023-01-01',
    vencimento: '2024-03-05',
    prazo_meses: 12,
    status: 'Rescindido',
    observacao: 'Contrato rescindido em março/2024'
  },
]

const inquilinos = ref([...mockInquilinos])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const selectedInquilino = ref(null)

const filters = reactive({
  search: '',
  status: '',
  imovel: '',
  periodo: ''
})

const form = reactive({
  nome: '',
  cpf: '',
  rg: '',
  telefone: '',
  email: '',
  data_nascimento: '',
  imovel_id: '',
  valor_aluguel: '',
  data_inicio: '',
  vencimento: '',
  prazo_meses: 12,
  status: 'Ativo',
  observacao: ''
})

// Paginação
const currentPage = ref(1)
const perPage = 10

const filteredInquilinos = computed(() => {
  let filtered = [...inquilinos.value]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(i => 
      i.nome.toLowerCase().includes(search) ||
      i.email.toLowerCase().includes(search) ||
      i.cpf.includes(search)
    )
  }
  
  if (filters.status) {
    filtered = filtered.filter(i => i.status === filters.status)
  }
  
  if (filters.imovel) {
    filtered = filtered.filter(i => 
      i.imovel_codigo.toLowerCase().includes(filters.imovel.toLowerCase())
    )
  }
  
  return filtered
})

const totalItems = computed(() => filteredInquilinos.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, totalItems.value))

const paginatedInquilinos = computed(() => {
  return filteredInquilinos.value.slice(startIndex.value, endIndex.value)
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const getInicial = (nome) => {
  if (!nome) return '?'
  return nome.charAt(0).toUpperCase()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Ativo':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'Em Atraso':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'Rescindido':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    case 'Inativo':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

const formatCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    form.cpf = value
  }
}

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      value = value.replace(/(\d{2})(\d)/, '($1) $2')
      value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
    form.telefone = value
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const openCreateModal = () => {
  isEditing.value = false
  selectedInquilino.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (inquilino) => {
  isEditing.value = true
  selectedInquilino.value = inquilino
  form.nome = inquilino.nome
  form.cpf = inquilino.cpf
  form.rg = inquilino.rg || ''
  form.telefone = inquilino.telefone
  form.email = inquilino.email
  form.data_nascimento = inquilino.data_nascimento || ''
  form.imovel_id = inquilino.imovel_id
  form.valor_aluguel = inquilino.valor_aluguel
  form.data_inicio = inquilino.data_inicio
  form.vencimento = inquilino.vencimento
  form.prazo_meses = inquilino.prazo_meses
  form.status = inquilino.status
  form.observacao = inquilino.observacao || ''
  showModal.value = true
}

const resetForm = () => {
  form.nome = ''
  form.cpf = ''
  form.rg = ''
  form.telefone = ''
  form.email = ''
  form.data_nascimento = ''
  form.imovel_id = ''
  form.valor_aluguel = ''
  form.data_inicio = ''
  form.vencimento = ''
  form.prazo_meses = 12
  form.status = 'Ativo'
  form.observacao = ''
}

const handleModalClose = () => {
  resetForm()
  selectedInquilino.value = null
}

const handleSubmit = () => {
  if (!form.nome || !form.cpf || !form.telefone || !form.email || !form.imovel_id || !form.valor_aluguel || !form.data_inicio || !form.vencimento) {
    ElMessage.warning('Preencha todos os campos obrigatórios')
    return
  }

  const imovel = imoveisDisponiveis.value.find(i => i.id === form.imovel_id)
  
  if (isEditing.value) {
    const index = inquilinos.value.findIndex(i => i.id === selectedInquilino.value.id)
    if (index !== -1) {
      inquilinos.value[index] = {
        ...inquilinos.value[index],
        ...form,
        imovel_codigo: imovel?.codigo || '',
        imovel_endereco: imovel?.endereco || ''
      }
      ElMessage.success('Inquilino atualizado com sucesso!')
    }
  } else {
    const novoInquilino = {
      id: inquilinos.value.length + 1,
      ...form,
      imovel_codigo: imovel?.codigo || '',
      imovel_endereco: imovel?.endereco || ''
    }
    inquilinos.value.push(novoInquilino)
    ElMessage.success('Inquilino cadastrado com sucesso!')
  }

  showModal.value = false
  resetForm()
}

const handleDelete = (id) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja excluir este inquilino?',
    'Excluir Inquilino',
    {
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(() => {
    const index = inquilinos.value.findIndex(i => i.id === id)
    if (index !== -1) {
      inquilinos.value.splice(index, 1)
      ElMessage.success('Inquilino excluído com sucesso!')
    }
  }).catch(() => {})
}
</script>
