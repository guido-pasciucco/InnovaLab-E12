import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from './select';

function ReservationForm() {


    return (
        <>
            <div>
                <h1 className="text-start">Nueva reserva</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 p-4">
                <form className="w-60 card p-3 shadow-sm" style={{ width: '75%' }}>
                    <div className='d-flex '>
                        <h3>Datos de la reserva</h3>
                    </div>
                    <div className="d-flex flex-column mb-5">
                        <div className="d-flex flex-column align-items-start mb-2 w-100">
                            <label htmlFor="actividad" className="form-label">Actividad</label>
                            <input id='actividad' type="text" className="form-control" placeholder='Curso de enfermería' />
                        </div>
                        <div className='d-flex mb-2 gap-3'>
                            <div className="mb-3 w-50">
                                <label htmlFor="espacio" className="form-label">Espacio</label>
                                <GenericSelect
                                    id='espacio'
                                    text="Espacio"
                                    opciones={[]}
                                />
                            </div>
                            <div className="mb-3 w-50">
                                <label htmlFor="datepicker1" className="form-label">Fecha</label>
                                <input type="text" className="form-control" id="datepicker1" data-bs-toggle="datepicker" autoComplete="off" placeholder="Choose date…" />
                            </div>
                        </div>
                        <div className='d-flex mb-2 gap-3'>
                            <div className="d-flex flex-column mb-3 w-50">
                                <label htmlFor="horaInicio" className="form-label">Hora de inicio</label>
                                <input id='horaInicio' type="text" className="form-control" placeholder='11:00' />
                            </div>
                            <div className="d-flex flex-column mb-3 w-50">
                                <label htmlFor="horaFin" className="form-label">Hora de fín</label>
                                <input id='horaFin' type="text" className="form-control" placeholder='13:00' />
                            </div>
                        </div>
                        <div className='d-flex mb-2 gap-3'>
                            <div className="d-flex flex-column mb-3 w-50">
                                <label htmlFor="equipamiento" className="form-label">Equipamiento</label>
                                <input id='equipamiento' type="text" className="form-control" placeholder='Simulador adulto A' />
                            </div>
                            <div className="d-flex flex-column mb-3 w-50">
                                <label htmlFor="responsable" className="form-label">Responsable</label>
                                <input id='responsable' type="text" className="form-control" placeholder='Martín Paz' />
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
                            <button
                                type="button"
                                className="btn btn-primary text-nowrap"
                                data-bs-toggle="modal"
                                data-bs-target="#miModal"
                            >
                                Enviar para aprobación
                            </button>
                        </div>
                    </div>
                </form>
                <div className="d-flex flex-column gap-3" style={{ width: '22%' }}>
                    <div className="card p-3 shadow-sm">
                        <h3>Verificación en tiempo real</h3>
                    </div>
                    <div className="card p-3 shadow-sm">
                        <h3>Alternativas disponibles</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReservationForm;