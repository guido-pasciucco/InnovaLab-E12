import { useState, useContext, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function ListadoReservasPage() {

    const { getTypeAndToken } = useContext(AuthContext);
    const { token_type, access_token } = getTypeAndToken();

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "Taller de RCP y Reanimación Avanzada",
        descripcion: "Práctica intensiva con simuladores de alta fidelidad",
        tipo: "Taller",
        cantidad_alumnos: 25,
        estado: "planificada",
        docente_id: 1,
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados:", formData);
        // acá podrías hacer un fetch/axios POST a tu
        

        handleClose();
    };
    return (
        <>
            <div>
                <h1 className="text-start">Reservas</h1>
            </div>

            <>
                <Button variant="primary" onClick={handleShow}>
                    Cargar reserva
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Formulario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDescripcion">
                                <Form.Label>Descripcion</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDescripcion">
                                <Form.Label>tipo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Cantidad de alumnos</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cantidad"
                                    value={formData.cantidad_alumnos}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEstado">
                                <Form.Label>estado</Form.Label>
                                <Form.Select>
                                    <option value="">Seleccione...</option>
                                    <option value="efectivo">Planificada</option>
                                    <option value="tarjeta">en_curso</option>
                                    <option value="transferencia">finalizada</option>
                                    <option value="transferencia">Cancelada</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formIdDocente">
                                <Form.Label>Docente Id</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="id-docente"
                                    value={formData.docente_id}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        </>
    );
}