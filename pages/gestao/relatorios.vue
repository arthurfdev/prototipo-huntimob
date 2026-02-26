<template>
  <ClientOnly>
    <Relatorios />
    <template #fallback>
      <div class="flex min-h-[320px] items-center justify-center glass-card-light dark:glass-card rounded-xl shadow-sm p-8">
        <div class="text-center">
          <div class="animate-spin h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full mx-auto" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Carregando relatórios...</p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import Relatorios from '../../components/relatorios/Relatorios.vue'

definePageMeta({ keepalive: false })
</script>
