<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Simulador de Financiamento</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Simule condições de financiamento imobiliário</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulário de Entrada -->
      <div class="lg:col-span-1">
        <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6 sticky top-6">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Dados do Financiamento</h2>
          
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Imóvel (R$)
              </label>
              <input
                v-model.number="formulario.valorImovel"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                @input="calcularFinanciamento"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor de Entrada (R$)
              </label>
              <input
                v-model.number="formulario.entrada"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                @input="calcularFinanciamento"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ percentualEntrada }}% do valor do imóvel
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Taxa de Juros Anual (%)
              </label>
              <input
                v-model.number="formulario.taxaJuros"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0,00"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                @input="calcularFinanciamento"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prazo (anos)
              </label>
              <input
                v-model.number="formulario.prazo"
                type="number"
                step="1"
                min="1"
                max="35"
                placeholder="30"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                @input="calcularFinanciamento"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formulario.prazo * 12 }} meses
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sistema de Amortização
              </label>
              <select
                v-model="formulario.sistema"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                @change="calcularFinanciamento"
              >
                <option value="price">Sistema Price (Parcelas Fixas)</option>
                <option value="sac">SAC (Amortização Constante)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div class="lg:col-span-2">
        <div v-if="!resultadoCalculado" class="glass-card-light dark:glass-card rounded-xl shadow-sm p-12 text-center">
          <CalculatorIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preencha os dados para simular</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Informe o valor do imóvel, entrada, taxa de juros e prazo para calcular o financiamento
          </p>
        </div>

        <div v-else class="space-y-6">
          <!-- Resumo -->
          <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Resumo do Financiamento</h2>
              <button
                @click="gerarPDF"
                class="btn-gradient px-4 py-2 flex items-center gap-2"
              >
                <DocumentArrowDownIcon class="w-5 h-5" />
                Baixar PDF
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p class="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">Valor Financiado</p>
                <p class="text-xl font-bold text-blue-900 dark:text-blue-100">{{ formatCurrency(resultado.valorFinanciado) }}</p>
              </div>

              <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p class="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">Parcela Mensal</p>
                <p class="text-xl font-bold text-emerald-900 dark:text-emerald-100">{{ formatCurrency(resultado.parcelaMensal) }}</p>
              </div>

              <div class="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p class="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Total de Juros</p>
                <p class="text-xl font-bold text-amber-900 dark:text-amber-100">{{ formatCurrency(resultado.totalJuros) }}</p>
              </div>

              <div class="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
                <p class="text-xs font-medium text-violet-700 dark:text-violet-400 uppercase tracking-wide mb-1">Total a Pagar</p>
                <p class="text-xl font-bold text-violet-900 dark:text-violet-100">{{ formatCurrency(resultado.totalPagar) }}</p>
              </div>
            </div>

            <!-- Detalhes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor do Imóvel</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(formulario.valorImovel) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor de Entrada</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(formulario.entrada) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxa de Juros</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formulario.taxaJuros }}% a.a. ({{ taxaJurosMensal.toFixed(4) }}% a.m.)</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Prazo</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formulario.prazo }} anos ({{ numeroParcelas }} meses)</p>
              </div>
            </div>
          </div>

          <!-- Tabela de Amortização (Primeiras e Últimas Parcelas) -->
          <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tabela de Amortização</h3>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Parcela</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Valor da Parcela</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amortização</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Juros</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Saldo Devedor</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Primeiras 5 parcelas -->
                  <tr
                    v-for="parcela in primeirasParcelas"
                    :key="parcela.numero"
                    class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ parcela.numero }}</td>
                    <td class="py-3 px-4 text-right text-gray-900 dark:text-white">{{ formatCurrency(parcela.parcela) }}</td>
                    <td class="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{{ formatCurrency(parcela.amortizacao) }}</td>
                    <td class="py-3 px-4 text-right text-red-600 dark:text-red-400">{{ formatCurrency(parcela.juros) }}</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(parcela.saldoDevedor) }}</td>
                  </tr>
                  
                  <!-- Separador -->
                  <tr v-if="numeroParcelas > 10" class="border-b-2 border-gray-300 dark:border-gray-600">
                    <td colspan="5" class="py-2 px-4 text-center text-xs text-gray-500 dark:text-gray-400 italic">
                      ... {{ numeroParcelas - 10 }} parcelas intermediárias ...
                    </td>
                  </tr>
                  
                  <!-- Últimas 5 parcelas -->
                  <tr
                    v-for="parcela in ultimasParcelas"
                    :key="parcela.numero"
                    class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ parcela.numero }}</td>
                    <td class="py-3 px-4 text-right text-gray-900 dark:text-white">{{ formatCurrency(parcela.parcela) }}</td>
                    <td class="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{{ formatCurrency(parcela.amortizacao) }}</td>
                    <td class="py-3 px-4 text-right text-red-600 dark:text-red-400">{{ formatCurrency(parcela.juros) }}</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(parcela.saldoDevedor) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  CalculatorIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'
