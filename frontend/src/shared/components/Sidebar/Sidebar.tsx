import { useLocation } from 'react-router-dom'
import { CaretUp, CaretDown, CaretLeft, CaretRight } from 'phosphor-react'
import { useState, useEffect } from 'react'
import { menuItems } from '../../../features/sidebar/menuItems'
import type { MenuItem, SidebarProps, SubMenuItem } from '../../../features/sidebar/types'

export function Sidebar({ isOpen = true, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({})
  const [activeAnchor, setActiveAnchor] = useState<string>('')

  useEffect(() => {
    setActiveAnchor(window.location.hash || '')

    const handleHashChange = () => {
      setActiveAnchor(window.location.hash || '')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [location])

  const isSubItemActive = (_item: MenuItem, subItem: SubMenuItem) => {
    if (subItem.path) {
      return location.pathname === subItem.path
    }

    if (subItem.anchor) {
      return activeAnchor === subItem.anchor
    }

    // fallback: nenhum critério específico
    return false
  }

  const handleNavigation = (path: string, anchor?: string) => {
    if (path !== location.pathname) {
      window.location.href = path + (anchor || '')
    } else if (anchor) {
      const element = document.querySelector(anchor)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.pushState(null, '', anchor)
        setActiveAnchor(anchor)
      }
    } else if (window.location.hash) {
      window.location.href = path
    }
    if (onClose) {
      onClose()
    }
  }

  const handleToggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  useEffect(() => {
    // abre automaticamente o submenu que contém o item ativo
    const initialState: { [key: string]: boolean } = {}

    menuItems.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const hasActiveSubItem = item.subItems.some((subItem) => isSubItemActive(item, subItem))
        if (hasActiveSubItem) {
          initialState[item.label] = true
        }
      }
    })

    if (Object.keys(initialState).length > 0) {
      setOpenSubMenus((prev) => ({ ...prev, ...initialState }))
    }
  }, [location.pathname, activeAnchor])

  const sidebarWidthClass = collapsed ? 'w-16' : 'w-70'

  return (
    <div
      className={`fixed left-0 top-3 bottom-3 z-40 ${sidebarWidthClass} transform bg-white rounded-2xl rounded-l-none shadow-sm transition-all ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* título */}
      <div className="flex h-14 w-full items-center justify-between border-b border-gray-200 px-3">
        <h6 className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-sm font-bold text-transparent">
          {!collapsed ? 'Dashboard' : null}
        </h6>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
            aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {collapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
          </button>
        )}
      </div>

      {/* item */}
      <div className="mt-3 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isSubMenuOpen = openSubMenus[item.label] || false
            const hasActiveSubItem =
              hasSubItems && item.subItems?.some((subItem) => isSubItemActive(item, subItem))
            const isActive =
              item.label !== 'Início' &&
              (location.pathname === item.path || location.pathname.startsWith(item.path)) &&
              !hasActiveSubItem

            return (
              <li key={item.path}>
                <div
                  className={`flex w-full items-center rounded-lg transition-all ${
                    isActive
                      ? 'border border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                      : hasActiveSubItem
                        ? 'border border-transparent bg-slate-50 text-gray-800'
                        : 'border border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className="flex flex-1 cursor-pointer items-center rounded-lg px-3 py-2 text-left transition-all"
                  >
                    <div
                      className={`mr-3 flex min-w-0 items-center transition-colors ${
                        isActive || hasActiveSubItem ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    {!collapsed && (
                      <span
                        className={`flex-1 text-lg font-medium ${
                          isActive ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </button>
                  {hasSubItems && !collapsed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggleSubMenu(item.label)
                      }}
                      className={`mr-1 flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors ${
                        isActive || hasActiveSubItem
                          ? 'text-blue-600 hover:bg-blue-100'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      aria-label={isSubMenuOpen ? 'Fechar submenu' : 'Abrir submenu'}
                    >
                      {isSubMenuOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
                    </button>
                  )}
                </div>

                {/* subitens */}
                {hasSubItems && !collapsed && (
                  <div
                    className={`overflow-hidden transition-all duration-150 ease-in-out ${
                      isSubMenuOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="ml-8 mt-1">
                      {item.subItems?.map((subItem) => {
                        const isSubActive = isSubItemActive(item, subItem)
                        return (
                          <li key={subItem.path ?? subItem.anchor ?? subItem.label} className="mb-1">
                            <button
                              onClick={() => handleNavigation(subItem.path ?? item.path, subItem.anchor)}
                              className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 transition-all ${
                                isSubActive
                                  ? 'border border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <div
                                className={`mr-3 flex min-w-0 items-center transition-colors ${
                                  isSubActive ? 'text-blue-600' : 'text-gray-400'
                                }`}
                              >
                                {subItem.icon}
                              </div>
                              <span
                                className={`flex-1 text-left text-base ${
                                  isSubActive ? 'text-gray-900' : 'text-gray-700'
                                }`}
                              >
                                {subItem.label}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
