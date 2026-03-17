import { useEffect } from 'react'
import { X } from 'phosphor-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  contentClassName?: string
}

export function Modal({ isOpen, onClose, title, children, contentClassName }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative flex flex-col rounded-xl bg-white shadow-lg ${
          contentClassName ?? 'w-full max-w-[800px] max-h-[600px]'
        }`}
      >
        <header className="shrink-0 bg-linear-to-b from-blue-100 to-blue-50 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h6 id="modal-title" className="font-semibold text-black text-lg mb-0.5">
            {title}
          </h6>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-blue-500/40 text-gray-600  hover:text-gray-800 cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} weight="bold" />
          </button>
        </header>
        <div className="flex-1 px-6 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
