<template>
  <div class="glass-card-light dark:glass-card w-full rounded-xl shadow-lg">
    <div class="p-6">
      <!-- Botão Voltar -->
      <div class="flex justify-between items-center mb-4">
        <button 
          @click="$emit('cancelar')" 
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon class="h-6 w-6 mr-2" />
          Voltar
        </button>
      </div>

      <!-- Cabeçalho com Logo -->
      <div class="border-b border-gray-300 dark:border-gray-700 mb-4">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center">
            <img src="/images/logos/logo_azul.png" alt="Logo" class="h-20" @error="handleImageError" />
          </div>
          <div class="text-center flex-1">
            <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">À, {{ clienteNome.toUpperCase() }}</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Através desta o(s) Proponente(s) abaixo qualificado(s), formaliza(m) uma proposta para aquisição do objeto descrito, cujos os
              termos e condições seguem para avaliação do Vendedor.
            </p>
          </div>
        </div>
      </div>

      <form @keydown.enter.prevent="() => {}" @submit.prevent="handleSubmit">
        <!-- Seleção da Venda -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione a Venda</label>
          <select 
            v-model="selectedSaleId" 
            @change="loadSaleData"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma venda</option>
            <option v-for="venda in vendas" :key="venda.id" :value="venda.id">
              {{ venda.cliente?.nome || 'Cliente' }} - {{ venda.produto?.nome || 'Produto' }} - {{ venda.edificio_torre || '' }} - Unidade: {{ venda.unidade || '' }} - Modalidade: {{ venda.modalidade || '' }}
            </option>
          </select>
        </div>

        <!-- DADOS DO ADQUIRENTE -->
        <h2 class="text-xl font-bold mb-4 text-center p-2 text-white" style="background-color: #25316d;">DADOS DO ADQUIRENTE(S)</h2>

        <!-- Primeiro Proponente -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="col-span-2">
            <label class="font-bold text-gray-700 dark:text-gray-300">PROPONENTE:</label>
            <input v-model="form.nome_cliente" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">CPF:</label>
            <input 
              v-model="form.cpf_cliente" 
              @input="(e) => handleCPFInput(e, 'cpf_cliente')" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              maxlength="14"
            >
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">NASCIMENTO:</label>
            <input v-model="form.data_nascimento_cliente" type="date" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">RENDA:</label>
            <input 
              v-model="form.renda_cliente" 
              @input="formatarMoeda($event, 'renda_cliente')"
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              placeholder="R$ 0,00"
            >
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">PROFISSÃO:</label>
            <input v-model="form.profissao_cliente" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div class="col-span-2">
            <label class="font-bold text-gray-700 dark:text-gray-300">END. RESIDENCIAL:</label>
            <input v-model="form.endereco_residencial_cliente" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">CEP:</label>
            <input 
              v-model="form.cep_cliente" 
              @input="(e) => handleCEPInput(e, 'cep_cliente')" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              maxlength="9"
            >
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">E-MAIL:</label>
            <input v-model="form.email_cliente" type="email" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">ESTADO CIVIL</label>
            <input v-model="form.estado_civil_regime_cliente" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">REGIME DE COMUNHÃO</label>
            <input v-model="form.regime_comunhao_cliente" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">TELEFONE:</label>
            <input 
              v-model="form.telefone_cliente" 
              @input="(e) => handleTelefoneInput(e, 'telefone_cliente')" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              maxlength="15"
            >
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">TELEFONE RESIDENCIAL:</label>
            <input 
              v-model="form.residencial_cliente" 
              @input="(e) => handleTelefoneInput(e, 'residencial_cliente')" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              maxlength="14"
            >
          </div>
        </div>

        <!-- Segundo Proponente -->
        <div class="mb-4">
          <div v-for="(proponente, index) in proponentesAdicionais" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Tipo de Proponente -->
            <div class="col-span-3 p-2 rounded-lg" style="background-color: #25316d;">
              <div class="flex items-center justify-center gap-8">
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="proponente.tipo" 
                    value="conjuge" 
                    class="form-radio"
                  >
                  <span class="ml-2 font-bold text-white">CÔNJUGE</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="proponente.tipo" 
                    value="segundo" 
                    class="form-radio"
                  >
                  <span class="ml-2 font-bold text-white">SEGUNDO PROPONENTE</span>
                </label>
              </div>
            </div>

            <!-- Seleção do Cliente -->
            <div class="col-span-3 mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione o Cliente</label>
              <select 
                v-model="proponente.cliente_id"
                @change="carregarDadosProponente(index)"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
                <option value="">Selecione um cliente</option>
                <option v-for="cliente in clientesDisponiveis" :key="cliente.id" :value="cliente.id">
                  {{ cliente.nome }}
                </option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="font-bold text-gray-700 dark:text-gray-300">PROPONENTE ADICIONAL {{ index + 1 }}:</label>
              <input 
                v-model="proponente.nome" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">CPF:</label>
              <input 
                v-model="proponente.cpf" 
                @input="(e) => handleCPFInput(e, `proponente${index}.cpf`)" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                maxlength="14"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">NASCIMENTO:</label>
              <input 
                v-model="proponente.data_nascimento" 
                type="date" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">RENDA:</label>
              <input 
                v-model="proponente.renda" 
                @input="formatarMoedaProponente($event, index)"
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                placeholder="R$ 0,00"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">PROFISSÃO:</label>
              <input 
                v-model="proponente.profissao" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div class="col-span-2">
              <label class="font-bold text-gray-700 dark:text-gray-300">END. RESIDENCIAL:</label>
              <input 
                v-model="proponente.endereco_residencial" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">CEP:</label>
              <input 
                v-model="proponente.cep" 
                @input="(e) => handleCEPInput(e, `proponente${index}.cep`)" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                maxlength="9"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">E-MAIL:</label>
              <input 
                v-model="proponente.email" 
                type="email" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">ESTADO CIVIL/REGIME:</label>
              <input 
                v-model="proponente.estado_civil_regime" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">REGIME DE COMUNHÃO:</label>
              <input 
                v-model="proponente.regime_comunhao" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">TELEFONE:</label>
              <input 
                v-model="proponente.telefone" 
                @input="(e) => handleTelefoneInput(e, `proponente${index}.telefone`)" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                maxlength="15"
              >
            </div>
            <div>
              <label class="font-bold text-gray-700 dark:text-gray-300">TELEFONE RESIDENCIAL:</label>
              <input 
                v-model="proponente.telefone_residencial" 
                @input="(e) => handleTelefoneInput(e, `proponente${index}.telefone_residencial`)" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                maxlength="14"
              >
            </div>
            <div class="col-span-3 flex justify-end">
              <button @click="removerProponente(index)" type="button" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                Remover
              </button>
            </div>
          </div>
          <button @click="adicionarProponente" type="button" class="btn-gradient mt-2 px-4 py-2">
            Adicionar Proponente
          </button>
        </div>

        <!-- Dados do Imóvel -->
        <div class="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
          <p class="text-center font-bold text-gray-900 dark:text-white">
            A(S) PESSOA(S) ACIMA QUALIFICADA(S), DAQUI POR DIANTE PASSA(M) A SER DENOMINADA(A) PROPONENTE E 
            AUTORIZA(M) O(S) INTERMEDIADORES A PROMOVER COM EXCLUSIVIDADE A COMPRA DO IMOVÉL A SEGUIR 
            CARACTERIZADO E DE ACORDO COM AS CONDILÇOES DESCRITAS NA PRESENTE PROPOSTA.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">EDIFÍCIO/TORRE:</label>
            <input 
              v-model="form.edificio_torre" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
              readonly
            >
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">UNIDADE AUTÔNOMA:</label>
            <input 
              v-model="form.unidade_autonoma" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
              readonly
            >
          </div>
          <div>
            <label class="font-bold text-gray-700 dark:text-gray-300">PRODUTO:</label>
            <input 
              v-model="form.produto_nome" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
              readonly
            >
          </div>
         <div>
          <label class="font-bold text-gray-700 dark:text-gray-300">VALOR TOTAL DO NEGÓCIO/VENDA:</label>
          <input 
            v-model="form.valor_total_negocio" 
            @input="formatarMoeda($event, 'valor_total_negocio')"
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="R$ 0,00"
          >
         </div>
         <div>
          <label class="font-bold text-gray-700 dark:text-gray-300">COMISSÃO INTERMEDIADA:</label>
          <input 
            v-model="form.comissao_intermediada" 
            @input="formatarMoeda($event, 'comissao_intermediada')"
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="R$ 0,00"
          >
         </div>
         <div>
          <label class="font-bold text-gray-700 dark:text-gray-300">COMISSÃO FATURADA:</label>
          <input 
            v-model="form.comissao_faturada" 
            @input="formatarMoeda($event, 'comissao_faturada')"
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            placeholder="R$ 0,00"
          >
         </div>
        </div>

        <!-- Forma de Pagamento -->
        <h2 class="text-xl font-bold mb-4 text-center p-2 text-white" style="background-color: #25316d;">PREÇO E FORMA DE PAGAMENTO DO IMÓVEL</h2>
        <div class="overflow-x-auto mb-6">
          <table class="w-full border border-gray-300 dark:border-gray-700">
            <thead class="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Nº DE PARCELAS</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">PERIODICIDADE</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">1ª VENCIMENTO</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">VALOR UNITÁRIO NESTA DATA</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">VALOR TOTAL DA SERIE DE PARCELAS</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ATUALIZAÇÃO MONETÁRIA</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">FORMA DE PAGAMENTO</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">OBSERVAÇÕES</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(parcela, index) in parcelas" :key="index" class="bg-white dark:bg-brand-navy">
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input v-model="parcela.numero_parcelas" type="number" min="1" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <select v-model="parcela.periodicidade" class="w-full px-2 py-1 glass-card-light dark:glass-card border border-white/10 rounded text-gray-900 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="SINAL">SINAL</option>
                    <option value="ÚNICA">ÚNICA</option>
                    <option value="MENSAIS">MENSAIS</option>
                    <option value="SEMESTRAIS">SEMESTRAIS</option>
                    <option value="ANUAIS">ANUAIS</option>
                    <option value="PRO-SOLUTO">PRO-SOLUTO</option>
                    <option value="FINANCIAMENTO">FINANCIAMENTO</option>
                    <option value="FGTS">FGTS</option>
                  </select>
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input v-model="parcela.primeiro_vencimento" type="date" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="parcela.valor_unitario" 
                    @input="formatarMoedaParcela($event, index, 'valor_unitario')"
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    placeholder="R$ 0,00"
                  >
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="parcela.valor_total_serie" 
                    @input="formatarMoedaParcela($event, index, 'valor_total_serie')"
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    placeholder="R$ 0,00"
                    readonly
                  >
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <select v-model="parcela.atualizacao_monetaria" class="w-full px-2 py-1 glass-card-light dark:glass-card border border-white/10 rounded text-gray-900 dark:text-white">
                    <option value="Fixa e irreajustável">Fixa e irreajustável</option>
                    <option value="Reajustável">Reajustável</option>
                  </select>
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input v-model="parcela.forma_pagamento" type="text" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input v-model="parcela.observacoes" type="text" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white">
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2 text-center">
                  <button 
                    type="button" 
                    @click="removerParcela(index)" 
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-2 py-1 font-bold"
                    title="Remover esta parcela"
                  >
                    ×
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex gap-2 mt-2">
            <button 
              type="button" 
              @click="adicionarParcela" 
              class="btn-gradient px-4 py-2"
            >
              Adicionar Parcela
            </button>
            <button 
              type="button" 
              @click="removerUltimaParcela" 
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              :disabled="!parcelas.length"
            >
              Remover Última Parcela
            </button>
          </div>
        </div>

        <!-- Valor Total do Contrato -->
        <div class="flex items-center justify-end gap-2 mb-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <label class="font-bold whitespace-nowrap text-gray-900 dark:text-white">
            VALOR TOTAL DO CONTRATO PARTICULAR DE PROMESSA DE COMPRA E VENDA:
          </label>
          <div class="w-64">
            <input 
              v-model="form.valor_total_contrato" 
              @input="formatarMoeda($event, 'valor_total_contrato')"
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white text-right"
              placeholder="R$ 0,00"
            >
          </div>
        </div>

        <!-- Considerações Gerais -->
        <h2 class="text-xl font-bold mb-4 text-center bg-gray-900 dark:bg-gray-800 text-white p-2 mt-4">CONSIDERAÇÕES GERAIS</h2>
        <div class="mb-6 text-gray-700 dark:text-gray-300">
          <p class="mb-2">1 - O proponente autoriza o corretor a juntar a documentação necessária à consecução do presente mandato.</p>
          <p class="mb-2">2 – Esta proposta, após aceita pela vendedora será de caráter irretratável e irrevogável, ficando o proponente obrigado a comparecer no escritório da vendedora, no prazo de até 30 (trinta) dias, para assinar o Contrato de Compromisso de Compra e Venda e receber o carnê/boleto para pagamento nos respectivos vencimentos. O não comparecimento no prazo estipulado acarretará o cancelamento desta Proposta.</p>
          <p class="mb-2">3 – O Proponente, neste ato, assina um Contrato de Prestação de Serviços de Intermediação, referente a comissão de corretagem expressando anuência e concordância na transferência do pagamento da referida comissão diretamente para o corretor. A referida transferência encontra lastro legal na decisão do STJ, exarado no Recurso Especial Repetitivo nº 1.599.511. Após a formalização do negócio, referida verba não será restituída ao pagante em caso de rescisão contratual.</p>
          <p class="mb-2 font-bold">Cláusula Compromissória: Todo litígio ou controvérsia originário ou decorrente deste instrumento será definitivamente decidido por arbitragem, conforme a Lei 9.307/1996.</p>
        </div>

        <!-- Comissionamento -->
        <h2 class="text-xl font-bold mb-4 text-center p-2 text-white" style="background-color: #25316d;">COMISSIONAMENTO</h2>
        <div class="overflow-x-auto mb-6">
          <div class="mb-2 flex justify-end">
            <button 
              v-if="!isFaturada"
              @click="adicionarColunaPeriodo" 
              type="button" 
              class="btn-gradient px-3 py-1.5 flex items-center text-sm font-medium"
            >
              <PlusIcon class="h-4 w-4 mr-1" />
              Adicionar Período
            </button>
          </div>
          <table class="w-full border border-gray-300 dark:border-gray-700">
            <thead class="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">INTERMEDIADOR</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">NOME</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">CPF/CNPJ</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">% HONORÁRIOS</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">VALOR DOS HONORÁRIOS</th>
                <!-- Colunas dinâmicas para períodos -->
                <th v-if="!isFaturada" v-for="(coluna, index) in colunasComissionamento" :key="index" class="border border-gray-300 dark:border-gray-700 p-2 relative">
                  <div class="flex items-center justify-between">
                    <input 
                      v-model="coluna.nome" 
                      type="date"
                      class="w-full px-1 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white text-xs"
                    >
                    <button 
                      type="button"
                      @click.stop.prevent="removerColunaPeriodo(index)" 
                      class="ml-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold"
                    >
                      ×
                    </button>
                  </div>
                </th>
                <th class="border border-gray-300 dark:border-gray-700 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(comissao, index) in comissionamentos" :key="index" class="bg-white dark:bg-brand-navy">
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="comissao.intermediador" 
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    :readonly="comissao.imobiliaria"
                  >
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="comissao.nome" 
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    :readonly="comissao.imobiliaria"
                  >
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="comissao.cpf_cnpj" 
                    @input="(e) => handleCPFouCNPJInput(e, comissao)" 
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    maxlength="18"
                  >
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <div class="flex flex-col gap-2">
                    <select 
                      v-model="comissao.tipo_comissao" 
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                      @change="handleComissaoChange(comissao)"
                    >
                      <option value="">Selecione</option>
                      <option value="comissao1">Comissão 1 ({{ selectedVenda?.produto?.percentual_comissao1 || 0 }}%)</option>
                      <option value="comissao2">Comissão 2 ({{ selectedVenda?.produto?.percentual_comissao2 || 0 }}%)</option>
                      <option value="personalizado">Personalizado</option>
                    </select>
                    <input 
                      v-model="comissao.percentual_honorarios"
                      type="text"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                      :readonly="comissao.tipo_comissao !== 'personalizado'"
                      @input="handlePercentualInput($event, comissao)"
                    >
                  </div>
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="comissao.valor_honorarios" 
                    @input="formatarMoedaComissao($event, index)"
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    placeholder="R$ 0,00"
                  >
                </td>
                <!-- Valores para cada coluna dinâmica -->
                <td v-if="!isFaturada" v-for="(coluna, colIndex) in colunasComissionamento" :key="colIndex" class="border border-gray-300 dark:border-gray-700 p-2">
                  <input 
                    v-model="comissao.periodos[colIndex]" 
                    @input="formatarMoedaPeriodo($event, index, colIndex)"
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                    placeholder="R$ 0,00"
                  >
                </td>
                <td class="border border-gray-300 dark:border-gray-700 p-2 text-center">
                  <button 
                    type="button" 
                    @click="removerComissionamento(index)" 
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-2 py-1 font-bold"
                    :disabled="comissao.imobiliaria || comissionamentos.length <= 1"
                    :class="{ 'opacity-50 cursor-not-allowed': comissao.imobiliaria || comissionamentos.length <= 1 }"
                    title="Remover este comissionamento"
                  >
                    ×
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex gap-2 mt-2">
            <button 
              type="button" 
              @click="adicionarComissionamento" 
              class="btn-gradient px-4 py-2"
            >
              Adicionar Comissionamento
            </button>
            <button 
              type="button" 
              @click="removerUltimoComissionamento" 
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              :disabled="comissionamentos.length <= 1"
            >
              Remover Último Comissionamento
            </button>
          </div>
        </div>

        <!-- Totais -->
        <div class="flex flex-col gap-4 mb-6">
          <div class="flex items-center gap-4">
            <label class="font-bold whitespace-nowrap text-gray-900 dark:text-white">TOTAL DOS SERVIÇOS PRESTADOS:</label>
            <div class="w-64">
              <input 
                v-model="form.total_servicos_prestados" 
                @input="formatarMoeda($event, 'total_servicos_prestados')"
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                placeholder="R$ 0,00"
              >
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="font-bold whitespace-nowrap text-gray-900 dark:text-white">PROPOSTA + INTERMEDIAÇÃO:</label>
            <div class="w-64">
              <input 
                v-model="form.proposta_mais_intermediacao" 
                @input="formatarMoeda($event, 'proposta_mais_intermediacao')"
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
                placeholder="R$ 0,00"
              >
            </div>
          </div>
        </div>

        <!-- Caixa Azul -->
        <div class="h-12 mb-6 rounded" style="background-color: #25316d;"></div>

        <!-- Local e Data -->
        <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900 dark:text-white">LOCAL:</span>
            <input 
              v-model="form.local" 
              type="text" 
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
              placeholder="GOIÂNIA-GO"
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900 dark:text-white">DATA:</span>
            <input 
              v-model="form.data" 
              type="date" 
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white"
            >
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            type="submit"
            class="btn-gradient px-6 py-2.5 flex items-center"
          >
            <CheckIcon class="h-5 w-5 mr-2" />
            Salvar Proposta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeftIcon, PlusIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useClienteStore } from '@/stores/cliente'

