<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Participação dos Lucros</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie a distribuição de lucros entre os sócios</p>
    </div>

    <!-- Filtros e Ações -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-white/10">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <label for="periodo" class="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</label>
          <select 
            id="periodo"
            v-model="periodoSelecionado"
            class="px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            @change="buscarDados"
          >
            <option v-for="periodo in periodosDisponiveis" :key="periodo.valor" :value="periodo.valor">
              {{ periodo.texto }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="atualizarLucros" 
            class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 dark:text-gray-900 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowPathIcon class="h-5 w-5 stroke-2" />
            Atualizar Lucros
          </button>
          <button 
            @click="gerarRelatorio" 
            class="btn-gradient px-4 py-2 text-sm font-semibold flex items-center gap-2"
          >
            <DocumentArrowDownIcon class="h-5 w-5 stroke-2" />
            Relatório
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6 animate-pulse border border-white/10">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Cards de Sócios -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        v-for="(socio, index) in socios"
        :key="socio.id"
        class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6 border border-white/10 hover:shadow-lg hover:border-emerald-500/50 transition-all relative"
      >
        <!-- Badge de Status -->
        <div class="absolute top-4 right-4">
          <span class="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            {{ socio.status }}
          </span>
        </div>

        <!-- Conteúdo do Card -->
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="relative flex-shrink-0">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-white/20">
                <img
                  v-if="socio.foto"
                  :src="socio.foto"
                  :alt="socio.nome"
                  class="w-full h-full object-cover"
                  @error="handlePhotoError(socio)"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-white font-semibold text-lg">
                    {{ getInitials(socio.nome) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ socio.cargo }}
              </h3>
              <p class="text-base font-semibold text-gray-900 dark:text-white mt-1 truncate">
                {{ socio.nome }}
              </p>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Percentual de Participação</p>
            <p class="text-2xl font-bold" :class="getSocioValueColor(index)">
              {{ socio.percentual }}%
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor do Lucro</p>
            <p class="text-3xl font-bold" :class="getSocioValueColor(index)">
              {{ formatCurrency(socio.valor) }}
            </p>
          </div>
        </div>

        <!-- Ações do Card -->
        <div class="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
          <button
            @click="verDetalhes(socio)"
            class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
            title="Ver detalhes"
          >
            <EyeIcon class="h-4 w-4 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </button>
          <button
            @click="pagarSocio(socio)"
            class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
            title="Pagar"
          >
            <BanknotesIcon class="h-4 w-4 text-emerald-500 dark:text-emerald-400 relative z-10 stroke-2" />
          </button>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex items-center justify-between glass-card-light dark:glass-card rounded-xl shadow-sm p-4 border border-white/10">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ inicio }} até {{ fim }} de {{ total }} resultados
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="paginaAnterior"
          :disabled="paginaAtual === 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 glass-card-light dark:glass-card border border-white/10 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPaginas"
            :key="page"
            @click="irParaPagina(page)"
            :class="[
              'px-3 py-1 text-sm font-semibold rounded-lg transition-colors',
              paginaAtual === page
                ? 'bg-amber-500 text-gray-900'
                : 'text-gray-700 dark:text-gray-300 glass-card-light dark:glass-card border border-white/10 hover:bg-white/10'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="proximaPagina"
          :disabled="paginaAtual === totalPaginas"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 glass-card-light dark:glass-card border border-white/10 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

const periodoSelecionado = ref(new Date().toISOString().slice(0, 7))
const loading = ref(false)
const paginaAtual = ref(1)
const itensPorPagina = 3

// Função para gerar os últimos 12 meses
const periodosDisponiveis = computed(() => {
  const periodos = []
  const hoje = new Date()
  
  for (let i = 0; i < 12; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const valor = data.toISOString().slice(0, 7)
    const mes = data.toLocaleString('pt-BR', { month: 'long' })
    const ano = data.getFullYear()
    
    periodos.push({
      valor: valor,
      texto: `${mes.charAt(0).toUpperCase() + mes.slice(1)} de ${ano}`
    })
  }
  
  return periodos
})

// Dados dos sócios
const socios = ref([
  {
    id: 1,
    nome: 'Arthur Felipe',
    cargo: 'Sócio Administrativo',
    percentual: 10,
    valor: 39144.90,
    status: 'Pendente',
    foto: '/images/corretores/corretor_arthur.jpg'
  },
  {
    id: 2,
    nome: 'Wesley Alves',
    cargo: 'Sócio Investidor',
    percentual: 30,
    valor: 117435.00,
    status: 'Pendente',
    foto: '/images/corretores/corretor_wesley.jpg'
  },
  {
    id: 3,
    nome: 'Pedro Marques',
    cargo: 'Sócio',
    percentual: 60,
    valor: 234870.00,
    status: 'Pendente',
    foto: '/images/corretores/corretor_pedro.jpg'
  }
])

// Cálculo do lucro total (baseado nos percentuais)
const lucroTotal = computed(() => {
  return socios.value.reduce((acc, socio) => acc + socio.valor, 0)
})

// Paginação
const total = computed(() => socios.value.length)
const totalPaginas = computed(() => Math.ceil(total.value / itensPorPagina))
const inicio = computed(() => (paginaAtual.value - 1) * itensPorPagina + 1)
const fim = computed(() => Math.min(paginaAtual.value * itensPorPagina, total.value))

const paginaAnterior = () => {
  if (paginaAtual.value > 1) {
    paginaAtual.value--
  }
}

const proximaPagina = () => {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value++
  }
}

const irParaPagina = (page) => {
  paginaAtual.value = page
}

// Funções auxiliares
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getSocioValueColor = (index) => {
  const colors = [
    'text-cyan-600 dark:text-cyan-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-blue-600 dark:text-blue-400'
  ]
  return colors[index % colors.length]
}

// Ações
const buscarDados = async () => {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Recalcular valores baseado no período (valores já estão multiplicados por 30)
    const baseValue = 391450.00 // Valor base para cálculo (13048.33 * 30)
    socios.value.forEach(socio => {
      socio.valor = (baseValue * socio.percentual) / 100
    })
    
    ElMessage({
      message: 'Dados atualizados com sucesso!',
      type: 'success'
    })
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    ElMessage({
      message: 'Erro ao carregar dados de participação de lucros',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const atualizarLucros = async () => {
  try {
    loading.value = true
    // TODO: Implementar lógica de atualização
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage({
      message: 'Lucros atualizados com sucesso!',
      type: 'success'
    })
  } catch (error) {
    console.error('Erro ao atualizar lucros:', error)
    ElMessage({
      message: 'Erro ao atualizar lucros',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const gerarRelatorio = () => {
  // TODO: Implementar geração de relatório
  ElMessage({
    message: 'Relatório gerado com sucesso!',
    type: 'success'
  })
}

const getInitials = (nome) => {
  if (!nome) return 'U'
  const names = nome.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return nome[0].toUpperCase()
}

const handlePhotoError = (socio) => {
  socio.foto = null
}

const verDetalhes = (socio) => {
  // TODO: Implementar modal de detalhes
  console.log('Ver detalhes:', socio)
  ElMessage({
    message: `Visualizando detalhes de ${socio.nome}`,
    type: 'info'
  })
}

const pagarSocio = (socio) => {
  // TODO: Implementar lógica de pagamento
  console.log('Pagar sócio:', socio)
  ElMessage({
    message: `Processando pagamento de ${formatCurrency(socio.valor)} para ${socio.nome}`,
    type: 'success'
  })
}

onMounted(() => {
  buscarDados()
})
</script>
