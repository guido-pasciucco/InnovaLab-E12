import GenericTable from "../components/table.jsx";
import Search from "../components/search.jsx";
import GenericSelect from "../components/select.jsx";
// import { listaItems } from "../services/items.js";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Modal, Button, Form } from "react-bootstrap";
import { getEspaciosApi } from "../utils/apiRoutes.js";
import {Spinner} from "react-bootstrap";

export default function ListadoEspaciosPage() {
  const [showSpinner, setShowSpinner] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const [datosAPI, setDatosAPI] = useState([]); // Estado para almacenar los datos obtenidos de la API
  const [cargando, setCargando] = useState(true);

  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  const resultadosFiltrados = datosAPI.filter((item) =>
    item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()),
  );

  const getData = async () => {
    const res = await getEspaciosApi();
    console.log(res.data.data);
    setDatosAPI(res.data.data);
    setShowSpinner(false)
  };

  useEffect(() => {
    getData();
  }, []);

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "Taller de RCP y Reanimación Avanzada",
    descripcion: "Práctica intensiva con simuladores de alta fidelidad",
    tipo: "Taller",
    cantidad_alumnos: 25,
    estado: "planificada",
    docente_id: 1,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // acá podrías hacer un fetch/axios POST a tu
    await fetch(CREATE_ESPACIO_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token_type} ${access_token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        console.log("Equipamiento creado: ", data);
      })
      .catch((error) => {
        console.error("Error al crear espacio: ", error);
      });

    handleClose();
  };

  return (
    <>
      <div>
        <h1 className="text-start">Espacios y equipamiento</h1>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-5  flex-wrap">
        <div
          className="d-flex align-items-center gap-3 w-100"
          style={{ maxWidth: "75%" }}
        >
          <div style={{ minWidth: "250px", width: "100%" }}>
            <Search
              text="Buscar espacios o equipos"
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
          className="btn btn-primary text-nowrap"
          data-bs-toggle="modal"
          data-bs-target="#miModal"
          onClick={handleShow}
        >
          Agregar espacio
        </button>
      </div>
      {showSpinner ? (
        <Spinner />
      ) : (
        <GenericTable items={resultadosFiltrados} />
      )}

      {/* modal del post */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Formulario</Modal.Title>
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
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>tipo</Form.Label>
              <Form.Control
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad de alumnos</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={formData.cantidad_alumnos}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEstado">
              <Form.Label>estado</Form.Label>
              <Form.Select>
                <option value="">Seleccione...</option>
                <option value="efectivo">Planificada</option>
                <option value="tarjeta">en_curso</option>
                <option value="transferencia">finalizada</option>
                <option value="transferencia">Cancelada</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formIdDocente">
              <Form.Label>Docente Id</Form.Label>
              <Form.Control
                type="number"
                name="id-docente"
                value={formData.docente_id}
                onChange={handleChange}
              />
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