const props = defineProps({
  proposta: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancelar', 'submit'])

const clienteStore = useClienteStore()
const clienteNome = computed(() => clienteStore.clienteNome)
const clienteCNPJ = '00000000000000' // TODO: Adicionar CNPJ ao store do cliente

// Funções para formatação de campos
const formatarCPF = (cpf) => {
  if (!cpf) return ''
  cpf = cpf.replace(/\D/g, '')
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return cpf.substring(0, 14)
}

const formatarCNPJ = (cnpj) => {
  if (!cnpj) return ''
  cnpj = cnpj.replace(/\D/g, '')
  cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2')
  cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2')
  return cnpj.substring(0, 18)
}

const formatarCPFouCNPJ = (valor) => {
  if (!valor) return ''
  valor = valor.replace(/\D/g, '')
  if (valor.length <= 11) {
    return formatarCPF(valor)
  } else {
    return formatarCNPJ(valor)
  }
}

const formatarCEP = (cep) => {
  if (!cep) return ''
  cep = cep.replace(/\D/g, '')
  cep = cep.replace(/^(\d{5})(\d)/, '$1-$2')
  return cep.substring(0, 9)
}

const formatarTelefone = (telefone) => {
  if (!telefone) return ''
  telefone = telefone.replace(/\D/g, '')
  if (telefone.length > 10) {
    telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else {
    telefone = telefone.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3')
  }
  return telefone
}

const formatarMoeda = (event, campo) => {
  let valor = event.target.value.replace(/\D/g, '')
  if (valor === '') {
    form.value[campo] = ''
    return
  }
  valor = (parseInt(valor) / 100).toFixed(2) + ''
  valor = valor.replace('.', ',')
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  form.value[campo] = 'R$ ' + valor
}

const formatarMoedaProponente = (event, index, campo) => {
  let valor = event.target.value.replace(/\D/g, '')
  if (valor === '') {
    proponentesAdicionais.value[index][campo] = ''
    return
  }
  valor = (parseInt(valor) / 100).toFixed(2) + ''
  valor = valor.replace('.', ',')
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  proponentesAdicionais.value[index][campo] = 'R$ ' + valor
}

const formatarMoedaParcela = (event, index, campo) => {
  let valor = event.target.value.replace(/\D/g, '')
  if (valor === '') {
    parcelas.value[index][campo] = ''
    return
  }
  valor = (parseInt(valor) / 100).toFixed(2) + ''
  valor = valor.replace('.', ',')
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  parcelas.value[index][campo] = 'R$ ' + valor
  
  if (campo === 'valor_unitario') {
    calcularValorTotalParcela(index)
  }
}

const formatarMoedaComissao = (event, index) => {
  let valor = event.target.value.replace(/\D/g, '')
  if (valor === '') {
    comissionamentos.value[index].valor_honorarios = ''
    return
  }
  valor = (parseInt(valor) / 100).toFixed(2) + ''
  valor = valor.replace('.', ',')
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  comissionamentos.value[index].valor_honorarios = 'R$ ' + valor
}

const formatarMoedaPeriodo = (event, comissaoIndex, periodoIndex) => {
  let valor = event.target.value.replace(/\D/g, '')
  if (valor === '') {
    comissionamentos.value[comissaoIndex].periodos[periodoIndex] = ''
    return
  }
  valor = (parseInt(valor) / 100).toFixed(2) + ''
  valor = valor.replace('.', ',')
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  comissionamentos.value[comissaoIndex].periodos[periodoIndex] = 'R$ ' + valor
}

const limparFormatacao = (valor) => {
  if (!valor) return ''
  return valor.replace(/\D/g, '')
}

const limparFormatacaoMonetaria = (valor) => {
  if (!valor) return null
  return parseFloat(valor.toString().replace(/[R$\s.]/g, '').replace(',', '.'))
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const calcularValorTotalParcela = (index) => {
  const parcela = parcelas.value[index]
  const valorUnitario = limparFormatacaoMonetaria(parcela.valor_unitario) || 0
  const numeroParcelas = parseInt(parcela.numero_parcelas) || 0
  const valorTotal = valorUnitario * numeroParcelas
  parcela.valor_total_serie = formatCurrency(valorTotal)
}

// Handlers para inputs formatados
const handleCPFInput = (e, campo) => {
  const input = e.target
  const cursor = input.selectionStart
  const valorSemFormatacao = limparFormatacao(input.value)
  const valorFormatado = formatarCPF(valorSemFormatacao)
  
  const diferencaTamanho = valorFormatado.length - input.value.length
  
  if (campo.startsWith('proponente')) {
    const match = campo.match(/proponente(\d+)\.(.+)/)
    if (match) {
      const [_, index, prop] = match
      proponentesAdicionais.value[index][prop] = valorFormatado
    }
  } else {
    form.value[campo] = valorFormatado
  }
  
  setTimeout(() => {
    input.setSelectionRange(cursor + diferencaTamanho, cursor + diferencaTamanho)
  }, 0)
}

const handleCPFouCNPJInput = (e, comissao) => {
  const input = e.target
  const cursor = input.selectionStart
  const valorSemFormatacao = limparFormatacao(input.value)
  const valorFormatado = formatarCPFouCNPJ(valorSemFormatacao)
  
  const diferencaTamanho = valorFormatado.length - input.value.length
  comissao.cpf_cnpj = valorFormatado
  
  setTimeout(() => {
    input.setSelectionRange(cursor + diferencaTamanho, cursor + diferencaTamanho)
  }, 0)
}

const handleCEPInput = (e, campo) => {
  const input = e.target
  const cursor = input.selectionStart
  const valorSemFormatacao = limparFormatacao(input.value)
  const valorFormatado = formatarCEP(valorSemFormatacao)
  
  const diferencaTamanho = valorFormatado.length - input.value.length
  
  if (campo.startsWith('proponente')) {
    const match = campo.match(/proponente(\d+)\.(.+)/)
    if (match) {
      const [_, index, prop] = match
      proponentesAdicionais.value[index][prop] = valorFormatado
    }
  } else {
    form.value[campo] = valorFormatado
  }
  
  setTimeout(() => {
    input.setSelectionRange(cursor + diferencaTamanho, cursor + diferencaTamanho)
  }, 0)
}

const handleTelefoneInput = (e, campo) => {
  const input = e.target
  const cursor = input.selectionStart
  const valorSemFormatacao = limparFormatacao(input.value)
  const valorFormatado = formatarTelefone(valorSemFormatacao)
  
  const diferencaTamanho = valorFormatado.length - input.value.length
  
  if (campo.startsWith('proponente')) {
    const match = campo.match(/proponente(\d+)\.(.+)/)
    if (match) {
      const [_, index, prop] = match
      proponentesAdicionais.value[index][prop] = valorFormatado
    }
  } else {
    form.value[campo] = valorFormatado
  }
  
  setTimeout(() => {
    input.setSelectionRange(cursor + diferencaTamanho, cursor + diferencaTamanho)
  }, 0)
}

const handleImageError = (event) => {
  event.target.src = '/images/logos/logo_azul.png'
}

const vendas = ref([])
const selectedSaleId = ref('')
const selectedVenda = ref(null)
const parcelas = ref([])
const proponentesAdicionais = ref([])
const comissionamentos = ref([])
const colunasComissionamento = ref([
  { nome: new Date().toISOString().split('T')[0] },
  { nome: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0] },
  { nome: new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0] }
])

const clientes = ref([])
const isFaturada = ref(false)

const form = ref({
  total_servicos_prestados: '',
  proposta_mais_intermediacao: '',
  valor_total_contrato: '',
  valor_total_negocio: '',
  comissao_intermediada: '',
  comissao_faturada: '',
  local: 'GOIÂNIA-GO',
  data: new Date().toISOString().split('T')[0]
})

const clientesDisponiveis = computed(() => {
  return clientes.value.filter(cliente => cliente.id !== selectedVenda.value?.cliente_id)
})

const adicionarProponente = () => {
  proponentesAdicionais.value.push({
    cliente_id: '',
    tipo: 'conjuge',
    nome: '',
    cpf: '',
    data_nascimento: '',
    renda: '',
    profissao: '',
    endereco_residencial: '',
    estado_civil_regime: '',
    email: '',
    telefone: '',
    telefone_residencial: '',
    telefone_comercial: '',
    cep: '',
    regime_comunhao: '',
  })
}

const removerProponente = (index) => {
  proponentesAdicionais.value.splice(index, 1)
}

const loadSaleData = async () => {
  if (!selectedSaleId.value) return
  
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get(`/vendas/${selectedSaleId.value}`)
    // selectedVenda.value = response.data
    // isFaturada.value = response.data.modalidade === 'faturada'
    
    // Mock data
    selectedVenda.value = {
      id: selectedSaleId.value,
      cliente: { nome: 'Cliente Teste', cpf: '12345678901', email: 'teste@teste.com', contato: '62999999999' },
      produto: { nome: 'Apartamento', percentual_comissao1: 5, percentual_comissao2: 3 },
      edificio_torre: 'Torre A',
      unidade: '101',
      modalidade: 'normal'
    }
    isFaturada.value = false
    
    const formatarDataParaInput = (dataString) => {
      if (!dataString) return ''
      return dataString.split('T')[0]
    }
    
    form.value = {
      ...form.value,
      id_venda: selectedVenda.value.id,
      nome_cliente: selectedVenda.value.cliente.nome,
      cpf_cliente: formatarCPF(selectedVenda.value.cliente.cpf || ''),
      email_cliente: selectedVenda.value.cliente.email,
      telefone_cliente: formatarTelefone(selectedVenda.value.cliente.contato || ''),
      residencial_cliente: '',
      telefone_comercial_cliente: '',
      cep_cliente: '',
      regime_comunhao_cliente: '',
      edificio_torre: selectedVenda.value.edificio_torre || '',
      unidade_autonoma: selectedVenda.value.unidade || '',
      produto_nome: selectedVenda.value.produto?.nome || '',
      data_nascimento_cliente: '',
      estado_civil_regime_cliente: '',
      endereco_residencial_cliente: '',
      profissao_cliente: '',
      renda_cliente: ''
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('Erro ao carregar dados da venda')
  }
}

const fetchVendas = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/vendasProposta')
    // vendas.value = response.data
    
    // Mock data
    vendas.value = [
      { id: 1, cliente: { nome: 'Cliente Teste' }, produto: { nome: 'Apartamento' }, edificio_torre: 'Torre A', unidade: '101', modalidade: 'normal' }
    ]
  } catch (error) {
    ElMessage.error('Erro ao carregar vendas')
  }
}

