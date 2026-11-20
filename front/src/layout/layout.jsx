import { Outlet } from 'react-router-dom'
import Topbar from '../components/bars/topbar'
import Sidebar from '../components//bars/sidebar'
import { useState } from 'react'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        style={{
          marginLeft: collapsed ? '103px' : '240px',
          padding: '30px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}
