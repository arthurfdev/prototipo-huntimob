<template>
  <!-- Sidebar -->
  <div 
    :class="[
      'fixed left-0 z-30 transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col',
      appStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      appStore.sidebarCollapsed ? 'w-16' : 'w-64'
    ]"
    class="glass-sidebar border-r border-white/10"
    style="top: 0; bottom: 0;"
  >
    <!-- Sidebar Header - Perfil e Notificações -->
    <div class="px-3 py-4 border-b border-white/10">
      <div v-if="appStore.sidebarCollapsed" class="flex flex-col items-center space-y-3">
        <!-- Foto de Perfil -->
        <button
          class="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all hover:ring-2 hover:ring-emerald-400/50 dark:hover:ring-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          title="Perfil"
        >
          <img
            v-if="userPhoto"
            :src="userPhoto"
            :alt="userName || 'Usuário'"
            class="w-full h-full object-cover"
            @error="handlePhotoError"
          />
          <span v-else class="text-white font-semibold text-sm">
            {{ userInitials }}
          </span>
        </button>
        
        <!-- Ícone de Notificações -->
        <button
          @click="activitiesStore.toggleFeed"
          class="relative p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
          title="Atividades"
        >
          <BellIcon class="h-5 w-5 stroke-2" />
          <!-- Badge de contador -->
          <span 
            v-if="activitiesStore.unreadCount > 0"
            class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md"
          >
            {{ activitiesStore.unreadCount > 9 ? '9+' : activitiesStore.unreadCount }}
          </span>
        </button>
        
        <!-- Collapse Button - Abaixo das notificações -->
        <button
          @click="appStore.toggleSidebarCollapse"
          class="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
          title="Expandir sidebar"
        >
          <ChevronRightIcon class="h-4 w-4 stroke-2" />
        </button>
      </div>
      
      <template v-else>
        <div class="flex items-center justify-between mb-4">
          <!-- Foto de Perfil e Nome -->
          <div class="flex items-center space-x-3 min-w-0 flex-1">
            <button
              class="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all hover:ring-2 hover:ring-emerald-400/50 dark:hover:ring-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-shrink-0"
              title="Perfil"
            >
              <img
                v-if="userPhoto"
                :src="userPhoto"
                :alt="userName || 'Usuário'"
                class="w-full h-full object-cover"
                @error="handlePhotoError"
              />
              <span v-else class="text-white font-semibold text-sm">
                {{ userInitials }}
              </span>
            </button>
            <div class="min-w-0 flex-1">
              <h2 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {{ userName || 'Usuário' }}
              </h2>
              <p class="text-xs text-gray-500 dark:text-slate-400 truncate">
                {{ clienteNome }}
              </p>
            </div>
          </div>
          
          <!-- Ícone de Notificações e Collapse -->
          <div class="flex items-center space-x-1 flex-shrink-0">
            <button
              @click="activitiesStore.toggleFeed"
              class="relative p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
              title="Atividades"
            >
              <BellIcon class="h-5 w-5 stroke-2" />
              <!-- Badge de contador -->
              <span 
                v-if="activitiesStore.unreadCount > 0"
                class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md"
              >
                {{ activitiesStore.unreadCount > 9 ? '9+' : activitiesStore.unreadCount }}
              </span>
            </button>
            
            <!-- Collapse Button -->
            <button
              @click="appStore.toggleSidebarCollapse"
              class="p-1.5 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
              title="Recolher sidebar"
            >
              <ChevronLeftIcon class="h-4 w-4 stroke-2" />
            </button>
          </div>
        </div>
        
        <!-- Seletor de Filial -->
        <div class="relative mb-3">
          <select
            v-model="filialSelecionada"
            @change="handleFilialChange"
            class="w-full px-3 py-1.5 text-xs glass-card border border-white/20 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option v-for="filial in filiais" :key="filial.id" :value="filial.id">
              {{ filial.nome }}
            </option>
          </select>
          <ChevronDownIcon class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-slate-400 pointer-events-none stroke-2" />
        </div>
        
        <!-- Close Button (Mobile) -->
        <button
          @click="closeSidebar"
          class="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
        >
          <XMarkIcon class="h-5 w-5 text-gray-600 dark:text-slate-300 stroke-2" />
        </button>
      </template>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden min-h-0">
      <template v-for="item in menuItems" :key="item.id">
        <!-- Menu item sem submenu -->
        <NuxtLink
          v-if="!item.subItems"
          :to="item.route"
          @click="closeSidebar"
          :class="[
            'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            appStore.sidebarCollapsed ? 'justify-center' : '',
            $route.path === item.route
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-gray-700 dark:text-slate-300 hover:bg-white/10'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0 stroke-2" :class="appStore.sidebarCollapsed ? '' : 'mr-3'" />
          <span v-if="!appStore.sidebarCollapsed">{{ item.label }}</span>
        </NuxtLink>

        <!-- Menu item com submenu -->
        <div v-else>
          <!-- Quando minimizado, mostrar apenas o ícone e abrir submenu ao clicar -->
          <template v-if="appStore.sidebarCollapsed">
            <div class="relative">
              <button
                @click="toggleSubmenu(item.id)"
                :class="[
                  'w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isSubmenuActive(item)
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-700 dark:text-gray-100 hover:bg-white/10'
                ]"
                :title="item.label"
              >
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0 stroke-2" />
              </button>
              
              <!-- Submenu flutuante quando minimizado -->
              <div 
                v-if="expandedMenus.includes(item.id)"
                class="absolute left-full top-0 ml-2 w-48 glass-card rounded-lg shadow-xl border border-white/20 py-1 z-[9999]"
                @click.stop
              >
                <NuxtLink
                  v-for="subItem in item.subItems"
                  :key="subItem.id"
                  :to="subItem.route"
                  @click="closeSidebar; expandedMenus = expandedMenus.filter(id => id !== item.id)"
                  :class="[
                    'flex items-center px-4 py-2 text-sm font-medium transition-all duration-200',
                isSubmenuItemActive(subItem)
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-300 hover:bg-white/10'
                  ]"
                >
                  <component :is="subItem.icon" class="h-4 w-4 flex-shrink-0 mr-3 stroke-2" />
                  <span>{{ subItem.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </template>
          
          <!-- Quando expandido, mostrar normalmente -->
          <template v-else>
            <button
              @click="toggleSubmenu(item.id)"
              :class="[
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 justify-between',
                isSubmenuActive(item)
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-300 hover:bg-white/10'
              ]"
            >
              <div class="flex items-center">
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0 mr-3 stroke-2" />
                <span>{{ item.label }}</span>
              </div>
              <ChevronDownIcon 
                :class="[
                  'h-4 w-4 transition-transform duration-200 stroke-2',
                  expandedMenus.includes(item.id) ? 'rotate-180' : ''
                ]"
              />
            </button>

            <!-- Submenu -->
            <div 
              v-if="expandedMenus.includes(item.id)"
              class="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-2"
            >
              <NuxtLink
                v-for="subItem in item.subItems"
                :key="subItem.id"
                :to="subItem.route"
                @click="closeSidebar"
                  :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isSubmenuItemActive(subItem)
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-white/10 hover:text-white'
                ]"
              >
                <component :is="subItem.icon" class="h-4 w-4 flex-shrink-0 mr-3" />
                <span>{{ subItem.label }}</span>
              </NuxtLink>
            </div>
          </template>
        </div>
      </template>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-white/10 space-y-2">
      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        :class="[
          'w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-white/10 rounded-lg transition-colors',
          appStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
      >
        <MoonIcon v-if="appStore.isDarkMode" class="h-5 w-5 flex-shrink-0 stroke-2" :class="appStore.sidebarCollapsed ? '' : 'mr-3'" />
        <SunIcon v-else class="h-5 w-5 flex-shrink-0 stroke-2" :class="appStore.sidebarCollapsed ? '' : 'mr-3'" />
        <span v-if="!appStore.sidebarCollapsed">{{ appStore.isDarkMode ? 'Modo Escuro' : 'Modo Claro' }}</span>
      </button>
      
      <!-- Logout Button -->
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 rounded-lg transition-colors',
          appStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
      >
        <ArrowLeftEndOnRectangleIcon class="h-5 w-5 flex-shrink-0 stroke-2" :class="appStore.sidebarCollapsed ? '' : 'mr-3'" />
        <span v-if="!appStore.sidebarCollapsed">Sair</span>
      </button>
      
    </div>
  </div>

  <!-- Overlay for mobile -->
  <div 
    v-if="appStore.sidebarOpen" 
    @click="closeSidebar"
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
  ></div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/app'
import { useClienteStore } from '../stores/cliente'
import { useActivitiesStore } from '../stores/activities'
import { 
  HomeIcon,
  MoonIcon, 
  SunIcon, 
  ArrowLeftEndOnRectangleIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BellIcon,
  // Automação
  CpuChipIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  CircleStackIcon,
  ChatBubbleLeftRightIcon,
  // Comercial
  ViewColumnsIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserPlusIcon,
  // Gestão
  ChartBarIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  GlobeAltIcon,
  // Imóveis
  BuildingOfficeIcon,
  HomeModernIcon,
  LinkIcon,
  CalculatorIcon,
  MegaphoneIcon,
  // Financeiro
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  GiftIcon,
  BanknotesIcon,
  // Fiscal
  ReceiptRefundIcon,
  DocumentIcon,
  AcademicCapIcon,
  // Aluguéis
  KeyIcon,
  DocumentDuplicateIcon,
  // Rankings
  TrophyIcon
} from '@heroicons/vue/24/outline'

const appStore = useAppStore()
const clienteStore = useClienteStore()
const activitiesStore = useActivitiesStore()
const route = useRoute()

// Dados do usuário
const userPhoto = ref('/images/corretores/corretor_arthur.jpg')
const userName = ref('Arthur')

// Iniciais do usuário para fallback
const userInitials = computed(() => {
  if (!userName.value) return 'U'
  const names = userName.value.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return userName.value[0].toUpperCase()
})

