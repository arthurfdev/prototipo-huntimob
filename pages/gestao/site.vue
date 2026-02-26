<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edição do Site</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Personalize o conteúdo do seu site público</p>
    </div>

    <!-- Tabs -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex space-x-1 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Hero Section Editor -->
    <div v-if="activeTab === 'hero'" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Seção Hero (Principal)</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título Principal
          </label>
          <input
            :value="siteStore.content.hero.title"
            @input="updateHeroTitle"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="Digite o título principal"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtítulo
          </label>
          <textarea
            :value="siteStore.content.hero.subtitle"
            @input="updateHeroSubtitle"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="Digite o subtítulo"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL da Imagem de Fundo
          </label>
          <input
            :value="siteStore.content.hero.backgroundImage"
            @input="updateHeroBackground"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="/images/background.jpg"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Use uma URL relativa (ex: /images/logo.png) ou URL completa
          </p>
        </div>
      </div>
    </div>

    <!-- Search Section Editor -->
    <div v-if="activeTab === 'search'" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Seção de Busca</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Placeholder do Campo de Busca
          </label>
          <input
            :value="siteStore.content.search.placeholder"
            @input="updateSearchPlaceholder"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="Localização, bairro ou endereço"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Texto do Botão
          </label>
          <input
            :value="siteStore.content.search.buttonText"
            @input="updateSearchButton"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="Buscar"
          />
        </div>
      </div>
    </div>

    <!-- Featured Properties Editor -->
    <div v-if="activeTab === 'properties'" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Imóveis em Destaque</h2>
        <button
          @click="showAddPropertyModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Adicionar Imóvel
        </button>
      </div>
      
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título da Seção
          </label>
          <input
            :value="siteStore.content.featuredProperties.title"
            @input="updateFeaturedTitle"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtítulo da Seção
          </label>
          <textarea
            :value="siteStore.content.featuredProperties.subtitle"
            @input="updateFeaturedSubtitle"
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="property in siteStore.content.featuredProperties.properties"
          :key="property.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-brand-navy-dark"
        >
          <div class="mb-3">
            <img :src="property.image" :alt="property.title" class="w-full h-40 object-cover rounded-lg" />
          </div>
          <div class="space-y-2">
            <input
              :value="property.title"
              @input="(e) => updatePropertyField(property.id, 'title', e)"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="Título"
            />
            <input
              :value="property.price"
              @input="(e) => updatePropertyField(property.id, 'price', e)"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="Preço"
            />
            <input
              :value="property.location"
              @input="(e) => updatePropertyField(property.id, 'location', e)"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="Localização"
            />
            <input
              :value="property.image"
              @input="(e) => updatePropertyField(property.id, 'image', e)"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="URL da imagem"
            />
            <button
              @click="siteStore.removeProperty(property.id)"
              class="w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Editor -->
    <div v-if="activeTab === 'services'" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Serviços Exclusivos</h2>
        <button
          @click="showAddServiceModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Adicionar Serviço
        </button>
      </div>
      
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título da Seção
          </label>
          <input
            :value="siteStore.content.services.title"
            @input="updateServicesTitle"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtítulo da Seção
          </label>
          <textarea
            :value="siteStore.content.services.subtitle"
            @input="updateServicesSubtitle"
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="service in siteStore.content.services.items"
          :key="service.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-brand-navy-dark"
        >
          <div class="space-y-3">
            <input
              :value="service.icon"
              @input="(e) => updateServiceField(service.id, 'icon', e)"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="Ícone (emoji ou texto)"
            />
            <input
              :value="service.title"
              @input="(e) => updateServiceField(service.id, 'title', e)"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="Título do serviço"
            />
            <textarea
              :value="service.description"
              @input="(e) => updateServiceField(service.id, 'description', e)"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy text-gray-900 dark:text-white"
              placeholder="Descrição do serviço"
            />
            <button
              @click="siteStore.removeService(service.id)"
              class="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Remover Serviço
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Editor -->
    <div v-if="activeTab === 'footer'" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Rodapé</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome da Empresa
          </label>
          <input
            :value="siteStore.content.footer.companyName"
            @input="updateFooterCompany"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CRECI
          </label>
          <input
            :value="siteStore.content.footer.creci"
            @input="updateFooterCreci"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Copyright
          </label>
          <input
            :value="siteStore.content.footer.copyright"
            @input="updateFooterCopyright"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Preview Button -->
    <div class="mt-6 flex justify-end">
      <NuxtLink
        to="/site"
        target="_blank"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Visualizar Site
      </NuxtLink>
    </div>

    <!-- Modal Add Property -->
    <div
      v-if="showAddPropertyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAddPropertyModal = false"
    >
      <div
        class="bg-white dark:bg-brand-navy rounded-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Adicionar Imóvel</h3>
        <div class="space-y-4">
          <input
            v-model="newProperty.title"
            type="text"
            placeholder="Título"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
          <input
            v-model="newProperty.price"
            type="text"
            placeholder="Preço"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
          <input
            v-model="newProperty.location"
            type="text"
            placeholder="Localização"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
          <input
            v-model="newProperty.image"
            type="text"
            placeholder="URL da imagem"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddPropertyModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-navy-dark"
          >
            Cancelar
          </button>
          <button
            @click="addProperty"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Add Service -->
    <div
      v-if="showAddServiceModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAddServiceModal = false"
    >
      <div
        class="bg-white dark:bg-brand-navy rounded-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Adicionar Serviço</h3>
        <div class="space-y-4">
          <input
            v-model="newService.icon"
            type="text"
            placeholder="Ícone (emoji)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
          <input
            v-model="newService.title"
            type="text"
            placeholder="Título"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
          <textarea
            v-model="newService.description"
            rows="3"
            placeholder="Descrição"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
          />
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddServiceModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-navy-dark"
          >
            Cancelar
          </button>
          <button
            @click="addService"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSiteStore } from '../../stores/site'

