import { useState } from 'react'
import { FunnelSimple, MagnifyingGlass } from 'phosphor-react'
import { FiltersSidebar } from '../../shared/components/FiltersSidebar/FiltersSidebar'
import { BillingEntriesAdvancedFilters } from './components/BillingEntriesAdvancedFilters'
import AsyncContributorSelect from './components/AsyncContributorSelect'
import type { RemoteContributor } from '../../services/contributorsService'

type BillingEntriesFormProps = {
  initialValues?: Record<string, any>
  onSubmitEntry: (values: Record<string, any>) => Promise<void> | void
  onCancel?: () => void
}

export function BillingEntriesForm({ initialValues, onSubmitEntry }: BillingEntriesFormProps) {
  const [isExpanded] = useState(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const [formValues, setFormValues] = useState<Record<string, any> & { contributor?: RemoteContributor | null }>({
    cpfCnpj: initialValues?.cpfCnpj ?? '',
    contributor: initialValues?.contributor ?? null,
    registroNumero: initialValues?.registroNumero ?? null,
    taxCreditType: initialValues?.taxCreditType ?? 'all',
    launchStatus: initialValues?.launchStatus ?? 'all',
    onlyActiveDebt: initialValues?.onlyActiveDebt ?? 'all',
    onlyInstallments: initialValues?.onlyInstallments ?? 'all',
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

  function handleNumericChange(name: string, raw: string) {
    const onlyDigits = raw.replace(/\D/g, '')
    handleChange(name, onlyDigits)
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault()
    }
    await onSubmitEntry(formValues)
  }

  function handleReset() {
    setFormValues({
      cpfCnpj: '',
      contributor: null,
      registroNumero: null,
      taxCreditType: 'all',
      launchStatus: 'all',
      onlyActiveDebt: 'all',
      onlyInstallments: 'all',
      dueDateStart: '',
      dueDateEnd: '',
      settlementDateStart: '',
      settlementDateEnd: '',
    })
  }

  const inputClass =
    'w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]'
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1'
  const fieldClass = 'flex flex-1 flex-col min-w-0'
  const btnSecondaryClass =
    'flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]'
  const btnPrimaryIconClass =
    'flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]'

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {isExpanded && (
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className={fieldClass}>
                <AsyncContributorSelect
                  value={formValues.contributor ?? null}
                  onChange={(contributor) => {
                    handleChange('contributor', contributor)
                    handleChange('cpfCnpj', contributor?.documentoRFB ?? '')
                  }}
                  label="CPF/CNPJ"
                  placeholder="CPF/CNPJ do contribuinte"
                />
              </div>

              <div className={fieldClass}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do registro</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formValues.registroNumero ?? ''}
                  onChange={(e) => handleNumericChange('registroNumero', e.target.value)}
                  className={inputClass}
                  placeholder="Informe o número do registro"
                />
              </div>

              <div className="shrink-0 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className={btnPrimaryIconClass}
                  title="Buscar"
                >
                  <MagnifyingGlass size={20} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className={btnSecondaryClass}
                >
                  Limpar filtros
                </button>

                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(true)}
                  className={btnSecondaryClass}
                >
                  <FunnelSimple size={18} weight="bold" />
                  <span>Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <FiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        title="Filtros avançados"
        size="md"
      >
        <BillingEntriesAdvancedFilters
          values={formValues}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm cursor-pointer"
          >
            Limpar filtros
          </button>
          <button
            type="button"
            onClick={() => {
              void handleSubmit()
              setIsFiltersOpen(false)
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm cursor-pointer"
          >
            Aplicar filtros
          </button>
        </div>
      </FiltersSidebar>
    </div>
  )
}

