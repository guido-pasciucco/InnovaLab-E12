import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { getActividades } from '../../services/apiRoutes'
import TablaGeneral from '../../components/tables/TablaGeneral'
import { Container } from 'react-bootstrap'
import AgregarItemButton from '../../components/butons/AgregarItemButton'
import { postActividades } from '../../services/apiRoutes'

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
    <Container>
      <h1 className="h1 mb-4">Actividades</h1>

      <TablaGeneral datos={data} showSpinner={showSpinner} />
    </Container>
  )
}
