import type { BillingEntryDetailsViewModel } from '../../viewModels/BillingEntryDetailsViewModel'

export function BillingEntryDetailsHero({ vm }: { vm: BillingEntryDetailsViewModel }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
      {vm.tituloContribuinte && (
        <div className="text-center">
          <span className="font-semibold text-gray-900 text-base">{vm.tituloContribuinte}</span>
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
                {vm.situacao || '—'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Origem
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                {vm.origem || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2">
            <span className="text-sm text-gray-500">Data do fato gerador</span>
            <span className="font-medium text-gray-900">{vm.dataFatoGeradorLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2">
            <span className="text-sm text-gray-500">Data de vencimento</span>
            <span className="font-medium text-gray-900">{vm.dataVencimentoLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">N° lançamento</span>
            <span className="font-medium text-gray-900">{vm.numeroLancamento}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

