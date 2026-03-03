<template>
  <div class="w-full">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pagadoria</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Integração com ImobTech para gestão de folha de pagamento</p>
    </div>

    <!-- Status da Integração -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
            <LinkIcon class="w-6 h-6 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">ImobTech</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Sistema de gestão de pagadoria</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span 
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="integracaoConectada ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'"
          >
            {{ integracaoConectada ? 'Conectado' : 'Desconectado' }}
          </span>
          <button
            @click="toggleIntegracao"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              integracaoConectada 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'btn-gradient'
            ]"
          >
            {{ integracaoConectada ? 'Desconectar' : 'Conectar' }}
          </button>
        </div>
      </div>

      <div v-if="integracaoConectada" class="mt-4 p-4 glass-card-light dark:glass-card rounded-lg border border-white/10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-xs text-indigo-700 dark:text-indigo-400 mb-1">Última Sincronização</p>
            <p class="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              {{ ultimaSincronizacao || 'Nunca' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-indigo-700 dark:text-indigo-400 mb-1">Próxima Sincronização</p>
            <p class="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              {{ proximaSincronizacao }}
            </p>
          </div>
          <div>
            <p class="text-xs text-indigo-700 dark:text-indigo-400 mb-1">Registros Sincronizados</p>
            <p class="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              {{ totalRegistros }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-white/10 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-white/20',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4 inline-block mr-2 stroke-2" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Atividades -->
    <div v-if="currentTab === 'atividades'" class="space-y-6">
      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Colaboradores</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estatisticas.colaboradores }}</p>
            </div>
            <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
              <UserGroupIcon class="w-6 h-6 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
            </div>
          </div>
        </div>

        <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pagamentos</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estatisticas.pagamentos }}</p>
            </div>
            <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
              <BanknotesIcon class="w-6 h-6 text-emerald-500 dark:text-emerald-400 relative z-10 stroke-2" />
            </div>
          </div>
        </div>

        <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Este Mês</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatCurrency(estatisticas.totalMes) }}</p>
            </div>
            <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon class="w-6 h-6 text-emerald-500 dark:text-emerald-400 relative z-10 stroke-2" />
            </div>
          </div>
        </div>

        <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pendentes</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estatisticas.pendentes }}</p>
            </div>
            <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
              <ClockIcon class="w-6 h-6 text-amber-500 dark:text-amber-400 relative z-10 stroke-2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Atividades Recentes -->
      <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Atividades Recentes</h2>
          <div class="flex items-center gap-3">
            <input
              v-model="filtroAtividades"
              type="text"
              placeholder="Buscar atividade..."
              class="px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white text-sm"
            />
            <select
              v-model="filtroTipoAtividade"
              class="px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Todos os tipos</option>
              <option value="pagamento">Pagamento</option>
              <option value="distribuicao">Distribuição</option>
              <option value="confirmacao">Confirmação</option>
              <option value="erro">Erro</option>
            </select>
          </div>
        </div>

        <div v-if="atividadesFiltradas.length === 0" class="text-center py-12">
          <DocumentTextIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4 stroke-2" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma atividade encontrada</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            As atividades da pagadoria aparecerão aqui
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="atividade in atividadesFiltradas"
            :key="atividade.id"
            class="flex items-start gap-4 p-4 glass-card-light dark:glass-card rounded-lg border border-white/10 hover:shadow-md transition-shadow"
          >
            <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <component :is="getAtividadeIcon(atividade.tipo)" class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {{ atividade.titulo }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ atividade.descricao }}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span class="flex items-center gap-1">
                      <ClockIcon class="w-4 h-4 stroke-2" />
                      {{ formatDateTime(atividade.data) }}
                    </span>
                    <span v-if="atividade.colaborador" class="flex items-center gap-1">
                      <UserIcon class="w-4 h-4 stroke-2" />
                      {{ atividade.colaborador }}
                    </span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p v-if="atividade.valor" class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {{ formatCurrency(atividade.valor) }}
                  </p>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(atividade.status)"
                  >
                    {{ atividade.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="atividadesFiltradas.length > 0" class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {{ atividadesFiltradas.length }} de {{ atividades.length }} atividades
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="paginaAtual = Math.max(1, paginaAtual - 1)"
              :disabled="paginaAtual === 1"
              class="px-3 py-1.5 text-sm glass-card-light dark:glass-card border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
            >
              Anterior
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Página {{ paginaAtual }} de {{ totalPaginas }}
            </span>
            <button
              @click="paginaAtual = Math.min(totalPaginas, paginaAtual + 1)"
              :disabled="paginaAtual === totalPaginas"
              class="px-3 py-1.5 text-sm glass-card-light dark:glass-card border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Técnica -->
    <div v-if="currentTab === 'tecnica'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Configuração -->
        <div class="lg:col-span-1">
          <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-6 sticky top-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Configuração da API</h2>
            
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL da API
                </label>
                <input
                  v-model="configuracao.apiUrl"
                  type="url"
                  placeholder="https://api.imobtech.com.br"
                  class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
                  :disabled="integracaoConectada"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key / Token
                </label>
                <div class="relative">
                  <input
                    v-model="configuracao.apiKey"
                    :type="mostrarApiKey ? 'text' : 'password'"
                    placeholder="Insira sua chave de API"
                    class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                    :disabled="integracaoConectada"
                  />
                  <button
                    @click="mostrarApiKey = !mostrarApiKey"
                    class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    :disabled="integracaoConectada"
                  >
                    <EyeIcon v-if="!mostrarApiKey" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client ID (Opcional)
                </label>
                <input
                  v-model="configuracao.clientId"
                  type="text"
                  placeholder="Client ID"
                  class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
                  :disabled="integracaoConectada"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequência de Sincronização
                </label>
                <select
                  v-model="configuracao.frequencia"
                  class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 text-gray-900 dark:text-white"
                  :disabled="integracaoConectada"
                >
                  <option value="manual">Manual</option>
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                </select>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="salvarConfiguracao"
                  :disabled="integracaoConectada || !configuracao.apiUrl || !configuracao.apiKey"
                  class="btn-gradient w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar Configuração
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conteúdo Técnico -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Sincronização Manual -->
          <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Sincronização Manual</h2>
              <button
                @click="sincronizarManual"
                :disabled="!integracaoConectada || sincronizando"
                class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon :class="['w-5 h-5', sincronizando ? 'animate-spin' : '']" />
                {{ sincronizando ? 'Sincronizando...' : 'Sincronizar Agora' }}
              </button>
            </div>

            <div v-if="!integracaoConectada" class="text-center py-8">
              <LinkSlashIcon class="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Configure e conecte a integração para começar a sincronizar
              </p>
            </div>
          </div>

          <!-- Histórico de Sincronizações -->
          <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Histórico de Sincronizações</h2>

            <div v-if="historicoSincronizacoes.length === 0" class="text-center py-8">
              <ClockIcon class="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Nenhuma sincronização realizada ainda
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="sync in historicoSincronizacoes"
                :key="sync.id"
                class="flex items-center justify-between p-4 glass-card-light dark:glass-card rounded-lg border border-white/10"
              >
                <div class="flex items-center gap-4">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="sync.status === 'sucesso' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : sync.status === 'erro'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-amber-100 dark:bg-amber-900/30'"
                  >
                    <CheckCircleIcon v-if="sync.status === 'sucesso'" class="w-5 h-5 text-green-600 dark:text-green-400" />
                    <XCircleIcon v-else-if="sync.status === 'erro'" class="w-5 h-5 text-red-600 dark:text-red-400" />
                    <ClockIcon v-else class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ sync.tipo }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDateTime(sync.data) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ sync.registros }} registros
                  </p>
                  <p v-if="sync.mensagem" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ sync.mensagem }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Logs de Atividades -->
          <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Logs Técnicos</h2>
              <button
                @click="limparLogs"
                class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Limpar
              </button>
            </div>

            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="(log, index) in logs"
                :key="index"
                class="flex items-start gap-3 p-3 glass-card-light dark:glass-card rounded-lg border border-white/10"
              >
                <div 
                  class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  :class="log.tipo === 'info' ? 'bg-blue-500' : log.tipo === 'erro' ? 'bg-red-500' : 'bg-amber-500'"
                ></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-900 dark:text-white mb-1">
                    {{ log.mensagem }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDateTime(log.data) }}
                  </p>
                </div>
              </div>

              <div v-if="logs.length === 0" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Nenhum log disponível
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  LinkIcon,
  LinkSlashIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckBadgeIcon,
  ArrowRightCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const currentTab = ref('atividades')

