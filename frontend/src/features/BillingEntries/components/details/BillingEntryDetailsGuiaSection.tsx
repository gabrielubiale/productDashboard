import type React from 'react'
import { formatCurrencyBRL } from '../../utils/money'
import type { BillingEntryDetailsViewModel } from '../../viewModels/BillingEntryDetailsViewModel'
import { SectionHeader } from '../../../../shared/components/SectionHeader'
import { FakeBarcode } from './FakeBarcode'
import type { AnistiaSelecao } from './AnistiaEncargosPanel'
import { AnistiaEncargosPanel } from './AnistiaEncargosPanel'

export function BillingEntryDetailsGuiaSection({
  vm,
  anistiaRef,
  anistiaOpen,
  anistiaSuccess,
  anistiaSelecao,
  onAnistiaSelecaoChange,
  anistiaConta,
  onAnistiaContaChange,
  anistiaMotivo,
  onAnistiaMotivoChange,
  onOpenAnistia,
  onCloseAnistia,
  onConfirmAnistia,
}: {
  vm: BillingEntryDetailsViewModel
  anistiaRef: React.RefObject<HTMLDivElement | null>
  anistiaOpen: boolean
  anistiaSuccess: boolean
  anistiaSelecao: AnistiaSelecao
  onAnistiaSelecaoChange: (value: AnistiaSelecao) => void
  anistiaConta: string
  onAnistiaContaChange: (value: string) => void
  anistiaMotivo: string
  onAnistiaMotivoChange: (value: string) => void
  onOpenAnistia: () => void
  onCloseAnistia: () => void
  onConfirmAnistia: () => void
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <SectionHeader title="Guia de recolhimento" />
      {/* layout 3: guia emitida */}
      {vm.isGuiaEmitida ? (
        <div className="flex flex-col gap-6 border-t border-gray-200 px-4 py-4 md:flex-row">
          <div className="flex w-full flex-col gap-3 md:w-1/2">
            <FakeBarcode code="816700001109000070120246123000000000900021304303" />
          </div>

          <div className="flex w-full flex-col gap-3 md:w-1/2">
            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Vencimento
                </span>
                <span className="text-sm font-semibold text-gray-900">{vm.dataVencimentoLabel}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Valor total
                </span>
                <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                  {formatCurrencyBRL(vm.valorGuia)}
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
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">CPF/CNPJ</span>
                <span className="font-semibold text-gray-900">{vm.contribDocumentoFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">Nome</span>
                <span className="font-semibold text-gray-900">{vm.contribNome}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">Situação</span>
                <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                  {vm.situacao || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">Vencimento</span>
                <span className="text-sm text-gray-800">{vm.dataVencimentoLabel}</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-0 md:w-1/2">
              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">Valor principal</span>
                    <span className="text-sm font-medium tabular-nums text-gray-800">
                      {formatCurrencyBRL(vm.valorPrincipal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">Encargos</span>
                    <span className="text-sm font-medium tabular-nums text-gray-800">
                      {formatCurrencyBRL(vm.encargos)}
                    </span>
                  </div>
                  <div className="my-2 h-px w-full bg-gray-200" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800">Valor guia</span>
                    <span className="text-base font-semibold text-emerald-700 tabular-nums">
                      {formatCurrencyBRL(vm.valorGuia)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-500">Valor no vencimento</span>
                    <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                      {formatCurrencyBRL(vm.valorGuia)}
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
                    onClick={onOpenAnistia}
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    Anistia de encargos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {anistiaOpen && (
            <AnistiaEncargosPanel
              anistiaRef={anistiaRef}
              encargos={vm.encargos}
              anistiaSelecao={anistiaSelecao}
              onAnistiaSelecaoChange={onAnistiaSelecaoChange}
              anistiaConta={anistiaConta}
              onAnistiaContaChange={onAnistiaContaChange}
              anistiaMotivo={anistiaMotivo}
              onAnistiaMotivoChange={onAnistiaMotivoChange}
              anistiaSuccess={anistiaSuccess}
              onClose={onCloseAnistia}
              onConfirm={onConfirmAnistia}
            />
          )}
        </div>
      )}
    </section>
  )
}

