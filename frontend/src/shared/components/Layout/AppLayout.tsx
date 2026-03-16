import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} />
      </div>

      {/* sidebar para mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-40 h-screen w-70 lg:hidden">
            <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col lg:ml-70 w-full">
        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1920px] p-4 lg:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
