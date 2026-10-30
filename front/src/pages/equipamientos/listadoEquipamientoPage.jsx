import Search from "../../components/others/search.jsx";
import GenericSelect from "../../components/others/select.jsx";
import { Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEquipamientoApi, getEspaciosApi, postEquipamientoApi } from "../../utils/apiRoutes.js";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import SelectedBadge from "../components/SelectedBadge.jsx";
import { Link } from "react-router-dom";


export default function ListadoEquipamientoPage() {
  const [showSpinner, setShowSpinner] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [show, setShow] = useState(false);
  const [datosAPI, setDatosAPI] = useState([]);
  const [espaciosApi, setEspaciosApi] = useState([]);
  const { getTokken } = useContext(AuthContext);

  const resultadosFiltrados = datosAPI.filter((item) =>
    item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()),
  );


  const getData = async () => {

    try {
      setShowSpinner(true);
      const res = await getEquipamientoApi(getTokken());
      const res2 = await getEspaciosApi(getTokken())
      setDatosAPI(res.data.data);
      setEspaciosApi(res2.data.data)
    } catch (err) {
      console.log("Error al cargar datos:", err);
    } finally {
      setShowSpinner(false);
    }
  }

  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  useEffect(() => {
    getData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const fueraDeServicio = datosAPI.filter(data => data.estado === "fuera_de_servicio").length;

  const estadoInicial = {
    nombre: "",
    categoria: "",
    tipo_movilidad: "",
    cantidad: "",
    espacio_habitual_id: "",
    espacio_actual_id: "",
    estado: "",
  }
  const [formData, setFormData] = useState(estadoInicial);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);

    // acá podrías hacer un fetch/axios POST a tu
    try {
      await postEquipamientoApi(formData, getTokken());

      toast.success("Equipo guardado con exito!");
      console.log("Datos cargados correctamente");
      setShowSpinner(true);
      getData();
      setFormData(estadoInicial);
      handleClose();

    } catch (err) {
      console.log("Error detallado del servidor:", err);

      if (err.response && err.response.data) {
        console.log("Mensaje de validación:", err.response.data);
      }

      toast.error("Hubo un error al guardar. Revisa los datos.");
    }

  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-column justify-content-center">
          <h1 className="text-start h1">Equipamiento</h1>
          <p>{datosAPI.length} Equipos - {fueraDeServicio} Fuera de servicio</p>
        </div>
        <div className="d-flex flex-row gap-2">
          <button className="btn btn-primary"
            onClick={handleShow}
          >
            Agregar equipo
          </button>
        </div>
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
            <div className="d-flex flex-row gap-3" style={{ minWidth: "100px", width: "40%" }}>
              <GenericSelect
                text="Movilidad"
                opciones={[
                  "Fijo",
                  "Trasladable",
                ]}
              />
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* 1. Evaluamos si está cargando o si hay datos */}
            {showSpinner ? (
              /* Si showSpinner es true, mostramos una fila que ocupe todo el ancho con el Spinner */
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </td>
              </tr>
            ) : resultadosFiltrados.length === 0 ? (
              /* Opcional: Si ya cargó pero la búsqueda no arrojó resultados */
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No se encontraron equipos que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              /* 2. Si ya cargó y hay resultados, hacemos el .map() usando resultadosFiltrados */
              resultadosFiltrados.map((sim, i) => (
                <tr key={sim.id || i}>
                  <td>{sim.nombre}</td>
                  <td>{sim.categoria}</td>
                  <td>{sim.tipo_movilidad}</td>
                  <td>{sim.cantidad}</td>
                  <td>{sim.espacio_habitual_id}</td>
                  <td
                    style={{ color: sim.estado === "disponible" ? "green" : "red" }}
                  >
                    <SelectedBadge label={sim.estado} />
                  </td>
                  <td>
                    <div className="d-flex flex-row gap-1">
                      <Link to={`${sim.id}`}>
                        Ver -
                      </Link>
                      <Link to={`${sim.id}`}>
                        Eliminar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <p className="text-start mt-4">
          Fijo: Permanece en su espacio.
          Trasladable: Se reserva con la actividad y puede usarse en otros espacios
        </p>
      </div>
      {/* modal del post */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Completa los datos:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                name="tipo_movilidad"
                value={formData.tipo_movilidad}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={formData.cantidad ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="disponible">Disponible</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEspacioHabitual">
              <Form.Label>Ubicación habitual</Form.Label>
              <Form.Select
                name="espacio_habitual_id"
                value={formData.espacio_habitual_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un espacio...</option>
                {espaciosApi.map((espacio) => (
                  <option key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEspacioActual">
              <Form.Label>Ubicación actual</Form.Label>
              <Form.Select
                name="espacio_actual_id"
                value={formData.espacio_actual_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un espacio...</option>
                {espaciosApi.map((espacio) => (
                  <option key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