const fetchClientes = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/clientes')
    // clientes.value = response.data
    
    // Mock data
    clientes.value = [
      { id: 1, nome: 'Cliente 1' },
      { id: 2, nome: 'Cliente 2' }
    ]
  } catch (error) {
    ElMessage.error('Erro ao carregar clientes')
  }
}

const carregarDadosProponente = async (index) => {
  const proponente = proponentesAdicionais.value[index]
  if (!proponente.cliente_id) return

  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get(`/clientes/${proponente.cliente_id}`)
    // const cliente = response.data
    
    // Mock data
    const cliente = { nome: 'Cliente Teste', cpf: '12345678901', email: 'teste@teste.com', contato: '62999999999' }

    const formatarDataParaInput = (dataString) => {
      if (!dataString) return ''
      return dataString.split('T')[0]
    }

    proponente.nome = cliente.nome || ''
    proponente.cpf = formatarCPF(cliente.cpf || '')
    proponente.data_nascimento = formatarDataParaInput(cliente.data_nascimento) || ''
    proponente.renda = cliente.renda || ''
    proponente.profissao = cliente.profissao || ''
    proponente.endereco_residencial = cliente.endereco_residencial || ''
    proponente.email = cliente.email || ''
    proponente.estado_civil_regime = cliente.estado_civil || ''
    proponente.telefone = formatarTelefone(cliente.contato || '')
    proponente.telefone_residencial = formatarTelefone(cliente.telefone_residencial || '')
    proponente.telefone_comercial = formatarTelefone(cliente.telefone_comercial || '')
    proponente.cep = formatarCEP(cliente.cep || '')
    proponente.regime_comunhao = cliente.regime_comunhao || ''
    proponente.tipo = proponente.tipo || 'conjuge'
  } catch (error) {
    ElMessage.error('Erro ao carregar dados do cliente')
  }
}

