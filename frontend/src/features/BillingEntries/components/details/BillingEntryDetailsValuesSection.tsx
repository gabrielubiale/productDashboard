import { SectionHeader } from '../../../../shared/components/SectionHeader'
import type { BillingEntryDetailsViewModel } from '../../viewModels/BillingEntryDetailsViewModel'
import { DetailMoneyRow } from './DetailMoneyRow'

export function BillingEntryDetailsValuesSection({ vm }: { vm: BillingEntryDetailsViewModel }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <SectionHeader title="Valores do lançamento" />
      <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row">
        <div className="flex w-full flex-col gap-1">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Composição
          </p>
          <DetailMoneyRow label="Valor original" amount={vm.valorOriginal} />
          <DetailMoneyRow label="Juros" amount={vm.valorJurosTotal} />
          <DetailMoneyRow label="Multa" amount={vm.valorMultaTotal} />
          <DetailMoneyRow
            label="Correção monetária"
            amount={vm.valorCorrecaoMonetariaTotal}
          />
          <div className="mt-1 border-t border-gray-100 pt-2">
            <DetailMoneyRow
              label="Valor total"
              amount={vm.valorPrincipal}
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
          <DetailMoneyRow label="Total principal liquidado" amount={vm.valorPrincipalRecebido} />
          <DetailMoneyRow label="Juros recebidos" amount={vm.valorJurosRecebido} />
          <DetailMoneyRow label="Multa recebida" amount={vm.valorMultaRecebida} />
          <DetailMoneyRow
            label="Correção monetária recebida"
            amount={vm.valorCorrecaoMonetariaRecebida}
          />
          <div className="mt-1 border-t border-gray-100 pt-2">
            <DetailMoneyRow
              label="Valor liquidado"
              amount={vm.valorLiquidadoTotal}
              emphasis
              labelBold
            />
          </div>
        </div>
      </div>
    </section>
  )
}

