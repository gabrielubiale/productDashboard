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

  const panelWidthClass = size === 'sm' ? 'max-w-sm' : 'max-w-[600px]'

  return (
    <div
      className="fixed inset-0 z-40 flex items-stretch justify-end bg-black/20 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <aside
        className={`flex w-full ${panelWidthClass} flex-col max-h-screen bg-white shadow-2xl border-l border-gray-200 rounded-l-2xl overflow-hidden`}
      >
        <header className="shrink-0 border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div>
            <h6 className="font-semibold text-gray-900 text-lg mb-1">
              {title}
            </h6>
            <p className="text-gray-600 text-sm">
              Ajuste os filtros avançados do lançamento.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
            aria-label="Fechar filtros"
          >
            <X size={20} weight="bold" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {children}
        </div>
      </aside>
    </div>
  )
}

