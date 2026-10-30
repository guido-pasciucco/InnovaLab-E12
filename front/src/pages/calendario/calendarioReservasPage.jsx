import Calendario from "../../components/others/calendar"
import GenericSelect from "../../components/others/select"

export default function CalendarioReservasPage() {

    return (
        <>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="d-flex flex-column justify-content-center">
                    <h1>Calendario</h1>
                    <p>Semana del 5 al 9 de octubre  * Sala Sim 1</p>
                </div>
                <div className="d-flex flex-row gap-2">
                    <button className="btn btn-secondary">
                        Hoy
                    </button>
                    <button className="btn btn-primary">
                        Nueva actividad
                    </button>
                </div>
            </div>
            <div className="d-flex flex-column my-3 gap-3">
                <div className="d-flex flex-row">
                    <GenericSelect text="Espacio: "
                        opciones={[
                            "Sala Sim 1",
                            "Sala medica",
                            "Laboratorio de Simulación A",
                            "Sala de Capacitación",
                        ]} />
                    <GenericSelect text="Recurso: "
                        opciones={[
                            "Todos",
                        ]} />
                    <GenericSelect text="Actividad"
                        opciones={[
                            'Práctica RCP',
                            "Taller de suturas",
                        ]} />
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


            <Calendario />
        </>
    )
}