import { useClienteStore } from '~/stores/cliente'

const clienteStore = useClienteStore()

const formulario = reactive({
  valorImovel: 500000,
  entrada: 100000,
  taxaJuros: 10.5,
  prazo: 30,
  sistema: 'price'
})

const resultado = reactive({
  valorFinanciado: 0,
  parcelaMensal: 0,
  totalJuros: 0,
  totalPagar: 0,
  tabelaAmortizacao: []
})

const resultadoCalculado = ref(false)

const percentualEntrada = computed(() => {
  if (!formulario.valorImovel || formulario.valorImovel === 0) return 0
  return ((formulario.entrada / formulario.valorImovel) * 100).toFixed(2)
})

const numeroParcelas = computed(() => {
  return formulario.prazo * 12
})

const taxaJurosMensal = computed(() => {
  return formulario.taxaJuros / 12 / 100
})

const primeirasParcelas = computed(() => {
  return resultado.tabelaAmortizacao.slice(0, 5)
})

const ultimasParcelas = computed(() => {
  if (resultado.tabelaAmortizacao.length <= 10) return []
  return resultado.tabelaAmortizacao.slice(-5)
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const calcularFinanciamento = () => {
  if (!formulario.valorImovel || formulario.valorImovel <= 0) {
    resultadoCalculado.value = false
    return
  }

  if (formulario.entrada >= formulario.valorImovel) {
    ElMessage.warning('O valor de entrada não pode ser maior ou igual ao valor do imóvel')
    resultadoCalculado.value = false
    return
  }

  const valorFinanciado = formulario.valorImovel - formulario.entrada
  const taxaMensal = taxaJurosMensal.value
  const numParcelas = numeroParcelas.value

  let parcelaMensal = 0
  const tabelaAmortizacao = []

  if (formulario.sistema === 'price') {
    // Sistema Price - Parcelas Fixas
    if (taxaMensal > 0) {
      parcelaMensal = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, numParcelas)) / (Math.pow(1 + taxaMensal, numParcelas) - 1)
    } else {
      parcelaMensal = valorFinanciado / numParcelas
    }

    let saldoDevedor = valorFinanciado

    for (let i = 1; i <= numParcelas; i++) {
      const juros = saldoDevedor * taxaMensal
      const amortizacao = parcelaMensal - juros
      saldoDevedor -= amortizacao

      if (saldoDevedor < 0.01) saldoDevedor = 0

      tabelaAmortizacao.push({
        numero: i,
        parcela: parcelaMensal,
        amortizacao: amortizacao,
        juros: juros,
        saldoDevedor: saldoDevedor
      })
    }
  } else {
    // Sistema SAC - Amortização Constante
    const amortizacaoConstante = valorFinanciado / numParcelas
    let saldoDevedor = valorFinanciado

    for (let i = 1; i <= numParcelas; i++) {
      const juros = saldoDevedor * taxaMensal
      const parcela = amortizacaoConstante + juros
      saldoDevedor -= amortizacaoConstante

      if (saldoDevedor < 0.01) saldoDevedor = 0

      tabelaAmortizacao.push({
        numero: i,
        parcela: parcela,
        amortizacao: amortizacaoConstante,
        juros: juros,
        saldoDevedor: saldoDevedor
      })
    }

    // Calcular média das parcelas para exibição
    parcelaMensal = tabelaAmortizacao.reduce((sum, p) => sum + p.parcela, 0) / numParcelas
  }

  const totalPagar = tabelaAmortizacao.reduce((sum, p) => sum + p.parcela, 0)
  const totalJuros = totalPagar - valorFinanciado

  resultado.valorFinanciado = valorFinanciado
  resultado.parcelaMensal = parcelaMensal
  resultado.totalJuros = totalJuros
  resultado.totalPagar = totalPagar
  resultado.tabelaAmortizacao = tabelaAmortizacao

  resultadoCalculado.value = true
}

const gerarPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF()

    // Cabeçalho
    doc.setFontSize(20)
    doc.setTextColor(37, 49, 109) // #25316d
    doc.text('Simulação de Financiamento', 14, 20)

    // Informações da Imobiliária
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(clienteStore.clienteNome || 'HuntImob', 14, 30)
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 35)

    // Resumo
    doc.setFontSize(14)
    doc.setTextColor(37, 49, 109)
    doc.text('Resumo do Financiamento', 14, 45)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    let yPos = 52

    const resumoData = [
      ['Valor do Imóvel', formatCurrency(formulario.valorImovel)],
      ['Valor de Entrada', formatCurrency(formulario.entrada)],
      ['Valor Financiado', formatCurrency(resultado.valorFinanciado)],
      ['Taxa de Juros', `${formulario.taxaJuros}% a.a. (${taxaJurosMensal.toFixed(4)}% a.m.)`],
      ['Prazo', `${formulario.prazo} anos (${numeroParcelas} meses)`],
      ['Sistema', formulario.sistema === 'price' ? 'Sistema Price' : 'SAC'],
      ['Parcela Mensal', formatCurrency(resultado.parcelaMensal)],
      ['Total de Juros', formatCurrency(resultado.totalJuros)],
      ['Total a Pagar', formatCurrency(resultado.totalPagar)]
    ]

    resumoData.forEach(([label, value]) => {
      doc.text(`${label}:`, 14, yPos)
      doc.text(value, 80, yPos)
      yPos += 6
    })

    // Tabela de Amortização (primeiras 20 parcelas)
    yPos += 5
    doc.setFontSize(14)
    doc.setTextColor(37, 49, 109)
    doc.text('Tabela de Amortização', 14, yPos)
    yPos += 5

    const parcelasParaPDF = resultado.tabelaAmortizacao.slice(0, 20)

    autoTable(doc, {
      startY: yPos,
      head: [['Parcela', 'Valor da Parcela', 'Amortização', 'Juros', 'Saldo Devedor']],
      body: parcelasParaPDF.map(p => [
        p.numero.toString(),
        formatCurrency(p.parcela),
        formatCurrency(p.amortizacao),
        formatCurrency(p.juros),
        formatCurrency(p.saldoDevedor)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [37, 49, 109], textColor: 255 },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 }
    })

    // Rodapé
    const pageCount = doc.internal.pages.length - 1
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Documento gerado por ${clienteStore.clienteNome || 'HuntImob'} - Página 1 de ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    )

    // Salvar PDF
    const nomeArquivo = `Simulacao_Financiamento_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(nomeArquivo)

    ElMessage.success('PDF gerado com sucesso!')
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    ElMessage.error('Erro ao gerar PDF. Tente novamente.')
  }
}

// Calcular ao montar o componente
calcularFinanciamento()
</script>
