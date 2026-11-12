import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './reservationForm.module.css';
import GenericSelect from '../others/select';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEspaciosApi, getActividades } from "../../services/apiRoutes.js";

function ReservationForm( { onSubmitForm, formData, handleChange } ) {
    const [actividades, setActividades] = useState([]);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const { getTokken } = useContext(AuthContext);
    const getData = async () => {

        try {
            setShowSpinner(true);
            const res2 = await getEspaciosApi(getTokken());
            const res4 = await getActividades(getTokken());
            setEspaciosApi(res2.data.data);
            setActividades(res4.data.data);
        } catch (err) {
            console.log("Error al cargar datos:", err);
        } finally {
            setShowSpinner(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);


    return (

        <form onSubmit={onSubmitForm}>
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
    )
}

export default ReservationForm;