watch(parcelas, () => {
  const valorTotal = parcelas.value.reduce((acc, parcela) => acc + (limparFormatacaoMonetaria(parcela.valor_total_serie) || 0), 0)
  form.value.valor_total_contrato = formatCurrency(valorTotal)
}, { deep: true })

watch(
  () => comissionamentos.value.map(comissao => comissao.percentual_honorarios),
  () => {
    comissionamentos.value.forEach((comissao) => {
      let percentualHonorarios = 0
      const valorTotalNegocio = limparFormatacaoMonetaria(form.value.valor_total_negocio) || 0
      if (comissao.tipo_comissao === 'personalizado') {
        percentualHonorarios = parseFloat(comissao.percentual_honorarios) / 100 || 0
      } else {
        percentualHonorarios = (limparFormatacaoMonetaria(comissao.percentual_honorarios) || 0) / 10000
      }
      const novoValorHonorarios = valorTotalNegocio * percentualHonorarios
      comissao.valor_honorarios = formatCurrency(novoValorHonorarios)
    })
  },
  { deep: true }
)

watch(comissionamentos, () => {
  if (comissionamentos.value && comissionamentos.value.length > 0) {
    const periodosTotais = comissionamentos.value.map(comissao => 
      comissao.periodos.reduce((acc, valor) => acc + (limparFormatacaoMonetaria(valor) || 0), 0)
    )
    const valorTotalTodosPeriodos = periodosTotais.reduce((acc, valor) => acc + valor, 0)
    form.value.total_servicos_prestados = formatCurrency(valorTotalTodosPeriodos)
    const proposta_mais_intermediacao = valorTotalTodosPeriodos + (limparFormatacaoMonetaria(form.value.valor_total_contrato) || 0)
    form.value.proposta_mais_intermediacao = formatCurrency(proposta_mais_intermediacao)
  }
}, { deep: true })

