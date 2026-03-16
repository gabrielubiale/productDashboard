type StatCardProps = {
  title: string
  icon: React.ElementType
  value: React.ReactNode
  gradient?: string
  iconBg?: string
  iconColor?: string
  borderColor?: string
  glowColor?: string
}

export function StatCard({
  title,
  icon: Icon,
  value,
  gradient = 'from-gray-500/20 via-gray-600/10 to-transparent',
  iconBg = 'bg-gray-500/20',
  iconColor = 'text-gray-400',
  borderColor = 'border-gray-500/30',
  glowColor = 'from-gray-500 to-gray-600',
}: StatCardProps) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border border-gray-200
        bg-white
        p-6 shadow-sm
        transition-all duration-300 ease-out
        hover:scale-[1.01] hover:shadow-md
        ${borderColor}
      `}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <div
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-lg
              shadow-lg transition-all duration-300
              group-hover:scale-110 group-hover:shadow-xl
              ${iconBg}
            `}
          >
            <Icon size={18} weight="fill" className={`${iconColor} transition-transform group-hover:scale-110`} />
          </div>
        </div>
        <h4 className="font-bold text-gray-900 transition-colors group-hover:text-gray-900 text-2xl">
          {value}
        </h4>
      </div>
      <div
        className={`
          absolute -right-12 -top-12 h-32 w-32 rounded-full
          bg-linear-to-br opacity-0 blur-3xl
          transition-opacity duration-500 group-hover:opacity-20
          ${glowColor}
        `}
      />
    </div>
  )
}
