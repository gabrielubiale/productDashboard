import { ChartContainerHeader } from '../ChartContainerHeader/ChartContainerHeader'

type ChartContainerProps = {
  id: string
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

export function ChartContainer({ id, title, description, children, className = '' }: ChartContainerProps) {
  return (
    <div
      id={id}
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      <ChartContainerHeader title={title} description={description} />
      {children}
    </div>
  )
}
