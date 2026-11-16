import Calendario from "../../components/others/calendar"
import GenericSelect from "../../components/others/select"
import { Link } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { getReservas } from "../../services/apiRoutes"
import { AuthContext } from "../../context/AuthContext.jsx";
import { Spinner } from "react-bootstrap";
import { getEspaciosApi, getActividades } from "../../services/apiRoutes"


export default function CalendarioReservasPage() {
    const [actividades, setActividades] = useState([]);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([])
    const [showSpinner, setShowSpinner] = useState(false)
    const { getTokken } = useContext(AuthContext);
    const hoy = new Date();
    const diffLunes = (hoy.getDay() + 6) % 7;
    const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - diffLunes);
    const domingo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - diffLunes + 6);
    // Extraemos los números de día y el nombre del mes
    const diaInicial = lunes.getDate();
    const diaFinal = domingo.getDate();
    const nombreDelMes = lunes.toLocaleDateString('es-ES', { month: 'long' }); // Ej: "noviembre"
    // Resultado armado dinámicamente:
    const textoSemana = `Semana del ${diaInicial} al ${diaFinal} de ${nombreDelMes}`;

    const getData = async () => {

        try {
            setShowSpinner(true);
            const [espaciosRes, reservasRes, actividadesRes] = await Promise.all([
                getEspaciosApi(getTokken()),
                getReservas(getTokken()),
                getActividades(getTokken()),
            ]);
            setReservas(reservasRes.data.data)
            setEspaciosApi(espaciosRes.data.data);
            setActividades(actividadesRes.data.data);
        } catch (err) {
            console.log("Error al cargar datos:", err);
        } finally {
            setShowSpinner(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    console.log("reservas", reservas);
    return (
        <>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="d-flex flex-column justify-content-center">
                    <h1 className="text-start h1">Calendario</h1>
                    <p>{textoSemana} * Sala Sim 1</p>
                </div>
                <div className="d-flex flex-row gap-2">
                    <button className="btn btn-secondary">
                        Hoy
                    </button>
                    <Link to="/dashboard/nueva-reserva" className="btn btn-primary">
                        Nueva reserva
                    </Link>
                </div>
            </div>
            <div className="d-flex flex-column my-3 gap-3">
                <div className="d-flex flex-row gap-3">
                    <GenericSelect text="Espacio: "
                        opciones={espaciosApi.map((item) => item.nombre)} />
                    <GenericSelect text="Recurso: "
                        opciones={[
                            "Todos",
                        ]} />
                    <GenericSelect text="Actividad"
                        opciones={actividades.map((item) => item.nombre)} />
                </div>
                <div className="bg-danger p-3 rounded-3 shadow-sm">
                    Alerta de superposición
                </div>
                <div className="d-flex flex-row gap-2">
                    <span className="bg-success p-1 rounded-3 shadow-sm">Confirmada</span>
                    <span className="bg-primary p-1 rounded-3 shadow-sm">Programada</span>
                    <span className="bg-warning p-1 rounded-3 shadow-sm">Pendiente</span>
                    <span className="bg-warning p-1 rounded-3 shadow-sm">Mantenimiento</span>
                    <span className="bg-danger p-1 rounded-3 shadow-sm">Conflicto</span>
                </div>
            </div>
            {showSpinner ? (
                <Spinner />
            ) : (
                <Calendario eventos={reservas} />
            )}
        </>
    )
}