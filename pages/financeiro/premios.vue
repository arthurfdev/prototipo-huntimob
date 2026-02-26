<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Prêmios</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Acompanhe premiações e incentivos dos colaboradores</p>
    </div>

    <!-- Card de Quase Lá -->
    <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl shadow-sm p-6 mb-6 border border-amber-200/50 dark:border-amber-800/30">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
          <TrophyIcon class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quase Lá! 🎯</h2>
          <p class="text-xs text-gray-600 dark:text-gray-400">Colaboradores próximos da premiação</p>
        </div>
      </div>

      <div v-if="quaseLa.length === 0" class="text-center py-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum colaborador próximo da premiação no momento</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="item in quaseLa"
          :key="item.id"
          class="bg-white dark:bg-brand-navy rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserIcon class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ item.nome }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.tipo }}</p>
              <div class="mt-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-600 dark:text-gray-400">Progresso:</span>
                  <span class="font-semibold text-amber-600 dark:text-amber-400">{{ item.progresso }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                  <div
                    class="bg-gradient-to-r from-amber-500 to-orange-600 h-1.5 rounded-full transition-all duration-300"
                    :style="{ width: `${item.progresso}%` }"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ item.descricao }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regras de Premiação -->
    <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-800">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regras de Premiação</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
          <div class="flex items-center gap-2 mb-2">
            <UserGroupIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Corretores</h3>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Corretores que vendem <span class="font-bold text-blue-600 dark:text-blue-400">3 ou mais imóveis</span> no mês entram automaticamente na lista de premiados.
          </p>
          <p class="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Prêmio: +10% em todas as comissões do mês
          </p>
        </div>
        <div class="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
          <div class="flex items-center gap-2 mb-2">
            <BriefcaseIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Gerentes</h3>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Gerentes que batem <span class="font-bold text-purple-600 dark:text-purple-400">R$ 1.500.000</span> de VGV no mês entram automaticamente na lista de premiados.
          </p>
          <p class="text-xs font-semibold text-purple-600 dark:text-purple-400">
            Prêmio: +10% em todas as comissões do mês
          </p>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Período</label>
          <select
            v-model="filters.periodo"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mes_atual">Mês Atual</option>
            <option value="mes_anterior">Mês Anterior</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="ano">Este Ano</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Tipo</label>
          <select
            v-model="filters.tipo"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="corretor">Corretores</option>
            <option value="gerente">Gerentes</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome do colaborador..."
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Lista de Premiados -->
    <div v-else-if="premiadosFiltrados.length === 0" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-12 border border-gray-100 dark:border-gray-800">
      <div class="text-center">
        <TrophyIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum premiado encontrado</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Os colaboradores que atingirem as metas aparecerão aqui automaticamente.
        </p>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="premiado in premiadosFiltrados"
        :key="premiado.id"
        class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrophyIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ premiado.nome }}</h3>
                <span
                  :class="[
                    'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md',
                    premiado.tipo === 'corretor' 
                      ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30'
                      : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30'
                  ]"
                >
                  {{ premiado.tipo === 'corretor' ? 'Corretor' : 'Gerente' }}
                </span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Conquista</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ premiado.conquista }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Bônus</p>
                  <p class="text-sm font-bold text-green-600 dark:text-green-400">+10% nas comissões</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Período</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatPeriodo(premiado.periodo) }}</p>
                </div>
              </div>
              <div v-if="premiado.comissoes_bonus" class="mt-3 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                <p class="text-xs font-semibold text-green-700 dark:text-green-400">
                  Bônus calculado: {{ formatMoney(premiado.comissoes_bonus) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  TrophyIcon,
  UserIcon,
  UserGroupIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline'

const loading = ref(false)
const premiados = ref([])
const quaseLa = ref([])

const filters = ref({
  periodo: 'mes_atual',
  tipo: '',
  search: ''
})

// Mock data - substituir por chamada à API
const loadPremiados = async () => {
  loading.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Premiados
    premiados.value = [
      {
        id: '1',
        nome: 'João Silva',
        tipo: 'corretor',
        conquista: '3 vendas no mês',
        periodo: '2025-01',
        comissoes_bonus: 4500.00
      },
      {
        id: '2',
        nome: 'Maria Santos',
        tipo: 'corretor',
        conquista: '4 vendas no mês',
        periodo: '2025-01',
        comissoes_bonus: 6800.00
      },
      {
        id: '3',
        nome: 'Carlos Oliveira',
        tipo: 'gerente',
        conquista: 'R$ 1.650.000 VGV',
        periodo: '2025-01',
        comissoes_bonus: 12500.00
      }
    ]

    // Quase lá
    quaseLa.value = [
      {
        id: 'q1',
        nome: 'Pedro Costa',
        tipo: 'Corretor',
        progresso: 67,
        descricao: '2 de 3 vendas (falta 1)'
      },
      {
        id: 'q2',
        nome: 'Ana Paula',
        tipo: 'Corretor',
        progresso: 80,
        descricao: '2.4 de 3 vendas (falta 0.6)'
      },
      {
        id: 'q3',
        nome: 'Roberto Lima',
        tipo: 'Gerente',
        progresso: 85,
        descricao: 'R$ 1.275.000 de R$ 1.500.000 VGV'
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar premiados:', error)
  } finally {
    loading.value = false
  }
}

const premiadosFiltrados = computed(() => {
  let filtered = [...premiados.value]

  // Filtro de tipo
  if (filters.value.tipo) {
    filtered = filtered.filter(p => p.tipo === filters.value.tipo)
  }

  // Filtro de busca
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.nome.toLowerCase().includes(search)
    )
  }

  // Filtro de período (já aplicado no mock, mas aqui seria filtrado)
  // TODO: Implementar filtro de período real

  return filtered
})

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatPeriodo = (periodo) => {
  if (!periodo) return '—'
  const [ano, mes] = periodo.split('-')
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return `${monthNames[parseInt(mes) - 1]} de ${ano}`
}

onMounted(() => {
  loadPremiados()
})
</script>