const tabs = [
  { id: 'atividades', name: 'Atividades', icon: DocumentTextIcon },
  { id: 'tecnica', name: 'Técnica', icon: LinkIcon }
]

const integracaoConectada = ref(false)
const mostrarApiKey = ref(false)
const sincronizando = ref(false)
const filtroAtividades = ref('')
const filtroTipoAtividade = ref('')
const paginaAtual = ref(1)
const itensPorPagina = 10

const configuracao = reactive({
  apiUrl: '',
  apiKey: '',
  clientId: '',
  frequencia: 'daily'
})

const estatisticas = reactive({
  colaboradores: 0,
  pagamentos: 0,
  totalMes: 0,
  pendentes: 0
})

const atividades = ref([
  {
    id: 1,
    tipo: 'distribuicao',
    titulo: 'Distribuição de Pagamento Confirmada',
    descricao: 'Pagamento de comissão distribuído para Carlos Mendes',
    data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Carlos Mendes',
    valor: 3500.00,
    status: 'Confirmado'
  },
  {
    id: 2,
    tipo: 'pagamento',
    titulo: 'Pagamento Processado',
    descricao: 'Pagamento de salário processado para Ana Costa',
    data: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Ana Costa',
    valor: 4500.00,
    status: 'Processado'
  },
  {
    id: 3,
    tipo: 'confirmacao',
    titulo: 'Confirmação de Pagamento',
    descricao: 'Pagamento confirmado pelo banco para Roberto Alves',
    data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Roberto Alves',
    valor: 2800.00,
    status: 'Confirmado'
  },
  {
    id: 4,
    tipo: 'distribuicao',
    titulo: 'Distribuição de Pagamento Confirmada',
    descricao: 'Pagamento de comissão distribuído para Mariana Silva',
    data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Mariana Silva',
    valor: 5200.00,
    status: 'Confirmado'
  },
  {
    id: 5,
    tipo: 'erro',
    titulo: 'Erro ao Processar Pagamento',
    descricao: 'Falha ao processar pagamento para João Santos - Dados bancários inválidos',
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    colaborador: 'João Santos',
    valor: 0,
    status: 'Erro'
  },
  {
    id: 6,
    tipo: 'pagamento',
    titulo: 'Pagamento Processado',
    descricao: 'Pagamento de salário processado para Pedro Oliveira',
    data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Pedro Oliveira',
    valor: 3800.00,
    status: 'Processado'
  },
  {
    id: 7,
    tipo: 'confirmacao',
    titulo: 'Confirmação de Pagamento',
    descricao: 'Pagamento confirmado pelo banco para Luiza Ferreira',
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Luiza Ferreira',
    valor: 4200.00,
    status: 'Confirmado'
  },
  {
    id: 8,
    tipo: 'distribuicao',
    titulo: 'Distribuição de Pagamento Confirmada',
    descricao: 'Pagamento de comissão distribuído para Rafael Costa',
    data: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    colaborador: 'Rafael Costa',
    valor: 3100.00,
    status: 'Confirmado'
  }
])

