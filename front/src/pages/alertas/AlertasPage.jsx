import { Container } from 'react-bootstrap'
import TablaGeneral from '../../components/tables/TablaGeneral'
import { useState, useEffect, useContext } from 'react'
import { getAlertas } from '../../utils/apiRoutes'
import { AuthContext } from '../../context/AuthContext'

export default function AlertasPage() {
  const [data, setData] = useState()
  const [showSpinner, setShowSpinner] = useState(true)

  const {getTokken} = useContext(AuthContext)

  const getDataApi = async () => {
    const res = await getAlertas(getTokken())
    setData(res.data)
    setShowSpinner(false)
  }

  useEffect(() => {
    getDataApi()
  })

  return (
    <Container>
      <h1 className='h1 mb-3'>Alertas</h1>
      <TablaGeneral datos={data} showSpinner={showSpinner}/>
    </Container>
  )
}
