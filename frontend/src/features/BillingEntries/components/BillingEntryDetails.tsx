import type {
  BillingEntry,
  BillingEntryDetail,
  BillingEntryEvent,
} from '../../../services/billingEntriesService'
import { useEffect, useRef, useState } from 'react'
import { DynamicTable } from '../../../shared/components/DynamicTable/DynamicTable'
import { formatDocument } from '../../../shared/utils/formatDocument'
import { SectionHeader } from '../../../shared/components/SectionHeader'
import { formatDateTime } from '../../../shared/utils/formatDateTime'
import { SelectInput } from '../../../shared/forms/inputs/SelectInput'
import { TextAreaInput } from '../../../shared/forms/inputs/TextAreaInput'
import { X } from 'phosphor-react'

function n(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}

function formatCurrency(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return safe.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function FakeBarcode({ code }: { code: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div
        className="h-14 w-90 rounded-md bg-white flex items-center justify-center px-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, #111827 0px, #111827 2px, transparent 2px, transparent 4px)',
        }}
        aria-hidden
      />
      <div className="mt-2 text-sm font-mono text-gray-600 break-all">{code}</div>
    </div>
  )
}

type DetailMoneyRowProps = {
  label: string
  amount: number
  emphasis?: boolean
  labelBold?: boolean
}

function DetailMoneyRow({ label, amount, emphasis, labelBold }: DetailMoneyRowProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-2 py-0.5">
      <span
        className={
          labelBold
            ? 'text-sm font-semibold text-gray-600'
            : 'text-sm text-gray-500'
        }
      >
        {label}
      </span>
      <span
        className={
          emphasis
            ? 'text-sm font-semibold text-emerald-700 tabular-nums'
            : 'text-sm font-medium text-gray-800 tabular-nums'
        }
      >
        {formatCurrency(amount)}
      </span>
    </div>
  )
}

type BillingEntryDetailsProps = {
  entry: BillingEntry
  detail?: BillingEntryDetail | null
  events?: BillingEntryEvent[]
  isLoading?: boolean
  error?: string | null
}