const handlePhotoError = (event) => {
  userPhoto.value = null
}

// Dados do cliente e filial
const clienteNome = computed(() => clienteStore.clienteNome)
const clienteInicial = computed(() => clienteStore.clienteInicial)
const filialSelecionada = computed({
  get: () => clienteStore.filialSelecionada,
  set: (value) => clienteStore.setFilialSelecionada(value)
})
const filiais = computed(() => clienteStore.filiais)

const handleFilialChange = () => {
  // Aqui você pode adicionar lógica adicional quando a filial mudar
  console.log('Filial alterada para:', clienteStore.filialAtual)
}

// Estado dos menus expandidos
const expandedMenus = ref([])

// Estrutura de menu com submenus baseada na imagem
const menuItems = computed(() => {
  return [
    { id: 'inicio', label: 'Início', route: '/', icon: HomeIcon },
    {
      id: 'inteligencia-hunt',
      label: 'Inteligência Hunt',
      icon: CpuChipIcon,
      subItems: [
        { id: 'config-ia', label: 'Configurações IA', route: '/automacao/configuracoes-ia', icon: CpuChipIcon },
        { id: 'whatsapp', label: 'WhatsApp', route: '/automacao/whatsapp', icon: ChatBubbleLeftRightIcon },
        { id: 'distribuicao-leads', label: 'Distribuição dos Leads', route: '/automacao/distribuicao-leads', icon: UserGroupIcon },
        { id: 'fluxos', label: 'Fluxos de Automação', route: '/automacao/fluxos', icon: CircleStackIcon }
      ]
    },
    {
      id: 'comercial',
      label: 'Comercial',
      icon: BriefcaseIcon,
      subItems: [
        { id: 'crm', label: 'CRM', route: '/comercial/crm', icon: ViewColumnsIcon },
        { id: 'clientes', label: 'Clientes', route: '/comercial/clientes', icon: UserPlusIcon },
        { id: 'negociacoes', label: 'Negociações', route: '/comercial/negociacoes', icon: BriefcaseIcon },
        { id: 'propostas', label: 'Propostas', route: '/comercial/propostas', icon: DocumentTextIcon },
        { id: 'leads-livres', label: 'Leads Livres', route: '/comercial/leads-livres', icon: UserPlusIcon }
      ]
    },
    {
      id: 'gestao',
      label: 'Gestão',
      icon: ChartBarIcon,
      subItems: [
        { id: 'metas', label: 'Metas', route: '/gestao/metas', icon: ChartBarIcon },
        { id: 'cadastros', label: 'Colaboradores', route: '/gestao/cadastros', icon: RectangleStackIcon },
        { id: 'permissoes', label: 'Permissões', route: '/gestao/permissoes', icon: ShieldCheckIcon },
        { id: 'relatorios', label: 'Relatórios', route: '/gestao/relatorios', icon: DocumentChartBarIcon },
        { id: 'balanco-mensal', label: 'Balanço Mensal', route: '/gestao/balanco-mensal', icon: ChartBarIcon },
        { id: 'participacao-lucros', label: 'Participação dos Lucros', route: '/gestao/participacao-lucros', icon: CurrencyDollarIcon }
      ]
    },
    {
      id: 'imoveis',
      label: 'Imóveis',
      icon: BuildingOfficeIcon,
      subItems: [
        { id: 'gestao-imoveis', label: 'Gestão', route: '/imoveis/gestao', icon: HomeModernIcon },
        { id: 'anuncios', label: 'Anúncios', route: '/imoveis/anuncios', icon: MegaphoneIcon },
        { id: 'integracoes', label: 'Integrações', route: '/imoveis/integracoes', icon: LinkIcon },
        { id: 'simulador-financiamento', label: 'Simulador de Financiamento', route: '/imoveis/simulador-financiamento', icon: CalculatorIcon }
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: CurrencyDollarIcon,
      subItems: [
        { id: 'gestao-financeira', label: 'Gestão Financeira', route: '/financeiro/gestao', icon: CurrencyDollarIcon },
        { id: 'comissoes', label: 'Comissões', route: '/financeiro/comissoes', icon: ReceiptPercentIcon },
        { id: 'premios', label: 'Prêmios', route: '/financeiro/premios', icon: GiftIcon },
        { id: 'pagadoria', label: 'Pagadoria', route: '/financeiro/pagadoria', icon: BanknotesIcon }
      ]
    },
    {
      id: 'fiscal',
      label: 'Fiscal',
      icon: ReceiptRefundIcon,
      subItems: [
        { id: 'recibos', label: 'Recibos', route: '/fiscal/recibos', icon: ReceiptRefundIcon },
        { id: 'notas-fiscais', label: 'Notas Fiscais', route: '/fiscal/notas-fiscais', icon: DocumentIcon },
        { id: 'certificado', label: 'Certificado', route: '/fiscal/certificado', icon: AcademicCapIcon }
      ]
    },
    {
      id: 'alugueis',
      label: 'Aluguéis',
      icon: KeyIcon,
      subItems: [
        { id: 'inquilinos', label: 'Inquilinos', route: '/alugueis/inquilinos', icon: UserGroupIcon },
        { id: 'contratos', label: 'Contratos', route: '/alugueis/contratos', icon: DocumentDuplicateIcon }
      ]
    },
    { id: 'rankings', label: 'Rankings', route: '/rankings', icon: TrophyIcon },
    { id: 'site', label: 'Site', route: '/gestao/site', icon: GlobeAltIcon }
  ]
})

// Função para alternar submenu
const toggleSubmenu = (menuId) => {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    // Fechar outros submenus abertos quando minimizado
    if (appStore.sidebarCollapsed) {
      expandedMenus.value = [menuId]
    } else {
      expandedMenus.value.push(menuId)
    }
  }
}

