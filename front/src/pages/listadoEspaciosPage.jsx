import GenericTable from "../components/table";
import Search from "../components/search";
import GenericSelect from "../components/select";
import { listaItems } from "../services/items";
import { useState } from "react";
import { ESPACIOS_ROUTE } from "../utils/apiRoutes.js";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ListadoEspaciosPage() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [datosAPI, setDatosAPI] = useState([]); // Estado para almacenar los datos obtenidos de la API

  const resultadosFiltrados = listaItems.filter((item) =>
    item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()),
  );

  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  const handleGet = async () => {
    try {
      const response = await fetch(ESPACIOS_ROUTE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token_type} ${access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Datos obtenidos:", data);
        setDatosAPI(data.data);
      } else {
        console.error("Error al obtener los datos:", data);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  // Llamar a handleGet cuando se monte el componente
  useEffect(() => {
    handleGet();
    // cargamos los datos de la API al montar el componente
    // ...
  }, []);

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
        >
          Agregar espacio
        </button>
      </div>
      <GenericTable items={resultadosFiltrados} />

      {/* mostramos la data en una tabla donde cada key es la columna */}
      {Array.isArray(datosAPI) ? (
        datosAPI.map((item) => <div key={item.id}>{item.nombre}</div>)
      ) : (
        <p>No hay datos disponibles</p>
      )}
    </>
  );
}
