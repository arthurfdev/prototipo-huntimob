<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações da IA</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie as configurações do assistente de IA</p>
    </div>

    <div class="space-y-6">
      <!-- Componente Personalidade IA -->
      <PersonalidadeIA />

      <!-- Componente Base de Conhecimento -->
      <BaseConhecimento />
    </div>
  </div>
</template>

<script setup>
import PersonalidadeIA from '@/components/automacao/PersonalidadeIA.vue'
import BaseConhecimento from '@/components/automacao/BaseConhecimento.vue'
</script>
