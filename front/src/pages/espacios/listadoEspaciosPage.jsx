import GenericTable from '../../components/tables/TablaGeneral2.jsx'
import Search from '../../components/others/search.jsx'
import GenericSelect from '../../components/others/select.jsx'
// import { listaItems } from "../services/items.js";
import { useState } from 'react'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { Modal, Button, Form } from 'react-bootstrap'
import {
  getEspaciosApi,
  postEspaciosApi,
  deleteEspacioApi,
  putEspacioApi,
} from '../../services/apiRoutes.js'
import { Spinner } from 'react-bootstrap'
import { Plus, PlusCircle } from 'react-bootstrap-icons'
import { BsSave2 } from 'react-icons/bs'
import PageHelmet from '../../helmet/PageHelmet.jsx'
import MyModal from '../../components/modals/MyModal.jsx'
import { toast } from 'react-toastify'
import AlertInfo from '../../components/alerts/AlertInfo.jsx'
import PostPutModal from '../../components/modals/PostPutModal.jsx'

export default function ListadoEspaciosPage() {
  const [showSpinner, setShowSpinner] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [terminoBusquedaEstado, setTerminoBusquedaEstado] = useState('')
  const [actualizar, setActualizar] = useState(false)
  const [showModalPut, setShowModalPut] = useState(false)

  const [datosAPI, setDatosAPI] = useState([]) // Estado para almacenar los datos obtenidos de la API
  const [cargando, setCargando] = useState(true)

  const { getTokken } = useContext(AuthContext)

  const resultadosFiltrados = datosAPI.filter((item) => {
    const coincideNombre = item.nombre
      .toLowerCase()
      .includes(terminoBusqueda.toLowerCase())

    console.log(item)
    console.log(terminoBusquedaEstado)
    const coincideEstado = item.estado
      .toLowerCase()
      .includes(terminoBusquedaEstado.toLowerCase())

    console.log(coincideEstado)
    return coincideEstado && coincideNombre
  })

  const extraerLista = (res) => {
    const payload = res?.data?.data ?? res?.data ?? res
    return Array.isArray(payload) ? payload : []
  }

  const getData = async () => {
    try {
      setShowSpinner(true)
      const res = await getEspaciosApi(getTokken())
      const espacios = extraerLista(res)
      console.log(espacios)
      setDatosAPI(espacios)
    } catch (err) {
      console.log('Error al cargar datos:', err)
      setDatosAPI([])
    } finally {
      setShowSpinner(false)
    }
  }

  useEffect(() => {
    getData()
  }, [actualizar])

  // post eequipamiento
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    capacidad: '',
    estado: '',
    ubicacion: '',
  })

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Datos enviados:', formData)
    // acá podrías hacer un fetch/axios POST a tu
    try {
      await postEspaciosApi(formData, getTokken())
      console.log('Datos cargados correctamente')
      toast.success('Datos guardados con exito')
      setShowSpinner(true)
      getData()
    } catch (err) {
      console.log('Error:')
      console.log(err.response?.data)
      toast.error('Error al guardar los datos.')
    }

    handleClose()
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await putEspacioApi(formData.id, getTokken(), formData)
      console.log('Elemento modificado correctamente')
      toast.success('Elemento modicado correctamente')
      setActualizar((prev) => !prev)
    } catch (err) {
      console.log(err)
      toast.error('error al modificar el elemento')
    } finally {
      setShowModalPut(false)
      setShowSpinner(false)
    }
  }

  const columnas = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'tipo',
      label: 'tipo',
      type: 'select',
      options: [
        { value: 'aula', label: 'Aula' },
        { value: 'laboratorio', label: 'Laboratorio' },
      ],
      required: true,
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'disponible', label: 'Disponible' },
        { value: 'mantenimiento', label: 'Mantenimiento' },
      ],
      required: true,
    },
    {
      name: 'capacidad',
      label: 'Capacidad',
      type: 'number',
      required: true,
    },
    {
      name: 'ubicacion',
      label: 'Ubicacion',
      type: 'text',
      required: true,
    },
  ]

  const handleEditar = (data) => {
    console.log(data)
    setFormData(data)
    setShowModalPut(true)
  }

  return (
    <>
      <PageHelmet
        title="Espacios"
        description="Pagina con el listado de espacios definidos"
      />

      <AlertInfo
        title="Administración de Espacios"
        description="En esta sección podés consultar y administrar los espacios registrados en la plataforma, visualizar sus características y disponibilidad, agregar nuevos espacios, modificar su información y eliminar registros."
      />

      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-column justify-content-center">
          <h1 className="text-start h1">Espacios</h1>
        </div>
        <div className="d-flex flex-row gap-2">
          <button className="btn btn-primary text-nowrap" onClick={handleShow}>
            <PlusCircle className="me-1 mb-1" />
            Agregar espacio
          </button>
        </div>
      </div>
      <div className="bg-light p-4 rounded-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-5  flex-wrap">
          <div
            className="d-flex align-items-center gap-3 w-100"
            style={{ maxWidth: '100%' }}
          >
            <div style={{ minWidth: '250px', width: '100%' }}>
              <Search
                text="Buscar espacios"
                terminoBusqueda={terminoBusqueda}
                setTerminoBusqueda={setTerminoBusqueda}
              />
            </div>
            <div style={{ minWidth: '100px', width: '20%' }}>
              <GenericSelect
                text="Estado"
                opciones={[
                  'Disponible',
                  'En uso',
                  'Confirmado',
                  'Borrador',
                  'Fuera de servicio',
                  'mantenimiento',
                ]}
                onChange={(e) => setTerminoBusquedaEstado(e.target.value)}
              />
            </div>
          </div>
        </div>
        {showSpinner ? (
          <Spinner />
        ) : resultadosFiltrados.length === 0 ? (
          /* Opcional: Si ya cargó pero la búsqueda no arrojó resultados */
          <div>
            <p colSpan="8" className="text-center text-muted py-4">
              No se encontraron equipos que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          <GenericTable
            items={resultadosFiltrados}
            refresh={setActualizar}
            handleEditar={handleEditar}
          />
        )}
      </div>

      {/* modal del post */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Espacio</Modal.Title>
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
                placeholder="Ej. Laboratorio De Simulacion A, Taller de practica 01, Laboratorio de AutoElevadores "
                required
              />
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>tipo</Form.Label>
              <Form.Control
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                placeholder="Ej: Laboratorio, Aula, Taller"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>ubicacion</Form.Label>
              <Form.Control
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
                placeholder="Ej: Piso 01 - ala sur, Planta baja, "
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                placeholder="Cantidad maxima de asistentes"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEstado">
              <Form.Label>estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="disponible">Disponible</option>
                <option value="mantenimiento">Mantenimiento</option>
              </Form.Select>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formIdDocente">
              <Form.Label>Docente Id</Form.Label>
              <Form.Control
                type="number"
                name="id-docente"
                value={formData.docente_id}
                onChange={handleChange}
              />
            </Form.Group> */}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="submit"
                onClick={() => setShowSpinner(true)}
              >
                <BsSave2 className="me-1" />
                Guardar
                {showSpinner && <Spinner size={'sm'} />}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* model del put */}

      <Modal show={showModalPut} onHide={() => setShowModalPut(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Espacio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Laboratorio De Simulacion A, Taller de practica 01, Laboratorio de AutoElevadores "
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
                placeholder="Ej: Laboratorio, Aula, Taller"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>ubicacion</Form.Label>
              <Form.Control
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
                placeholder="Ej: Piso 01 - ala sur, Planta baja, "
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                placeholder="Cantidad maxima de asistentes"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEstado">
              <Form.Label>estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="disponible">Disponible</option>
                <option value="mantenimiento">Mantenimiento</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="submit"
                onClick={() => setShowSpinner(true)}
              >
                <BsSave2 className="me-1" />
                Guardar
                {showSpinner && <Spinner size={'sm'} />}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
