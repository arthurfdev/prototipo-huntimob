<template>
  <div class="flex flex-col min-h-0 flex-1">
    <!-- Header do Relatório -->
    <div v-if="header" class="shrink-0 px-6 md:px-8 py-5 border-b border-gray-200 dark:border-gray-700 space-y-3 bg-white dark:bg-brand-navy">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ header.titulo }}</h3>
      <p v-if="header.subtitulo" class="text-sm text-gray-600 dark:text-gray-400">{{ header.subtitulo }}</p>
      <div v-if="header.periodo" class="text-sm">
        <span class="text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Período</span>
        <span class="text-gray-900 dark:text-white font-normal ml-2">{{ header.periodo }}</span>
      </div>
      <div v-if="header.imobiliaria" class="text-sm">
        <span class="text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Imobiliária</span>
        <span class="text-gray-900 dark:text-white font-normal ml-2">{{ header.imobiliaria.nome }}</span>
        <span v-if="header.imobiliaria.cnpj" class="text-gray-500 dark:text-gray-400 text-sm ml-3">· CNPJ {{ header.imobiliaria.cnpj }}</span>
      </div>
      <div v-if="header.filtros && Object.keys(header.filtros).length > 0" class="space-y-2">
        <span class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Filtros aplicados</span>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="(value, key) in header.filtros"
            :key="key"
            v-show="value"
            class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
          >
            {{ key }}: {{ value }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Tabela -->
    <div class="flex-1 min-h-0 overflow-auto bg-white dark:bg-brand-navy">
      <table class="min-w-full border-collapse">
        <thead class="sticky top-0 z-10 bg-gray-50 dark:bg-brand-navy-dark">
          <tr>
            <th
              v-for="coluna in colunas"
              :key="coluna.key"
              :class="[
                'px-6 md:px-8 py-4 text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700',
                coluna.align === 'right' ? 'text-right' : coluna.align === 'center' ? 'text-center' : 'text-left'
              ]"
            >
              {{ coluna.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in dados"
            :key="index"
            :class="[
              'border-b border-gray-200 dark:border-gray-700 transition-colors duration-200',
              index % 2 === 0 ? 'bg-white dark:bg-brand-navy' : 'bg-gray-50 dark:bg-brand-navy-dark',
              'hover:bg-blue-50 dark:hover:bg-blue-900/20'
            ]"
          >
            <td
              v-for="coluna in colunas"
              :key="coluna.key"
              :class="[
                'px-6 md:px-8 py-4 text-sm font-normal text-gray-900 dark:text-white whitespace-nowrap',
                coluna.align === 'right' ? 'text-right' : coluna.align === 'center' ? 'text-center' : 'text-left'
              ]"
            >
              <template v-if="coluna.format">
                {{ coluna.format(getNestedValue(item, coluna.key), item) }}
              </template>
              <template v-else>
                {{ getNestedValue(item, coluna.key) ?? '—' }}
              </template>
            </td>
          </tr>
        </tbody>
        <!-- Totais -->
        <tfoot v-if="totais && Object.keys(totais).length > 0" class="sticky bottom-0 bg-gray-50 dark:bg-brand-navy-dark border-t-2 border-gray-200 dark:border-gray-700">
          <tr>
            <td
              v-for="coluna in colunas"
              :key="coluna.key"
              :class="[
                'px-6 md:px-8 py-4 text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap',
                coluna.align === 'right' ? 'text-right' : coluna.align === 'center' ? 'text-center' : 'text-left'
              ]"
            >
              <template v-if="totais[coluna.key] !== undefined">
                <template v-if="coluna.format">
                  {{ coluna.format(totais[coluna.key]) }}
                </template>
                <template v-else>
                  {{ totais[coluna.key] }}
                </template>
              </template>
              <template v-else-if="coluna.key === colunas[0].key">
                Total
              </template>
              <template v-else>
                —
              </template>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Mensagem quando não há dados -->
    <div v-if="dados.length === 0" class="flex-1 flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400">
      Nenhum registro encontrado
    </div>
  </div>
</template>

<script setup>
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

defineProps({
  colunas: {
    type: Array,
    required: true
  },
  dados: {
    type: Array,
    required: true
  },
  header: {
    type: Object,
    default: null
  },
  totais: {
    type: Object,
    default: null
  }
})
</script>
