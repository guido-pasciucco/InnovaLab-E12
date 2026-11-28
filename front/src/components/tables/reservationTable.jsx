import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './reservationTable.module.css';

function ReservationTable({ items }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th className={styles.fieldsTable}>Fecha</th>
          <th className={styles.fieldsTable}>Actividad</th>
          <th className={styles.fieldsTable}>Horario</th>
          <th className={styles.fieldsTable}>Estado</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {/* <td>{item.id}</td> */}
            <td>{item.fecha}</td>
            <td>{item.actividad}</td>
            <td>{item.horaInicio} - {item.horaFin}</td>
            <td>{item.estado}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ReservationTable;