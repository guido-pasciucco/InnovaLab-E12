import { useEffect, useState, useContext } from 'react'

import { AuthContext } from '../../context/AuthContext'
import { getUsuarios, postUsuarios, editUsuario } from '../../services/apiRoutes'
import TablaGeneral from '../../components/tables/TablaGeneral'
import PostPutModal from '../../components/modals/PostPutModal'
import GenericAlertModal from '../../components/modals/GenericAlertModal'
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal'

export default function UsuariosYRolesPage() {
  const [data, setData] = useState()
  const [modalData, setModalData] = useState({})

  const { getTokken } = useContext(AuthContext)

  const [showSpinner, setShowSpinner] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [dataEliminar, setDataEliminar] = useState(null)

  const [refresh, setRefresh] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState(null)

  const getUsuariosData = async () => {
    const res = await getUsuarios(getTokken())
    console.log(res.data)
    setData(res.data)
    console.log('data cargada ', data)
    setShowSpinner(false)
  }

  useEffect(() => {
    getUsuariosData()
  }, [refresh])

  const [show, setShow] = useState(false)
  const handleShow = () => {
    setShow(true)
  }
  const onHide = () => {
    setShow(false)
  }

  const onSubmit = async (formData) => {
    console.log(formData)
    try {
      const res = await postUsuarios(getTokken(), formData)
      console.log('post usuarios satisfactorio: ', res)
      setModalData({
        title: 'Operacion exitosa',
        tipo: 'success',
        mensaje: 'El usuario se cargo correctamente',
      })
      setRefresh((prev) => !prev)
    } catch (err) {
      console.log('Err: ', err)
      setModalData({
        title: 'Error al agregar usuario',
        tipo: 'error',
        mensaje: err.message || 'Error inesperado',
      })
    } finally {
      setShow(false)
      setShowModal(true)
      setShowSpinner(false)
    }
  }

  const onSubmitEdit = async (formData) => {
    console.log(formData)
    try {
      await editUsuario(getTokken(), formData.id, formData)
      setModalData({
        title: 'Operacion exitosa',
        tipo: 'success',
        mensaje: 'El usuario se edito correctamente',
      })
      setRefresh((prev) => !prev)
    } catch (err) {
      setModalData({
        title: 'Error al agregar usuario',
        tipo: 'error',
        mensaje: err.message || 'Error inesperado',
      })
    } finally {
      setShow(false)
      setShowModal(true)
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
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'rol_id',
      label: 'Rol Id',
      type: 'select',
      options: [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Coordinador' },
      ],
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
    },
  ]

  // para usar datos seleccionados objeto name con su valor

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h1 className="h1">Usuarios y roles page</h1>
        <button className="btn btn-primary" onClick={handleShow}>
          Agregar usuario
        </button>
      </div>
      {/* ingresamos tabla */}
      <TablaGeneral
        datos={data}
        showSpinner={showSpinner}
        onEditar={(data) => {
          setUsuarioEditar(data)
          setShowEditModal(true)
        }}
        onEliminar={(dato) => {
          setShowDeleteConfirmModal(true)
          setDataEliminar(dato)
          console.log(dato.id)
        }}
      />{' '}
      {/* modal al tocar boton */}
      <PostPutModal
        show={show}
        onHide={onHide}
        onSubmit={onSubmit}
        titulo="Agregar Usuario"
        columnas={columnas}
        datosIniciales={null}
      />
      {/* modal edicion */}
      <PostPutModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        titulo="Modificar usuario"
        columnas={columnas}
        datosIniciales={usuarioEditar}
        onSubmit={onSubmitEdit}
      />
      {showModal && (
        <GenericAlertModal
          show={showModal}
          onHide={() => setShowModal(false)}
          tipo={modalData.tipo}
          titulo={modalData.titulo}
          mensaje={modalData.mensaje}
        />
      )}
      <DeleteConfirmModal
        show={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
        id={dataEliminar?.id}
        onSuccess={() => setRefresh((prev) => !prev)}
      />
    </>
  )
}
