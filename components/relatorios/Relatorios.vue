<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Gere relatórios personalizados com filtros e exporte em CSV ou PDF
      </p>
    </div>

    <!-- Filtro rápido por categoria (tabs) -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        @click="categoriaAtiva = null"
        :class="[
          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200',
          !categoriaAtiva
            ? 'btn-gradient text-white shadow-sm'
            : 'glass-card-light dark:glass-card border border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10'
        ]"
      >
        Todos
      </button>
      <button
        v-for="cat in categoriasFiltradas"
        :key="cat.id"
        @click="categoriaAtiva = cat.id"
        :class="[
          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200',
          categoriaAtiva === cat.id
            ? 'btn-gradient text-white shadow-sm'
            : 'glass-card-light dark:glass-card border border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10'
        ]"
      >
        <component :is="cat.icon" class="h-4 w-4 stroke-2" />
        {{ cat.label }}
      </button>
    </div>

    <!-- Grid de categorias -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="categoria in categoriasExibidas"
        :key="categoria.id"
        class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5 transition duration-200 hover:shadow-lg"
      >
        <div class="flex items-start gap-3 mb-4">
          <div class="icon-glass w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
            <component :is="categoria.icon" class="h-5 w-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ categoria.label }}
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ categoria.descricao }}
            </p>
          </div>
        </div>

        <ul class="space-y-2">
          <li
            v-for="tipo in categoria.tipos"
            :key="tipo"
            class="group"
          >
            <NuxtLink
              :to="`/gestao/relatorios/${tipo}`"
              class="w-full flex items-center justify-between gap-2 rounded-xl glass-card-light dark:glass-card border border-white/10 px-3 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-white/10 dark:hover:bg-white/10"
            >
              <span>{{ getTituloRelatorio(tipo) }}</span>
              <DocumentArrowDownIcon class="h-4 w-4 text-gray-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 flex-shrink-0 stroke-2" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Estado vazio quando filtro não retorna nada -->
    <div
      v-if="categoriasExibidas.length === 0"
      class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-12 text-center"
    >
      <DocumentChartBarIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4 stroke-2" />
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Nenhuma categoria encontrada
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { categoriasRelatorios } from '../../utils/configRelatoriosCategorias'
import { getRelatorioConfig } from '../../utils/configRelatorios'
import { DocumentArrowDownIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline'

const categoriaAtiva = ref(null)

const categoriasFiltradas = computed(() => {
  return categoriasRelatorios
})

const categoriasExibidas = computed(() => {
  if (!categoriaAtiva.value) return categoriasFiltradas.value
  return categoriasFiltradas.value.filter(c => c.id === categoriaAtiva.value)
})

const getTituloRelatorio = (tipo) => {
  const config = getRelatorioConfig(tipo)
  return config?.titulo || tipo
}
</script>
