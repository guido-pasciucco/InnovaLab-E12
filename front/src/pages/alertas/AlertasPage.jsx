import { Container } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'
import { getAlertas, resolverAlerta } from '../../services/apiRoutes'
import { AuthContext } from '../../context/AuthContext'
import { BsInbox } from 'react-icons/bs'
import {toast} from 'react-toastify'
import TablaGeneral from '../../components/tables/TablaGeneral'
import PageHelmet from '../../helmet/PageHelmet'
import AlertInfo from '../../components/alerts/AlertInfo'

function EmptyState({ message, description }) {
  return (
    <div className="border rounded bg-light text-center py-4 px-3 mt-3">
      <BsInbox size={32} className="text-secondary mb-3" />

      <h6 className="fw-semibold mb-2">{message}</h6>

      <p className="text-muted small mb-0">{description}</p>
    </div>
  )
}

export default function AlertasPage() {
  const [data, setData] = useState([])
  const [showSpinner, setShowSpinner] = useState(true)

  const { getTokken } = useContext(AuthContext)

  const getDataApi = async () => {
    try {
      setShowSpinner(true)
      const res = await getAlertas(getTokken())
      setData(res ?? [])
      console.log('Data alertas: ' + res.data)
    } catch (error) {
      console.error('Error al cargar las alertas:', error)
      setData([])
    } finally {
      setShowSpinner(false)
    }
  }

  useEffect(() => {
    getDataApi()
  }, [])

  const handleResolver = async (alerta) => {
    try {
      await resolverAlerta(alerta.id, getTokken())

      toast.success('Alerta marcada como resuelta')
      getDataApi()
    } catch (error) {
      console.error('Error al resolver la alerta:', error)
      toast.error('No se pudo resolver la alerta')
    }
  }

  return (
    <>
      <PageHelmet
        title="Alertas"
        description="Alertas del centro de simulación"
      />

      <AlertInfo
        title="Alertas Activas"
        description="En esta sección podés consultar las alertas activas relacionadas con los espacios y el equipamiento, identificar inconvenientes y realizar un seguimiento de las situaciones que requieren atención."
      />

      <Container>
        <h1 className="h1 mb-3">Alertas</h1>

        {showSpinner ? (
          <TablaGeneral
            datos={data}
            showSpinner={showSpinner}
            onResolver={handleResolver}
          />
        ) : data.length > 0 ? (
          <TablaGeneral
            datos={data}
            showSpinner={showSpinner}
            onResolver={handleResolver}
          />
        ) : (
          <EmptyState
            message="No se registran alertas activas en este momento."
            description="Los espacios y equipos no presentan alertas pendientes."
          />
        )}
      </Container>
    </>
  )
}
