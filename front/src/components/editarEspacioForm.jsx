import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from './select';


function EditarEspacioForm() {

    return (

        <form className="w-60 card p-3 shadow-sm" style={{ width: '75%' }}>
            <div className='d-flex mb-2'>
                <h3>Datos del espacio</h3>
            </div>
            <div className="d-flex flex-column mb-5">
                <div className="d-flex flex-column align-items-start mb-2 w-100">
                    <label htmlFor="actividad" className="form-label">Nombre</label>
                    <input id='actividad' type="text" className="form-control" placeholder='Sala sim 1' />
                </div>
                <div className='d-flex mb-2 gap-3'>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="datepicker1" className="form-label">Tipo</label>
                        <input id='actividad' type="text" className="form-control" placeholder='Simulación' />
                    </div>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="datepicker1" className="form-label">Capacidad</label>
                        <input type="text" className="form-control" id="datepicker1" data-bs-toggle="datepicker" autoComplete="off" placeholder="12" />
                    </div>
                </div>
                <div className="d-flex flex-column align-items-start mb-2 w-100">
                    <label htmlFor="actividad" className="form-label">Ubicación</label>
                    <input id='actividad' type="text" className="form-control" placeholder='Planta baja' />
                </div>
                <div className='d-flex mb-2 gap-3'>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="equipamiento" className="form-label">Mantenimiento desde</label>
                        <input id='equipamiento' type="text" className="form-control" placeholder='--' />
                    </div>
                    <div className="d-flex flex-column align-items-start mb-3 w-50">
                        <label htmlFor="responsable" className="form-label">Mantenimiento hasta</label>
                        <input id='responsable' type="text" className="form-control" placeholder='--' />
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
                        Guardar cambios
                    </button>
                </div>
            </div>
        </form>
    )
}

export default EditarEspacioForm;