import Table from 'react-bootstrap/Table'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'
import { deleteEspaciosApiId } from '../utils/apiRoutes'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const badgesDeEstado = {
  disponible: 'badge bg-success',
  confirmada: 'badge bg-success',
  programada: 'badge bg-primary',
  borrador: 'badge bg-secondary',
  mantenimiento: 'badge bg-warning',
}

function GenericTable({ items, onDeleteSuccess }) {
  const { getTokken } = useContext(AuthContext)

  const handleDelete = async(id) => {
    console.log("Eliminando item id: ", id)
    await deleteEspaciosApiId(getTokken(), id)
    console.log("Item eliminado")
    onDeleteSuccess()
  }

  const handleEdit = () => {}

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {/* <th>#</th> */}
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Capacidad</th>
          <th>Estado</th>
          <th></th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {/* <td>{item.id}</td> */}
            <td>{item.nombre}</td>
            <td>{item.tipo}</td>
            <td>{item.capacidad}</td>
            <td
              className={
                badgesDeEstado[item.estado?.toLowerCase().trim()] ||
                'badge bg-secondary'
              }
              style={{ color: 'white' }}
            >
              {item.estado}
            </td>
            <td>
              <Link to={`${item.id}`}>Ver</Link>
            </td>
            <td>
              <button className="btn" onClick={() => handleEdit(item.id)}>
                Editar
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default GenericTable
