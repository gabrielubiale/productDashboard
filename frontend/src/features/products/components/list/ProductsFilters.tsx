import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlass } from 'phosphor-react'
import type { ProductStatus } from '../../../../services/types'

type StatusOption = {
  value: ProductStatus | ''
  label: string
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Disponíveis' },
  { value: 'inactive', label: 'Indisponíveis' },
]

type ProductsFiltersProps = {
  isLoading: boolean
}

export function ProductsFilters({ isLoading }: ProductsFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchLocal, setSearchLocal] = useState(() => searchParams.get('search') ?? '')

  const searchFromUrl = searchParams.get('search') ?? ''
  const status = (searchParams.get('status') as ProductStatus | null) ?? ''

  useEffect(() => {
    setSearchLocal(searchFromUrl)
  }, [searchFromUrl])

  function applySearch() {
    const next = new URLSearchParams(searchParams)
    if (searchLocal.trim()) {
      next.set('search', searchLocal.trim())
    } else {
      next.delete('search')
    }
    setSearchParams(next)
  }

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams)
    if (value && value.length) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  function handleReset() {
    setSearchLocal('')
    setSearchParams(new URLSearchParams())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      applySearch()
    }
  }

  const inputClass = 'w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const fieldClass = 'flex flex-1 flex-col min-w-0'
  const btnClass = 'flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]'

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
      <div className={fieldClass}>
        <label className={labelClass}>Buscar por nome</label>
        <input
          type="text"
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={inputClass}
          placeholder="Digite o nome do produto..."
        />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Status</label>
        <select
          value={status}
          onChange={(e) => updateParam('status', e.target.value || null)}
          disabled={isLoading}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value} className="bg-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={applySearch}
          disabled={isLoading}
          className={btnClass}
          title="Buscar"
        >
          <MagnifyingGlass size={20} weight="bold" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className={btnClass}
        >
          Limpar filtros
        </button>
      </div>
    </div>
  )
}
