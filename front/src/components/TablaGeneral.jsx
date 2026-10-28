import { Table } from "react-bootstrap";

function TablaGeneral({ datos = [] }) {
  // Evita errores si la API todavía no devolvió datos
  if (!datos.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  // Obtiene las propiedades del primer objeto
  const columnas = Object.keys(datos[0]);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columnas.map((columna) => (
            <th key={columna}>{columna}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {datos.map((dato, index) => (
          <tr key={dato.id ?? index}>
            {columnas.map((columna) => (
              <td key={columna}>
                {String(dato[columna] ?? "-")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaGeneral;