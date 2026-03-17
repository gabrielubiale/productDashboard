export type Column<T> = {
  id: string
  header: string
  align?: 'left' | 'right' | 'center'
  render: (item: T) => React.ReactNode
}

type DynamicTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T, index: number) => string
  emptyMessage?: string
  minWidth?: string
  className?: string
  rowClassName?: (item: T, index: number) => string
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
} as const

export function DynamicTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage,
  minWidth = '800px',
  className = '',
  rowClassName,
}: DynamicTableProps<T>) {
  if (data.length === 0 && emptyMessage) {
    return (
      <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white py-12 text-center text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    )
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`px-4 py-3 font-semibold text-gray-700 ${alignClass[col.align ?? 'left']}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className={`
                  border-b border-gray-100 transition-all duration-200
                  hover:bg-blue-50 hover:shadow-[inset_4px_0_0_rgba(59,130,246,0.5)]
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  ${rowClassName?.(item, index) ?? ''}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`px-4 py-3 ${alignClass[col.align ?? 'left']}`}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
