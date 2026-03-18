type PageTitleProps = {
  title: string
  /** Itens do breadcrumb, por exemplo ['Cobrança', 'Consulta de lançamentos'] */
  breadcrumbItems?: string[]
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function PageTitle({ title, breadcrumbItems, action, icon }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
      {icon && (
        <div className="flex h-[65px] w-[65px] items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
          {icon}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2">
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-row items-center gap-3 text-xs font-medium text-gray-500">
              {breadcrumbItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex flex-row items-center gap-3 text-sm">
                  <span>{item}</span>
                  {index < breadcrumbItems.length - 1 && (
                    <span className="text-gray-400">{'>'}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-row items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}
