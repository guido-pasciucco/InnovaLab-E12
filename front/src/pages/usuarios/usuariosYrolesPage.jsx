import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { getUsuarios } from "../../utils/apiRoutes";
import TablaGeneral from "../../components/tables/TablaGeneral";

export default function UsuariosYRolesPage() {
  const [data, setData] = useState();

  const { getTokken } = useContext(AuthContext);

  const getUsuariosData = async () =>{
    const res = await getUsuarios(getTokken())
    console.log(res.data)
    setData(res.data)
    console.log("data cargada ", data)
  }
  useEffect(() => {
    getUsuariosData()
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h1 className="h1">Usuarios y roles page</h1>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#miModal"
        >
          Agregar usuario
        </button>
      </div>
      {/* ingresamos tabla */}
      <TablaGeneral datos={data}/>
      {/* modal al tocar boton */}
      <div
        className="modal fade"
        id="miModal"
        tabIndex="-1"
        aria-labelledby="miModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Encabezado */}
            <div className="modal-header">
              <h5 className="modal-title" id="miModalLabel">
                Título del Modal
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            {/* Cuerpo */}
            <div className="modal-body">Contenido del modal...</div>

            {/* Pie */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="button" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
