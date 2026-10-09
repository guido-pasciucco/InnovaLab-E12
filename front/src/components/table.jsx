import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function GenericTable({ items }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
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
            <td>{item.id}</td>
            <td>{item.nombre}</td>
            <td>{item.tipo}</td>
            <td>{item.capacidad}</td>
            <td>{item.estado}</td>
            <td>
              <Link to={`/dashboard/${item.categoria}/${item.id}`}>
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