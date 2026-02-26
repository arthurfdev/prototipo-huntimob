<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-brand-navy border-b border-gray-200 dark:border-gray-800" style="z-index: 1 !important;">
    <div class="h-full flex items-center justify-between px-4">
      <!-- Logo e Nome -->
      <div class="flex items-center">
        <img 
          src="/images/logos/logo_azul.png" 
          alt="HuntImob Logo" 
          class="h-10 w-auto flex-shrink-0 object-contain"
          @error="handleLogoError"
        />
        <img 
          src="/images/logos/escrito_logo.png" 
          alt="HuntImob" 
          class="h-48 w-auto hidden sm:block object-contain"
          @error="handleEscritoError"
        />
      </div>

      <!-- Espaço para ações futuras (notificações, perfil, etc) -->
      <div class="flex items-center space-x-4">
        <!-- Placeholder para futuras ações -->
      </div>
    </div>
  </header>
</template>

<script setup>
// Header sutil com logo e branding

const handleLogoError = (event) => {
  console.warn('Erro ao carregar logo azul')
  // Fallback pode ser adicionado aqui se necessário
}

const handleEscritoError = (event) => {
  console.warn('Erro ao carregar escrito logo')
  // Fallback pode ser adicionado aqui se necessário
}
</script>
