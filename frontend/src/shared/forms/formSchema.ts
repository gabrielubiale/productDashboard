export type FieldType =
  | 'text'
  | 'select'
  | 'date'
  | 'number'
  | 'email'
  | 'textarea'
  | 'money'

type BaseFieldSchema = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export type TextFieldSchema = BaseFieldSchema & {
  type: 'text'
  minLength?: number
  maxLength?: number
}

export type TextAreaFieldSchema = BaseFieldSchema & {
  type: 'textarea'
  minLength?: number
  maxLength?: number
}

export type SelectFieldSchema = BaseFieldSchema & {
  type: 'select'
  options: { value: string; label: string }[]
}

export type DateFieldSchema = BaseFieldSchema & {
  type: 'date'
  minDate?: string
  maxDate?: string
}

export type NumberFieldSchema = BaseFieldSchema & {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export type EmailFieldSchema = BaseFieldSchema & {
  type: 'email'
}

export type MoneyFieldSchema = BaseFieldSchema & {
  type: 'money'
  min?: number
  max?: number
}

export type FormFieldSchema =
  | TextFieldSchema
  | TextAreaFieldSchema
  | SelectFieldSchema
  | DateFieldSchema
  | NumberFieldSchema
  | EmailFieldSchema
  | MoneyFieldSchema

export type FormSchema = {
  fields: FormFieldSchema[]
}