const adicionarParcela = () => {
  parcelas.value.push({
    numero_parcelas: 1,
    periodicidade: '',
    primeiro_vencimento: '',
    valor_unitario: '',
    valor_total_serie: '',
    atualizacao_monetaria: 'Fixa e irreajustável',
    forma_pagamento: '',
    observacoes: ''
  })
}

const removerUltimaParcela = () => {
  if (parcelas.value.length > 0) {
    parcelas.value.pop()
  }
}

const removerParcela = (index) => {
  parcelas.value.splice(index, 1)
}

const adicionarComissionamento = () => {
  const isFirstRow = comissionamentos.value.length === 0
  
  comissionamentos.value.push({
    imobiliaria: isFirstRow,
    intermediador: isFirstRow ? 'IMOBILIARIA' : '',
    nome: isFirstRow ? clienteNome.value.toUpperCase() : '',
    cpf_cnpj: isFirstRow ? formatarCNPJ(clienteCNPJ) : '',
    tipo_comissao: '',
    percentual_honorarios: '',
    valor_honorarios: '',
    periodos: new Array(colunasComissionamento.value.length).fill('')
  })
}

const adicionarColunaPeriodo = () => {
  colunasComissionamento.value.push({ nome: '' })
  comissionamentos.value.forEach(comissao => {
    comissao.periodos.push('')
  })
}

