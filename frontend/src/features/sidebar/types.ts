export type SidebarProps = {
  isOpen?: boolean
  onClose?: () => void
  /** Modo colapsado (desktop) */
  collapsed?: boolean
  /** Alternar modo colapsado (desktop) */
  onToggleCollapse?: () => void
}

export type SubMenuItem = {
  label: string
  /** Âncora/hash na mesma página (ex.: dashboard) */
  anchor?: string
  /** Caminho de rota próprio para o subitem (ex.: /cobranca/lancamentos) */
  path?: string
  icon: React.ReactNode
}

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode
  subItems?: SubMenuItem[]
}
