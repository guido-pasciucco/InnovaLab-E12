import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { getUsuarios, postUsuarios } from "../../utils/apiRoutes";
import TablaGeneral from "../../components/tables/TablaGeneral";
import PostModal from "../../components/modals/PostModal";
import GenericAlertModal from "../../components/modals/GenericAlertModal";

export default function UsuariosYRolesPage() {
  const [data, setData] = useState();
  const [modalData, setModalData] = useState({});

  const { getTokken } = useContext(AuthContext);

  const [showSpinner, setShowSpinner] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const getUsuariosData = async () => {
    const res = await getUsuarios(getTokken());
    console.log(res.data);
    setData(res.data);
    console.log("data cargada ", data);
    setShowSpinner(false);
  };
  
  useEffect(() => {
    getUsuariosData();
  }, []);

  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(true);
  };
  const onHide = () => {
    setShow(false);
  };

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const res = await postUsuarios(getTokken(), formData);
      console.log("post usuarios satisfactorio: ", res);
      setModalData({
        title: "Operacion exitosa",
        tipo: "success",
        mensaje: "El usuario se cargo correctamente",
      });
    } catch (err) {
      console.log("Err: ", err);
      setModalData({
        title: "Error al agregar usuario",
        tipo: "error",
        mensaje: err.message || "Error inesperado",
      });
    } finally {
      setShow(false);
      setShowModal(true);
      setShowSpinner(false);
    }
  };

  // ejemplo de columnas
  const columnas = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "rol_id",
      label: "Rol Id",
      type: "select",
      options: [
        { value: "1", label: "Administrador" },
        { value: "2", label: "Coordinador" },
      ],
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
    },
  ];

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
      <TablaGeneral datos={data} showSpinner={showSpinner} />
      {/* modal al tocar boton */}
      <PostModal
        show={show}
        onHide={onHide}
        onSubmit={onSubmit}
        titulo="Agregar Usuario"
        columnas={columnas}
        datosIniciales={null}
        showSpinner={showSpinner}
        setShowSpinner={setShowSpinner}
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
    </>
  );
}
