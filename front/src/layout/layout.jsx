import { Outlet } from 'react-router-dom'
import Topbar from '../components/bars/topbar'
import Sidebar from '../components//bars/sidebar'

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
