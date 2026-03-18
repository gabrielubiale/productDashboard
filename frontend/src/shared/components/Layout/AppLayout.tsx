import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          isOpen
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* sidebar para mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-40 h-screen w-70 lg:hidden">
            <Sidebar isOpen onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Conteúdo Principal */}
      <div
        className={`flex w-full flex-1 flex-col ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-70'
        } transition-[margin] duration-200`}
      >
        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1920px] p-4 lg:p-6 m-4 bg-white rounded-2xl shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
