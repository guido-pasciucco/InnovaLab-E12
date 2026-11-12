import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './reservationForm.module.css';
import GenericSelect from '../others/select.jsx';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEquipamientoApi, getEspaciosApi, getActividades, getReservas, postEquipamientoApi, postReserva } from "../../services/apiRoutes.js";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { Form, Button } from 'react-bootstrap';

function ReservationForm2({ onSubmitForm, onBack, formData, onCustomChange }) {
    const [showSpinner, setShowSpinner] = useState(false);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([]);
    const { getTokken } = useContext(AuthContext);
    const espaciosDisponibles = espaciosApi.filter(espacio => {
        const reservasParaEspacio = reservas.filter(
            reserva => reserva.espacioId === espacio.id
                && reserva.fecha === dataEncurso.fecha
                && reserva.hora_inicio === dataEncurso.hora_inicio).map(reserva => reserva.espacioId);
        return espaciosApi.filter(espacio => !reservasParaEspacio.includes(espacio.id));
    });
    const getData = async () => {

        try {
            setShowSpinner(true);
            const res = await getEspaciosApi(getTokken());
            setEspaciosApi(res.data.data);
            console.log("Datos de espacios obtenidos:", espaciosApi);
        }
        catch (error) {
            console.error("Error al obtener espacios:", error);
        } finally {
            setShowSpinner(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Form onSubmit={onSubmitForm}>
            <div className="d-flex flex-column gap-3 my-3">
                {/* Si aún no cargan los espacios, mostramos un mensaje o spinner para evitar renderizados vacíos */}
                {!espaciosDisponibles || espaciosDisponibles.length === 0 ? (
                    <p className="text-center text-muted">Cargando espacios disponibles...</p>
                ) : (
                    espaciosDisponibles.map((opcion) => (
                        <Form.Check
                            key={opcion.id}
                            className="d-flex flex-row align-items-center gap-5 w-100 card p-1 shadow-sm"
                            reverse
                            type="radio"
                            label={
                                <div className="d-flex flex-column align-items-start">
                                    <span>{opcion.nombre}</span>
                                    <small className="ms-2">Capacidad: {opcion.capacidad}</small>
                                </div>
                            }
                            name="espacio"
                            id={`radio-${opcion.id}`}
                            value={opcion.nombre}
                            // Forzamos booleano estricto con el doble igual o doble negación por seguridad
                            checked={String(formData.espacio) === String(opcion.nombre)}
                            onChange={() => onCustomChange('espacio', opcion.nombre)}
                        />
                    ))
                )}
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={onBack}>
                    Volver
                </button>
                <button className="btn btn-primary" type="submit">
                    Continuar
                </button>
            </div>
        </Form>
    );

}

export default ReservationForm2;