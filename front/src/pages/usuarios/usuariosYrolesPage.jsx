import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { getUsuarios, postUsuarios } from "../../utils/apiRoutes";
import TablaGeneral from "../../components/tables/TablaGeneral";
import PostModal from "../../components/modals/PostModal";

export default function UsuariosYRolesPage() {
  const [data, setData] = useState();

  const { getTokken } = useContext(AuthContext);

  const [showSpinner, setShowSpinner] = useState(true);

  const getUsuariosData = async () => {
    const res = await getUsuarios(getTokken());
    console.log(res.data);
    setData(res.data);
    console.log("data cargada ", data);
    setShowSpinner(false)
  };
  useEffect(() => {
    getUsuariosData();
  }, []);

  const [show, setShow] = useState(false)
  const handleShow = () =>{
    setShow(true)
  }
  const onHide = ()=>{
    setShow(false)
  }

  const onSubmit =async (formData) =>{
    console.log(formData)
    const res = await postUsuarios(getTokken(), formData)
    console.log("post usuarios satisfactorio: ", res)
    setShow(false)
  }


  // ejemplo de columnas
  const columnas = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    required: true
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true
  },
  {
    name: "rol_id",
    label: "Rol Id",
    type: "select",
    options: [
      { value: "1", label: "Administrador" },
      { value: "2", label: "Coordinador" }
    ]
  },
  {
    name: "password",
    label: "Password",
    type: "password"
  }
];

// para usar datos seleccionados objeto name con su valor



  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h1 className="h1">Usuarios y roles page</h1>
        <button
          className="btn btn-primary"
          onClick={handleShow}
        >
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
      titulo=""
      columnas={columnas}
      datosIniciales={null}
      />
    </>
  );
}
