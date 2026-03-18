import { tributosHttpClient } from './tributosHttpClient'

export type RemoteBillingEntry = {
  lancamentoId: string
  numeroLancamento: number
  numeroParcela: number
  tipoCredito: number
  tipoCreditoDescricao: string
  tipoCreditoDescricaoResumida: string
  nome: string
  documentoRFB: string
  valorOriginal: number
  valorResidual: number
  valorResidualAtualizado: number
  valorTotal: number
  dataVencimento: string
  situacaoLancamento: number
  situacaoLancamentoDescricao: string
  situacaoLancamentoVirtualDescricao: string
  valorJuros: number
  valorJurosRecebido: number
  valorJurosTotal: number
  valorMulta: number
  valorMultaRecebida: number
  valorMultaTotal: number
  valorCorrecaoMonetaria: number
  valorCorrecaoMonetariaRecebida: number
  valorCorrecaoMonetariaTotal: number
  tipoLiquidacao: number
  tipoLiquidacaoDescricao: string
  vencido: boolean
  parcelado: boolean
  lancamentoEmParcelas: boolean
  dividaAtiva: boolean
  dividaAtivaComCDA: boolean
  dividaAtivaId: string
  numeroDAT: number
  numeroCDA: number
  numeroParcelamento: number
  identificacaoCreditoDescricao: string
  identificacaoCreditoDescricaoResumida: string
  identificacaoDescricao: string
  identificacaoValor: string
  exercicio: number
  podeInscreverDAT: boolean
}

export type BillingEntry = RemoteBillingEntry & {
  id: string
}

function mapRemoteToBillingEntry(remote: RemoteBillingEntry): BillingEntry {
  return {
    ...remote,
    id: remote.lancamentoId,
  }
}

export type RemoteBillingEntryDetail = RemoteBillingEntry & {
  historico?: string
}

export type BillingEntryDetail = RemoteBillingEntryDetail

export type BillingEntryEvent = {
  data: string
  tipoEvento: string
  descricaoEvento: string
  usuario: string
}

export const billingEntriesService = {
  async fetchBillingEntries(page: number): Promise<BillingEntry[]> {
    const data = await billingEntriesService.fetchBillingEntriesWithFilters({
      page,
    })

    return data
  },

  async fetchBillingEntriesWithFilters(input: {
    page: number
    contribuinteId?: string
    numeroLancamento?: string | number | null
    onlyInstallments?: string
    onlyActiveDebt?: string
    taxCreditType?: string
    launchStatus?: string
    dueDateStart?: string
    dueDateEnd?: string
    settlementDateStart?: string
    settlementDateEnd?: string
  }): Promise<BillingEntry[]> {
    const params = new URLSearchParams({
      pagina: String(input.page),
      itens: '20',
    })

    if (input.contribuinteId) {
      params.set('contribuinteId', input.contribuinteId)
    } else {
      params.set('contribuinteId', '')
    }

    if (input.numeroLancamento) {
      params.set('numeroLancamento', String(input.numeroLancamento))
    } else {
      params.set('numeroLancamento', '')
    }

    // parcelado (onlyInstallments -> parcelado)
    if (input.onlyInstallments === 'with_installments') {
      params.set('parcelado', 'true')
    } else if (input.onlyInstallments === 'without_installments') {
      params.set('parcelado', 'false')
    } else {
      params.set('parcelado', '')
    }

    // dividaAtiva (onlyActiveDebt -> dividaAtiva)
    if (input.onlyActiveDebt === 'with_active_debt') {
      params.set('dividaAtiva', 'true')
    } else if (input.onlyActiveDebt === 'without_active_debt') {
      params.set('dividaAtiva', 'false')
    } else {
      params.set('dividaAtiva', '')
    }

    // tipoCredito
    if (input.taxCreditType && input.taxCreditType !== 'all') {
      params.set('tipoCredito', input.taxCreditType)
    } else {
      params.set('tipoCredito', '')
    }

    // situacaoLancamento
    if (input.launchStatus && input.launchStatus !== 'all') {
      params.set('situacaoLancamento', input.launchStatus)
    } else {
      params.set('situacaoLancamento', '')
    }

    // datas de vencimento
    params.set('dataVencimentoInicial', input.dueDateStart || '')
    params.set('dataVencimentoFinal', input.dueDateEnd || '')

    // datas de liquidação
    params.set('dataLiquidacaoInicial', input.settlementDateStart || '')
    params.set('dataLiquidacaoFinal', input.settlementDateEnd || '')

    const data = await tributosHttpClient.get<RemoteBillingEntry[]>(
      `/lancamentos/listar?${params.toString()}`,
    )

    return data.map(mapRemoteToBillingEntry)
  },

  async fetchBillingEntryDetail(lancamentoId: string): Promise<BillingEntryDetail> {
    const params = new URLSearchParams({
      lancamentoId,
    })

    const detail = await tributosHttpClient.get<RemoteBillingEntryDetail>(
      `/lancamentos/detalhe?${params.toString()}`,
    )

    return detail
  },

  async fetchBillingEntryEvents(input: {
    origemId: string
    numeroOrigem: number
    tipoOrigem: number
  }): Promise<BillingEntryEvent[]> {
    const params = new URLSearchParams({
      origemId: input.origemId,
      numeroOrigem: String(input.numeroOrigem),
      tipoOrigem: String(input.tipoOrigem),
    })

    const events = await tributosHttpClient.get<BillingEntryEvent[]>(
      `/eventos/listarEventos?${params.toString()}`,
    )

    return events
  },
}

