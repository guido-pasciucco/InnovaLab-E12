import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './reservationForm.module.css';
import GenericSelect from '../others/select';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEquipamientoApi, getEspaciosApi, getActividades, getReservas, postEquipamientoApi, postReservas } from "../../utils/apiRoutes.js";
import { toast } from 'react-toastify';

function ReservationForm() {
    const [equipamientoApi, setEquipamientoApi] = useState([]);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const { getTokken } = useContext(AuthContext);

    const getData = async () => {

        try {
            setShowSpinner(true);
            const res = await getEquipamientoApi(getTokken());
            const res2 = await getEspaciosApi(getTokken())
            const res3 = await getReservas(getTokken());
            const res4 = await getActividades(getTokken());
            setEquipamientoApi(res.data.data);
            setEspaciosApi(res2.data.data)
            setReservas(res3.data.data)
            setActividades(res4.data.data)
        } catch (err) {
            console.log("Error al cargar datos:", err);
        } finally {
            setShowSpinner(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const estadoInicial = {
        actividad_id: "",
        espacio_id: "",
        usuario_solicitante_id: "",
        fecha_hora_inicio: "",
        fecha_hora_fin: "",
        equipamiento_id: "",
    }
    const [formData, setFormData] = useState(estadoInicial);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // const nuevaActividad = !actividades.find(act => act.nombre === formData.actividad_id);

        // if (nuevaActividad) {
        //     const nuevaActividadId = actividades.length + 1;
        //     actividad_id = nuevaActividadId;
        // }
        const actividadId = actividades.find(act => act.nombre === formData.actividad_id)?.id;
        const espacioId = espaciosApi.find(esp => esp.nombre === formData.espacio_id)?.id;
        const equipamientoId = equipamientoApi.find(eq => eq.nombre === formData.equipamiento_id)?.id;
        const fechaInicioCompleta = formData.fecha && formData.fecha_hora_inicio
            ? `${formData.fecha} ${formData.fecha_hora_inicio}:00`
            : formData.fecha_hora_inicio;

        const fechaFinCompleta = formData.fecha && formData.fecha_hora_fin
            ? `${formData.fecha} ${formData.fecha_hora_fin}:00`
            : formData.fecha_hora_fin;

        const datosParaEnviar = {
            ...formData,
            actividad_id: actividadId,
            espacio_id: espacioId,
            equipamiento_id: equipamientoId,
            fecha_hora_inicio: fechaInicioCompleta,
            fecha_hora_fin: fechaFinCompleta
        };

        try {

            console.log("Datos enviados:", datosParaEnviar);

            await postReservas(datosParaEnviar, getTokken());
            toast.success("Reserva guardada con exito!");
            console.log("Datos cargados correctamente");
            setShowSpinner(true);
            getData();
            setFormData(estadoInicial);

        } catch (err) {
            console.log("Error detallado del servidor:", err);

            if (err.response && err.response.data) {
                console.log("Mensaje de validación:", err.response.data);
            }

            toast.error("Hubo un error al guardar. Revisa los datos.");
        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    return (

        <form onSubmit={handleSubmit}>
            <div className='d-flex mb-2'>
                <h3>Datos de la reserva</h3>
            </div>
            <div className="d-flex flex-column mb-5">
                <div className="d-flex flex-column align-items-start mb-2 w-100">
                    <label htmlFor="actividad" className="form-label">Actividad</label>
                    <GenericSelect
                        name='actividad_id'
                        id='actividad_id'
                        text="Elige una actividad"
                        opciones={actividades.map((item) => item.nombre)}
                        value={formData.actividad_id}
                        onChange={handleChange}
                        required
                    />
                    {/* <input
                        name='actividad_id'
                        id='actividad_id'
                        type="text"
                        className="form-control"
                        placeholder='Curso de enfermería'
                        value={formData.actividad_id}
                        onChange={handleChange}
                        required
                    /> */}
                </div>
                <div className='d-flex mb-2 gap-3'>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="espacio" className="form-label">Espacio</label>
                        <GenericSelect
                            name='espacio_id'
                            id='espacio_id'
                            text="Elige un espacio"
                            opciones={espaciosApi.map((item) => item.nombre)}
                            value={formData.espacio_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                </div>
                <div className='d-flex mb-2 gap-3'>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="horaInicio" className="form-label">Hora de inicio</label>
                        <input
                            name='fecha_hora_inicio'
                            id='fecha_hora_inicio'
                            type="text"
                            className="form-control"
                            placeholder='11:00'
                            value={formData.fecha_hora_inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="horaFin" className="form-label">Hora de fín</label>
                        <input
                            name='fecha_hora_fin'
                            id='fecha_hora_fin'
                            type="text"
                            className="form-control"
                            placeholder='13:00'
                            value={formData.fecha_hora_fin}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className='d-flex mb-2 gap-3'>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="equipamiento" className="form-label">Equipamiento</label>
                        <GenericSelect
                            name='equipamiento_id'
                            id='equipamiento_id'
                            text="Elige equipamiento"
                            opciones={equipamientoApi.map((item) => item.nombre)}
                            value={formData.equipamiento_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="responsable" className="form-label">Responsable</label>
                        <input
                            name='usuario_solicitante_id'
                            id='usuario_solicitante_id'
                            type="text"
                            className="form-control"
                            placeholder='Martín Paz'
                            value={formData.usuario_solicitante_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                        Enviar para aprobación
                    </button>
                    {/* <Link to="/dashboard/resolver-conflicto" className="btn btn-primary text-nowrap">
                        Enviar para aprobación
                    </Link> */}
                </div>
            </div>
        </form>
    )
}

export default ReservationForm;