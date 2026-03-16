import { X } from 'phosphor-react'
import type { ReactNode, MouseEvent } from 'react'

type FiltersSidebarProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md'
  children: ReactNode
}

export function FiltersSidebar({
  isOpen,
  onClose,
  title,
  size = 'sm',
  children,
}: FiltersSidebarProps) {
  if (!isOpen) return null

  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const panelWidthClass = size === 'sm' ? 'max-w-sm' : 'max-w-md'

  return (
    <div
      className="fixed inset-0 z-40 flex items-stretch justify-end bg-black/20 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <aside
        className={`flex h-full w-full ${panelWidthClass} flex-col bg-white shadow-2xl border-l border-gray-200 rounded-l-2xl mt-3 mb-3 overflow-hidden`}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {children}
        </div>
      </aside>
    </div>
  )
}

