type ChartContainerHeaderProps = {
  title: string
  description: string
}

export function ChartContainerHeader({ title, description }: ChartContainerHeaderProps) {
  return (
    <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-6 py-4">
      <h6 className="font-semibold text-gray-900 text-lg mb-1">{title}</h6>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
