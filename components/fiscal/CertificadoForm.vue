<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Dados da Empresa -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5 sm:p-6">
      <div class="flex items-center gap-2 mb-6">
        <div class="icon-glass w-8 h-8 rounded-lg flex items-center justify-center">
          <BuildingOfficeIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Dados da Empresa
        </h3>
      </div>

      <!-- Tipo de documento -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Tipo de Documento
          </label>
          <select
            v-model="tipoDocumento"
            class="w-full max-w-[420px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          >
            <option value="cnpj">CNPJ (MEI/Empresa)</option>
            <option value="cpf">CPF (Pessoa Física)</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            {{ tipoDocumento === 'cnpj' ? 'CNPJ' : 'CPF' }} *
          </label>
          <input
            v-if="tipoDocumento === 'cnpj'"
            :value="form.cnpj"
            @input="form.cnpj = formatCnpj($event.target.value)"
            type="text"
            placeholder="00.000.000/0000-00"
            class="w-full max-w-[420px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            :class="{ 'border-red-500': errors.cnpj }"
          />
          <input
            v-else
            :value="form.cpf"
            @input="form.cpf = formatCpf($event.target.value)"
            type="text"
            placeholder="000.000.000-00"
            class="w-full max-w-[420px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            :class="{ 'border-red-500': errors.cpf }"
          />
          <p v-if="errors.cnpj || errors.cpf" class="text-sm text-red-500">{{ errors.cnpj || errors.cpf }}</p>
        </div>
      </div>

      <!-- Razão Social e Nome Fantasia -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Razão Social *
          </label>
          <input
            v-model="form.razao_social"
            type="text"
            placeholder="Nome empresarial oficial"
            class="w-full max-w-[420px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            :class="{ 'border-red-500': errors.razao_social }"
          />
          <p v-if="errors.razao_social" class="text-sm text-red-500">{{ errors.razao_social }}</p>
        </div>

        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Nome Fantasia
          </label>
          <input
            v-model="form.nome_fantasia"
            type="text"
            placeholder="Nome comercial (opcional)"
            class="w-full max-w-[420px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          />
        </div>
      </div>

      <!-- Inscrições e Regime -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Inscrição Municipal
          </label>
          <input
            v-model="form.inscricao_municipal"
            type="text"
            placeholder="Número da IM"
            class="w-full max-w-[280px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          />
          <p class="text-xs text-gray-400 dark:text-gray-500">Necessária para emitir NFS-e</p>
        </div>

        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Inscrição Estadual
          </label>
          <input
            v-model="form.inscricao_estadual"
            type="text"
            placeholder="Número da IE"
            class="w-full max-w-[280px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          />
          <p class="text-xs text-gray-400 dark:text-gray-500">MEI geralmente não possui</p>
        </div>

        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Regime Tributário
          </label>
          <select
            v-model="form.regime_tributario"
            class="w-full max-w-[280px] px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="1">Simples Nacional (MEI/ME/EPP)</option>
            <option :value="2">Simples Nacional - Excesso</option>
            <option :value="3">Regime Normal</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Endereço Fiscal -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5 sm:p-6">
      <div class="flex items-center gap-2 mb-6">
        <div class="icon-glass w-8 h-8 rounded-lg flex items-center justify-center">
          <MapPinIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Endereço Fiscal
        </h3>
      </div>

      <!-- CEP -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            CEP *
          </label>
          <input
            :value="form.endereco_cep"
            @input="form.endereco_cep = formatCep($event.target.value)"
            type="text"
            placeholder="00000-000"
            class="w-full max-w-[200px] px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.endereco_cep }"
          />
          <p v-if="errors.endereco_cep" class="text-sm text-red-500">
            {{ errors.endereco_cep }}
          </p>
        </div>

        <div class="md:col-span-3 space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Logradouro *
          </label>
          <input
            v-model="form.endereco_logradouro"
            type="text"
            placeholder="Rua, Avenida, etc."
            class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.endereco_logradouro }"
          />
        </div>
      </div>

      <!-- Número, Complemento, Bairro -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Número</label>
          <input v-model="form.endereco_numero" type="text" placeholder="S/N" class="w-full max-w-[140px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" />
        </div>
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Complemento</label>
          <input v-model="form.endereco_complemento" type="text" placeholder="Sala, Andar..." class="w-full px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" />
        </div>
        <div class="md:col-span-2 space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Bairro *</label>
          <input v-model="form.endereco_bairro" type="text" placeholder="Bairro" class="w-full px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" :class="{ 'border-red-500': errors.endereco_bairro }" />
        </div>
      </div>

      <!-- Cidade, UF, Código Município -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-2 space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Cidade *</label>
          <input v-model="form.endereco_cidade" type="text" placeholder="Nome da cidade" class="w-full px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" :class="{ 'border-red-500': errors.endereco_cidade }" />
        </div>
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">UF *</label>
          <select v-model="form.endereco_uf" class="w-full max-w-[140px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" :class="{ 'border-red-500': errors.endereco_uf }">
            <option value="">Selecione</option>
            <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Cód. Município *</label>
          <input v-model="form.endereco_codigo_municipio" type="text" placeholder="Código IBGE" class="w-full max-w-[140px] px-3 py-2 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" :class="{ 'border-red-500': errors.endereco_codigo_municipio }" />
          <p class="text-xs text-gray-400 dark:text-gray-500">Código IBGE do município</p>
        </div>
      </div>
    </div>

    <!-- Certificado Digital -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5 sm:p-6">
      <div class="flex items-center gap-2 mb-6">
        <div class="icon-glass w-8 h-8 rounded-lg flex items-center justify-center">
          <ShieldCheckIcon class="w-5 h-5 text-emerald-600 dark:text-emerald-400 relative z-10 stroke-2" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Certificado Digital</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Arquivo do Certificado (.pfx ou .p12) *</label>
          <div @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" @drop.prevent="handleFileDrop" :class="['relative border-2 border-dashed rounded-xl p-6 text-center transition duration-200 cursor-pointer glass-card-light dark:glass-card', dragOver ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/20 hover:border-cyan-500/50']">
            <input type="file" accept=".pfx,.p12" @change="handleFileSelect" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div v-if="!form.certificado">
              <DocumentArrowUpIcon class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p class="text-sm text-gray-500 dark:text-gray-400">Arraste o arquivo aqui ou clique para procurar</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Formatos aceitos: .pfx, .p12</p>
            </div>
            <div v-else class="flex items-center justify-center gap-3">
              <DocumentCheckIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
              <div class="text-left">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ form.certificado.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(form.certificado.size) }}</p>
              </div>
              <button type="button" @click.stop="form.certificado = null" class="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition duration-200">
                <XCircleIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <p v-if="errors.certificado" class="text-sm text-red-500">{{ errors.certificado }}</p>
        </div>
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">Senha do Certificado *</label>
          <div class="relative">
            <input v-model="form.senha" :type="showPassword ? 'text' : 'password'" placeholder="Digite a senha do certificado" class="w-full px-3 py-2 pr-12 rounded-xl glass-card-light dark:glass-card border border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50" :class="{ 'border-red-500': errors.senha }" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="errors.senha" class="text-sm text-red-500">{{ errors.senha }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">A senha será utilizada apenas para validar e enviar o certificado</p>
        </div>
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
      <button type="button" @click="$emit('cancel')" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 glass-card-light dark:glass-card border border-white/10 transition duration-200 hover:bg-white/10 dark:hover:bg-white/10">
        Cancelar
      </button>
      <button type="submit" :disabled="isLoading" class="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold disabled:opacity-45 disabled:cursor-not-allowed">
        <ArrowPathIcon v-if="isLoading" class="w-5 h-5 animate-spin" />
        {{ isLoading ? 'Salvando...' : 'Salvar Configuração' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import {
  ShieldCheckIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// Funções de formatação de máscaras
function formatCnpj(value) {
  const numbers = value.replace(/\D/g, '').slice(0, 14)
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
}

function formatCpf(value) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
}

function formatCep(value) {
  const numbers = value.replace(/\D/g, '').slice(0, 8)
  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
}

const props = defineProps({
  colaboradorId: {
    type: String,
    default: null
  },
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success', 'cancel', 'error'])

const isLoading = ref(false)
const showPassword = ref(false)
const dragOver = ref(false)
const tipoDocumento = ref('cnpj')

const form = reactive({
  certificado: null,
  senha: '',
  cnpj: '',
  cpf: '',
  razao_social: '',
  nome_fantasia: '',
  inscricao_municipal: '',
  inscricao_estadual: '',
  regime_tributario: 1,
  endereco_logradouro: '',
  endereco_numero: '',
  endereco_complemento: '',
  endereco_bairro: '',
  endereco_cidade: '',
  endereco_uf: '',
  endereco_cep: '',
  endereco_codigo_municipio: ''
})

const errors = reactive({})

const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

// Formatar tamanho do arquivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Manipular seleção de arquivo
function handleFileSelect(event) {
  const input = event.target
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.name.endsWith('.pfx') || file.name.endsWith('.p12')) {
      form.certificado = file
      errors.certificado = ''
    } else {
      errors.certificado = 'Formato inválido. Use .pfx ou .p12'
    }
  }
}

// Manipular drop de arquivo
function handleFileDrop(event) {
  dragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    const file = files[0]
    if (file.name.endsWith('.pfx') || file.name.endsWith('.p12')) {
      form.certificado = file
      errors.certificado = ''
    } else {
      errors.certificado = 'Formato inválido. Use .pfx ou .p12'
    }
  }
}

// Preencher formulário com dados iniciais
function preencherDadosIniciais(data) {
  if (!data) return

  // Tipo de documento (CPF ou CNPJ)
  if (data.cnpj) {
    tipoDocumento.value = 'cnpj'
    form.cnpj = data.cnpj
  } else if (data.cpf) {
    tipoDocumento.value = 'cpf'
    form.cpf = data.cpf
  }

  // Dados básicos
  if (data.razao_social) form.razao_social = data.razao_social
  if (data.nome_fantasia) form.nome_fantasia = data.nome_fantasia
  if (data.inscricao_municipal) form.inscricao_municipal = data.inscricao_municipal
  if (data.inscricao_estadual) form.inscricao_estadual = data.inscricao_estadual
  if (data.regime_tributario) form.regime_tributario = data.regime_tributario

  // Endereço
  if (data.endereco_logradouro) form.endereco_logradouro = data.endereco_logradouro
  if (data.endereco_numero) form.endereco_numero = data.endereco_numero
  if (data.endereco_complemento) form.endereco_complemento = data.endereco_complemento
  if (data.endereco_bairro) form.endereco_bairro = data.endereco_bairro
  if (data.endereco_cidade) form.endereco_cidade = data.endereco_cidade
  if (data.endereco_uf) form.endereco_uf = data.endereco_uf
  if (data.endereco_cep) form.endereco_cep = data.endereco_cep
  if (data.endereco_codigo_municipio) form.endereco_codigo_municipio = data.endereco_codigo_municipio
}

// Watch para preencher quando initialData mudar
watch(() => props.initialData, (newData) => {
  if (newData) {
    preencherDadosIniciais(newData)
  }
}, { immediate: true, deep: true })

// Preencher no mount
onMounted(() => {
  if (props.initialData) {
    preencherDadosIniciais(props.initialData)
  }
})

// Validar formulário
function validate() {
  // Limpar erros
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  if (!form.certificado) {
    errors.certificado = 'Certificado é obrigatório'
    isValid = false
  }

  if (!form.senha) {
    errors.senha = 'Senha do certificado é obrigatória'
    isValid = false
  }

  if (tipoDocumento.value === 'cnpj' && !form.cnpj) {
    errors.cnpj = 'CNPJ é obrigatório'
    isValid = false
  }

  if (tipoDocumento.value === 'cpf' && !form.cpf) {
    errors.cpf = 'CPF é obrigatório'
    isValid = false
  }

  if (!form.razao_social) {
    errors.razao_social = 'Razão Social é obrigatória'
    isValid = false
  }

  if (!form.endereco_logradouro) {
    errors.endereco_logradouro = 'Logradouro é obrigatório'
    isValid = false
  }

  if (!form.endereco_bairro) {
    errors.endereco_bairro = 'Bairro é obrigatório'
    isValid = false
  }

  if (!form.endereco_cidade) {
    errors.endereco_cidade = 'Cidade é obrigatória'
    isValid = false
  }

  if (!form.endereco_uf) {
    errors.endereco_uf = 'UF é obrigatório'
    isValid = false
  }

  if (!form.endereco_cep) {
    errors.endereco_cep = 'CEP é obrigatório'
    isValid = false
  }

  if (!form.endereco_codigo_municipio) {
    errors.endereco_codigo_municipio = 'Código do município é obrigatório'
    isValid = false
  }

  return isValid
}

// Submeter formulário
async function handleSubmit() {
  if (!validate()) return
  const file = form.certificado
  if (!file) return

  isLoading.value = true

  try {
    const dados = {
      senha: form.senha,
      razao_social: form.razao_social,
      regime_tributario: form.regime_tributario.toString(),
      endereco_logradouro: form.endereco_logradouro,
      endereco_numero: form.endereco_numero || 'S/N',
      endereco_bairro: form.endereco_bairro,
      endereco_cidade: form.endereco_cidade,
      endereco_uf: form.endereco_uf,
      endereco_cep: form.endereco_cep.replace(/\D/g, ''),
      endereco_codigo_municipio: form.endereco_codigo_municipio
    }
    if (tipoDocumento.value === 'cnpj') {
      dados.cnpj = form.cnpj.replace(/\D/g, '')
    } else {
      dados.cpf = form.cpf.replace(/\D/g, '')
    }
    if (form.nome_fantasia) dados.nome_fantasia = form.nome_fantasia
    if (form.inscricao_municipal) dados.inscricao_municipal = form.inscricao_municipal
    if (form.inscricao_estadual) dados.inscricao_estadual = form.inscricao_estadual
    if (form.endereco_complemento) dados.endereco_complemento = form.endereco_complemento

    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    emit('success', { message: 'Certificado cadastrado com sucesso!' })
  } catch (error) {
    emit('error', error)
  } finally {
    isLoading.value = false
  }
}
</script>
