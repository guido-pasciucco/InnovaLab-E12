import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { LOGIN, loginPostCredentials } from '../utils/apiRoutes.js'
import { Spinner } from 'react-bootstrap'

import styles from './login.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@innovalab.edu.ar')
  const [password, setPassword] = useState('admin123')
  const { setAuthData } = useContext(AuthContext)
  const [showSpinner, setShowSpinner] = useState(true)

  const handleLogin = async () => {
    const credentials = { email: email, password: password }
    const res = await loginPostCredentials(credentials)

    if (res) {
      console.log('resultado res: ', res)
      console.log(res.data)

      console.log(res.status == '200')

      setAuthData(res.data)
      console.log('Login exitoso:', res.data)
      navigate('/dashboard')
    } else {
      console.error('Error al hacer login...')
    }

    // try {
    //   console.log("iniciando login> ", LOGIN)
    //   const response = await fetch(LOGIN, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   })

    //   const data = await response.json()

    //   if (response.ok) {
    //     setAuthData(data)
    //     console.log('Login exitoso:', data)
    //     navigate('/dashboard')
    //   } else {
    //     alert('Credenciales incorrectas')
    //   }
    // } catch (error) {
    //   console.error('Error al iniciar sesión:', error)
    //   alert('Error al iniciar sesión')
    // }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSpinner(true)
    handleLogin()
    setShowSpinner(false)
  }

  return (
    // <div className="d-flex justify-content-center align-items-center vh-100">
    <div className={styles.homeMainContainer}>
      <div className={styles.imgHomeContainer}>
        <img
          src="../src/assets/Home.png"
          alt="Logo"
          className="img-fluid vh-100"
        />
      </div>
      {/* <div className="card shadow" style={{ width: '24rem' }}> */}
      <div className={styles.loginContainer}>
        <div className={styles.loginContainer}>
          {/* <div className="card-body p-5"> */}
          <div className={styles.loginCard}>
            {/* <h3 className="card-title text-center mb-4">Iniciar sesion</h3> */}
            <div className={styles.loginCardTitleArea}>
              <h3 className={styles.loginCardTitle}>Ingresá al sistema</h3>
              <span>Usá tu cuenta institucional</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formData}>
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Correo
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="usuario@innovalab.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formData}>
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Contrasena
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Recordarme y Olvidaste contraseña en la misma fila */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Recordarme
                  </label>
                </div>
                <a href="/forgot-password" className="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button type="submit" className="btn btn-warning w-100">
                {!showSpinner ? <Spinner></Spinner> : <p>Ingresar</p>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
