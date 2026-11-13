import { useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import RecursoCard from '../../components/cards/RecursoCard'
import { AuthContext } from '../../context/AuthContext'
import { getEquipamientoApiId } from '../../services/apiRoutes'
import { useParams } from 'react-router-dom'

export default function EquipamientoDetallePage() {
  const [dataApi, setDataApi] = useState(null)
  const [loading, setLoadign] = useState(true)

  const { getTokken } = useContext(AuthContext)

  const { id } = useParams()
  const getApiDetalle = async () => {
    console.log(id)
    const res = await getEquipamientoApiId(getTokken(), id)
    console.log(res.data.data)
    setLoadign(false)
    setDataApi(res.data.data)
  }

  useEffect(() => {
    getApiDetalle()
  }, [])

  return (
    <Container>
      <h1 className="h1">Equipamiento Detalle</h1>
      <RecursoCard recurso={dataApi} />

      {loading && <Spinner className='mt-5'/>}
    </Container>
  )
}
