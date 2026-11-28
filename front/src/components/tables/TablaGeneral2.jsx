import Table from 'react-bootstrap/Table'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'
import { BsEye, BsTrash, BsPen } from 'react-icons/bs'
import { Button } from 'react-bootstrap'
import { useState } from 'react'
import MyModal from '../modals/MyModal'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { deleteEspacioApi } from '../../services/apiRoutes'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const badgesDeEstado = {
  disponible: 'badge bg-success',
  confirmada: 'badge bg-success',
  programada: 'badge bg-primary',
  borrador: 'badge bg-secondary',
  mantenimiento: 'badge bg-warning',
}

// borderless hover responsive

function TablaGeneral2({ items, refresh, handleEditar }) {
  const [showModal, setShowModal] = useState(false)
  const [idItem, setIdItem] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)
  const [data, setData] = useState(null)

  const { getTokken } = useContext(AuthContext)

  const handleEliminar = async () => {
    try {
      setShowSpinner(true)
      await deleteEspacioApi(idItem, getTokken())
      toast.success('Registro eliminado con exito')
      setShowModal(false)
      setShowSpinner(false)
      refresh((prev) => !prev)
    } catch (err) {
      console.log('Error al eliminar el registro: ', err)
      toast.error('Error al eliminar el registro.')
    }
  }

  const capitalizarPrimeraLetra = (texto = '') => {
    const valor = texto.toLowerCase().trim()
    return valor.charAt(0).toUpperCase() + valor.slice(1)
  }

  return (
    <>
      <Table responsive hover className="table shadow-sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Capacidad</th>
            <th>Ubicacion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.tipo}</td>
              <td>{item.capacidad}</td>
              <td>{item.ubicacion}</td>
              <td className="text-center align-middle">
                <span
                  className={
                    badgesDeEstado[item.estado?.toLowerCase().trim()] ||
                    'badge bg-secondary'
                  }
                >
                  {capitalizarPrimeraLetra(item.estado)}
                </span>
              </td>
              <td>
                {/* <Link className="text-decoration-none" to={`${item.id}`}>
                <BsEye />
                Ver
              </Link>
              <Button>
                <BsTrash />
                Eliminar
              </Button> */}

                <div className="d-flex flex-row gap-1 align-items-center">
                  <Link className="text-decoration-none" to={`${item.id}`}>
                    <Button variant="link" className="text-decoration-none">
                      <BsEye />
                      Ver
                    </Button>
                  </Link>
                  <Button
                    variant="link"
                    className="text-danger text-decoration-none"
                    onClick={() => {
                      setIdItem(item.id)
                      setShowModal(true)
                    }}
                  >
                    <BsTrash />
                    Eliminar
                  </Button>
                  <Button
                    variant="link"
                    className="text-decoration-none"
                    onClick={() => handleEditar(item)}
                  >
                    <BsPen />
                    Editar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <MyModal
        mostrar={showModal}
        title="¿Eliminar este equipamiento?"
        bodyMessage="Esta acción no se puede deshacer. Las reservas futuras del equipo quedaran sin efecto."
        handleConfirm={handleEliminar}
        handleCancel={() => setShowModal(false)}
      />
    </>
  )
}

export default TablaGeneral2
