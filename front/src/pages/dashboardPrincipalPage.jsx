import { Link } from 'react-router-dom'
import { getDashboardApi } from '../utils/apiRoutes'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Row, Col, Card } from 'react-bootstrap'
import TablaAlarmas from '../components/tablaAlarmas'

export default function DashboardPrincipalPage() {
  const [dataApi, setDataApi] = useState([])
  const { getTokken } = useContext(AuthContext)

  const getData = async () => {
    console.log('Ejecutando getData con tokken', getTokken())
    const data = await getDashboardApi(getTokken())
    console.log('data en dashboard cargada: ', data.data)
    setDataApi(data.data)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="container-md p-4">
      {/* Título */}

      <Row className="g-3">
        {Object.entries(dataApi?.kpis ?? {}).map(([clave, valor]) => (
          <Col key={clave} md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{clave.replaceAll('_', ' ')}</Card.Title>
                <Card.Text className="fs-3 fw-bold">{valor}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col xs={12}>
          <h4>Alertas recientes</h4>

          <TablaAlarmas alarmas={dataApi?.alertas_recientes ?? []} />
        </Col>
      </Row>
    </div>
  )
}
