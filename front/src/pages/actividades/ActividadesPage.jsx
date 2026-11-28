import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { getActividades } from '../../services/apiRoutes'
import TablaGeneral from '../../components/tables/TablaGeneral'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'react-bootstrap-icons'
import Helmet from '../../helmet/PageHelmet'
import AlertInfo from '../../components/alerts/AlertInfo'

export default function ActividadesPage() {
  const [data, setData] = useState()

  const { getTokken } = useContext(AuthContext)
  const token = getTokken()

  const [showSpinner, setShowSpinner] = useState(true)

  const getDataApi = async () => {
    const res = await getActividades(token)
    console.log('res actividades: ', res)
    setData(res.data.data)
    setShowSpinner(false)
  }

  useEffect(() => {
    getDataApi()
  }, [])

  const columnasForm = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'taller', label: 'Taller' },
        { value: 'curso', label: 'Curso' },
        { value: 'capacitacion', label: 'Capacitacion' },
        { value: 'workshop', label: 'Workshop' },
      ],
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'programada', label: 'Programada' },
        { value: 'cancelada', label: 'Cancelada' },
      ],
    },
    {
      name: 'fecha',
      label: 'Fecha',
      type: 'date',
      required: true,
    },
    {
      name: 'hora_inicio',
      label: 'Hora Inicio',
      type: 'time',
      required: true,
    },
    {
      name: 'hora_fin',
      label: 'Hora Fin',
      type: 'time',
      required: true,
    },
  ]
  return (
    <>
      <Helmet title="Actividades" description="Lista de actividades" />
      <AlertInfo
        title="Resumen de Actividades"
        description="En esta sección podés consultar un resumen de las actividades programadas, visualizar sus fechas, horarios, espacios asignados y estado, para realizar un seguimiento de la planificación."
      />
      <Container>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex flex-column justify-content-center">
            <h1 className="text-start h1 mb-4">Actividades</h1>
          </div>
          <div className="d-flex flex-row gap-2">
            <Link to="/dashboard/nueva-actividad" className="btn btn-primary">
              <PlusCircle className="mb-1 me-1" />
              Nueva actividad
            </Link>
          </div>
        </div>
        <TablaGeneral datos={data} showSpinner={showSpinner} />
      </Container>
    </>
  )
}
