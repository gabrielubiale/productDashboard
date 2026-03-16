import { useState } from 'react'
import type React from 'react'
import type { FormSchema, FormFieldSchema } from './formSchema'
import { TextInput } from './inputs/TextInput'
import { SelectInput } from './inputs/SelectInput'
import { DateInput } from './inputs/DateInput'
import { NumberInput } from './inputs/NumberInput'
import { EmailInput } from './inputs/EmailInput'
import { TextAreaInput } from './inputs/TextAreaInput'
import { MoneyInput } from './inputs/MoneyInput'

type DynamicFormProps = {
  schema: FormSchema
  values: Record<string, any>
  errors?: Record<string, string | undefined>
  onChange: (values: Record<string, any>) => void
  onSubmit: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
}

export function DynamicForm({
  schema,
  values,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
}: DynamicFormProps) {
  const [isExpanded] = useState(true)

  function handleFieldChange(name: string, value: any) {
    onChange({
      ...values,
      [name]: value,
    })
  }

  function renderField(field: FormFieldSchema) {
    const value = values[field.name]
    const error = errors[field.name]

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            name={field.name}
            label={field.label}
            value={value ?? ''}
            onChange={(val) => handleFieldChange(field.name, val)}
            placeholder={field.placeholder}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      case 'textarea':
        return (
          <TextAreaInput
            name={field.name}
            label={field.label}
            value={value ?? ''}
            onChange={(val) => handleFieldChange(field.name, val)}
            placeholder={field.placeholder}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      case 'select':
        return (
          <SelectInput
            name={field.name}
            label={field.label}
            value={value ?? ''}
            onChange={(val) => handleFieldChange(field.name, val)}
            options={field.options}
            placeholder={field.placeholder}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      case 'date':
        return (
          <DateInput
            name={field.name}
            label={field.label}
            value={value ?? ''}
            onChange={(val) => handleFieldChange(field.name, val)}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      case 'number':
        return (
          <NumberInput
            name={field.name}
            label={field.label}
            value={value ?? null}
            onChange={(val) => handleFieldChange(field.name, val)}
            placeholder={field.placeholder}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      case 'email':
        return (
          <EmailInput
            name={field.name}
            label={field.label}
            value={value ?? ''}
            onChange={(val) => handleFieldChange(field.name, val)}
            placeholder={field.placeholder}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      case 'money':
        return (
          <MoneyInput
            name={field.name}
            label={field.label}
            value={value ?? null}
            onChange={(val) => handleFieldChange(field.name, val)}
            placeholder={field.placeholder}
            description={field.description}
            required={field.required}
            disabled={field.disabled}
            error={error}
          />
        )
      default:
        return null
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      {isExpanded && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {schema.fields.map((field) => (
              <div
                key={field.name}
                className={field.fullWidth ? 'md:col-span-2' : ''}
              >
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 px-4 pb-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

