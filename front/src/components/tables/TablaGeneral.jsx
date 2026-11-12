import { Table, Button, Spinner } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import SelectedBadge from '../badges/SelectedBadge'

function TablaGeneral({
  datos = [],
  showSpinner = false,
  onEditar,
  onEliminar,
}) {
  if (showSpinner) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!datos.length) {
    return <p className="text-muted text-center">No hay registros.</p>
  }

  const columnas = Object.keys(datos[0])
  const mostrarAcciones = onEditar || onEliminar

  const formatearFecha = (valor) => {
    const fecha = new Date(valor)

    if (isNaN(fecha.getTime())) return valor

    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  const columnasFecha = [
    'fecha',
    'fecha_creacion',
    'fecha_inicio',
    'created_at',
    'updated_at',
    'deleted_at',
  ]
  return (
    <Table responsive hover className="table shadow-sm">
      <thead>
        <tr>
          {columnas.map((columna) => (
            <th key={columna}>{columna}</th>
          ))}

          {mostrarAcciones && <th className="text-center">Acciones</th>}
        </tr>
      </thead>

      <tbody>
        {datos.map((dato, index) => (
          <tr key={dato.id ?? index}>
            {columnas.map((columna) => (
              <td key={columna}>
                {columna === 'estado' || columna === 'activo' ? (
                  <SelectedBadge label={dato[columna]} />
                ) : typeof dato[columna] === 'object' &&
                  dato[columna] !== null ? (
                  JSON.stringify(dato[columna])
                ) : columnasFecha.includes(columna) && dato[columna] ? (
                  formatearFecha(dato[columna])
                ) : (
                  String(dato[columna] ?? '-')
                )}
              </td>
            ))}

            {mostrarAcciones && (
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  {onEditar && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      title="Modificar"
                      onClick={() => onEditar(dato)}
                    >
                      <FaEdit />
                    </Button>
                  )}

                  {onEliminar && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      title="Eliminar"
                      onClick={() => onEliminar(dato)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaGeneral
