
import { Card, Row, Col, Badge } from "react-bootstrap";

export default function RecursoCard({ recurso }) {
  if (!recurso) return null;

  const formatearTexto = (texto = "") =>
    texto.charAt(0).toUpperCase() + texto.slice(1);

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getEstadoVariant = (estado) => {
    switch (estado?.toLowerCase()) {
      case "disponible":
        return "success";
      case "en uso":
        return "primary";
      case "fuera de servicio":
        return "danger";
      case "en mantenimiento":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <small className="text-muted">
              {recurso.categoria}
            </small>

            <Card.Title className="mt-1">
              {recurso.nombre}
            </Card.Title>
          </div>

          <Badge bg={getEstadoVariant(recurso.estado)}>
            {formatearTexto(recurso.estado)}
          </Badge>
        </div>

        <hr />

        {/* Información del recurso */}
        <h6 className="mb-3">Información general</h6>

        <Row className="g-3">
          <Col xs={6}>
            <small className="text-muted">Cantidad</small>
            <p className="fw-semibold mb-0">{recurso.cantidad}</p>
          </Col>

          <Col xs={6}>
            <small className="text-muted">Movilidad</small>
            <p className="fw-semibold mb-0">
              {formatearTexto(recurso.tipo_movilidad)}
            </p>
          </Col>

          <Col xs={12}>
            <small className="text-muted">ID del recurso</small>
            <p className="fw-semibold mb-0">#{recurso.id}</p>
          </Col>
        </Row>

        <hr />

        {/* Ubicación */}
        <h6 className="mb-3">Ubicación habitual</h6>

        <p className="fw-semibold mb-1">
          {recurso.espacio_habitual?.nombre ?? "Sin asignar"}
        </p>

        <small className="text-muted">
          {recurso.espacio_habitual?.ubicacion ?? "-"}
        </small>

        <div className="mt-3">
          <small className="text-muted">Ubicación actual</small>

          <p className="fw-semibold mb-1">
            {recurso.espacio_actual?.nombre ?? "Sin asignar"}
          </p>

          <small className="text-muted">
            {recurso.espacio_actual?.ubicacion ?? "-"}
          </small>
        </div>

        <hr />

        {/* Registro */}
        <h6 className="mb-3">Registro</h6>

        <Row>
          <Col xs={6}>
            <small className="text-muted">Creado</small>
            <p className="mb-0 small">
              {formatearFecha(recurso.created_at)}
            </p>
          </Col>

          <Col xs={6}>
            <small className="text-muted">Actualizado</small>
            <p className="mb-0 small">
              {formatearFecha(recurso.updated_at)}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
