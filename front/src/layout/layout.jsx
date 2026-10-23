import { Outlet } from 'react-router-dom'
import Topbar from '../components/topbar'
import Sidebar from '../components/sidebar'

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <main style={{ marginLeft: '220px', padding: '30px' }}>
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}
