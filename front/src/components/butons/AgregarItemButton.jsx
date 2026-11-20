import { AuthContext } from '../../context/AuthContext'
import PostPutModal from '../modals/PostPutModal'
import { useContext, useState } from 'react'
import GenericAlertModal from '../modals/GenericAlertModal'

export default function AgregarItemButton({
  columnas = [
    { name: 'example', label: 'Example', type: 'text', required: false },
  ],
  label = '',
  apiService,
}) {
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [dataConfirmModal, setDataConfirmModal] = useState({
    titulo: '',
    mensaje: '',
    tipo: '',
  })

  const { getTokken } = useContext(AuthContext)

  const handleClick = () => {
    setShowModal(true)
  }

  const handleSubmit = async (formData) => {
    console.log(formData)
    try {
      await apiService(getTokken(), formData)
      setDataConfirmModal({ titulo: 'OK', mensaje: 'Operacion Exitosa' })
      setShowConfirmModal(true)
    } catch (err) {
      setDataConfirmModal({
        titulo: 'Fallo',
        mensaje: 'Operacion no se pudo completar',
        tipo: 'error',
      })
      setShowConfirmModal(true)
    }
    setShowModal(false)
  }
  return (
    <>
      <button className="btn btn-primary" onClick={handleClick}>
        {label}
      </button>

      {/* modal para agregar dato */}
      <PostPutModal
        show={showModal}
        onHide={() => setShowModal(false)}
        columnas={columnas}
        onSubmit={handleSubmit}
        titulo={label}
      />

      {/* modal de resolucion  */}
      <GenericAlertModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        tipo={dataConfirmModal.tipo}
        titulo={dataConfirmModal.titulo}
        mensaje={dataConfirmModal.mensaje}
      />
    </>
  )
}
