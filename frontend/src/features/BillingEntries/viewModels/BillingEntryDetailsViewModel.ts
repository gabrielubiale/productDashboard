import type { BillingEntry, BillingEntryDetail } from '../../../services/billingEntriesService'
import { formatDocument } from '../../../shared/utils/formatDocument'
import { parseHistoricoKeyValue, splitHistoricoLines } from '../utils/historico'
import { safeNumber } from '../utils/safeNumber'

export type BillingEntryDetailsViewModel = {
  // Hero
  tituloContribuinte: string
  contribNome: string
  contribDocumentoFormatted: string
  situacao: string
  origem: string
  dataFatoGeradorLabel: string
  dataVencimentoLabel: string
  numeroLancamento: string

  // Flags
  isLiquidado: boolean
  isPago: boolean
  isTaxa: boolean
  isGuiaEmitida: boolean

  // Valores (totais)
  valorOriginal: number
  valorJurosTotal: number
  valorMultaTotal: number
  valorCorrecaoMonetariaTotal: number
  valorPrincipal: number // "valorTotal" (usado como base na guia)
  encargos: number
  valorGuia: number

  // Valores (liquidação)
  valorPrincipalRecebido: number
  valorJurosRecebido: number
  valorMultaRecebida: number
  valorCorrecaoMonetariaRecebida: number
  valorLiquidadoTotal: number // "valorPago" (usado no layout completo)
  valorLiquidadoCompact: number // soma (juros/multa/correção) recebidos (usado no compacto)

  // Histórico e observações
  historicoParsed: { label: string; value: string }[]
  historicoLines: string[]
  historicoVazio: boolean

  observacoesParsed: { label: string; value: string }[]
  hasObservacoes: boolean
}

export function buildBillingEntryDetailsViewModel(
  entry: BillingEntry,
  detail?: BillingEntryDetail | null,
): BillingEntryDetailsViewModel {
  const effective = (detail ?? entry) as BillingEntryDetail | BillingEntry

  const tipoCreditoDescricao = String((effective as any).tipoCreditoDescricao ?? '').trim()
  const isTaxa = tipoCreditoDescricao.toUpperCase() === 'TAXA'

  const situacao =
    ('situacaoLancamentoVirtualDescricao' in effective &&
      (effective as any).situacaoLancamentoVirtualDescricao) ||
    (effective as any).situacaoLancamentoDescricao

  const normalizedSituacao = String(situacao ?? '').trim().toLowerCase()
  const isLiquidado = normalizedSituacao === 'liquidado'
  const isPago = normalizedSituacao === 'pago'

  // Regra (mantida do componente atual):
  // - quando for Taxa, exibir layout de "guia já emitida" fora de Liquidado/Pago.
  const isGuiaEmitida = isTaxa && !isLiquidado && !isPago

  const origem =
    ('tipoCreditoDescricaoResumida' in effective &&
      (effective as any).tipoCreditoDescricaoResumida) ||
    (effective as any).tipoCreditoDescricao

  const contribNome =
    (effective as any).contribuinte?.pessoa?.nome?.trim() || (effective as any).nome?.trim() || ''

  const contribDocumentoRaw =
    (effective as any).contribuinte?.pessoa?.documentoRFB || (effective as any).documentoRFB

  const contribDocumentoFormatted = formatDocument(contribDocumentoRaw)
  const tituloContribuinte = contribNome
    ? `${contribNome} — ${contribDocumentoFormatted}`
    : contribDocumentoFormatted

  const dataFatoGeradorLabel = (effective as any).dataFatoGerador
    ? new Date((effective as any).dataFatoGerador).toLocaleDateString('pt-BR')
    : '—'

  const dataVencimentoLabel = (effective as any).dataVencimento
    ? new Date((effective as any).dataVencimento).toLocaleDateString('pt-BR')
    : '—'

  const numeroLancamento = String((effective as any).numeroLancamento ?? '—')

  // Totais
  const valorOriginal = safeNumber((effective as any).valorOriginal)
  const valorJurosTotal = safeNumber((effective as any).valorJurosTotal)
  const valorMultaTotal = safeNumber((effective as any).valorMultaTotal)
  const valorCorrecaoMonetariaTotal = safeNumber((effective as any).valorCorrecaoMonetariaTotal)

  const valorPrincipal = safeNumber((effective as any).valorTotal)
  const encargos = valorJurosTotal + valorMultaTotal + valorCorrecaoMonetariaTotal
  const valorGuia = valorPrincipal + encargos

  // Recebidos
  const valorPrincipalRecebido = safeNumber((effective as any).valorPrincipalRecebido)
  const valorJurosRecebido = safeNumber((effective as any).valorJurosRecebido)
  const valorMultaRecebida = safeNumber((effective as any).valorMultaRecebida)
  const valorCorrecaoMonetariaRecebida = safeNumber((effective as any).valorCorrecaoMonetariaRecebida)

  const valorLiquidadoTotal = safeNumber((effective as any).valorPago)
  const valorLiquidadoCompact = valorJurosRecebido + valorMultaRecebida + valorCorrecaoMonetariaRecebida

  // Histórico e observações
  const historicoRaw =
    ((detail as any)?.historico as string | undefined) ??
    ((effective as any).historico as string | undefined) ??
    ''

  const historicoParsed = parseHistoricoKeyValue(historicoRaw)
  const historicoLines = splitHistoricoLines(historicoRaw)

  const observacaoRaw =
    ((detail as any)?.observacao as string | undefined) ??
    ((detail as any)?.observacoes as string | undefined) ??
    ((effective as any).observacao as string | undefined) ??
    ((effective as any).observacoes as string | undefined)

  const observacoesParsed = parseHistoricoKeyValue(observacaoRaw ?? null)

  return {
    tituloContribuinte,
    contribNome,
    contribDocumentoFormatted,
    situacao: String(situacao ?? '').trim(),
    origem: String(origem ?? '').trim(),
    dataFatoGeradorLabel,
    dataVencimentoLabel,
    numeroLancamento,

    isLiquidado,
    isPago,
    isTaxa,
    isGuiaEmitida,

    valorOriginal,
    valorJurosTotal,
    valorMultaTotal,
    valorCorrecaoMonetariaTotal,
    valorPrincipal,
    encargos,
    valorGuia,

    valorPrincipalRecebido,
    valorJurosRecebido,
    valorMultaRecebida,
    valorCorrecaoMonetariaRecebida,
    valorLiquidadoTotal,
    valorLiquidadoCompact,

    historicoParsed,
    historicoLines,
    historicoVazio: historicoParsed.length === 0,

    observacoesParsed,
    hasObservacoes: observacoesParsed.length > 0,
  }
}

