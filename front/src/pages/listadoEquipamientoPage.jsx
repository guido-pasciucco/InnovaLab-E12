import { Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { EQUIPAMIENTO_ROUTE, handleGet } from "../utils/apiRoutes";

export default function ListadoEquipamientoPage() {
  const [cargando, setCargando] = useState(true)
  const [datosAPI, setDatosAPI] = useState([
    {
      nombre: "Simulador de Paciente Adulto HAL S3201",
      categoria: "Simulador de Alta Fidelidad",
      tipo_movilidad: "fijo",
      cantidad: 2,
      espacio_habitual_id: 1,
      estado: "disponible",
    },
  ]);

  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  useEffect(()=>{
    handleGet(EQUIPAMIENTO_ROUTE, token_type, access_token, setDatosAPI, setCargando)
  }, [])

  return (
    <>
      <h1>Equipamiento page</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Movilidad</th>
            <th>Cantidad</th>
            <th>Espacio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {datosAPI.map((sim, i) => (
            <tr key={i}>
              <td>{sim.nombre}</td>
              <td>{sim.categoria}</td>
              <td>{sim.tipo_movilidad}</td>
              <td>{sim.cantidad}</td>
              <td>{sim.espacio_habitual_id}</td>
              <td
                style={{ color: sim.estado === "disponible" ? "green" : "red" }}
              >
                {sim.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
