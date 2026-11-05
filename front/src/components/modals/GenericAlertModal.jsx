import { Modal, Button } from "react-bootstrap";

function GenericAlertModal({
  show,
  onHide,
  tipo = "success",
  titulo,
  mensaje,
}) {
  const configuracion = {
    success: {
      titulo: "Operación exitosa",
      variant: "success",
      icono: "✓",
    },
    error: {
      titulo: "Ocurrió un error",
      variant: "danger",
      icono: "✕",
    },
    warning: {
      titulo: "Atención",
      variant: "warning",
      icono: "!",
    },
  };

  const config = configuracion[tipo] || configuracion.success;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className={`text-${config.variant} me-2`}>{config.icono}</span>
          {titulo || config.titulo}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>{mensaje}</Modal.Body>

      <Modal.Footer>
        <Button variant={config.variant} onClick={onHide}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GenericAlertModal;
