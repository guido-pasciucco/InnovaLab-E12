import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const badgesDeEstado = {
  disponible: "badge bg-success",
  confirmada: "badge bg-success",
  programada: "badge bg-primary",
  borrador: "badge bg-secondary",
  mantenimiento: "badge bg-warning",
}

// borderless hover responsive

function GenericTable({ items }) {
  return (
    <Table responsive hover className='table shadow-sm'>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Capacidad</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.nombre}</td>
            <td>{item.tipo}</td>
            <td>{item.capacidad}</td>
            <td className="text-center align-middle">
              <span
                className={
                  badgesDeEstado[item.estado?.toLowerCase().trim()] ||
                  "badge bg-secondary"
                }
              >
                {item.estado}
              </span>
            </td>
            <td>
              <Link to={`${item.id}`}>
                Ver
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default GenericTable;