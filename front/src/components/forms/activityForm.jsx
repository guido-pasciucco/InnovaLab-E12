import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from '../others/select';
import { Link } from 'react-router-dom';
import { Spinner } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEspaciosApi, getActividades, getReservas, getEquipamientoApi, postActividades } from "../../services/apiRoutes.js";

const ESTADO_INICIAL = {
    nombre: "",
    tipo: "",
    responsable: "",
    responsable_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    participantes_estimados: "",
    duracion: "",
    espacio: "",
    estado: "programada",
};

function ActivityForm() {
    const [actividades, setActividades] = useState([]);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [equipamientoApi, setEquipamientoApi] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const { getTokken } = useContext(AuthContext);
    const tipos = ['Taller', 'Curso', 'Charla'];
    const [formData, setFormData] = useState(ESTADO_INICIAL);

    const getData = async () => {
        try {
            setShowSpinner(true);
            const [espaciosRes, actividadesRes, reservasRes, equipamientoRes] = await Promise.all([
                getEspaciosApi(getTokken()),
                getActividades(getTokken()),
                getReservas(getTokken()),
                getEquipamientoApi(getTokken())
            ]);
            setEspaciosApi(espaciosRes.data.data || []);
            setActividades(actividadesRes.data.data || []);
            setReservas(reservasRes.data.data || []);
            setEquipamientoApi(equipamientoRes.data.data || []);
        } catch (err) {
            console.error("Error al cargar datos:", err);
        } finally {
            setShowSpinner(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const completeData = formData;

        const actividadEncontrada = actividades.find(act =>
            String(act.id) === String(completeData.actividad_id) ||
            act.nombre === completeData.nombre ||
            act.nombre === completeData.tipo
        );
        const actividadId = actividadEncontrada ? actividadEncontrada.id : (actividades[0]?.id || 1);

        const espacioId = espaciosApi.find(esp =>
            esp.nombre === completeData.espacio || esp.tipo === completeData.espacio
        )?.id || null;
        const equipamientoId = equipamientoApi?.find(eq => eq.nombre === completeData.equipamiento)?.id || null;

        const fecha = completeData.fecha || new Date().toISOString().split("T")[0];
        const horaInicio = completeData.hora_inicio || "09:00";
        const horaFin = completeData.hora_fin || "10:00";
        const responsableId = Number(completeData.responsable_id) || 1;

        const estadosValidos = ["programada", "en_curso", "finalizada", "cancelada"];
        const estado = estadosValidos.includes(completeData.estado)
            ? completeData.estado
            : "programada";

        const fechaInicioCompleta = `${fecha}T${horaInicio.length === 5 ? horaInicio + ":00" : horaInicio}`;
        const fechaFinCompleta = `${fecha}T${horaFin.length === 5 ? horaFin + ":00" : horaFin}`;

        const datosParaEnviar = {
            nombre: completeData.nombre || completeData.titulo || "",
            tipo: completeData.tipo || "",
            responsable_id: responsableId,
            fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            participantes_estimados: completeData.participantes_estimados ? Number(completeData.participantes_estimados) : 1,
            duracion: completeData.duracion || "",
            estado,
            actividad_id: actividadId,
            espacio_id: espacioId,
            equipamiento_id: equipamientoId,
            fecha_hora_inicio: fechaInicioCompleta,
            fecha_hora_fin: fechaFinCompleta
        };

        try {
            await postActividades(getTokken(), datosParaEnviar);
            toast.success("Actividad guardada con exito!");
            setFormData(ESTADO_INICIAL);
            await getData();
        } catch (err) {
            console.log("Error detallado del servidor:", err);
            if (err.response && err.response.data) {
                console.log("Mensaje de validación:", err.response.data);
            }
            toast.error("Hubo un error al guardar. Revisa los datos.");
        }
    };

    if (showSpinner) {
        return <Spinner animation="border" />;
    }

    return (
        <div className='d-flex flex-row gap-3'>
            <form onSubmit={handleSubmit} style={{ width: '80%' }}>
                <div className="bg-light p-3 rounded-3 d-flex flex-column mb-5">
                    <div className="d-flex flex-column align-items-start mb-2 w-100">
                        <label htmlFor="nombre" className="form-label">Actividad</label>
                        <input
                            type='text'
                            name='nombre'
                            id='nombre'
                            placeholder='Taller de RCP'
                            className="form-control"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='d-flex mb-2 gap-3'>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="tipo" className="form-label">Tipo</label>
                            <GenericSelect
                                name='tipo'
                                id='tipo'
                                text="Elige el tipo de actividad"
                                opciones={tipos}
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="responsable" className="form-label">Responsable</label>
                            <input
                                type='text'
                                name='responsable'
                                id='responsable'
                                placeholder='Responsable...'
                                className="form-control"
                                value={formData.responsable}
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                            <label htmlFor="duracion" className="form-label">Duracion</label>
                            <input
                                name='duracion'
                                id='duracion'
                                type="text"
                                className="form-control"
                                placeholder='2h'
                                value={formData.duracion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column align-items-start mb-3 w-50">
                            <label htmlFor="espacio" className="form-label">Tipo de espacio</label>
                            <GenericSelect
                                name='espacio'
                                id='espacio'
                                text="Elige el tipo de espacio"
                                opciones={[...new Set(espaciosApi.map((item) => item.tipo).filter(Boolean))]}
                                value={formData.espacio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-2 gap-3">
                        <Link to="/dashboard/calendario" className="btn btn-secondary">
                            Cancelar
                        </Link>
                        <button type="submit" className="btn btn-primary text-nowrap">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
            <div className='d-flex flex-column gap-3'>
                <div className="p-3 border rounded bg-light align-self-start">
                    <div className='d-flex flex-column mb-2'>
                        <h3>Qué sigue</h3>
                        <p>
                            Al guardar, podés reservar un espacio y el equipamiento
                            para esta actividad en 3 pasos.
                        </p>
                    </div>
                </div>
                <div className="p-3 border rounded bg-light align-self-start">
                    <div className='d-flex flex-column mb-2'>
                        <h3>Datos obligatorios</h3>
                        <span>Nombre*</span>
                        <span>Tipo*</span>
                        <span>Responsble*</span>
                        <span>Participantes*</span>
                        <span>Duración*</span>
                        <span>Tipo de espacio*</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityForm;