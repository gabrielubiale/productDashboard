import type {
  BillingEntry,
  BillingEntryDetail,
  BillingEntryEvent,
} from '../../../services/billingEntriesService'
import { formatDocument } from '../../../shared/utils/formatDocument'
import { formatDateTime } from '../../../shared/utils/formatDateTime'

function n(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}

function formatCurrency(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return safe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

type BillingEntryDetailsCompactProps = {
  entry: BillingEntry
  detail?: BillingEntryDetail | null
  events?: BillingEntryEvent[]
  isLoading?: boolean
  error?: string | null
}

export function BillingEntryDetailsCompact({
  entry,
  detail,
  events = [],
  isLoading,
  error,
}: BillingEntryDetailsCompactProps) {
  const effective = (detail ?? entry) as BillingEntryDetail | BillingEntry

  const contribNome =
    (effective as any).contribuinte?.pessoa?.nome?.trim() || (effective as any).nome?.trim() || ''
  const contribDocumento =
    (effective as any).contribuinte?.pessoa?.documentoRFB || (effective as any).documentoRFB

  const tituloContribuinte = contribNome
    ? `${contribNome} — ${formatDocument(contribDocumento)}`
    : formatDocument(contribDocumento)

  const situacao =
    ('situacaoLancamentoVirtualDescricao' in effective &&
      (effective as any).situacaoLancamentoVirtualDescricao) ||
    (effective as any).situacaoLancamentoDescricao

  const origem =
    ('tipoCreditoDescricaoResumida' in effective &&
      (effective as any).tipoCreditoDescricaoResumida) ||
    (effective as any).tipoCreditoDescricao

  const valorTotal = n((effective as any).valorTotal)
  const valorOriginal = n((effective as any).valorOriginal)
  const juros = n((effective as any).valorJurosTotal)
  const multa = n((effective as any).valorMultaTotal)
  const correcao = n((effective as any).valorCorrecaoMonetariaTotal)

  const encargos = juros + multa + correcao
  const valorGuia = valorTotal + encargos

  const valorLiquidado =
    n((effective as any).valorJurosRecebido) +
    n((effective as any).valorMultaRecebida) +
    n((effective as any).valorCorrecaoMonetariaRecebida)

  const dataVencimento = (effective as any).dataVencimento
    ? new Date((effective as any).dataVencimento).toLocaleDateString('pt-BR')
    : '—'

  const dataFatoGerador = (effective as any).dataFatoGerador
    ? new Date((effective as any).dataFatoGerador).toLocaleDateString('pt-BR')
    : '—'

  const numeroLancamento = (effective as any).numeroLancamento ?? '—'

  const historicoRaw =
    ((detail as any)?.historico as string | undefined) ??
    ((effective as any).historico as string | undefined) ??
    ''

  const historicoLines = historicoRaw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const historicoPreview = historicoLines.slice(0, 4)
  const hasMoreHistorico = historicoLines.length > historicoPreview.length

  const eventosPreview = events.slice(0, 3)
  const hasMoreEventos = events.length > eventosPreview.length

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm space-y-3">
      {isLoading && (
        <p className="text-xs text-blue-600">Carregando detalhes do lançamento...</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">{tituloContribuinte}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
              {origem}
            </span>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              {situacao}
            </span>
            <span className="text-xs text-gray-500">N° {String(numeroLancamento)}</span>
            <span className="text-xs text-gray-500">Venc. {dataVencimento}</span>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            Valor total
          </div>
          <div className="text-sm font-semibold tabular-nums text-emerald-800">
            {formatCurrency(valorTotal)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Original
          </div>
          <div className="text-sm font-medium tabular-nums text-gray-900">
            {formatCurrency(valorOriginal)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Encargos
          </div>
          <div className="text-sm font-medium tabular-nums text-gray-900">
            {formatCurrency(encargos)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Liquidado
          </div>
          <div className="text-sm font-medium tabular-nums text-gray-900">
            {formatCurrency(valorLiquidado)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
          <div className="text-xs text-gray-500">Data do fato gerador</div>
          <div className="text-sm font-medium text-gray-900">{dataFatoGerador}</div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
          <div className="text-xs text-gray-500">Juros / Multa / Correção</div>
          <div className="text-sm font-medium tabular-nums text-gray-900">
            {formatCurrency(juros)} / {formatCurrency(multa)} / {formatCurrency(correcao)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
          <div className="text-xs text-gray-500">Valor guia (estimado)</div>
          <div className="text-sm font-semibold tabular-nums text-emerald-700">
            {formatCurrency(valorGuia)}
          </div>
        </div>
      </div>

      <details className="rounded-lg border border-gray-100 bg-white">
        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-gray-800">
          Histórico{historicoLines.length ? ` (${historicoLines.length})` : ''}
        </summary>
        <div className="px-3 pb-3 pt-1 text-sm text-gray-700 space-y-1">
          {historicoLines.length === 0 ? (
            <p className="text-sm text-gray-500">Histórico não disponível para este lançamento.</p>
          ) : (
            <>
              {historicoPreview.map((line, idx) => (
                <p key={idx} className="text-sm text-gray-800">
                  {line}
                </p>
              ))}
              {hasMoreHistorico && (
                <p className="text-xs text-gray-500">
                  +{historicoLines.length - historicoPreview.length} linhas…
                </p>
              )}
            </>
          )}
        </div>
      </details>

      <details className="rounded-lg border border-gray-100 bg-white">
        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-gray-800">
          Eventos{events.length ? ` (${events.length})` : ''}
        </summary>
        <div className="px-3 pb-3 pt-1 text-sm text-gray-700 space-y-2">
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum evento encontrado para este lançamento.</p>
          ) : (
            <>
              {eventosPreview.map((ev, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 border-b border-gray-100 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      {formatDateTime(ev.data)}
                    </span>
                    <span className="text-xs text-gray-500">{ev.usuario}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{ev.tipoEvento}</div>
                  <div className="text-sm text-gray-700 line-clamp-2 whitespace-pre-line">
                    {ev.descricaoEvento}
                  </div>
                </div>
              ))}
              {hasMoreEventos && (
                <p className="text-xs text-gray-500">
                  +{events.length - eventosPreview.length} eventos…
                </p>
              )}
            </>
          )}
        </div>
      </details>

      <details className="rounded-lg border border-gray-100 bg-white">
        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-gray-800">
          Guia de recolhimento
        </summary>
        <div className="px-3 pb-3 pt-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-gray-500">Valor guia</div>
              <div className="text-sm font-semibold tabular-nums text-emerald-700">
                {formatCurrency(valorGuia)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log('Emitir guia de recolhimento para lançamento', numeroLancamento)
              }}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Emitir
            </button>
          </div>
        </div>
      </details>
    </div>
  )
}

