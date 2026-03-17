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

// Detalhe do lançamento: por enquanto, usamos o mesmo shape básico do RemoteBillingEntry
// e adicionamos campos específicos da rota de detalhe.
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
    const params = new URLSearchParams({
      tipoCredito: '1',
      dataVencimentoInicial: '2021-03-15',
      pagina: String(page),
      itens: '10',
    })

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

