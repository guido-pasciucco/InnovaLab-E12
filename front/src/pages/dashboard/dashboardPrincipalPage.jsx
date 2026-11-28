
import { getDashboardApi } from '../../services/apiRoutes'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {
  Row,
  Col,
  Card,
  ProgressBar,
  Container,
  Spinner,
} from 'react-bootstrap'
import {
  BsBuilding,
  BsCheckCircle,
  BsWrench,
  BsCalendarCheck,
  BsCalendarWeek,
  BsExclamationTriangle,
  BsExclamationCircle,
  BsTools,
} from 'react-icons/bs'

import TablaGeneral from '../../components/tables/TablaGeneral'
import PageHelmet from '../../helmet/PageHelmet'

const iconosKpi = {
  total_espacios: BsBuilding,
  espacios_operativos: BsCheckCircle,
  espacios_mantenimiento: BsWrench,
  reservas_hoy: BsCalendarCheck,
  reservas_semana: BsCalendarWeek,
  alertas_activas: BsExclamationTriangle,
  conflictos_pendientes: BsExclamationCircle,
  equipos_fuera_de_servicio: BsTools,
}

export default function DashboardPrincipalPage() {
  const [dataApi, setDataApi] = useState(null)
  const { getTokken } = useContext(AuthContext)
  const [showSpinner, setShowSpinner] = useState(true)

  const getData = async () => {
    try {
      console.log('Ejecutando getData con token', getTokken())

      const data = await getDashboardApi(getTokken())

      console.log('data en dashboard cargada: ', data.data)
      setDataApi(data.data)
    } catch (error) {
      console.error('Error al cargar dashboard:', error)
    } finally {
      setShowSpinner(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const cargando = showSpinner

  return (
    <>
      <PageHelmet
        title="Dashboard"
        description="Página de dashboard con métricas principales"
      />

      <Container fluid className="px-3">

        {/* KPI */}
        <Row className="g-3">
          <Col xs={12}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h4>KPIs</h4>

                <Row className="g-3">
                  {cargando ? (
                    <Col xs={12} className="text-center">
                      <Spinner />
                    </Col>
                  ) : (
                    Object.entries(dataApi?.kpis ?? {}).map(
                      ([clave, valor]) => {
                        const Icono = iconosKpi[clave] || BsBuilding

                        return (
                          <Col key={clave} xs={12} md={6} lg={3}>
                            <Card className="h-100 shadow-sm dashboard-card">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                  <Card.Title className="text-capitalize mb-0">
                                    {clave.replaceAll('_', ' ')}
                                  </Card.Title>

                                  <Icono
                                    size={28}
                                    className="dashboard-kpi-icon"
                                  />
                                </div>

                                <Card.Text className="fs-3 fw-bold mt-3 mb-0">
                                  {valor}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      },
                    )
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recursos y ocupación */}
        <Row className="mt-4 g-3">
          <Col xs={12} lg={7}>
            <Card className="h-100 shadow-sm dashboard-card">
              <Card.Body>
                <h5>Recursos con mayor demanda</h5>

                <Row className="g-3 mt-1">
                  {cargando ? (
                    <Col xs={12} className="text-center">
                      <Spinner />
                    </Col>
                  ) : (
                    (dataApi?.recursos_mayor_demanda ?? []).map((recurso) => (
                      <Col key={recurso.nombre} xs={12} sm={6}>
                        <div className="border rounded p-3 h-100 dashboard-item">
                          <div className="fw-semibold">
                            {recurso.nombre}
                          </div>

                          <div className="fs-4 fw-bold text-primary">
                            {recurso.total_reservas}
                          </div>

                          <small className="text-muted">
                            {recurso.total_reservas === 1
                              ? 'reserva'
                              : 'reservas'}
                          </small>
                        </div>
                      </Col>
                    ))
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={5}>
            <Card className="h-100 shadow-sm dashboard-card">
              <Card.Body>
                <h5>Ocupación por espacio</h5>

                {cargando ? (
                  <div className="text-center">
                    <Spinner />
                  </div>
                ) : (
                  (dataApi?.ocupacion_por_espacio ?? []).map((espacio) => (
                    <div key={espacio.id} className="mt-3 mb-4">
                      <div className="d-flex justify-content-between gap-2 mb-2">
                        <span>{espacio.nombre}</span>
                        <strong>{espacio.porcentaje}%</strong>
                      </div>

                      <ProgressBar now={espacio.porcentaje} />
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alertas recientes */}
        <Row className="mt-4 g-3">
          <Col xs={12}>
            <Card className="shadow-sm dashboard-card">
              <Card.Body>
                <h5>Alertas recientes</h5>

                <TablaGeneral
                  datos={dataApi?.alertas ?? []}
                  showSpinner={cargando}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actividades de hoy */}
        <Row className="mt-4 g-3">
          <Col xs={12}>
            <Card className="shadow-sm dashboard-card">
              <Card.Body>
                <h5>Actividades de hoy</h5>

                <TablaGeneral
                  datos={dataApi?.actividades_hoy ?? []}
                  showSpinner={cargando}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  )
}
