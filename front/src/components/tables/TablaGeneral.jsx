import { Table } from "react-bootstrap";
import SelectedBadge from "../badges/SelectedBadge";
import { Spinner } from "react-bootstrap";

function TablaGeneral({ datos = [], showSpinner = false }) {
  // Evita errores si la API todavía no devolvió datos
  if (showSpinner) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!datos.length) {
    return <p className="text-muted text-center">No hay registros.</p>;
  }

  // Obtiene las propiedades del primer objeto
  const columnas = Object.keys(datos[0]);

  return (
    <Table responsive hover className="table shadow-sm">
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
                {columna === "estado" || columna === "activo" ? (
                  <SelectedBadge label={dato[columna]} />
                ) : typeof dato[columna] === "object" &&
                  dato[columna] !== null ? (
                  JSON.stringify(dato[columna])
                ) : (
                  String(dato[columna] ?? "-")
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaGeneral;
