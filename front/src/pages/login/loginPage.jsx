import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { loginPostCredentials } from '../../utils/apiRoutes.js'
import { Spinner } from 'react-bootstrap'
import { Alert } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

import styles from './login.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAuthData } = useContext(AuthContext)
  const [showSpinner, setShowSpinner] = useState(true)

  const [error, setError] = useState(null)
  // funcion principal del login



  const handleLogin = async () => {
    const credentials = { email: email, password: password }
    try {
      const res = await loginPostCredentials(credentials)
      setAuthData(res.data)
      console.log('Login exitoso: ', res.data)
      navigate('/dashboard')
    } catch (err) {
      console.log('Datos de respuesta:', err.response?.data)
      console.log('Estado:', err.response?.status)

      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos')
      } else if (err.response?.status === 422) {
        setError('Los datos ingresados no son válidos')
      } else {
        setError('Error al iniciar sesión. Intentá nuevamente.')
      }
      setShowSpinner(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSpinner(true)
    handleLogin()
    setShowSpinner(false)
  }

  // botones credenciales predefinidas

  const handleIngresarCordinador =  () => {
    setEmail('carlos@innovalab.edu.ar')
    setPassword('admin123')
  }

  const handleIngresarAdmin =  () => {
    setEmail('admin@innovalab.edu.ar')
    setPassword('admin123')
  }

  return (
    // <div className="d-flex justify-content-center align-items-center vh-100">
    <div className={styles.homeMainContainer}>
      <div className={styles.imgHomeContainer}>
        <img src="/login02.png" alt="Logo" className="img-fluid vh-100" />
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
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
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
              </div> */}
              {error && <Alert variant="danger">{error}</Alert>}

              <button
                type="submit"
                className="btn w-100 mt-4 background-primary"
              >
                {!showSpinner ? <Spinner></Spinner> : <p>Ingresar</p>}
              </button>
              {/* mostrar error */}

              <hr className="mt-5" />
              <Row className="mt-1 justify-content-center">
                <h6>Espacio de prueba</h6>

                <Row className="mt-3">
                  <Button onClick={handleIngresarCordinador}>
                    Ingresar credenciales coordinador
                  </Button>
                </Row>
                <Row className="mt-3">
                  <Button onClick={handleIngresarAdmin}>Ingresar credenciales administrador</Button>
                </Row>
              </Row>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
