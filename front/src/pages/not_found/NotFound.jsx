import { Container, Row, Col, Button } from 'react-bootstrap'
// Si usas React Router, descomenta la siguiente línea:
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    // Opción A: Con React Router (recomendado para evitar recargar la página)
    navigate('/dashboard')
  }

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light text-center"
    >
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6}>
          <h1 className="display-1 fw-bold text-primary">404</h1>
          <h2 className="mb-3 fw-semibold">Página no encontrada</h2>
          <p className="text-muted mb-4 fs-5">
            Lo sentimos, la página que estás buscando no existe, fue movida o la
            dirección es incorrecta.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoHome}
            className="px-4 shadow-sm"
          >
            Volver al inicio
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
