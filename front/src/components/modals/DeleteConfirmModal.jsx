import { useContext, useState } from 'react'
import { Modal, Button, Spinner, Alert } from 'react-bootstrap'
import { deleteUsuario } from '../../services/apiRoutes'
import { AuthContext } from '../../context/AuthContext'
import GenericAlertModal from './GenericAlertModal'

export default function DeleteConfirmModal({
  show,
  onHide,
  title,
  id,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [tipoModal, setTipoModal] = useState('')

  const { getTokken } = useContext(AuthContext)

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError('')
      console.log("id a eliminar: ", id)
      await deleteUsuario(getTokken(), id)
      setTipoModal('success')
      
      onSuccess?.()
      onHide()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          ¿Estás seguro de que deseas eliminar el registro #{id}?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>

          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <GenericAlertModal show={showSuccessModal} tipo={tipoModal} />
    </>
  )
}
