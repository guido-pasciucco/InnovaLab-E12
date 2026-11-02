import { Modal, Button } from 'react-bootstrap'

export default function MyModal({
  mostrar,
  title,
  bodyMessage,
  handleConfirm,
  handleCancel,
}) {
  return (
    <Modal show={mostrar} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyMessage}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" className='background-secondary' onClick={handleCancel}>
          Cancelar
        </Button>
        

        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
