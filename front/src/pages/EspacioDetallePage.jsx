// EspacioDetallePage.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./detalleEspacio.module.css";
import ReservationTable from "../components/reservationTable";
import { getEspaciosApiId } from "../utils/apiRoutes";
import { AuthContext } from "../context/AuthContext";

import { Row, Col, Table } from "react-bootstrap";
import SelectedBadge from "../components/badge";

export default function EspacioDetallePage() {
  const { id } = useParams();
  //   const api = useApi();
  const [espacio, setEspacio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  const fechaDeHoy = new Date().toISOString().split("T")[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  const { getTokken } = useContext(AuthContext);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getEspaciosApiId(getTokken(), id);
        const data = res.data.data;
        console.log(data);
        setEspacio(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) {
    return <p>Cargando espacio desde la API...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!espacio) {
    return <p>El producto no existe.</p>;
  }

  return (
    <div className="container mt-4">
      {/* historial */}
      <Row>
        <Col>
          <Table></Table>
        </Col>
      </Row>

      {/* equipamientos habituales */}

      <div className="card border-1 shadow-sm h-100">
        <h3>Detalle del Espacio</h3>

        <div className="card-body">
          <h5 className="card-title">{espacio.nombre}</h5>
          <p className="card-text">
            <strong>Tipo:</strong> {espacio.tipo}
          </p>
          <div className="card-text">
            <strong className="mx-1">Estado:</strong>
            <SelectedBadge label={espacio.estado} />
          </div>
          <p className="card-text">
            <strong>Capacidad:</strong> {espacio.capacidad}
          </p>
          <p className="card-text">
            <strong>ubicacion:</strong> {espacio.ubicacion}
          </p>
        </div>
      </div>

      <Row>
        <Col>
          <h4 className="mt-4">Equipamientos Habituales</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Tipo de Movilidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {espacio?.equipamientos_habituales &&
              espacio.equipamientos_habituales.length > 0 ? (
                espacio.equipamientos_habituales.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.nombre || "N/A"}</td>
                    <td>{item.categoria || "N/A"}</td>
                    <td>{item.cantidad ?? 0}</td>
                    <td>{item.tipo_movilidad || "N/A"}</td>
                    <td>{<SelectedBadge label={item.estado} /> || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-3">
                    No hay equipamientos habituales registrados en el historial.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
  // return (
  //   <>
  //     <div className={styles.topContainer}>
  //       <div className="d-flex justify-content-start gap-3 align-items-center">
  //         <span className={styles.name}>{espacio.nombre}</span>
  //         <span className="badge bg-success">●{espacio.estado}</span>
  //       </div>
  //       <div className="d-flex justify-content-start gap-3 align-items-center">

  //         <button className="btn btn-primary">Reservar</button>
  //       </div>
  //     </div>
  //     <div className={styles.containerCards}>
  //       <div className={styles.cardsLeft}>
  //         <div className={styles.cards}>
  //           <h3 className={styles.subtitles}>Datos generales</h3>
  //           <div className={styles.cardsContent}>
  //             <div className={styles.content}>
  //               <span>Tipo</span>
  //               <span>{espacio.tipo}</span>
  //             </div>
  //             <div className={styles.content}>
  //               <span>Capacidad</span>
  //               <span>{espacio.capacidad}</span>
  //             </div>
  //             <div className={styles.content}>
  //               <span>Ubicación</span>
  //               <span>{espacio.ubicacion}</span>
  //             </div>
  //           </div>
  //         </div>
  //         <div className={styles.cards}>
  //           <h3 className={styles.subtitles}>Disponibilidad de hoy</h3>
  //           <span>Implementar modelo de ocupación del día</span>
  //           {/* <span>Tipo: {espacio.tipo}</span> */}
  //         </div>
  //         <div className={styles.cards}>
  //           <h3 className={styles.subtitles}>Proximas reservas</h3>
  //           <div className={styles.cardsContent}>
  //             {/* <ReservationTable items={reservasProximas} /> */}
  //           </div>
  //         </div>
  //       </div>
  //       <div className={styles.cardsRight}>
  //         <div className={styles.cards}>
  //           <h3 className={styles.subtitles}>Equipamiento asignado</h3>
  //           <div className={styles.content}>
  //             <span>Modelos para RCP</span>
  //             <span>Simulador obstetrico</span>
  //           </div>
  //         </div>
  //         <div className={styles.cards}>
  //           <h3 className={styles.subtitles}>Mantenimiento</h3>
  //           <div className={styles.content}>
  //             <span>Realizado 12/10/2026</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
