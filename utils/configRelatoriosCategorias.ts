import type { Component } from 'vue'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TrophyIcon,
  HomeIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

export interface CategoriaRelatorio {
  id: string
  label: string
  descricao: string
  icon: Component
  tipos: string[]
}

/**
 * Categorias de relatórios para organização na página.
 * Cada categoria agrupa relatórios relacionados.
 */
export const categoriasRelatorios: CategoriaRelatorio[] = [
  {
    id: 'produtividade',
    label: 'Produtividade',
    descricao: 'Produtividade dos corretores por vendas, atendimentos e CRM',
    icon: ChartBarIcon,
    tipos: [
      'produtividade-corretores',
      'atendimentos-corretores',
      'interacoes-crm-corretores'
    ]
  },
  {
    id: 'imoveis',
    label: 'Imóveis',
    descricao: 'Imóveis em alta e análise de captações',
    icon: BuildingOfficeIcon,
    tipos: [
      'imoveis-alta',
      'captacao-leads',
      'lancamentos-performance'
    ]
  },
  {
    id: 'clientes',
    label: 'Clientes',
    descricao: 'Atividades, perfil e relacionamento com clientes',
    icon: UserGroupIcon,
    tipos: [
      'clientes-atividades',
      'clientes-perfil',
      'clientes-relacionamento'
    ]
  },
  {
    id: 'propostas',
    label: 'Propostas',
    descricao: 'Status, valores e projeções de propostas',
    icon: DocumentTextIcon,
    tipos: [
      'propostas-status',
      'propostas-valores',
      'propostas-projecoes'
    ]
  },
  {
    id: 'aluguel',
    label: 'Aluguel',
    descricao: 'Valores, número de inquilinos e gestão de aluguéis',
    icon: HomeIcon,
    tipos: [
      'aluguel-valores',
      'aluguel-inquilinos',
      'aluguel-contratos'
    ]
  },
  {
    id: 'metas',
    label: 'Metas',
    descricao: 'Metas por equipe e por colaborador',
    icon: TrophyIcon,
    tipos: [
      'metas-equipe',
      'metas-colaborador',
      'metas-performance'
    ]
  },
  {
    id: 'comissoes',
    label: 'Comissões e Prêmios',
    descricao: 'Comissões pagas e prêmios distribuídos',
    icon: BanknotesIcon,
    tipos: [
      'comissoes-pagas',
      'premios-distribuidos',
      'comissoes-projecao'
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    descricao: 'Receitas, despesas, lucro e impostos',
    icon: CurrencyDollarIcon,
    tipos: [
      'financeiro-receitas',
      'financeiro-despesas',
      'financeiro-lucro',
      'financeiro-impostos'
    ]
  }
]