export function BillingEntryDetails({
  entry,
  detail,
  events = [],
  isLoading,
  error,
}: BillingEntryDetailsProps) {
  const effective = (detail ?? entry) as BillingEntryDetail | BillingEntry

  const [anistiaOpen, setAnistiaOpen] = useState(false)
  const [anistiaSuccess, setAnistiaSuccess] = useState(false)
  const [anistiaConta, setAnistiaConta] = useState('bb_padrao')
  const [anistiaMotivo, setAnistiaMotivo] = useState('')
  const [anistiaSelecao, setAnistiaSelecao] = useState<'total' | 'seletiva' | 'informada'>(
    'seletiva',
  )
  const anistiaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!anistiaOpen) return

    // Garante que o modal "desça" para mostrar o bloco recém-aberto.
    const t = window.setTimeout(() => {
      anistiaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)

    return () => window.clearTimeout(t)
  }, [anistiaOpen])

  function parseHistorico(raw?: string | null) {
    type ParsedItem = { label: string; value: string }

    if (!raw) return [] as ParsedItem[]

    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const items = lines.map((line) => {
      const [labelPart, ...rest] = line.split(':')
      if (rest.length === 0) {
        return {
          label: '',
          value: line,
        }
      }

      return {
        label: `${labelPart.trim()}:`,
        value: rest.join(':').trim(),
      }
    })

    return items
  }

  const historicoParsed = parseHistorico(
    (detail as BillingEntryDetail | undefined)?.historico ?? (effective as any).historico,
  )

  function renderDescricaoEventoWithHighlight(descricao: string) {
    if (!descricao) return null

    const match = descricao.match(/\$([\d.,]+)/)
    if (!match) {
      return descricao.split('\n').map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))
    }

    const rawAmount = match[1]
    const amountNumber = Number(rawAmount.replace(/\./g, '').replace(',', '.'))

    const formattedAmount = Number.isFinite(amountNumber)
      ? amountNumber.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : rawAmount

    const before = descricao.slice(0, match.index)
    const after = descricao.slice((match.index ?? 0) + match[0].length)

    return (
      <>
        {before && <span className="block whitespace-pre-line">{before}</span>}
        <span className="block font-semibold text-emerald-700">{formattedAmount}</span>
        {after && <span className="block whitespace-pre-line">{after}</span>}
      </>
    )
  }

  const valorPrincipal = n(effective.valorTotal)
  const encargos =
    n(effective.valorJurosTotal) +
    n(effective.valorMultaTotal) +
    n(effective.valorCorrecaoMonetariaTotal)
  const valorGuia = valorPrincipal + encargos

  const observacaoRaw =
  (detail as BillingEntryDetail | undefined)?.observacao ??
  (detail as BillingEntryDetail | undefined)?.observacoes ??
  (effective as any).observacao ??
  (effective as any).observacoes

  const observacoesParsed = parseHistorico(observacaoRaw ?? null)
  const hasObservacoes = observacoesParsed.length > 0

  const valorPrincipalRecebido = n((effective as any).valorPrincipalRecebido)
  const valorLiquidadoTotal = n((effective as any).valorPago)

  const situacao =
    ('situacaoLancamentoVirtualDescricao' in effective &&
      (effective as any).situacaoLancamentoVirtualDescricao) ||
    (effective as any).situacaoLancamentoDescricao
  const normalizedSituacao = String(situacao ?? '').trim().toLowerCase()
  const isLiquidado = normalizedSituacao === 'liquidado'
  const isPago = normalizedSituacao === 'pago'

  const tipoCreditoDescricao = String((effective as any).tipoCreditoDescricao ?? '').trim()
  const isTaxa = tipoCreditoDescricao.toUpperCase() === 'TAXA'
  // Regra 3 (simulada): quando for Taxa, exibir layout de “guia já emitida” fora de Liquidado/Pago.
  const isGuiaEmitida = isTaxa && !isLiquidado && !isPago
  const origem =
    ('tipoCreditoDescricaoResumida' in effective &&
      (effective as any).tipoCreditoDescricaoResumida) ||
    (effective as any).tipoCreditoDescricao

  const contribNome =
    (effective as any).contribuinte?.pessoa?.nome?.trim() || effective.nome?.trim() || ''
  const contribDocumento =
    (effective as any).contribuinte?.pessoa?.documentoRFB || effective.documentoRFB

  const tituloContribuinte = contribNome
    ? `${contribNome} — ${formatDocument(contribDocumento)}`
    : formatDocument(contribDocumento)

  const historicoVazio = historicoParsed.length === 0

  return (
    <div className="flex flex-col gap-5 text-sm text-gray-700 bg-gray-50/40 -mx-2 px-2 py-1 rounded-lg">
      {isLoading && (
        <p className="text-sm text-blue-600 px-1">Carregando detalhes do lançamento...</p>
      )}

      {error && <p className="text-sm text-red-600 px-1">{error}</p>}

      {/* Bloco 1 - Hero */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        {tituloContribuinte && (
          <div className="text-center">
            <span className="font-semibold text-gray-900 text-base">{tituloContribuinte}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50/80 p-4 justify-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Situação
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                  {situacao || '—'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Origem
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                  {origem || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Data do fato gerador</span>
              <span className="font-medium text-gray-900">
                {(effective as any).dataFatoGerador
                  ? new Date((effective as any).dataFatoGerador).toLocaleDateString('pt-BR')
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Data de vencimento</span>
              <span className="font-medium text-gray-900">
                {new Date(effective.dataVencimento).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">N° lançamento</span>
              <span className="font-medium text-gray-900">{effective.numeroLancamento}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Valores do lançamento */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <SectionHeader title="Valores do lançamento" />
        <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row">
          <div className="flex w-full flex-col gap-1">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Composição
            </p>
            <DetailMoneyRow label="Valor original" amount={n(effective.valorOriginal)} />
            <DetailMoneyRow label="Juros" amount={n(effective.valorJurosTotal)} />
            <DetailMoneyRow label="Multa" amount={n(effective.valorMultaTotal)} />
            <DetailMoneyRow
              label="Correção monetária"
              amount={n(effective.valorCorrecaoMonetariaTotal)}
            />
            <div className="mt-1 border-t border-gray-100 pt-2">
              <DetailMoneyRow
                label="Valor total"
                amount={n(effective.valorTotal)}
                emphasis
                labelBold
              />
            </div>
          </div>

          <div className="hidden sm:block w-px shrink-0 bg-gray-100" aria-hidden />

          <div className="flex w-full flex-col gap-1">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Liquidado
            </p>
            <DetailMoneyRow
              label="Total principal liquidado"
              amount={valorPrincipalRecebido}
            />
            <DetailMoneyRow label="Juros recebidos" amount={n(effective.valorJurosRecebido)} />
            <DetailMoneyRow label="Multa recebida" amount={n(effective.valorMultaRecebida)} />
            <DetailMoneyRow
              label="Correção monetária recebida"
              amount={n(effective.valorCorrecaoMonetariaRecebida)}
            />
            <div className="mt-1 border-t border-gray-100 pt-2">
              <DetailMoneyRow
                label="Valor liquidado"
                amount={valorLiquidadoTotal}
                emphasis
                labelBold
              />
            </div>
          </div>
        </div>
      </section>

      {/* Histórico */}
      {!historicoVazio && (
        <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <SectionHeader title="Histórico de lançamentos" />
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {historicoParsed.map((item, index) => (
                <div key={`hist-${index}`} className="flex flex-col gap-0.5">
                  {item.label && (
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      {item.label}
                    </span>
                  )}
                  <span className="whitespace-pre-line text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Observações */}
      {hasObservacoes && (
        <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <SectionHeader title="Observações" />
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {observacoesParsed.map((item, index) => (
                <div key={`obs-${index}`} className="flex flex-col gap-0.5">
                  {item.label && (
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      {item.label}
                    </span>
                  )}
                  <span className="whitespace-pre-line text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Eventos */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <SectionHeader title="Eventos" />
        <div className="border-t border-gray-200 px-3 py-3">
          <DynamicTable<BillingEntryEvent>
            data={events}
            keyExtractor={(_item: BillingEntryEvent, index: number) => String(index)}
            minWidth="600px"
            emptyMessage="Nenhum evento encontrado para este lançamento."
            columns={[
              {
                id: 'data',
                header: 'Data e hora',
                render: (item) => formatDateTime(item.data),
              },
              {
                id: 'tipoEvento',
                header: 'Tipo do evento',
                render: (item) => item.tipoEvento,
              },
              {
                id: 'descricaoEvento',
                header: 'Descrição',
                render: (item) => (
                  <div className="text-sm text-gray-700">
                    {renderDescricaoEventoWithHighlight(item.descricaoEvento)}
                  </div>
                ),
              },
              {
                id: 'usuario',
                header: 'Usuário',
                render: (item) => item.usuario,
              },
            ]}
          />
        </div>
      </section>

      {/* Guia de recolhimento */}
      {!isLiquidado && !isPago && (
        <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <SectionHeader title="Guia de recolhimento" />
          {/* layout 3: guia emitida */}
          {isGuiaEmitida ? (
            <div className="flex flex-col gap-6 border-t border-gray-200 px-4 py-4 md:flex-row">

              <div className="flex w-full flex-col gap-3 md:w-1/2">
                <FakeBarcode
                  code="816700001109000070120246123000000000900021304303"
                />
              </div>

              <div className="flex w-full flex-col gap-3 md:w-1/2">
                <div className='flex flex-row justify-between gap-2'>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Vencimento
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(effective.dataVencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Valor total
                    </span>
                    <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                      {formatCurrency(valorGuia)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex-1 rounded-lg bg-yellow-400/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-yellow-500"
                  >
                    Nova guia
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex-1 rounded-lg bg-orange-500/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500"
                  >
                    Imprimir
                  </button>
                </div>
              </div>

            </div>
          ) : (
            // Layout 2: a ser emitido + Anistia fake
            <div className="flex flex-col gap-6 border-t border-gray-200 px-4 py-4">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex w-full flex-col justify-around gap-0 md:w-1/2">
                  <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      CPF/CNPJ
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatDocument(contribDocumento)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Nome
                    </span>
                    <span className="font-semibold text-gray-900">{contribNome}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Situação
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                      {situacao || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Vencimento
                    </span>
                    <span className="text-sm text-gray-800">
                      {new Date(effective.dataVencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

              <div className="flex w-full flex-col gap-0 md:w-1/2">
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600">Valor principal</span>
                      <span className="text-sm font-medium tabular-nums text-gray-800">
                        {formatCurrency(valorPrincipal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600">Encargos</span>
                      <span className="text-sm font-medium tabular-nums text-gray-800">
                        {formatCurrency(encargos)}
                      </span>
                    </div>
                    <div className="my-2 h-px w-full bg-gray-200" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-800">Valor guia</span>
                      <span className="text-base font-semibold text-emerald-700 tabular-nums">
                        {formatCurrency(valorGuia)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-500">Valor no vencimento</span>
                      <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                        {formatCurrency(valorGuia)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Fake: não realizar emissão real no desafio técnico.
                      }}
                      className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Emitir
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAnistiaOpen(true)
                        setAnistiaSuccess(false)
                      }}
                      className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Anistia de encargos
                    </button>
                  </div>
                </div>
              </div>
              </div>
              {anistiaOpen && (
                <div
                  ref={anistiaRef}
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Anistia de Encargos</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Selecione se a anistia de encargos será: total, seletiva ou informada
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAnistiaOpen(false)
                        setAnistiaSuccess(false)
                      }}
                      className="rounded-lg p-1 hover:bg-gray-100 text-gray-600 cursor-pointer"
                      aria-label="Fechar"
                    >
                      <X size={20} weight="bold" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setAnistiaSelecao('total')}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        anistiaSelecao === 'total'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      aria-pressed={anistiaSelecao === 'total'}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`text-sm font-semibold uppercase tracking-wide ${
                            anistiaSelecao === 'total'
                              ? 'text-emerald-800'
                              : 'text-gray-600'
                          }`}
                        >
                          Total
                        </div>
                        {anistiaSelecao === 'total' && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-gray-800">
                        Encargos: {formatCurrency(encargos)}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnistiaSelecao('seletiva')}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        anistiaSelecao === 'seletiva'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      aria-pressed={anistiaSelecao === 'seletiva'}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`text-sm font-semibold uppercase tracking-wide ${
                            anistiaSelecao === 'seletiva'
                              ? 'text-emerald-800'
                              : 'text-gray-600'
                          }`}
                        >
                          Seletiva
                        </div>
                        {anistiaSelecao === 'seletiva' && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-3 text-sm ${
                          anistiaSelecao === 'seletiva' ? 'text-emerald-900' : 'text-gray-800'
                        }`}
                      >
                        Encargos: {formatCurrency(encargos)}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnistiaSelecao('informada')}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        anistiaSelecao === 'informada'
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      aria-pressed={anistiaSelecao === 'informada'}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`text-sm font-semibold uppercase tracking-wide ${
                            anistiaSelecao === 'informada'
                              ? 'text-emerald-800'
                              : 'text-gray-600'
                          }`}
                        >
                          Informada
                        </div>
                        {anistiaSelecao === 'informada' && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-gray-800">
                        Encargos: {formatCurrency(encargos)}
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-600/5 px-3 py-2 text-sm text-emerald-900">
                    {anistiaSelecao === 'total' &&
                      'O valor de todos os encargos será anistiado na totalidade.'}
                    {anistiaSelecao === 'seletiva' &&
                      'O valor total de cada encargo selecionado será anistiado.'}
                    {anistiaSelecao === 'informada' &&
                      'O valor anistiado será calculado de acordo com o percentual informado em cada encargo.'}
                  </div>

                  <div className="mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <SelectInput
                          name="anistiaConta"
                          label="Convênio / Conta bancária"
                          value={anistiaConta}
                          onChange={setAnistiaConta}
                          options={[
                            {
                              value: 'bb_padrao',
                              label:
                                'Convênio | Banco do Brasil | Ag: 1673 | Cc: 89877-7 | Cv: 97920 / 0 (padrão)',
                            },
                          ]}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TextAreaInput
                          name="anistiaMotivo"
                          label="Motivo da Anistia de Encargos"
                          value={anistiaMotivo}
                          onChange={setAnistiaMotivo}
                          rows={4}
                          placeholder="Informe o motivo (exemplo ilustrativo)."
                        />
                      </div>
                    </div>
                  </div>

                  {anistiaSuccess && (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                      Solicitação de anistia enviado com sucesso
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAnistiaOpen(false)
                        setAnistiaSuccess(false)
                      }}
                      className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAnistiaSuccess(true)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
