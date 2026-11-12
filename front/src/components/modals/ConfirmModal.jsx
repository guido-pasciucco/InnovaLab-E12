import { Modal, Button } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap'
import { useState } from 'react'

export default function ConfirmModal({
  mostrar,
  title,
  bodyMessage,
  handleConfirm,
  handleCancel,
}) {
  const [loading, setLoading] = useState(false)
  return (
    <Modal show={mostrar} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyMessage}</Modal.Body>

      <Modal.Footer>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Button
              variant="secondary"
              className="background-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              onClick={async () => {
                setLoading(true)
                await handleConfirm()
                setLoading(false)
              }}
            >
              Confirmar
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  )
}