const historicoSincronizacoes = ref([])
const logs = ref([])

const atividadesFiltradas = computed(() => {
  let filtered = [...atividades.value]
  
  if (filtroAtividades.value) {
    const search = filtroAtividades.value.toLowerCase()
    filtered = filtered.filter(a => 
      a.titulo.toLowerCase().includes(search) ||
      a.descricao.toLowerCase().includes(search) ||
      (a.colaborador && a.colaborador.toLowerCase().includes(search))
    )
  }
  
  if (filtroTipoAtividade.value) {
    filtered = filtered.filter(a => a.tipo === filtroTipoAtividade.value)
  }
  
  // Paginação
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  
  return filtered.slice(inicio, fim)
})

const totalPaginas = computed(() => {
  let filtered = [...atividades.value]
  
  if (filtroAtividades.value) {
    const search = filtroAtividades.value.toLowerCase()
    filtered = filtered.filter(a => 
      a.titulo.toLowerCase().includes(search) ||
      a.descricao.toLowerCase().includes(search) ||
      (a.colaborador && a.colaborador.toLowerCase().includes(search))
    )
  }
  
  if (filtroTipoAtividade.value) {
    filtered = filtered.filter(a => a.tipo === filtroTipoAtividade.value)
  }
  
  return Math.ceil(filtered.length / itensPorPagina)
})

const ultimaSincronizacao = computed(() => {
  const ultima = historicoSincronizacoes.value.find(s => s.status === 'sucesso')
  return ultima ? formatDateTime(ultima.data) : null
})

const proximaSincronizacao = computed(() => {
  if (configuracao.frequencia === 'manual') return 'Manual'
  
  const agora = new Date()
  const proxima = new Date(agora)
  
  switch (configuracao.frequencia) {
    case 'hourly':
      proxima.setHours(proxima.getHours() + 1)
      break
    case 'daily':
      proxima.setDate(proxima.getDate() + 1)
      proxima.setHours(0, 0, 0, 0)
      break
    case 'weekly':
      proxima.setDate(proxima.getDate() + 7)
      proxima.setHours(0, 0, 0, 0)
      break
  }
  
  return formatDateTime(proxima.toISOString())
})

