import { Outlet } from 'react-router-dom'
import Topbar from '../components/bars/topbar'
import Sidebar from '../components/bars/sidebar'
import { useState } from 'react'
import { List } from 'react-bootstrap-icons'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main
        className="main-content"
        style={{
          marginLeft: collapsed ? '103px' : '240px',
          padding: '30px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Menú hamburguesa */}
        <button
          className="btn btn-secondary d-lg-none mb-3 w-100"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <List size={24} />
        </button>

        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}
