// Utilitários para geração de relatórios
// Funções auxiliares de formatação
const formatCurrency = (value) => {
  if (value == null || value === undefined) return '—'
  const num = Number(value)
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

const formatDate = (value) => {
  if (!value) return '—'
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('pt-BR')
  } catch {
    return '—'
  }
}

export interface RelatorioHeader {
  titulo: string
  subtitulo?: string
  periodo?: string
  filtros?: Record<string, any>
  imobiliaria?: {
    nome: string
    cnpj?: string
    endereco?: string
  }
}

export interface RelatorioColuna {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any, item?: any) => string
  width?: number
}

// Helper para extrair valor de objeto aninhado usando notação de ponto
function getNestedValue(obj, path) {
  if (!path.includes('.')) {
    return obj[path]
  }
  
  const keys = path.split('.')
  let value = obj
  for (const key of keys) {
    if (value == null) return undefined
    value = value[key]
  }
  return value
}

export interface RelatorioOptions {
  header?: RelatorioHeader
  colunas: RelatorioColuna[]
  dados: any[]
  totais?: Record<string, number>
  subtotais?: Array<{
    label: string
    valores: Record<string, number>
  }>
  filename?: string
}

// Exportar para CSV
export function exportToCSV(
  dados,
  filename,
  colunas,
  header
) {
  // Criar conteúdo CSV
  const linhas = []
  
  // Cabeçalho do relatório
  if (header) {
    linhas.push(header.titulo)
    if (header.subtitulo) linhas.push(header.subtitulo)
    if (header.periodo) linhas.push(`Período: ${header.periodo}`)
    if (header.imobiliaria) {
      linhas.push(`Imobiliária: ${header.imobiliaria.nome}`)
      if (header.imobiliaria.cnpj) linhas.push(`CNPJ: ${header.imobiliaria.cnpj}`)
    }
    if (header.filtros && Object.keys(header.filtros).length > 0) {
      linhas.push('Filtros aplicados:')
      Object.entries(header.filtros).forEach(([key, value]) => {
        if (value) linhas.push(`  ${key}: ${value}`)
      })
    }
    linhas.push('') // Linha em branco
  }
  
  // Cabeçalho da tabela
  const headers = colunas.map(c => c.label)
  linhas.push(headers.join(','))
  
  // Dados
  dados.forEach(item => {
    const linha = colunas.map(col => {
      let valor = getNestedValue(item, col.key)
      if (col.format) {
        valor = col.format(valor, item)
      } else if (valor == null) {
        valor = ''
      } else {
        valor = String(valor)
        // Escapar vírgulas e aspas
        if (valor.includes(',') || valor.includes('"')) {
          valor = `"${valor.replace(/"/g, '""')}"`
        }
      }
      return valor
    })
    linhas.push(linha.join(','))
  })
  
  // Totais
  if (header && Object.keys(header).length > 0) {
    linhas.push('')
    linhas.push('Totais:')
  }
  
  // Rodapé
  linhas.push('')
  linhas.push(`Gerado em: ${new Date().toLocaleString('pt-BR')}`)
  
  // Criar blob com BOM para Excel
  const conteudo = '\uFEFF' + linhas.join('\n')
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' })
  
  // Download
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Exportar para PDF
export async function exportToPDF(options) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20
  
  // Cabeçalho
  if (options.header) {
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(options.header.titulo, 14, yPos)
    yPos += 8
    
    if (options.header.subtitulo) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(options.header.subtitulo, 14, yPos)
      yPos += 6
    }
    
    if (options.header.periodo) {
      doc.setFontSize(10)
      doc.text(`Período: ${options.header.periodo}`, 14, yPos)
      yPos += 5
    }
    
    if (options.header.imobiliaria) {
      doc.setFontSize(10)
      doc.text(`Imobiliária: ${options.header.imobiliaria.nome}`, 14, yPos)
      yPos += 5
      if (options.header.imobiliaria.cnpj) {
        doc.text(`CNPJ: ${options.header.imobiliaria.cnpj}`, 14, yPos)
        yPos += 5
      }
    }
    
    if (options.header.filtros && Object.keys(options.header.filtros).length > 0) {
      doc.setFontSize(9)
      doc.text('Filtros aplicados:', 14, yPos)
      yPos += 4
      Object.entries(options.header.filtros).forEach(([key, value]) => {
        if (value) {
          doc.text(`  ${key}: ${String(value)}`, 14, yPos)
          yPos += 4
        }
      })
    }
    
    yPos += 5
  }
  
  // Preparar dados da tabela
  const headers = options.colunas.map(c => c.label)
  const rows = options.dados.map(item =>
    options.colunas.map(col => {
      let valor = getNestedValue(item, col.key)
      if (col.format) {
        return col.format(valor, item)
      }
      return valor != null ? String(valor) : ''
    })
  )
  
  // Adicionar totais se houver
  if (options.totais && Object.keys(options.totais).length > 0) {
    const totalRow = []
    options.colunas.forEach(col => {
      if (options.totais && options.totais[col.key] !== undefined) {
        const valor = options.totais[col.key]
        totalRow.push(col.format ? col.format(valor) : String(valor))
      } else {
        totalRow.push('')
      }
    })
    rows.push(totalRow)
  }
  
  // Criar tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: yPos,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [37, 49, 109], // Cor azul HuntImob
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Rodapé em cada página
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
      doc.text(
        `Página ${data.pageNumber}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: 'right' }
      )
    }
  })
  
  // Download
  const filename = options.filename || 'relatorio'
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`)
}
