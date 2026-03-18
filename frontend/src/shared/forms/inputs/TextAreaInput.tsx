type TextAreaInputProps = {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  description?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  rows?: number
}

export function TextAreaInput({
  name,
  label,
  value,
  onChange,
  error,
  description,
  required,
  disabled,
  placeholder,
  rows = 4,
}: TextAreaInputProps) {
  const baseInputClasses =
    'w-full px-3 py-2 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'

  const inputClasses = `${baseInputClasses} ${error ? 'border-red-500' : 'border-gray-300'}`

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${inputClasses} resize-y`}
      />

      {description && !error && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

