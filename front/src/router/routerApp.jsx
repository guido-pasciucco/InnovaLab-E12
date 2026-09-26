import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Layout from '../layout/layout'

import Home from '../components/home'
import About from '../components/about'
import LoginPage from '../pages/loginPage'
import DashboardPrincipalPage from '../pages/dashboardPrincipalPage'

export default function RouterApp() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<DashboardPrincipalPage />} />
          {/* Define your routes here */}
          {/* <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
          </Route> */}
        </Routes>
      </Router>
    </div>
  )
}
