<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Colaboradores</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie colaboradores e equipes</p>
      </div>
      <button 
        @click="openCreateColaborador" 
        class="btn-gradient px-4 py-2 text-sm font-semibold flex items-center gap-2"
      >
        <UserPlusIcon class="h-4 w-4 stroke-2" />
        <span>Novo Colaborador</span>
      </button>
    </div>

    <!-- Tabela -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-white/10">
          <thead class="glass-card-light dark:glass-card bg-white/5 dark:bg-white/5 backdrop-blur-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Função</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contato</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="colaborador in colaboradores" :key="colaborador.id" class="hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ colaborador.nome }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ colaborador.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ colaborador.funcao }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
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
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="openEditColaborador(colaborador)" 
                    class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-4 w-4 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
                  </button>
                  <button 
                    @click="deleteColaborador(colaborador)" 
                    class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Excluir"
                  >
                    <TrashIcon class="h-4 w-4 text-red-500 dark:text-red-400 relative z-10 stroke-2" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserPlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

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