const removerColunaPeriodo = (index) => {
  colunasComissionamento.value.splice(index, 1)
  comissionamentos.value.forEach(comissao => {
    comissao.periodos.splice(index, 1)
  })
}

const handleComissaoChange = (comissao) => {
  if (comissao.tipo_comissao === 'comissao1') {
    comissao.percentual_honorarios = selectedVenda.value?.produto?.percentual_comissao1?.toString() || ''
  } else if (comissao.tipo_comissao === 'comissao2') {
    comissao.percentual_honorarios = selectedVenda.value?.produto?.percentual_comissao2?.toString() || ''
  } else if (comissao.tipo_comissao === 'personalizado') {
    comissao.percentual_honorarios = ''
  }
}

const removerUltimoComissionamento = () => {
  if (comissionamentos.value.length <= 1) return
  if (comissionamentos.value[comissionamentos.value.length - 1].imobiliaria) return
  comissionamentos.value.pop()
}

const removerComissionamento = (index) => {
  if (comissionamentos.value[index].imobiliaria || comissionamentos.value.length <= 1) {
    return
  }
  comissionamentos.value.splice(index, 1)
}

const handlePercentualInput = (event, comissao) => {
  if (comissao.tipo_comissao === 'personalizado') {
    let valor = event.target.value.replace(',', '.')
    const pontos = valor.split('.').length - 1
    if (pontos > 1) {
      valor = valor.replace(/\./g, '').replace(/(\d+)(\d{0,2})/, '$1.$2')
    }
    valor = valor.replace(/[^\d.]/g, '')
    comissao.percentual_honorarios = valor
  }
}

