
import { Table, Button, Spinner } from 'react-bootstrap'
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa'
import SelectedBadge from '../badges/SelectedBadge'
import { useState } from 'react'


function TablaGeneral({
  datos = [],
  showSpinner = false,
  onEditar,
  onEliminar,
  onResolver,
}) {
  const [resolviendoId, setResolviendoId] = useState(null)

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
  const mostrarAcciones = onEditar || onEliminar || onResolver

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

  const handleResolver = async (dato) => {
    try {
      setResolviendoId(dato.id)
      await onResolver(dato)
    } finally {
      setResolviendoId(null)
    }
  }

  return (
    <Table responsive hover className="table shadow-sm">
      <thead>
        <tr>
          {columnas.map((columna) => (
            <th key={columna}>
              {columna === 'created_at'
                ? 'creado_el'
                : columna === 'updated_at'
                  ? 'actualizado_el'
                  : columna}
            </th>
          ))}

          {mostrarAcciones && (
            <th className="text-center">Acciones</th>
          )}
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
                  Array.isArray(dato[columna]) ? (
                    dato[columna].join(' - ')
                  ) : (
                    Object.values(dato[columna]).join(' - ')
                  )
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
                  {onResolver && dato.estado?.toLowerCase() !== 'resuelta' && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      title="Marcar como resuelta"
                      disabled={resolviendoId === dato.id}
                      onClick={() => handleResolver(dato)}
                    >
                      {resolviendoId === dato.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <FaCheckCircle />
                      )}
                    </Button>
                  )}

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
