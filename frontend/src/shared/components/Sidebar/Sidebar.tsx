import { useLocation } from 'react-router-dom'
import { CaretUp, CaretDown } from 'phosphor-react'
import { useState, useEffect } from 'react'
import { menuItems } from '../../../features/sidebar/menuItems'
import type { SidebarProps } from '../../../features/sidebar/types'

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
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

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen w-70 transform border-r border-gray-200 bg-linear-to-b shadow-2xl transition-all ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* título */}
      <div className="w-full flex h-14 items-center justify-center border-b border-gray-200 px-4">
        <h6 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-transparent text-sm">
          Dashboard
        </h6>
      </div>

      {/* item */}
      <div className="mt-3 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isSubMenuOpen = openSubMenus[item.label] || false
            const hasActiveSubItem = hasSubItems && item.subItems?.some(subItem => activeAnchor === subItem.anchor)
            const isActive =
              item.label !== 'Início' &&
              (location.pathname === item.path || location.pathname.startsWith(item.path)) &&
              !hasActiveSubItem

            return (
              <li key={item.path}>
                <div
                  className={`w-full rounded-lg transition-all flex items-center
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className="flex-1 cursor-pointer rounded-lg transition-all flex items-center px-3 py-2 text-left"
                  >
                    <div className={`min-w-0 mr-3 transition-colors flex items-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span className={`font-medium text-lg flex-1 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </button>
                  {hasSubItems && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggleSubMenu(item.label)
                      }}
                      className={`cursor-pointer rounded-md p-1.5 transition-colors flex items-center justify-center shrink-0 mr-1
                        ${isActive ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-500 hover:bg-gray-100'}
                      `}
                      aria-label={isSubMenuOpen ? 'Fechar submenu' : 'Abrir submenu'}
                    >
                      {isSubMenuOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
                    </button>
                  )}
                </div>

                {/* subitens */}
                {hasSubItems && (
                  <div className={`overflow-hidden transition-all duration-150 ease-in-out ${isSubMenuOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="ml-8 mt-1">
                      {item.subItems?.map((subItem) => {
                        const isSubActive = activeAnchor === subItem.anchor
                        return (
                          <li key={subItem.anchor} className="mb-1">
                            <button
                              onClick={() => handleNavigation(item.path, subItem.anchor)}
                              className={`w-full cursor-pointer rounded-lg transition-all flex items-center px-3 py-2
                                ${isSubActive
                                  ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-100'
                                }
                              `}
                            >
                              <div className={`min-w-0 mr-3 transition-colors flex items-center ${isSubActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                {subItem.icon}
                              </div>
                              <span className={`text-base flex-1 text-left ${isSubActive ? 'text-gray-900' : 'text-gray-700'}`}>
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
