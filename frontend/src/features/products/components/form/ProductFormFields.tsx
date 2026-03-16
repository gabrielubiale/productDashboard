import type { NewProduct, ProductStatus } from '../../../../services/types'

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Disponível' },
  { value: 'inactive', label: 'Indisponível' },
]

const CATEGORY_OPTIONS = [
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Software', label: 'Software' },
  { value: 'Acessórios', label: 'Acessórios' },
  { value: 'Mobile', label: 'Mobile' },
]

const inputClass =
  'w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'

type ProductFormFieldsProps = {
  defaultValues?: Partial<Pick<NewProduct, 'name' | 'category' | 'price' | 'status'>>
  onSubmit: (data: NewProduct) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
  submitLabel: string
  title: string
  showTitle?: boolean
}

export function ProductFormFields({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  title,
  showTitle = true,
}: ProductFormFieldsProps) {
  const defaultName = defaultValues?.name ?? ''
  const defaultCategory = defaultValues?.category ?? ''
  const defaultPrice = defaultValues?.price?.toString() ?? ''
  const defaultStatus = defaultValues?.status ?? 'active'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const category = String(formData.get('category') ?? '')
    const price = Number(formData.get('price') ?? 0)
    const status = formData.get('status') as ProductStatus

    if (!name || !category || !price || !status) return

    await onSubmit({ name, category, price, status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showTitle && (
        <h6 className="text-lg font-semibold text-gray-900 mb-4">{title}</h6>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          name="name"
          type="text"
          defaultValue={defaultName}
          required
          disabled={isLoading}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select name="category" defaultValue={defaultCategory} required disabled={isLoading} className={inputClass}>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={defaultPrice}
          required
          disabled={isLoading}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select name="status" defaultValue={defaultStatus} required disabled={isLoading} className={inputClass}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
