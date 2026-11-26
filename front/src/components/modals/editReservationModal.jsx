import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext.jsx';
import { actualizarReserva } from '../../services/apiRoutes.js';

// Soporta "2026-11-27T16:00:00", "2026-11-27 16:00:00" o strings ISO con zona
const separarFechaHora = (valor) => {
    if (!valor) return { fecha: '', hora: '' };
    const partes = String(valor).trim().split(/[T\s]+/);
    const fecha = /^\d{4}-\d{2}-\d{2}/.test(partes[0])
        ? partes[0].slice(0, 10)
        : '';
    const hora = partes[1] ? partes[1].slice(0, 5) : '';
    return { fecha, hora };
};

// Arma "YYYY-MM-DDTHH:mm:ss" sin desfasar zona horaria
const armarIsoLocal = (fecha, hora) => {
    if (!fecha || !hora) return null;
    const horaFormateada = hora.length === 5 ? `${hora}:00` : hora;
    return `${fecha}T${horaFormateada}`;
};

export default function ModalEditarReserva({
    show,
    onHide,
    reserva,
    onActualizado,
}) {
    const { getTokken } = useContext(AuthContext);
    const [guardando, setGuardando] = useState(false);
    const [formReserva, setFormReserva] = useState({
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        estado: 'programada',
    });

    useEffect(() => {
        if (reserva) {
            const inicio = separarFechaHora(reserva.fecha_hora_inicio);
            const fin = separarFechaHora(reserva.fecha_hora_fin);

            setFormReserva({
                fecha: inicio.fecha || (reserva.fecha ? String(reserva.fecha).slice(0, 10) : ''),
                hora_inicio: inicio.hora || (reserva.hora_inicio ? String(reserva.hora_inicio).slice(0, 5) : ''),
                hora_fin: fin.hora || (reserva.hora_fin ? String(reserva.hora_fin).slice(0, 5) : ''),
                estado: reserva.estado || 'programada',
            });
        }
    }, [reserva]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormReserva((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const enviarActualizacion = async (nuevoEstado = formReserva.estado) => {
        if (!reserva?.id) return;

        const payload = {
            ...reserva,
            fecha: formReserva.fecha,
            hora_inicio: formReserva.hora_inicio,
            hora_fin: formReserva.hora_fin,
            fecha_hora_inicio: armarIsoLocal(formReserva.fecha, formReserva.hora_inicio),
            fecha_hora_fin: armarIsoLocal(formReserva.fecha, formReserva.hora_fin),
            estado: nuevoEstado,
        };

        try {
            setGuardando(true);
            await actualizarReserva(getTokken(), reserva.id, payload);
            if (onActualizado) {
                await onActualizado();
            }
            onHide();
        } catch (err) {
            console.error('Error al actualizar reserva:', err);
        } finally {
            setGuardando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await enviarActualizacion(formReserva.estado);
    };

    // Ajustá el string ("suspendida" o "cancelada") al valor que acepte tu back
    const handleSuspender = async () => {
        await enviarActualizacion('suspendida');
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar reserva</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body className="d-flex flex-column gap-3">
                    <Form.Group controlId="fechaReserva">
                        <Form.Label>Día</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha"
                            value={formReserva.fecha}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Form.Group controlId="horaInicioReserva" className="w-50">
                            <Form.Label>Hora inicio</Form.Label>
                            <Form.Control
                                type="time"
                                name="hora_inicio"
                                value={formReserva.hora_inicio}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="horaFinReserva" className="w-50">
                            <Form.Label>Hora fin</Form.Label>
                            <Form.Control
                                type="time"
                                name="hora_fin"
                                value={formReserva.hora_fin}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="estadoReserva">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="estado"
                            value={formReserva.estado}
                            onChange={handleChange}
                        >
                            <option value="programada">Programada</option>
                            <option value="finalizada">Finalizada</option>
                            <option value="suspendida">Suspendida</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    <Button
                        variant="outline-danger"
                        type="button"
                        disabled={guardando}
                        onClick={handleSuspender}
                    >
                        Suspender reserva
                    </Button>

                    <div className="d-flex gap-2">
                        <Button variant="secondary" type="button" onClick={onHide} disabled={guardando}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit" disabled={guardando}>
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}