import styles from './detalleEspacio.module.css';
import { useParams } from 'react-router-dom';
import ReservationTable from '../components/reservationTable';
import { useState, useEffect } from 'react';
import { listaReservas } from '../services/reservas';

export default function DetalleEspacio({ espacios }) {
    console.log('espacios:', espacios); // Agrega este console.log para verificar el valor de espacios
    const { id } = useParams();
    const [reservasProximas, setReservasProximas] = useState([]);
    const fechaDeHoy = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD

    useEffect(() => {
        const reservasFiltradas = listaReservas.filter((reserva) => reserva.fecha >= fechaDeHoy);
        setReservasProximas(reservasFiltradas);
    }, [listaReservas, fechaDeHoy]);

    const espacio = espacios.find((item) => String(item.id) === String(id));

    if (!espacio) {
        return <h2 className="text-danger">Espacio no encontrado</h2>;
    }

    return (
        <>
            <div className={styles.topContainer}>
                <div className='d-flex justify-content-start gap-3 align-items-center'>
                    <span className={styles.name}>{espacio.nombre}</span>
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
            <div className={styles.containerCards}>
                <div className={styles.cardsLeft}>
                    <div className={styles.cards}>
                        <h3 className={styles.subtitles}>Datos generales</h3>
                        <div className={styles.cardsContent}>
                            <div className={styles.content}>
                                <span>Tipo</span>
                                <span>{espacio.tipo}</span>
                            </div>
                            <div className={styles.content}>
                                <span>Capacidad</span>
                                <span>{espacio.capacidad}</span>
                            </div>
                            <div className={styles.content}>
                                <span>Ubicación</span>
                                <span>{espacio.ubicacion}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.cards}>
                        <h3 className={styles.subtitles}>Disponibilidad de hoy</h3>
                        <span>Capacidad: {espacio.capacidad}</span>
                        <span>Tipo: {espacio.tipo}</span>
                    </div>
                    <div className={styles.cards}>
                        <h3 className={styles.subtitles}>Proximas reservas</h3>
                        <div className={styles.cardsContent}>
                            <ReservationTable items={reservasProximas} />
                        </div>
                    </div>
                </div>
                <div className={styles.cardsRight}>
                    <div className={styles.cards}>
                        <h3 className={styles.subtitles}>Equipamiento asignado</h3>
                        <div className={styles.content}>
                            <span>Tipo</span>
                            <span>{espacio.tipo}</span>
                        </div>
                    </div>
                    <div className={styles.cards}>
                        <h3 className={styles.subtitles}>Mantenimiento</h3>
                        <div className={styles.content}>
                            <span>Tipo</span>
                            <span>{espacio.tipo}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
