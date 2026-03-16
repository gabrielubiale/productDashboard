import { useState } from 'react'
import { MagnifyingGlass, Plus } from 'phosphor-react'
import { NumberInput } from '../../shared/forms/inputs/NumberInput'
import { SelectInput } from '../../shared/forms/inputs/SelectInput'
import { DateInput } from '../../shared/forms/inputs/DateInput'
import { FormHeader } from '../../shared/forms/FormHeader'

type BillingEntriesFormProps = {
  initialValues?: Record<string, any>
  onSubmitEntry: (values: Record<string, any>) => Promise<void> | void
  onCancel?: () => void
  headerTitle?: string
}

export function BillingEntriesForm({
  initialValues,
  onSubmitEntry,
  onCancel,
  headerTitle,
}: BillingEntriesFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const [formValues, setFormValues] = useState<Record<string, any>>({
    contribuinteId: initialValues?.contribuinteId ?? null,
    taxCreditType: initialValues?.taxCreditType ?? 'all',
    launchStatus: initialValues?.launchStatus ?? 'all',
    onlyActiveDebt: initialValues?.onlyActiveDebt ?? 'all',
    onlyInstallments: initialValues?.onlyInstallments ?? 'all',
    launchNumber: initialValues?.launchNumber ?? null,
    dueDateStart: initialValues?.dueDateStart ?? '',
    dueDateEnd: initialValues?.dueDateEnd ?? '',
    settlementDateStart: initialValues?.settlementDateStart ?? '',
    settlementDateEnd: initialValues?.settlementDateEnd ?? '',
  })

  function handleChange(name: string, value: any) {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmitEntry(formValues)
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      {headerTitle && (
        <FormHeader
          title={headerTitle}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />
      )}

      {isExpanded && (
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Linha 1: Contribuinte, Tipo de crédito tributário, Situação lançamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberInput
                name="contribuinteId"
                label="Contribuinte"
                value={formValues.contribuinteId}
                onChange={(val) => handleChange('contribuinteId', val)}
                placeholder="CPF/CNPJ do contribuinte"
              />

              <SelectInput
                name="taxCreditType"
                label="Tipo de crédito tributário"
                value={formValues.taxCreditType}
                onChange={(val) => handleChange('taxCreditType', val)}
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
                value={formValues.launchStatus}
                onChange={(val) => handleChange('launchStatus', val)}
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

            {/* Linha 2: Apenas em dívida ativa?, Apenas parcelados?, N° lançamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                name="onlyActiveDebt"
                label="Apenas em dívida ativa?"
                value={formValues.onlyActiveDebt}
                onChange={(val) => handleChange('onlyActiveDebt', val)}
                options={[
                  { value: 'all', label: 'Listar TODOS os débitos' },
                  { value: 'without_active_debt', label: 'Listar apenas débitos SEM dívida ativa' },
                  {
                    value: 'with_active_debt',
                    label: 'Listar APENAS débitos EM DÍVIDAS ATIVAS',
                  },
                ]}
              />

              <SelectInput
                name="onlyInstallments"
                label="Apenas parcelados?"
                value={formValues.onlyInstallments}
                onChange={(val) => handleChange('onlyInstallments', val)}
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

              <NumberInput
                name="launchNumber"
                label="N° lançamento"
                value={formValues.launchNumber}
                onChange={(val) => handleChange('launchNumber', val)}
                placeholder="Informe o número lançamento"
              />
            </div>

            {/* Linha 3: Datas de vencimento e liquidação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-full flex justify-center">
                  <span className="text-sm font-medium text-gray-700">Data de vencimento</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateInput
                    name="dueDateStart"
                    label="Data inicial"
                    value={formValues.dueDateStart}
                    onChange={(val) => handleChange('dueDateStart', val)}
                  />
                  <DateInput
                    name="dueDateEnd"
                    label="Data final"
                    value={formValues.dueDateEnd}
                    onChange={(val) => handleChange('dueDateEnd', val)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full flex justify-center">
                  <span className="text-sm font-medium text-gray-700">Data de liquidação</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateInput
                    name="settlementDateStart"
                    label="Data inicial"
                    value={formValues.settlementDateStart}
                    onChange={(val) => handleChange('settlementDateStart', val)}
                  />
                  <DateInput
                    name="settlementDateEnd"
                    label="Data final"
                    value={formValues.settlementDateEnd}
                    onChange={(val) => handleChange('settlementDateEnd', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ações finais */}
          <div className="flex flex-wrap items-center justify-end gap-3 px-4 pb-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0F5132' }}
            >
              <MagnifyingGlass size={18} weight="bold" />
              <span>Pesquisar</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: '#0F5132' }}
            >
              <Plus size={18} weight="bold" />
              <span>Lançamento manual</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

