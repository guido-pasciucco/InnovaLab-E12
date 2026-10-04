import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalConfirmacion({ show, handleClose, onConfirm }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Guardar los cambios?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Vas a actualizar los datos del espacio podes actualizarlos cuando quieras</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfirmacion;
