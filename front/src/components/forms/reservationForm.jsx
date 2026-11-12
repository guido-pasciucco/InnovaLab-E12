import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './reservationForm.module.css';
import GenericSelect from '../others/select';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEspaciosApi, getActividades, getReservas } from "../../services/apiRoutes.js";

function ReservationForm({ onSubmitForm, formData, handleChange }) {
    const [actividades, setActividades] = useState([]);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const { getTokken } = useContext(AuthContext);

    console.log('Reservas a la fecha: ', reservas);
    const getData = async () => {

        try {
            setShowSpinner(true);
            const [espaciosRes, actividadesRes, reservasRes] = await Promise.all([
                getEspaciosApi(getTokken()),
                getActividades(getTokken()),
                getReservas(getTokken()),
            ]);
            setEspaciosApi(espaciosRes.data.data);
            setActividades(actividadesRes.data.data);
            setReservas(reservasRes.data.data);
        } catch (err) {
            console.error("Error al cargar datos:", err);
        } finally {
            setShowSpinner(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (

        <div className='d-flex flex-row gap-3'>
            <form onSubmit={onSubmitForm} style={{ width: '80%' }}>
                <div className='d-flex mb-2'>
                    <h3>Datos de la reserva</h3>
                </div>
                <div className="d-flex flex-column mb-5">
                    <div className="d-flex flex-column align-items-start mb-2 w-100">
                        <label htmlFor="nombre" className="form-label">Actividad</label>
                        <GenericSelect
                            name='nombre'
                            id='nombre'
                            text="Elige una actividad"
                            opciones={actividades.map((item) => item.nombre)}
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='d-flex mb-2 gap-3'>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="datepickerMinMax" className="form-label">
                                Fecha
                            </label>
                            <input
                                type="date"
                                name="fecha"
                                className={`form-control w-100 ${styles.inputFecha}`}
                                id="datepickerMinMax"
                                min="2026-01-01"
                                max="2027-12-31"
                                value={formData.fecha}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="horaInicio" className="form-label">Hora de inicio</label>
                            <input
                                name='hora_inicio'
                                id='hora_inicio'
                                type="time"
                                className="form-control"
                                placeholder='11:00'
                                value={formData.hora_inicio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="horaFin" className="form-label">Hora de fín</label>
                            <input
                                name='hora_fin'
                                id='hora_fin'
                                type="time"
                                className="form-control"
                                placeholder='13:00'
                                value={formData.hora_fin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='d-flex mb-2 gap-3'>
                    </div>
                    <div className='d-flex mb-2 gap-3'>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="participantes_estimados" className="form-label">Participantes estimados</label>
                            <input
                                name='participantes_estimados'
                                id='participantes_estimados'
                                type="number"
                                className="form-control"
                                placeholder='10'
                                value={formData.participantes_estimados}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="tipo" className="form-label">Tipo de espacio</label>
                            <GenericSelect
                                name='tipo'
                                id='tipo'
                                text="Elige el tipo de espacio"
                                opciones={[...new Set(espaciosApi.map((item) => item.tipo))]}
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='d-flex mb-2 gap-3'>
                        <p>
                            ¿La actividad no existe ? Crear nueva actividad {''}
                            <Link to="/dashboard/nueva-actividad" className="text-decoration-none">
                                aquí.
                            </Link>
                        </p>
                    </div>
                    <div className="d-flex justify-content-end mb-2 gap-3">
                        <button
                            type="button"
                            className="btn btn-secondary text-nowrap"
                            data-bs-toggle="modal"
                            data-bs-target="#miModal"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary text-nowrap">
                            Continuar
                        </button>
                    </div>
                </div>
            </form>
            <div className="p-3 border rounded bg-light align-self-start">
                {formData.fecha ? (
                    <div>
                        {/* Muestra el día de la semana formateado */}
                        <p className="text-capitalize fw-bold">
                            Ocupación {new Date(`${formData.fecha}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'long' }).substring(0,3)}
                            {' '}{formData.fecha}
                        </p>

                        {/* Aquí muestras la info que viene del backend para esa fecha */}

                        {/* Ejemplo: si guardas la disponibilidad en un estado o la buscas */}
                        {reservas && reservas
                            .filter(r => {
                                const fechaReserva = r?.fecha_hora_inicio ? r.fecha_hora_inicio.substring(0, 10) : '';
                                return fechaReserva === formData.fecha;
                            })
                            .map((reserva, index) => {
                                const horaInicio = reserva?.fecha_hora_inicio ?
                                    new Date(reserva.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
                                const horaFin = reserva?.fecha_hora_fin ?
                                    new Date(reserva.fecha_hora_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';

                                return (
                                    <div key={index}>
                                        <p>
                                            {reserva.espacio.nombre} - Cap: {reserva.espacio.capacidad} 
                                        </p>
                                        <p>
                                            Ocupada: {horaInicio} - {horaFin}
                                        </p>
                                    </div>
                                );
                            })
                        }

                    </div>
                ) : (
                    <p className="text-muted">Selecciona una fecha para ver la disponibilidad.</p>
                )}
            </div>
        </div>
    )
}

export default ReservationForm;