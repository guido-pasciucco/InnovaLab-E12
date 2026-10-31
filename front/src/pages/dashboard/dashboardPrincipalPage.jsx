import { Link } from "react-router-dom";
import { getDashboardApi } from "../../utils/apiRoutes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Row, Col, Card, ProgressBar, Container } from "react-bootstrap";
import TablaGeneral from "../../components/tables/TablaGeneral";

export default function DashboardPrincipalPage() {
  const [dataApi, setDataApi] = useState([]);
  const { getTokken } = useContext(AuthContext);

  const getData = async () => {
    console.log("Ejecutando getData con tokken", getTokken());
    const data = await getDashboardApi(getTokken());
    console.log("data en dashboard cargada: ", data.data);
    setDataApi(data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container fluid className="px-3">
      {/* KPI */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h4>KPIs</h4>

              <Row className="g-3">
                {Object.entries(dataApi?.kpis ?? {}).map(([clave, valor]) => (
                  <Col key={clave} xs={12} md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>{clave.replaceAll("_", " ")}</Card.Title>

                        <Card.Text className="fs-3 fw-bold">{valor}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Recursos y ocupación */}
      <Row className="mt-4 g-3">
        <Col xs={12} lg={7}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5>Recursos con mayor demanda</h5>

              <Row className="g-3 mt-1">
                {(dataApi?.recursos_mayor_demanda ?? []).map((recurso) => (
                  <Col key={recurso.nombre} xs={12} sm={6}>
                    <div className="border rounded p-3 h-100">
                      <div className="fw-semibold">{recurso.nombre}</div>

                      <div className="fs-4 fw-bold text-primary">
                        {recurso.total_reservas}
                      </div>

                      <small className="text-muted">
                        {recurso.total_reservas === 1 ? "reserva" : "reservas"}
                      </small>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={5}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5>Ocupación por espacio</h5>

              {(dataApi?.ocupacion_por_espacio ?? []).map((espacio) => (
                <div key={espacio.id} className="mt-3 mb-4">
                  <div className="d-flex justify-content-between gap-2 mb-2">
                    <span>{espacio.nombre}</span>
                    <strong>{espacio.porcentaje}%</strong>
                  </div>

                  <ProgressBar now={espacio.porcentaje} />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alertas recientes */}
      <Row className="mt-4 g-3">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Alarmas recientes</h5>

              <TablaGeneral datos={dataApi?.alertas ?? []} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actividades_hoy */}
      <Row className="mt-4 g-3">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Actividades hoy</h5>
              <TablaGeneral datos={dataApi?.actividades_hoy ?? []} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
