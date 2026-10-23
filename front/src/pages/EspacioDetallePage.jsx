// EspacioDetallePage.jsx
import { useEffect, useState,useMemo } from "react";
import { useParams } from "react-router-dom";
import styles from './detalleEspacio.module.css';
import ReservationTable from '../components/reservationTable';
import { listaReservas } from '../services/reservas';

export default function EspacioDetallePage() {
  const { id } = useParams();
  const api = useApi();
  const [espacio, setEspacio] = useState(null);
  const fechaDeHoy = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  console.log(listaReservas)
  
  

  const reservasProximas = listaReservas.filter((reserva) => reserva.fecha >= fechaDeHoy);
  

  if (!espacio) return <p>Cargando detalle...</p>;

  // return (
  //   <div className="container mt-4">
  //     <h3>Detalle del Espacio</h3>
  //     <div className="card">
  //       <div className="card-body">
  //         <h5 className="card-title">{espacio.nombre}</h5>
  //         <p className="card-text"><strong>Tipo:</strong> {espacio.tipo}</p>
  //         <p className="card-text"><strong>Estado:</strong> {espacio.estado}</p>
  //         <p className="card-text"><strong>Descripción:</strong> {espacio.descripcion}</p>
  //       </div>
  //     </div>
  //   </div>
  // );
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
                        <span>Implementar modelo de ocupación del día</span>
                        {/* <span>Tipo: {espacio.tipo}</span> */}
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
                            <span>Modelos para RCP</span>
                            <span>Simulador obstetrico</span>
                        </div>
                    </div>
                    <div className={styles.cards}>
                        <h3 className={styles.subtitles}>Mantenimiento</h3>
                        <div className={styles.content}>
                            <span>Realizado 12/10/2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
