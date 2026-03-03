<template>
  <div class="min-h-screen bg-white">
    <!-- Header do Site -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <img 
              src="/images/logos/logo_cliente.png" 
              alt="Beet Imoveis Logo" 
              class="h-10 w-auto"
            />
            <span class="ml-3 text-xl font-bold text-gray-900">
              {{ siteStore.content.footer.companyName }}
            </span>
          </div>
          <nav class="hidden md:flex space-x-6">
            <a
              v-for="link in siteStore.content.footer.links"
              :key="link.id"
              :href="link.url"
              class="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {{ link.label }}
            </a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section 
      class="relative text-white py-20 lg:py-32"
      :style="{
        backgroundImage: 'url(/images/imoveis/imovel23.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {{ siteStore.content.hero.title }}
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {{ siteStore.content.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Search Section -->
    <section class="bg-gray-50 py-8 -mt-8 relative z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            :placeholder="siteStore.content.search.placeholder"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            {{ siteStore.content.search.buttonText }}
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Properties -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ siteStore.content.featuredProperties.title }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ siteStore.content.featuredProperties.subtitle }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="property in siteStore.content.featuredProperties.properties"
            :key="property.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div class="relative h-48 bg-gray-200">
              <img
                :src="property.image"
                :alt="property.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ property.title }}
              </h3>
              <p class="text-blue-600 font-bold text-xl mb-2">
                {{ property.price }}
              </p>
              <p class="text-gray-600 text-sm">
                {{ property.location }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ siteStore.content.services.title }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ siteStore.content.services.subtitle }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in siteStore.content.services.items"
            :key="service.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div class="text-4xl mb-4">{{ service.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              {{ service.title }}
            </h3>
            <p class="text-gray-600">
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <!-- Coluna 1: Nome da Empresa e CRECI -->
          <div class="lg:col-span-1">
            <h3 class="text-xl font-bold text-white mb-3 uppercase">{{ siteStore.content.footer.companyName }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ siteStore.content.footer.creci }}</p>
          </div>
          
          <!-- Colunas dos Links -->
          <div
            v-for="link in siteStore.content.footer.links"
            :key="link.id"
            class="lg:col-span-1"
          >
            <h4 class="font-semibold text-white mb-3">{{ link.label }}</h4>
            <a 
              :href="link.url" 
              class="text-gray-400 hover:text-white transition-colors block text-sm mb-1"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
        
        <!-- Linha de Copyright -->
        <div class="border-t border-gray-800 pt-8 mt-8">
          <p class="text-center text-gray-400 text-sm">{{ siteStore.content.footer.copyright }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSiteStore } from '../stores/site'

definePageMeta({
  layout: 'public'
})

const siteStore = useSiteStore()

const handleImageError = (event) => {
  event.target.src = '/images/imoveis/imovel1.jpg'
}

onMounted(() => {
  siteStore.loadFromLocalStorage()
})
</script>

<style scoped>
/* Estilos específicos do site público */
</style>
