import { useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import RecursoCard from '../../components/cards/RecursoCard'
import { AuthContext } from '../../context/AuthContext'
import { getEquipamientoApiId } from '../../services/apiRoutes'
import { useParams } from 'react-router-dom'
import PageHelmet from '../../helmet/PageHelmet'
import ButtonVolver from '../../components/butons/ButtonVolver'

export default function EquipamientoDetallePage() {
  const [dataApi, setDataApi] = useState(null)
  const [loading, setLoadign] = useState(true)

  const { getTokken } = useContext(AuthContext)

  const { id } = useParams()
  
  const extraerObjeto = (res) => {
    const payload = res?.data?.data ?? res?.data ?? res
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return null
    }
    return payload
  }

  const getApiDetalle = async () => {
    try {
      console.log(id)
      const res = await getEquipamientoApiId(getTokken(), id)
      const detalle = extraerObjeto(res)
      console.log('Detalle:', detalle)
      setDataApi(detalle)
    } catch (err) {
      console.log('Error al cargar detalle:', err)
      setDataApi(null)
    } finally {
      setLoadign(false)
    }
  }

  useEffect(() => {
    getApiDetalle()
  }, [])

  return (
    <>
      <PageHelmet
        title={`Equipamiento Nro ${id}`}
        description="pagina con detalle del equipamiento elegido"
      />
      <Container>
        <ButtonVolver link_volver={'/dashboard/equipamiento'} />
        <h1 className="h1">Equipamiento Detalle</h1>
        <RecursoCard recurso={dataApi} />

        {loading && <Spinner className="mt-5" />}
      </Container>
    </>
  )
}
