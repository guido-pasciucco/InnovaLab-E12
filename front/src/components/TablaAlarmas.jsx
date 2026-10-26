import { Table } from "react-bootstrap";

function TablaAlarmas({ alarmas = [] }) {
  // Evita errores si la API todavía no devolvió datos
  if (!alarmas.length) {
    return <p>No hay alarmas para mostrar.</p>;
  }

  // Obtiene las propiedades del primer objeto
  const columnas = Object.keys(alarmas[0]);

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
        {alarmas.map((alarma, index) => (
          <tr key={alarma.id ?? index}>
            {columnas.map((columna) => (
              <td key={columna}>
                {String(alarma[columna] ?? "-")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaAlarmas;