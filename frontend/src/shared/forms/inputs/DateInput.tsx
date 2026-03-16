type DateInputProps = {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  description?: string
  required?: boolean
  disabled?: boolean
}

export function DateInput({
  name,
  label,
  value,
  onChange,
  error,
  description,
  required,
  disabled,
}: DateInputProps) {
  const baseInputClasses = 'form-input pt-4'

  const inputClasses = `${baseInputClasses} ${error ? 'border-red-500' : 'border-gray-300'}`

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
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

