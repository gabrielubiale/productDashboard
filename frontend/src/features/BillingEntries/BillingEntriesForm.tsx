import { useState } from 'react'
import type { FormSchema } from '../../shared/forms/formSchema.ts'
import { DynamicForm } from '../../shared/forms/DynamicForm.tsx'

const billingEntriesFormSchema: FormSchema = {
  fields: [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Enter a short description',
    },
    {
      name: 'amount',
      label: 'Amount (BRL)',
      type: 'money',
      placeholder: 'R$',
      required: true,
    },
    {
      name: 'dueDate',
      label: 'Due date',
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'open', label: 'Open' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
      ],
      placeholder: 'Select a status',
    },
    {
      name: 'payerEmail',
      label: 'Payer e-mail',
      type: 'email',
      required: false,
      placeholder: 'name@example.com',
      fullWidth: true,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
      fullWidth: true,
      placeholder: 'Add any relevant notes about this billing entry…',
    },
  ],
}

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
  const [formValues, setFormValues] = useState<Record<string, any>>(
    initialValues ?? {
      description: '',
      amount: null,
      dueDate: '',
      status: '',
      payerEmail: '',
      notes: '',
    },
  )

  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({})

  function validate(): Record<string, string | undefined> {
    const errors: Record<string, string | undefined> = {}

    for (const field of billingEntriesFormSchema.fields) {
      const value = formValues[field.name]

      if (field.required && (value === undefined || value === null || value === '')) {
        errors[field.name] = 'This field is required'
        continue
      }

      if (field.type === 'email' && value) {
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(String(value))) {
          errors[field.name] = 'Please enter a valid e-mail address'
        }
      }

      if (field.type === 'number' && value !== undefined && value !== null && value !== '') {
        if (Number.isNaN(Number(value))) {
          errors[field.name] = 'Please enter a valid number'
        }
      }

      if (field.type === 'money' && value !== undefined && value !== null && value !== '') {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          errors[field.name] = 'Please enter a valid amount'
        }
      }
    }

    return errors
  }

  async function handleSubmit() {
    const nextErrors = validate()
    setFormErrors(nextErrors)

    const hasError = Object.values(nextErrors).some(Boolean)
    if (hasError) return

    await onSubmitEntry(formValues)
  }

  return (
    <DynamicForm
      schema={billingEntriesFormSchema}
      values={formValues}
      errors={formErrors}
      onChange={setFormValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Save entry"
      cancelLabel="Cancel"
      headerTitle={headerTitle}
    />
  )
}

