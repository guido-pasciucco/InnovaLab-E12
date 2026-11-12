import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEspaciosApi, getReservas } from "../../utils/apiRoutes.js";
import { Spinner } from "react-bootstrap";
import { Form } from 'react-bootstrap';

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
            const [espaciosRes, reservasRes] = await Promise.all([
                getEspaciosApi(getTokken()),
                getReservas(getTokken()),
            ]);
            setEspaciosApi(espaciosRes.data.data);
            setReservas(reservasRes.data.data);
            console.log("Datos de espacios obtenidos:", espaciosApi);
        }
        catch (error) {
            console.error("Error al obtener espacios:", error);
        } finally {
            setShowSpinner(false);
        }
    };

    const capacidadRequerida = formData.participantes_estimados;
    console.log('Capacidad requerida: ', capacidadRequerida);

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
                                    <small className={`ms-2 ${opcion.capacidad < capacidadRequerida ?
                                        'text-danger' :
                                        'text-black'
                                        }`}
                                    >
                                        {opcion.capacidad >= capacidadRequerida
                                            ? `Capacidad: ${opcion.capacidad}`
                                            : 'Capacidad superada para este espacio'}
                                    </small>
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