const siteStore = useSiteStore()

const activeTab = ref('hero')
const tabs = [
  { id: 'hero', label: 'Hero' },
  { id: 'search', label: 'Busca' },
  { id: 'properties', label: 'Imóveis' },
  { id: 'services', label: 'Serviços' },
  { id: 'footer', label: 'Rodapé' }
]

const showAddPropertyModal = ref(false)
const showAddServiceModal = ref(false)

const newProperty = ref({
  title: '',
  price: '',
  location: '',
  image: ''
})

const newService = ref({
  icon: '',
  title: '',
  description: ''
})

const addProperty = () => {
  if (newProperty.value.title && newProperty.value.image) {
    siteStore.addProperty({
      id: Date.now().toString(),
      ...newProperty.value
    })
    newProperty.value = { title: '', price: '', location: '', image: '' }
    showAddPropertyModal.value = false
  }
}

const addService = () => {
  if (newService.value.title && newService.value.description) {
    siteStore.addService({
      id: Date.now().toString(),
      ...newService.value
    })
    newService.value = { icon: '', title: '', description: '' }
    showAddServiceModal.value = false
  }
}

// Métodos auxiliares para eventos de input
const updateHeroTitle = (e) => {
  siteStore.updateHero({ title: e.target.value })
}

const updateHeroSubtitle = (e) => {
  siteStore.updateHero({ subtitle: e.target.value })
}

const updateHeroBackground = (e) => {
  siteStore.updateHero({ backgroundImage: e.target.value })
}

const updateSearchPlaceholder = (e) => {
  siteStore.updateSearch({ placeholder: e.target.value })
}

const updateSearchButton = (e) => {
  siteStore.updateSearch({ buttonText: e.target.value })
}

const updateFeaturedTitle = (e) => {
  siteStore.updateFeaturedProperties({ title: e.target.value })
}

const updateFeaturedSubtitle = (e) => {
  siteStore.updateFeaturedProperties({ subtitle: e.target.value })
}

const updatePropertyField = (propertyId, field, e) => {
  siteStore.updateProperty(propertyId, { [field]: e.target.value })
}

const updateServicesTitle = (e) => {
  siteStore.updateServices({ title: e.target.value })
}

const updateServicesSubtitle = (e) => {
  siteStore.updateServices({ subtitle: e.target.value })
}

const updateServiceField = (serviceId, field, e) => {
  siteStore.updateService(serviceId, { [field]: e.target.value })
}

const updateFooterCompany = (e) => {
  siteStore.updateFooter({ companyName: e.target.value })
}

const updateFooterCreci = (e) => {
  siteStore.updateFooter({ creci: e.target.value })
}

const updateFooterCopyright = (e) => {
  siteStore.updateFooter({ copyright: e.target.value })
}

onMounted(() => {
  siteStore.loadFromLocalStorage()
})
</script>
