<template>
  <div class="flex items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center gap-1">
      <NuxtLink
        to="/comercial/crm"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
          $route.path === '/comercial/crm' || $route.path === '/comercial/crm/'
            ? 'border-blue-500 text-blue-500 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        Pipeline
      </NuxtLink>
      <NuxtLink
        to="/automacao/fluxos"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
          $route.path === '/automacao/fluxos'
            ? 'border-blue-500 text-blue-500 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        Fluxos de Automação
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Componente de abas do CRM
</script>
