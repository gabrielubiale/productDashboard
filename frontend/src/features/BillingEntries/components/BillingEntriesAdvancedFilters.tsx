import { SelectInput } from '../../../shared/forms/inputs/SelectInput'
import { DateInput } from '../../../shared/forms/inputs/DateInput'

type BillingEntriesAdvancedFiltersProps = {
  values: Record<string, any>
  onChange: (name: string, value: any) => void
}

export function BillingEntriesAdvancedFilters({
  values,
  onChange,
}: BillingEntriesAdvancedFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
        <span className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          Situações
        </span>
        <div className="mt-2 space-y-3">
          <SelectInput
            name="onlyActiveDebt"
            label="Apenas em dívida ativa?"
            value={values.onlyActiveDebt}
            onChange={(val) => onChange('onlyActiveDebt', val)}
            options={[
              { value: 'all', label: 'Listar TODOS os débitos' },
              {
                value: 'without_active_debt',
                label: 'Listar apenas débitos SEM dívida ativa',
              },
              {
                value: 'with_active_debt',
                label: 'Listar APENAS débitos EM DÍVIDAS ATIVAS',
              },
            ]}
          />

          <SelectInput
            name="onlyInstallments"
            label="Apenas parcelados?"
            value={values.onlyInstallments}
            onChange={(val) => onChange('onlyInstallments', val)}
            options={[
              { value: 'all', label: 'Listar TODOS os débitos' },
              {
                value: 'without_installments',
                label: 'Listar apenas débitos SEM parcelamento',
              },
              {
                value: 'with_installments',
                label: 'Lista APENAS débitos EM PARCELAMENTO',
              },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
        <span className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          Tipo de crédito e situação
        </span>
        <div className="mt-2 space-y-3">
          <SelectInput
            name="taxCreditType"
            label="Tipo de crédito tributário"
            value={values.taxCreditType}
            onChange={(val) => onChange('taxCreditType', val)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'iptu', label: 'IPTU' },
              { value: 'itbi', label: 'ITBI' },
              { value: 'taxa', label: 'Taxa' },
              { value: 'multa', label: 'Multa' },
              { value: 'iss', label: 'ISS' },
              { value: 'irrf', label: 'IRRF' },
              { value: 'other', label: 'Outro créditos tributários' },
            ]}
          />

          <SelectInput
            name="launchStatus"
            label="Situação lançamento"
            value={values.launchStatus}
            onChange={(val) => onChange('launchStatus', val)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'open', label: 'Em aberto' },
              { value: 'settled', label: 'Liquidado' },
              { value: 'suspended', label: 'Suspenso' },
              { value: 'canceled', label: 'Cancelado' },
              { value: 'paid', label: 'Pago' },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
        <span className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          Data de vencimento
        </span>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <DateInput
            name="dueDateStart"
            label="Data inicial"
            value={values.dueDateStart}
            onChange={(val) => onChange('dueDateStart', val)}
          />
          <DateInput
            name="dueDateEnd"
            label="Data final"
            value={values.dueDateEnd}
            onChange={(val) => onChange('dueDateEnd', val)}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 mb-1">
        <span className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          Data de liquidação
        </span>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <DateInput
            name="settlementDateStart"
            label="Data inicial"
            value={values.settlementDateStart}
            onChange={(val) => onChange('settlementDateStart', val)}
          />
          <DateInput
            name="settlementDateEnd"
            label="Data final"
            value={values.settlementDateEnd}
            onChange={(val) => onChange('settlementDateEnd', val)}
          />
        </div>
      </div>
    </div>
  )
}

