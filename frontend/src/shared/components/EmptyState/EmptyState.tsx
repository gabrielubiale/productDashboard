type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="py-12 flex justify-center items-center text-center rounded-xl border border-gray-200 bg-white">
      <div className="space-y-3">
        <h6 className="text-gray-900 font-semibold text-lg">
          {title}
        </h6>
        {description && (
          <p className="text-gray-400 text-sm">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
