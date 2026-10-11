import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { LOGIN } from '../utils/apiRoutes.js'


export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@innovalab.edu.ar')
  const [password, setPassword] = useState('admin123')
  const { setAuthData } = useContext(AuthContext)

  const handleLogin = async () => {
    try {
      const response = await fetch(LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setAuthData(data);
        console.log('Login exitoso:', data);
        navigate('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();   
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: '24rem' }}>
        <div className="card-body p-5">
          <h3 className="card-title text-center mb-4">Iniciar sesion</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Usuario
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

            <div className="mb-3">
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

            <button type="submit" className="btn btn-primary w-100">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
