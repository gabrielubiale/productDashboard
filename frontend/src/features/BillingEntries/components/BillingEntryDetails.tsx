import type {
  BillingEntry,
  BillingEntryDetail,
  BillingEntryEvent,
} from '../../../services/billingEntriesService'
import { useEffect, useRef, useState } from 'react'
import { SectionHeader } from '../../../shared/components/SectionHeader'
import { SelectInput } from '../../../shared/forms/inputs/SelectInput'
import { TextAreaInput } from '../../../shared/forms/inputs/TextAreaInput'
import { X } from 'phosphor-react'

import { formatCurrencyBRL } from '../utils/money'
import { buildBillingEntryDetailsViewModel } from '../viewModels/BillingEntryDetailsViewModel'
import { BillingEntryDetailsEventsSection } from './details/BillingEntryDetailsEventsSection'
import { BillingEntryDetailsGuiaSection } from './details/BillingEntryDetailsGuiaSection'
import { BillingEntryDetailsHero } from './details/BillingEntryDetailsHero'
import { BillingEntryDetailsHistoricoSection } from './details/BillingEntryDetailsHistoricoSection'
import { BillingEntryDetailsObservacoesSection } from './details/BillingEntryDetailsObservacoesSection'
import { BillingEntryDetailsValuesSection } from './details/BillingEntryDetailsValuesSection'

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
  const vm = buildBillingEntryDetailsViewModel(entry, detail)
  const {
    isLiquidado,
    isPago,
    isGuiaEmitida,
    historicoParsed,
    historicoVazio,
    observacoesParsed,
    hasObservacoes,
    contribNome,
    contribDocumentoFormatted,
    situacao,
    dataVencimentoLabel,
    valorPrincipal,
    encargos,
    valorGuia,
  } = vm

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

  return (
    <div className="flex flex-col gap-5 text-sm text-gray-700 bg-gray-50/40 -mx-2 px-2 py-1 rounded-lg">
      {isLoading && (
        <p className="text-sm text-blue-600 px-1">Carregando detalhes do lançamento...</p>
      )}

      {error && <p className="text-sm text-red-600 px-1">{error}</p>}

      <BillingEntryDetailsHero vm={vm} />

      <BillingEntryDetailsValuesSection vm={vm} />

      {!historicoVazio && <BillingEntryDetailsHistoricoSection items={historicoParsed} />}

      {hasObservacoes && (
        <BillingEntryDetailsObservacoesSection items={observacoesParsed} />
      )}

      <BillingEntryDetailsEventsSection events={events} />

      {/* Guia de recolhimento */}
      {!isLiquidado && !isPago && (
        <>
          <BillingEntryDetailsGuiaSection
            vm={vm}
            anistiaRef={anistiaRef}
            anistiaOpen={anistiaOpen}
            anistiaSuccess={anistiaSuccess}
            anistiaSelecao={anistiaSelecao}
            onAnistiaSelecaoChange={setAnistiaSelecao}
            anistiaConta={anistiaConta}
            onAnistiaContaChange={setAnistiaConta}
            anistiaMotivo={anistiaMotivo}
            onAnistiaMotivoChange={setAnistiaMotivo}
            onOpenAnistia={() => {
              setAnistiaOpen(true)
              setAnistiaSuccess(false)
            }}
            onCloseAnistia={() => {
              setAnistiaOpen(false)
              setAnistiaSuccess(false)
            }}
            onConfirmAnistia={() => {
              setAnistiaSuccess(true)
            }}
          />
          <section className="hidden">
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
                      {dataVencimentoLabel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                      Valor total
                    </span>
                    <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                      {formatCurrencyBRL(valorGuia)}
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
                    <span className="font-semibold text-gray-900">{contribDocumentoFormatted}</span>
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
                      {dataVencimentoLabel}
                    </span>
                  </div>
                </div>

              <div className="flex w-full flex-col gap-0 md:w-1/2">
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600">Valor principal</span>
                      <span className="text-sm font-medium tabular-nums text-gray-800">
                        {formatCurrencyBRL(valorPrincipal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600">Encargos</span>
                      <span className="text-sm font-medium tabular-nums text-gray-800">
                        {formatCurrencyBRL(encargos)}
                      </span>
                    </div>
                    <div className="my-2 h-px w-full bg-gray-200" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-800">Valor guia</span>
                      <span className="text-base font-semibold text-emerald-700 tabular-nums">
                        {formatCurrencyBRL(valorGuia)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-500">Valor no vencimento</span>
                      <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                        {formatCurrencyBRL(valorGuia)}
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
                        Encargos: {formatCurrencyBRL(encargos)}
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
                        Encargos: {formatCurrencyBRL(encargos)}
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
                        Encargos: {formatCurrencyBRL(encargos)}
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
        </>
      )}
    </div>
  )
}
