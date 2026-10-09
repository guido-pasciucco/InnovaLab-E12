import { useParams } from 'react-router-dom';

export default function DetalleEspacio({ espacios }) {
    console.log(espacios)
    const { id } = useParams();

    const espacio = espacios.find((item) => String(item.id) === String(id));

    if (!espacio) {
        return <h2 className="text-danger">Espacio no encontrado</h2>;
    }

    return (
        <div className='d-flex flex-column justify-content-start align-items-start gap-3'>
            <div className='d-flex justify-content-between gap-3 align-items-center'>
                <div className='d-flex justify-content-start gap-3 align-items-center'>
                    <span>{espacio.nombre}</span>
                    <span className="badge bg-success">
                        ●
                        {espacio.estado}
                    </span>
                </div>
                <div className='d-flex justify-content-start gap-3 align-items-center'>
                    <button className="btn btn-secondary">Editar</button>
                    <button className="btn btn-primary">Reservar</button>
                </div>
            </div>
            <div b>
                <h3>Datos generales</h3>
                <div className='d-flex flex-column justify-content-center gap-1 align-items-center'>
                    <span>Tipo</span>
                    <span>{espacio.tipo}</span>
                </div>
                <div className='d-flex flex-column justify-content-center gap-1 align-items-center'>
                    <span>Capacidad</span>
                    <span>{espacio.capacidad}</span>
                </div>
                <div className='d-flex flex-column justify-content-center gap-1 align-items-center'>
                    <span>Ubicación</span>
                    <span>{espacio.ubicacion}</span>
                </div>
            </div>
            <div>
                <h3>Disponibilidad de hoy</h3>
                <p>Capacidad: {espacio.capacidad}</p>
                <span>Tipo: {espacio.tipo}</span>
            </div>
            <div>
                <h3>Proximas reservas</h3>
                <p>Capacidad: {espacio.capacidad}</p>
                <span>Tipo: {espacio.tipo}</span>
            </div>
        </div>
    );
}
