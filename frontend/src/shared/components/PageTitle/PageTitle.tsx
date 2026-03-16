type PageTitleProps = {
  title: string
  description: string
  action?: React.ReactNode
}

export function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}
