type NumberInputProps = {
  name: string
  label: string
  value: number | null
  onChange: (value: number | null) => void
  error?: string
  description?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export function NumberInput({
  name,
  label,
  value,
  onChange,
  error,
  description,
  required,
  disabled,
  placeholder,
}: NumberInputProps) {
  const baseInputClasses = 'form-input pt-4'

  const inputClasses = `${baseInputClasses} ${error ? 'border-red-500' : 'border-gray-300'}`

  function handleChange(raw: string) {
    if (!raw.trim()) {
      onChange(null)
      return
    }
    const parsed = Number(raw.replace(',', '.'))
    if (Number.isNaN(parsed)) {
      return
    }
    onChange(parsed)
  }

  return (
    <div className="relative space-y-1">
      <label
        htmlFor={name}
        className="absolute -top-2 left-4 bg-white px-1 text-xs font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        inputMode="decimal"
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