const totalRegistros = computed(() => {
  return historicoSincronizacoes.value
    .filter(s => s.status === 'sucesso')
    .reduce((sum, s) => sum + s.registros, 0)
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getAtividadeIcon = (tipo) => {
  switch (tipo) {
    case 'pagamento':
      return BanknotesIcon
    case 'distribuicao':
      return ArrowRightCircleIcon
    case 'confirmacao':
      return CheckBadgeIcon
    case 'erro':
      return ExclamationTriangleIcon
    default:
      return DocumentTextIcon
  }
}

const getAtividadeColorClass = (tipo) => {
  switch (tipo) {
    case 'pagamento':
      return 'bg-blue-500'
    case 'distribuicao':
      return 'bg-emerald-500'
    case 'confirmacao':
      return 'bg-green-500'
    case 'erro':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Confirmado':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'Processado':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Erro':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

const toggleIntegracao = () => {
  if (integracaoConectada.value) {
    ElMessageBox.confirm(
      'Tem certeza que deseja desconectar a integração com ImobTech? A sincronização será interrompida.',
      'Desconectar Integração',
      {
        confirmButtonText: 'Desconectar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    ).then(() => {
      integracaoConectada.value = false
      adicionarLog('info', 'Integração desconectada com sucesso')
      ElMessage.success('Integração desconectada')
    }).catch(() => {})
  } else {
    if (!configuracao.apiUrl || !configuracao.apiKey) {
      ElMessage.warning('Configure a URL da API e a API Key antes de conectar')
      return
    }
    
    sincronizando.value = true
    setTimeout(() => {
      integracaoConectada.value = true
      sincronizando.value = false
      adicionarLog('info', 'Integração conectada com sucesso')
      ElMessage.success('Integração conectada com sucesso!')
      
      carregarEstatisticas()
    }, 1500)
  }
}

const salvarConfiguracao = () => {
  if (!configuracao.apiUrl || !configuracao.apiKey) {
    ElMessage.warning('Preencha a URL da API e a API Key')
    return
  }
  
  ElMessage.success('Configuração salva com sucesso!')
  adicionarLog('info', 'Configuração atualizada')
}

const sincronizarManual = async () => {
  if (!integracaoConectada.value) return
  
  sincronizando.value = true
  adicionarLog('info', 'Iniciando sincronização manual...')
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const registros = Math.floor(Math.random() * 50) + 10
    const novaSync = {
      id: historicoSincronizacoes.value.length + 1,
      tipo: 'Sincronização Manual',
      status: 'sucesso',
      data: new Date().toISOString(),
      registros: registros,
      mensagem: `${registros} registros sincronizados com sucesso`
    }
    
    historicoSincronizacoes.value.unshift(novaSync)
    adicionarLog('info', `Sincronização concluída: ${registros} registros processados`)
    
    // Adicionar nova atividade
    const novaAtividade = {
      id: atividades.value.length + 1,
      tipo: 'distribuicao',
      titulo: 'Sincronização Realizada',
      descricao: `${registros} registros sincronizados com sucesso`,
      data: new Date().toISOString(),
      colaborador: null,
      valor: 0,
      status: 'Confirmado'
    }
    atividades.value.unshift(novaAtividade)
    
    carregarEstatisticas()
    ElMessage.success(`Sincronização concluída: ${registros} registros`)
  } catch (error) {
    const novaSync = {
      id: historicoSincronizacoes.value.length + 1,
      tipo: 'Sincronização Manual',
      status: 'erro',
      data: new Date().toISOString(),
      registros: 0,
      mensagem: 'Erro ao sincronizar: ' + error.message
    }
    
    historicoSincronizacoes.value.unshift(novaSync)
    adicionarLog('erro', 'Erro na sincronização: ' + error.message)
    ElMessage.error('Erro ao sincronizar')
  } finally {
    sincronizando.value = false
  }
}

const carregarEstatisticas = () => {
  estatisticas.colaboradores = 25
  estatisticas.pagamentos = atividades.value.filter(a => a.tipo === 'pagamento' || a.tipo === 'distribuicao').length
  estatisticas.totalMes = atividades.value
    .filter(a => a.valor > 0)
    .reduce((sum, a) => sum + a.valor, 0)
  estatisticas.pendentes = atividades.value.filter(a => a.status === 'Erro').length
}

const adicionarLog = (tipo, mensagem) => {
  logs.value.unshift({
    tipo,
    mensagem,
    data: new Date().toISOString()
  })
  
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const limparLogs = () => {
  ElMessageBox.confirm(
    'Tem certeza que deseja limpar todos os logs?',
    'Limpar Logs',
    {
      confirmButtonText: 'Limpar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(() => {
    logs.value = []
    ElMessage.success('Logs limpos')
  }).catch(() => {})
}

// Resetar página quando filtros mudarem
watch([filtroAtividades, filtroTipoAtividade], () => {
  paginaAtual.value = 1
})

onMounted(() => {
  if (integracaoConectada.value) {
    carregarEstatisticas()
  } else {
    carregarEstatisticas() // Carregar mesmo sem conexão para mostrar dados mock
  }
})
</script>