const handleSubmit = async () => {
  try {
    const dados = {
      id_venda: form.value.id_venda,
      renda_cliente: limparFormatacaoMonetaria(form.value.renda_cliente),
      profissao_cliente: form.value.profissao_cliente,
      endereco_cliente: form.value.endereco_residencial_cliente,
      total_venda: limparFormatacaoMonetaria(form.value.valor_total_contrato),
      residencial_cliente: limparFormatacao(form.value.residencial_cliente),
      data: form.value.data,
      local: form.value.local,
      total_servicos_prestados: limparFormatacaoMonetaria(form.value.total_servicos_prestados),
      valor_total_contrato: limparFormatacaoMonetaria(form.value.valor_total_contrato),
      telefone_cliente: limparFormatacao(form.value.telefone_cliente),
      regime_comunhao_cliente: form.value.regime_comunhao_cliente,
      telefone_comercial_cliente: limparFormatacao(form.value.telefone_comercial_cliente),
      cep_cliente: limparFormatacao(form.value.cep_cliente),
      valor_total_do_negocio: limparFormatacaoMonetaria(form.value.valor_total_negocio),
      comissao_intermediada: limparFormatacaoMonetaria(form.value.comissao_intermediada),
      comissao_faturada: limparFormatacaoMonetaria(form.value.comissao_faturada),
      valor_intermediacao: limparFormatacaoMonetaria(form.value.comissao_intermediada),
      proposta_mais_intermediacao: limparFormatacaoMonetaria(form.value.proposta_mais_intermediacao),
      proponente_proposta: proponentesAdicionais.value.map(proponente => ({
        cliente_id: proponente.cliente_id,
        tipo_proponente: proponente.tipo,
        renda_proponente: limparFormatacaoMonetaria(proponente.renda),
        profissao_proponente: proponente.profissao,
        endereco_proponente: proponente.endereco_residencial,
        estado_civil_proponente: proponente.estado_civil_regime,
        telefone_proponente: limparFormatacao(proponente.telefone),
        residencial_proponente: proponente.endereco_residencial,
        regime_comunhao_proponente: proponente.regime_comunhao,
        telefone_comercial_proponente: limparFormatacao(proponente.telefone),
        cep_proponente: limparFormatacao(proponente.cep)
      })),
      pagamento_proposta: parcelas.value.map(parcela => ({
        numero_parcelas: parcela.numero_parcelas,
        periodicidade: parcela.periodicidade,
        primeiro_vencimento: parcela.primeiro_vencimento,
        valor_unitario: limparFormatacaoMonetaria(parcela.valor_unitario),
        valor_total_serie_parcelas: limparFormatacaoMonetaria(parcela.valor_total_serie),
        atualizacao_monetaria: parcela.atualizacao_monetaria,
        forma_de_pagamento: parcela.forma_pagamento,
        observacoes: parcela.observacoes
      })),
      comissionamento_proposta: comissionamentos.value.map(comissao => ({
        intermediador: comissao.intermediador,
        nome: comissao.nome,
        cpf_cnpj: limparFormatacao(comissao.cpf_cnpj),
        honorarios: limparFormatacaoMonetaria(comissao.percentual_honorarios),
        valor_honorarios: limparFormatacaoMonetaria(comissao.valor_honorarios)
      })),
      parcelas_comissionamento_proposta: comissionamentos.value.flatMap(comissao =>
        comissao.periodos.map((valor, index) => ({
          numero_parcela: index + 1,
          valor_parcela: limparFormatacaoMonetaria(valor),
          data_pagamento: new Date(colunasComissionamento.value[index].nome).toLocaleDateString('pt-BR')
        }))
      ),
      comissao_imobiliaria: comissionamentos.value.filter(comissao => comissao.imobiliaria).map(comissao => ({
        intermediador: comissao.intermediador,
        nome: comissao.nome,
        cpf_cnpj: limparFormatacao(comissao.cpf_cnpj),
        honorarios: limparFormatacaoMonetaria(comissao.percentual_honorarios),
        valor_honorarios: limparFormatacaoMonetaria(comissao.valor_honorarios)
      })),
      parcelas_comissao_imobiliaria: comissionamentos.value.filter(comissao => comissao.imobiliaria).flatMap(comissao =>
        comissao.periodos.map((valor, index) => ({
          numero_parcela: index + 1,
          valor_parcela: limparFormatacaoMonetaria(valor),
          data_pagamento: new Date(colunasComissionamento.value[index].nome).toLocaleDateString('pt-BR')
        }))
      )
    }
    
    // TODO: Substituir por chamada real à API
    // const response = await api.post('/propostas', dados)
    // if (response.status === 200) {
    //   ElMessage.success('Proposta criada com sucesso')
    //   emit('submit')
    // }
    
    ElMessage.success('Proposta criada com sucesso')
    emit('submit')
    
  } catch (error) {
    console.error('Erro detalhado:', error.response?.data)
    ElMessage.error('Erro ao criar proposta: ' + (error.response?.data?.message || 'Erro desconhecido'))
  }
}

onMounted(() => {
  fetchVendas()
  fetchClientes()
  if (props.proposta) {
    selectedSaleId.value = props.proposta.id
    loadSaleData()
  }
  // Adiciona o primeiro comissionamento (imobiliária) automaticamente
  if (comissionamentos.value.length === 0) {
    adicionarComissionamento()
  }
})
</script>