// Fechar submenus quando a sidebar for recolhida
watch(() => appStore.sidebarCollapsed, (collapsed) => {
  if (collapsed) {
    expandedMenus.value = []
  }
})

// Verifica se um item específico do submenu está ativo
const isSubmenuItemActive = (subItem) => {
  return route.path === subItem.route || route.path.startsWith(subItem.route + '/')
}

// Verifica se algum item do submenu está ativo
const isSubmenuActive = (item) => {
  if (!item.subItems) return false
  return item.subItems.some(subItem => isSubmenuItemActive(subItem))
}

// Fechar submenus ao clicar fora quando sidebar estiver recolhida
const handleClickOutside = (event) => {
  if (appStore.sidebarCollapsed && expandedMenus.value.length > 0) {
    const sidebar = document.querySelector('.fixed.inset-y-0.left-0')
    const submenu = event.target.closest('.absolute.left-full')
    if (sidebar && !sidebar.contains(event.target) && !submenu) {
      expandedMenus.value = []
    }
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    appStore.theme = 'light'
    document.documentElement.classList.remove('dark')
  } else {
    appStore.theme = 'dark'
    document.documentElement.classList.add('dark')
  }

  // Estado da sidebar
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  if (savedSidebarState !== null) {
    appStore.sidebarCollapsed = JSON.parse(savedSidebarState)
  }

  // Carregar dados do cliente do localStorage
  const savedClienteNome = localStorage.getItem('clienteNome')
  if (savedClienteNome) {
    clienteStore.setClienteNome(savedClienteNome)
  }

  const savedFilial = localStorage.getItem('filialSelecionada')
  if (savedFilial) {
    clienteStore.setFilialSelecionada(savedFilial)
  }

  // Adicionar listener para fechar submenus ao clicar fora
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleTheme = () => {
  appStore.toggleTheme()
  document.documentElement.classList.toggle('dark', appStore.isDarkMode)
}

const closeSidebar = () => {
  appStore.sidebarOpen = false
}

const handleLogout = () => {
  // TODO: Implementar logout
  console.log('Logout')
}
</script>
