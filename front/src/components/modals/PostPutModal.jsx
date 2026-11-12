import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap'

export default function PostPutModal({
  show,
  onHide,
  columnas = [],
  onSubmit,
  titulo = 'Formulario',
  datosIniciales = {},
}) {
  const [formData, setFormData] = useState({})
  const [showSpinner, setShowSpinner] = useState(false)

  // Inicializa los datos del formulario
  useEffect(() => {
    setFormData(datosIniciales ?? {})
  }, [show])

  // Maneja los cambios de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Envía los datos al padre
  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowSpinner(true)
    await onSubmit(formData)
    setShowSpinner(false)
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            {columnas.map((columna) => (
              <Col xs={12} key={columna.name}>
                <Form.Group>
                  <Form.Label>{columna.label ?? columna.name}</Form.Label>

                  {columna.type === 'select' ? (
                    <Form.Select
                      name={columna.name}
                      value={formData[columna.name] ?? ''}
                      onChange={handleChange}
                      required={columna.required ?? false}
                    >
                      <option value="">Seleccionar...</option>

                      {(columna.options ?? []).map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </Form.Select>
                  ) : columna.type === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={columna.name}
                      value={formData[columna.name] ?? ''}
                      onChange={handleChange}
                      required={columna.required ?? false}
                    />
                  ) : (
                    <Form.Control
                      type={columna.type ?? 'text'}
                      name={columna.name}
                      value={formData[columna.name] ?? ''}
                      onChange={handleChange}
                      required={columna.required ?? false}
                    />
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {showSpinner ? (
            <Spinner />
          ) : (
            <>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>

              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
