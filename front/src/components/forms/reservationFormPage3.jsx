import { getEquipamientoApi } from "../../services/apiRoutes.js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Spinner } from "react-bootstrap";

function ReservationForm3({ onSubmitFinal, onBack, formData, handleChange }) {
    const { getTokken } = useContext(AuthContext);
    const [showSpinner, setShowSpinner] = useState(false);
    const [equipamientoApi, setEquipamientoApi] = useState([]);
    const getData = async () => {

        try {
            setShowSpinner(true);
            const equipamientoRes = await getEquipamientoApi(getTokken());
            setEquipamientoApi(equipamientoRes.data.data);
            console.log("Datos de equipos obtenidos:", equipamientoRes.data.data);
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

    console.log("Datos de la reserva en el paso 3:", formData);

    const handleSubmit = (e) => {
        e.preventDefault();
        // 2. Llamamos a onSubmitFinal pasando un objeto vacío (o los datos locales si los hubiera),
        // evitando por completo que se propague el evento del navegador al componente padre.
        onSubmitFinal({});
    };

    const equipoEncontrado = equipamientoApi.find(
    (eq) => String(eq.id) === String(formData.equipamientoMovil)
);
    const nombreDeEquipoAMostrar = equipoEncontrado?.nombre ?? formData.equipamientoMovil ?? "Sin equipamiento móvil";

    return (
        <form onSubmit={handleSubmit}>
            <div className='d-flex mb-2'>
                <h3>Resumen de la reserva</h3>
            </div>
            <div className="d-flex flex-column mb-5 align-items-start">
                <span>Actividad: {formData.nombre}</span>
                <span>Fecha y hora: {formData.fecha}. {formData.hora_inicio} - {formData.hora_fin}</span>
                <span>Ubicación: {formData.espacio}</span>
                <span>Participantes: {formData.participantes_estimados}</span>
                <span>Equipamiento: {nombreDeEquipoAMostrar}</span>
                <span>Responsable: {formData.resposable_id}</span>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    Volver
                </button>
                <button className="btn btn-primary" type="submit">
                    Confirmar Reserva
                </button>
            </div>
        </form>
    );
}

export default ReservationForm3;