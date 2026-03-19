import { formatCurrencyBRL } from '../../utils/money'

type DetailMoneyRowProps = {
  label: string
  amount: number
  emphasis?: boolean
  labelBold?: boolean
}

export function DetailMoneyRow({ label, amount, emphasis, labelBold }: DetailMoneyRowProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-2 py-0.5">
      <span
        className={
          labelBold
            ? 'text-sm font-semibold text-gray-600'
            : 'text-sm text-gray-500'
        }
      >
        {label}
      </span>
      <span
        className={
          emphasis
            ? 'text-sm font-semibold text-emerald-700 tabular-nums'
            : 'text-sm font-medium text-gray-800 tabular-nums'
        }
      >
        {formatCurrencyBRL(amount)}
      </span>
    </div>
  )
}

