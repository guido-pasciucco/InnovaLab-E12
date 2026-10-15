// EspacioDetallePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../components/useApi";

export default function EspacioDetallePage() {
  const { id } = useParams();
  const api = useApi();
  const [espacio, setEspacio] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await api.get(`/espacios/${id}`);
        console.log("fetch detalle: ", res.data.data)
        setEspacio(res.data.data);
      } catch (err) {
        console.error("Error al obtener detalle:", err);
      }
    };
    fetchDetalle();
  }, [id, api]);

  if (!espacio) return <p>Cargando detalle...</p>;

  return (
    <div className="container mt-4">
      <h3>Detalle del Espacio</h3>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{espacio.nombre}</h5>
          <p className="card-text"><strong>Tipo:</strong> {espacio.tipo}</p>
          <p className="card-text"><strong>Estado:</strong> {espacio.estado}</p>
          <p className="card-text"><strong>Descripción:</strong> {espacio.descripcion}</p>
        </div>
      </div>
    </div>
  );
}
