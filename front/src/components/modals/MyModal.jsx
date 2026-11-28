import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { BsTrash } from 'react-icons/bs'

export default function MyModal({
  mostrar,
  title = '',
  bodyMessage,
  handleConfirm,
  handleCancel,
}) {
  const [loading, setLoading] = useState(false)

  const confirmar = async () => {
    try {
      setLoading(true)
      await handleConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={mostrar} onHide={loading ? undefined : handleCancel}>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{bodyMessage}</Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          className="background-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button variant="primary" onClick={confirmar} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm"/>
            </>
          ) : (
            <>
              {title.includes('Eliminar') && <BsTrash className="me-1" />}
              Confirmar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
