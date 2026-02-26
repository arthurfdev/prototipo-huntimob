// Função auxiliar para formatação (será importada de utils/index.ts)
const formatCurrency = (value: any): string => {
  if (value == null || value === undefined) return '—'
  const num = Number(value)
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

const formatDate = (value: any): string => {
  if (!value) return '—'
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('pt-BR')
  } catch {
    return '—'
  }
}

export interface FiltroConfig {
  key: string
  label: string
  type: 'date' | 'select' | 'boolean' | 'text'
  store?: 'colaboradores' | 'clientes' | 'imoveis' | 'lancamentos' | 'captacoes'
  options?: { value: any; label: string }[]
  required?: boolean
  placeholder?: string
}

export interface ColunaConfig {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any, item?: any) => string
  width?: number
}

export interface RelatorioConfig {
  titulo: string
  endpoint: string
  filtros: FiltroConfig[]
  colunas: ColunaConfig[]
}

export const configRelatorios: Record<string, RelatorioConfig> = {
  // ========== Produtividade ==========
  'produtividade-corretores': {
    titulo: 'Produtividade dos Corretores',
    endpoint: 'produtividade-corretores',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'colaborador_id',
        label: 'Corretor',
        type: 'select',
        store: 'colaboradores',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Corretor', align: 'left' },
      { key: 'vendas_realizadas', label: 'Vendas Realizadas', align: 'right' },
      { key: 'atendimentos', label: 'Atendimentos', align: 'right' },
      { key: 'interacoes_crm', label: 'Interações no CRM', align: 'right' },
      { key: 'taxa_conversao', label: 'Taxa de Conversão (%)', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' },
      { key: 'receita_total', label: 'Receita Total', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },
  'atendimentos-corretores': {
    titulo: 'Atendimentos por Corretor',
    endpoint: 'atendimentos-corretores',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'colaborador_id',
        label: 'Corretor',
        type: 'select',
        store: 'colaboradores',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Corretor', align: 'left' },
      { key: 'total_atendimentos', label: 'Total Atendimentos', align: 'right' },
      { key: 'atendimentos_efetivos', label: 'Atendimentos Efetivos', align: 'right' },
      { key: 'taxa_efetividade', label: 'Taxa de Efetividade (%)', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' }
    ]
  },
  'interacoes-crm-corretores': {
    titulo: 'Interações no CRM por Corretor',
    endpoint: 'interacoes-crm-corretores',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'colaborador_id',
        label: 'Corretor',
        type: 'select',
        store: 'colaboradores',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Corretor', align: 'left' },
      { key: 'cards_criados', label: 'Cards Criados', align: 'right' },
      { key: 'cards_movidos', label: 'Cards Movidos', align: 'right' },
      { key: 'acoes_realizadas', label: 'Ações Realizadas', align: 'right' },
      { key: 'lembretes_criados', label: 'Lembretes Criados', align: 'right' }
    ]
  },

  // ========== Imóveis ==========
  'imoveis-alta': {
    titulo: 'Imóveis em Alta',
    endpoint: 'imoveis-alta',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: false
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: false
      },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todos' },
          { value: 'lancamento', label: 'Lançamento' },
          { value: 'captacao_venda', label: 'Captação Venda' },
          { value: 'captacao_aluguel', label: 'Captação Aluguel' }
        ]
      }
    ],
    colunas: [
      { key: 'imovel_nome', label: 'Imóvel', align: 'left' },
      { key: 'tipo', label: 'Tipo', align: 'left' },
      { key: 'visualizacoes', label: 'Visualizações', align: 'right' },
      { key: 'interesses', label: 'Interesses', align: 'right' },
      { key: 'propostas', label: 'Propostas', align: 'right' },
      { key: 'vendas', label: 'Vendas', align: 'right' },
      { key: 'taxa_conversao', label: 'Taxa de Conversão (%)', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' }
    ]
  },
  'captacao-leads': {
    titulo: 'Captação de Leads',
    endpoint: 'captacao-leads',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'origem',
        label: 'Origem',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todas' },
          { value: 'site', label: 'Site' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'indicacao', label: 'Indicação' },
          { value: 'outros', label: 'Outros' }
        ]
      }
    ],
    colunas: [
      { key: 'data', label: 'Data', align: 'center', format: (v) => formatDate(v) },
      { key: 'origem', label: 'Origem', align: 'left' },
      { key: 'total_leads', label: 'Total de Leads', align: 'right' },
      { key: 'leads_qualificados', label: 'Leads Qualificados', align: 'right' },
      { key: 'taxa_qualificacao', label: 'Taxa de Qualificação (%)', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' }
    ]
  },
  'lancamentos-performance': {
    titulo: 'Performance de Lançamentos',
    endpoint: 'lancamentos-performance',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: false
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: false
      },
      {
        key: 'lancamento_id',
        label: 'Lançamento',
        type: 'select',
        store: 'lancamentos',
        required: false
      }
    ],
    colunas: [
      { key: 'lancamento_nome', label: 'Lançamento', align: 'left' },
      { key: 'unidades_total', label: 'Unidades Total', align: 'right' },
      { key: 'unidades_vendidas', label: 'Unidades Vendidas', align: 'right' },
      { key: 'unidades_disponiveis', label: 'Unidades Disponíveis', align: 'right' },
      { key: 'percentual_vendido', label: '% Vendido', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' },
      { key: 'receita_total', label: 'Receita Total', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },

  // ========== Clientes ==========
  'clientes-atividades': {
    titulo: 'Atividades de Clientes',
    endpoint: 'clientes-atividades',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'cliente_id',
        label: 'Cliente',
        type: 'select',
        store: 'clientes',
        required: false
      }
    ],
    colunas: [
      { key: 'cliente_nome', label: 'Cliente', align: 'left' },
      { key: 'visitas', label: 'Visitas', align: 'right' },
      { key: 'propostas', label: 'Propostas', align: 'right' },
      { key: 'negociacoes', label: 'Negociações', align: 'right' },
      { key: 'ultima_atividade', label: 'Última Atividade', align: 'center', format: (v) => formatDate(v) }
    ]
  },
  'clientes-perfil': {
    titulo: 'Perfil de Clientes',
    endpoint: 'clientes-perfil',
    filtros: [
      {
        key: 'faixa_renda',
        label: 'Faixa de Renda',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todas' },
          { value: 'ate_3000', label: 'Até R$ 3.000' },
          { value: '3000_5000', label: 'R$ 3.000 - R$ 5.000' },
          { value: '5000_10000', label: 'R$ 5.000 - R$ 10.000' },
          { value: 'acima_10000', label: 'Acima de R$ 10.000' }
        ]
      },
      {
        key: 'objetivo',
        label: 'Objetivo',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todos' },
          { value: 'compra', label: 'Compra' },
          { value: 'aluguel', label: 'Aluguel' }
        ]
      }
    ],
    colunas: [
      { key: 'cliente_nome', label: 'Cliente', align: 'left' },
      { key: 'email', label: 'Email', align: 'left' },
      { key: 'telefone', label: 'Telefone', align: 'left' },
      { key: 'faixa_renda', label: 'Faixa de Renda', align: 'left' },
      { key: 'objetivo', label: 'Objetivo', align: 'left' },
      { key: 'data_cadastro', label: 'Data de Cadastro', align: 'center', format: (v) => formatDate(v) }
    ]
  },
  'clientes-relacionamento': {
    titulo: 'Relacionamento com Clientes',
    endpoint: 'clientes-relacionamento',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'cliente_nome', label: 'Cliente', align: 'left' },
      { key: 'interacoes_total', label: 'Total de Interações', align: 'right' },
      { key: 'tempo_medio_resposta', label: 'Tempo Médio de Resposta (h)', align: 'right' },
      { key: 'satisfacao', label: 'Satisfação', align: 'center' },
      { key: 'status', label: 'Status', align: 'center' }
    ]
  },

  // ========== Propostas ==========
  'propostas-status': {
    titulo: 'Propostas por Status',
    endpoint: 'propostas-status',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todos' },
          { value: 'pendente', label: 'Pendente' },
          { value: 'aprovada', label: 'Aprovada' },
          { value: 'rejeitada', label: 'Rejeitada' },
          { value: 'cancelada', label: 'Cancelada' }
        ]
      }
    ],
    colunas: [
      { key: 'status', label: 'Status', align: 'left' },
      { key: 'quantidade', label: 'Quantidade', align: 'right' },
      { key: 'valor_total', label: 'Valor Total', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'valor_medio', label: 'Valor Médio', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },
  'propostas-valores': {
    titulo: 'Valores de Propostas',
    endpoint: 'propostas-valores',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'colaborador_id',
        label: 'Corretor',
        type: 'select',
        store: 'colaboradores',
        required: false
      }
    ],
    colunas: [
      { key: 'data', label: 'Data', align: 'center', format: (v) => formatDate(v) },
      { key: 'cliente_nome', label: 'Cliente', align: 'left' },
      { key: 'imovel_nome', label: 'Imóvel', align: 'left' },
      { key: 'valor_proposta', label: 'Valor da Proposta', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'status', label: 'Status', align: 'center' }
    ]
  },
  'propostas-projecoes': {
    titulo: 'Projeções de Propostas',
    endpoint: 'propostas-projecoes',
    filtros: [
      {
        key: 'mes',
        label: 'Mês',
        type: 'date',
        required: false
      }
    ],
    colunas: [
      { key: 'mes', label: 'Mês', align: 'center' },
      { key: 'propostas_previstas', label: 'Propostas Previstas', align: 'right' },
      { key: 'valor_previsto', label: 'Valor Previsto', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'propostas_realizadas', label: 'Propostas Realizadas', align: 'right' },
      { key: 'valor_realizado', label: 'Valor Realizado', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'percentual_atingido', label: '% Atingido', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' }
    ]
  },

  // ========== Aluguel ==========
  'aluguel-valores': {
    titulo: 'Valores de Aluguéis',
    endpoint: 'aluguel-valores',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'imovel_nome', label: 'Imóvel', align: 'left' },
      { key: 'valor_aluguel', label: 'Valor do Aluguel', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'valor_condominio', label: 'Valor do Condomínio', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'valor_total', label: 'Valor Total', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'status', label: 'Status', align: 'center' }
    ]
  },
  'aluguel-inquilinos': {
    titulo: 'Inquilinos',
    endpoint: 'aluguel-inquilinos',
    filtros: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todos' },
          { value: 'ativo', label: 'Ativo' },
          { value: 'encerrado', label: 'Encerrado' }
        ]
      }
    ],
    colunas: [
      { key: 'inquilino_nome', label: 'Inquilino', align: 'left' },
      { key: 'imovel_nome', label: 'Imóvel', align: 'left' },
      { key: 'valor_mensal', label: 'Valor Mensal', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'data_inicio', label: 'Data Início', align: 'center', format: (v) => formatDate(v) },
      { key: 'data_fim', label: 'Data Fim', align: 'center', format: (v) => formatDate(v) },
      { key: 'status', label: 'Status', align: 'center' }
    ]
  },
  'aluguel-contratos': {
    titulo: 'Contratos de Aluguel',
    endpoint: 'aluguel-contratos',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'contrato_numero', label: 'Nº Contrato', align: 'left' },
      { key: 'inquilino_nome', label: 'Inquilino', align: 'left' },
      { key: 'imovel_nome', label: 'Imóvel', align: 'left' },
      { key: 'valor_mensal', label: 'Valor Mensal', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'data_inicio', label: 'Data Início', align: 'center', format: (v) => formatDate(v) },
      { key: 'data_fim', label: 'Data Fim', align: 'center', format: (v) => formatDate(v) }
    ]
  },

  // ========== Metas ==========
  'metas-equipe': {
    titulo: 'Metas por Equipe',
    endpoint: 'metas-equipe',
    filtros: [
      {
        key: 'mes',
        label: 'Mês',
        type: 'date',
        required: false
      },
      {
        key: 'equipe_id',
        label: 'Equipe',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Todas' }
        ]
      }
    ],
    colunas: [
      { key: 'equipe_nome', label: 'Equipe', align: 'left' },
      { key: 'meta_vendas', label: 'Meta de Vendas', align: 'right' },
      { key: 'vendas_realizadas', label: 'Vendas Realizadas', align: 'right' },
      { key: 'percentual_atingido', label: '% Atingido', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' },
      { key: 'meta_vgv', label: 'Meta VGV', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'vgv_realizado', label: 'VGV Realizado', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },
  'metas-colaborador': {
    titulo: 'Metas por Colaborador',
    endpoint: 'metas-colaborador',
    filtros: [
      {
        key: 'mes',
        label: 'Mês',
        type: 'date',
        required: false
      },
      {
        key: 'colaborador_id',
        label: 'Colaborador',
        type: 'select',
        store: 'colaboradores',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Colaborador', align: 'left' },
      { key: 'meta_tipo', label: 'Tipo de Meta', align: 'left' },
      { key: 'meta_valor', label: 'Meta', align: 'right' },
      { key: 'realizado', label: 'Realizado', align: 'right' },
      { key: 'percentual_atingido', label: '% Atingido', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' },
      { key: 'bateu_meta', label: 'Bateu Meta', align: 'center', format: (v) => v ? 'Sim' : 'Não' }
    ]
  },
  'metas-performance': {
    titulo: 'Performance de Metas',
    endpoint: 'metas-performance',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'periodo', label: 'Período', align: 'center' },
      { key: 'total_metas', label: 'Total de Metas', align: 'right' },
      { key: 'metas_atingidas', label: 'Metas Atingidas', align: 'right' },
      { key: 'taxa_sucesso', label: 'Taxa de Sucesso (%)', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' }
    ]
  },

  // ========== Comissões e Prêmios ==========
  'comissoes-pagas': {
    titulo: 'Comissões Pagas',
    endpoint: 'comissoes-pagas',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      },
      {
        key: 'colaborador_id',
        label: 'Colaborador',
        type: 'select',
        store: 'colaboradores',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Colaborador', align: 'left' },
      { key: 'total_comissoes', label: 'Total de Comissões', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'total_pago', label: 'Total Pago', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'data_pagamento', label: 'Data Pagamento', align: 'center', format: (v) => formatDate(v) }
    ]
  },
  'premios-distribuidos': {
    titulo: 'Prêmios Distribuídos',
    endpoint: 'premios-distribuidos',
    filtros: [
      {
        key: 'mes',
        label: 'Mês',
        type: 'date',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Colaborador', align: 'left' },
      { key: 'tipo_premio', label: 'Tipo de Prêmio', align: 'left' },
      { key: 'conquista', label: 'Conquista', align: 'left' },
      { key: 'bonus', label: 'Bônus', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'periodo', label: 'Período', align: 'center' }
    ]
  },
  'comissoes-projecao': {
    titulo: 'Projeção de Comissões',
    endpoint: 'comissoes-projecao',
    filtros: [
      {
        key: 'mes',
        label: 'Mês',
        type: 'date',
        required: false
      }
    ],
    colunas: [
      { key: 'colaborador_nome', label: 'Colaborador', align: 'left' },
      { key: 'comissoes_previstas', label: 'Comissões Previstas', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'comissoes_pagas', label: 'Comissões Pagas', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'comissoes_pendentes', label: 'Comissões Pendentes', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },

  // ========== Financeiro ==========
  'financeiro-receitas': {
    titulo: 'Receitas',
    endpoint: 'financeiro-receitas',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'data', label: 'Data', align: 'center', format: (v) => formatDate(v) },
      { key: 'categoria', label: 'Categoria', align: 'left' },
      { key: 'descricao', label: 'Descrição', align: 'left' },
      { key: 'valor', label: 'Valor', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },
  'financeiro-despesas': {
    titulo: 'Despesas',
    endpoint: 'financeiro-despesas',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'data', label: 'Data', align: 'center', format: (v) => formatDate(v) },
      { key: 'categoria', label: 'Categoria', align: 'left' },
      { key: 'descricao', label: 'Descrição', align: 'left' },
      { key: 'valor', label: 'Valor', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },
  'financeiro-lucro': {
    titulo: 'Lucro',
    endpoint: 'financeiro-lucro',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'periodo', label: 'Período', align: 'center' },
      { key: 'receita_bruta', label: 'Receita Bruta', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'despesas', label: 'Despesas', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'lucro_bruto', label: 'Lucro Bruto', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'impostos', label: 'Impostos', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'lucro_liquido', label: 'Lucro Líquido', align: 'right', format: (v) => formatCurrency(v) }
    ]
  },
  'financeiro-impostos': {
    titulo: 'Impostos',
    endpoint: 'financeiro-impostos',
    filtros: [
      {
        key: 'data_inicio',
        label: 'Data Início',
        type: 'date',
        required: true
      },
      {
        key: 'data_fim',
        label: 'Data Fim',
        type: 'date',
        required: true
      }
    ],
    colunas: [
      { key: 'tipo_imposto', label: 'Tipo de Imposto', align: 'left' },
      { key: 'valor', label: 'Valor', align: 'right', format: (v) => formatCurrency(v) },
      { key: 'percentual', label: 'Percentual (%)', align: 'right', format: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—' },
      { key: 'data_vencimento', label: 'Data de Vencimento', align: 'center', format: (v) => formatDate(v) }
    ]
  }
}

export const getRelatorioConfig = (tipo: string): RelatorioConfig | null => {
  return configRelatorios[tipo] || null
}

export const getTiposRelatorio = (): string[] => {
  return Object.keys(configRelatorios)
}
