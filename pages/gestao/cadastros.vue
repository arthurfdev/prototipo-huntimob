<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Cadastros</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie colaboradores e equipes</p>
    </div>
    
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-brand-navy-dark mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Conteúdo das tabs -->
    <div>
      <!-- Tab Colaboradores -->
      <div v-if="currentTab === 'colaboradores'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Colaboradores</h2>
          <button 
            @click="openCreateColaborador" 
            class="btn-gradient px-4 py-2 flex items-center space-x-2"
          >
            <UserPlusIcon class="h-5 w-5" />
            <span>Novo Colaborador</span>
          </button>
        </div>

        <div class="bg-white dark:bg-brand-navy rounded-lg shadow border border-gray-200 dark:border-brand-navy-dark overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-brand-navy-dark">
              <thead class="bg-gray-50 dark:bg-brand-navy-dark">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Função</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contato</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-brand-navy divide-y divide-gray-200 dark:divide-brand-navy-dark">
                <tr v-for="colaborador in colaboradores" :key="colaborador.id" class="hover:bg-gray-50 dark:hover:bg-brand-navy-dark">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ colaborador.nome }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ colaborador.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ colaborador.funcao }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ colaborador.contato }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="colaborador.status === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                    >
                      {{ colaborador.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <button @click="openEditColaborador(colaborador)" class="text-blue-600 hover:text-blue-900">
                        <PencilIcon class="h-5 w-5" />
                      </button>
                      <button @click="deleteColaborador(colaborador)" class="text-red-600 hover:text-red-900">
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserPlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const currentTab = ref('colaboradores')

const tabs = [
  { id: 'colaboradores', name: 'Colaboradores' }
]

// Dados mockados
const mockColaboradores = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', funcao: 'Corretor', contato: '(11) 99999-9999', status: 'ativo' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', funcao: 'Gerente', contato: '(11) 88888-8888', status: 'ativo' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', funcao: 'Corretor', contato: '(11) 77777-7777', status: 'inativo' },
]

const colaboradores = ref([...mockColaboradores])

const openCreateColaborador = () => {
  ElMessage.info('Funcionalidade em desenvolvimento')
}

const openEditColaborador = (colaborador) => {
  ElMessage.info('Funcionalidade em desenvolvimento')
}

const deleteColaborador = (colaborador) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja excluir este colaborador?',
    'Confirmação',
    {
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      type: 'warning',
    }
  ).then(() => {
    const index = colaboradores.value.findIndex(c => c.id === colaborador.id)
    if (index !== -1) {
      colaboradores.value.splice(index, 1)
      ElMessage.success('Colaborador excluído com sucesso')
    }
  }).catch(() => {})
}
</script>
