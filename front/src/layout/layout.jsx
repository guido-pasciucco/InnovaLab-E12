import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <main style={{ marginLeft: '220px', padding: '30px' }}>
        <Navbar />
        <Outlet />
      </main>
    </div>
  )
}
