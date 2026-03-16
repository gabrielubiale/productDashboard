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
}

export type BillingEntry = {
  id: string
  numeroLancamento: number
  contribuinte: string
  documento: string
  tipoCredito: string
  situacao: string
  dataVencimento: string
  valorTotal: number
}

function mapRemoteToBillingEntry(remote: RemoteBillingEntry): BillingEntry {
  return {
    id: remote.lancamentoId,
    numeroLancamento: remote.numeroLancamento,
    contribuinte: remote.nome,
    documento: remote.documentoRFB,
    tipoCredito: remote.tipoCreditoDescricaoResumida || remote.tipoCreditoDescricao,
    situacao: remote.situacaoLancamentoVirtualDescricao || remote.situacaoLancamentoDescricao,
    dataVencimento: remote.dataVencimento,
    valorTotal: remote.valorTotal,
  }
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
}

