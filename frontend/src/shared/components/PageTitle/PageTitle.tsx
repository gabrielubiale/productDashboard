type PageTitleProps = {
  title: string
  description: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function PageTitle({ title, description, action, icon}: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
              {icon}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}
