<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Conecte seu WhatsApp Business para ativar o assistente</p>
    </div>

    <QRCodeWhatsApp />
  </div>
</template>

<script setup>
import QRCodeWhatsApp from '@/components/automacao/QRCodeWhatsApp.vue'
</script>
