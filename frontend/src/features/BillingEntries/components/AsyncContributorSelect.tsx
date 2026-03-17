import { useEffect, useRef, useState } from 'react'
import { contributorsService, type RemoteContributor } from '../../../services/contributorsService'

type AsyncContributorSelectProps = {
  value?: RemoteContributor | null
  onChange: (value: RemoteContributor | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}

function formatDocumento(documento: string) {
  const digits = documento.replace(/\D/g, '')

  if (digits.length === 11) {
    // CPF: 000.000.000-00
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  if (digits.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  return documento
}

const inputBaseClass =
  'w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]'

const labelBaseClass = 'block text-sm font-medium text-gray-700 mb-1'

const dropdownBaseClass =
  'absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-20'

const optionBaseClass = 'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100'

const selectedOptionClass = 'bg-blue-50 text-blue-700'

const stateTextClass = 'px-3 py-2 text-sm text-gray-500 cursor-default'

const DEBOUNCE_MS = 300

const AsyncContributorSelect = ({
  value = null,
  onChange,
  placeholder,
  label,
  disabled,
}: AsyncContributorSelectProps) => {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<RemoteContributor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const debounceTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (value) {
      setInputValue(`${value.nome} - ${formatDocumento(value.documentoRFB)}`)
      return
    }

    setInputValue('')
  }, [value])

  useEffect(() => {
    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current)
    }

    const trimmed = inputValue.trim()

    if (!trimmed) {
      setOptions([])
      setLoading(false)
      setError(null)
      return
    }

    debounceTimeoutRef.current = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)

        const results = await contributorsService.fetchByDocument(trimmed)
        setOptions(results)
      } catch (_err) {
        setError('Ocorreu un erro ao buscar. Tente novamente.')
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [inputValue])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleSelect(option: RemoteContributor) {
    onChange(option)
    setInputValue(`${option.nome} - ${formatDocumento(option.documentoRFB)}`)
    setIsOpen(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }
  }

  const showNoResults = !loading && !error && inputValue.trim() !== '' && options.length === 0

  return (
    <div className="flex flex-col min-w-0" ref={containerRef}>
      {label && <label className={labelBaseClass}>{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={inputBaseClass}
          placeholder={placeholder}
          disabled={disabled}
        />

        {isOpen && (
          <div className={dropdownBaseClass}>
            {loading && <div className={stateTextClass}>Carregando...</div>}

            {error && !loading && <div className={stateTextClass}>{error}</div>}

            {showNoResults && <div className={stateTextClass}>Nenhum resultado encontrado</div>}

            {!loading &&
              !error &&
              options.map((option) => {
                const isSelected = value?.id === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`${optionBaseClass} ${isSelected ? selectedOptionClass : ''}`}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="font-medium text-gray-900 text-left truncate">{option.nome}</div>
                    <div className="text-xs text-gray-500 text-left">
                      {formatDocumento(option.documentoRFB)} ({option.documentoRFB})
                    </div>
                  </button>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AsyncContributorSelect

