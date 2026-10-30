import ReservationForm from "../../components/forms/reservationForm";

export default function NuevaReservaPage() {

    return (
        <>
            <div>
                <h1 className="text-start">Nueva reserva</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 p-4">
                <ReservationForm />
                <div className="d-flex flex-column gap-3" style={{ width: '22%' }}>
                    <div className="card p-3 shadow-sm">
                        <h3>Verificación en tiempo real</h3>
                        <div className="card p-2 shadow-sm my-3">
                            <span>▲ Conflicto: superposición</span>
                            <p>Sala sim 1 ocupada de 10:00 a 12:00 (Práctica RCP)</p>
                        </div>
                        <div className="card p-2 shadow-sm">
                            <span>■ Capacidad excedida</span>
                            <p>La capacidad máxima de la sala es de 12 personas</p>
                        </div>
                    </div>
                    <div className="card p-3 shadow-sm">
                        <h3>Alternativas disponibles</h3>
                        <div className="d-flex flex-row justify-content-between my-2">
                            <span>
                                Sala sim 1 mie 11:00 a 13:00
                            </span>
                            <button className="btn btn-primary text-nowrap">
                                Elegir
                            </button>
                        </div>
                        <div className="d-flex flex-row justify-content-between my-2">
                            <span>
                                Sala sim 2 mie 12:00 a 14:00
                            </span>
                            <button className="btn btn-primary text-nowrap">
                                Elegir
                            </button>
                        </div> 
                    </div>
                </div>
            </div >
        </>
    )

}