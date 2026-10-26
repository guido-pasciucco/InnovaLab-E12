import Search from "../components/search.jsx";
import GenericSelect from "../components/select.jsx";
import { Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getEquipamientoApi } from "../utils/apiRoutes";

export default function ListadoEquipamientoPage() {
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [show, setShow] = useState(false);
  // const [datosAPI, setDatosAPI] = useState([
  //   {
  //     nombre: "Simulador de Paciente Adulto HAL S3201",
  //     categoria: "Simulador de Alta Fidelidad",
  //     tipo_movilidad: "fijo",
  //     cantidad: 2,
  //     espacio_habitual_id: 1,
  //     estado: "disponible",
  //   },
  // ]);

  const [datosAPI, setDatosAPI] = useState([]);
  const { getTokken } = useContext(AuthContext);

  const resultadosFiltrados = datosAPI.filter((item) =>
    item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()),
  );


  const getData = async () => {
    const res = await getEquipamientoApi(getTokken());
    setDatosAPI(res.data.data);
  }
  getData();

  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  useEffect(() => {
    getData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const fueraDeServicio = datosAPI.filter(data => data.estado === "fuera_de_servicio").length;

  // useEffect(() => {
  //   // handleGet(EQUIPAMIENTO_ROUTE, token_type, access_token, setDatosAPI, setCargando)
  // }, [])

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-start mb-2">
        <h1 className="text-start h1">Equipamiento</h1>
        <span>{datosAPI.length} Equipos - 1 Fuera de servicio</span>
      </div>
      <div className="bg-light p-4 rounded-3 shadow-sm">

        <div className="d-flex justify-content-between align-items-center mb-5  flex-wrap">
          <div
            className="d-flex align-items-center gap-3 w-100"
            style={{ maxWidth: "75%" }}
          >
            <div style={{ minWidth: "250px", width: "100%" }}>
              <Search
                text="Buscar equipos"
                terminoBusqueda={terminoBusqueda}
                setTerminoBusqueda={setTerminoBusqueda}
              />
            </div>
            <div style={{ minWidth: "100px", width: "100%" }}>
              <GenericSelect
                text="Estado"
                opciones={[
                  "Disponible",
                  "En uso",
                  "Confirmado",
                  "Borrador",
                  "Fuera de servicio",
                  "En mantenimiento",
                ]}
              />
            </div>
          </div>
          <button
            className="btn btn-warning text-nowrap"

            onClick={handleShow}
          >
            Agregar equipo
          </button>
        </div>
        <Table hover>
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
        <p className="text-start mt-4">
          Fijo: Permanece en su espacio.   
          Trasladable: Se reserva con la actividad y puede usarse en otros espacios
        </p>
      </div>
    </>
  );
}
