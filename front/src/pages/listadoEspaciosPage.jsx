import GenericTable from "../components/table";
import Search from "../components/search";
import GenericSelect from "../components/select";
import { listaEspacios} from "../services/espacios";
import { useState } from "react";
import { ESPACIOS_ROUTE, handleGet } from "../utils/apiRoutes.js";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Modal, Button, Form } from "react-bootstrap";
import { CREATE_ESPACIO_ROUTE } from "../utils/apiRoutes.js";
import useApi from "../components/useApi.jsx";
import FiltroEspacios from "../components/filtrosEspacios.jsx";
import { Link } from "react-router-dom";

export default function ListadoEspaciosPage() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [datosAPI, setDatosAPI] = useState([]); // Estado para almacenar los datos obtenidos de la API
  const [cargando, setCargando] = useState(true);


  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  // Llamar a handleGet cuando se monte el componente
  useEffect(() => {
    // handleGet();
    // cargamos los datos de la API al montar el componente
    // ...

    handleGet(
      ESPACIOS_ROUTE,
      token_type,
      access_token,
      setDatosAPI,
      setCargando,
    );
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

  // logica para filtrar datos

  const handleFilter = async () => {
    const [dataFilter, setDataFilter] = useState();
    const api = useApi();
    try {
      console.log("consultando enpoint con filtros...");
      const res = await api.get("/espacios", { params: { tipo: "Aula" } });
      setDataFilter(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-start">Espacios</h1>
      </div>

      <>
        <Button variant="primary" onClick={handleShow}>
          Cargar Espacio
        </Button>

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
                <Form.Label>descripcion</Form.Label>
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

      {/* cargando data */}

      {cargando ? (
        <h2>Cargando</h2>
      ) : (
        <div className="list-group mt-3">
          {/* mostramos la data en una tabla donde cada key es la columna */}
          <h1 className="h1">Datos</h1>
          {Array.isArray(datosAPI) ? (
            (console.log("cargando: ", datosAPI),
            datosAPI.map((item) => (
              <div className="list-group-item" key={item.id}>
                <Link to={`${item.id}`}>{item.nombre}</Link>
              </div>
            )))
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </div>
      )}

      {/* filtramos espacios */}
      <FiltroEspacios></FiltroEspacios>
    </>
  );
}
