import React, { useState } from "react";
import useApi from "./useApi"; // tu hook que devuelve axios con token

export default function FiltroEspacios() {
  const api = useApi();
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [search, setSearch] = useState("");
  const [dataFilter, setDataFilter] = useState([]);

  const handleFilter = async (e) => {
    e.preventDefault();

    const filters = {};
    if (estado) filters.estado = estado;
    if (tipo) filters.tipo = tipo;
    if (search) filters.search = search;

    try {
      console.log("Consultando endpoint con filtros...");
      const res = await api.get("/espacios", { params: filters });
      const result = res.data.data || res.data;
      setDataFilter(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Filtrar Espacios</h3>
      <form onSubmit={handleFilter} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <input
            type="text"
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="ej: operativo"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <input
            type="text"
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="ej: Aula, Simulación"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Buscar</label>
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ej: Sala"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Filtrar
        </button>
      </form>

      <h4>Resultados</h4>
      <ul className="list-group">
        {dataFilter.map((espacio) => (
          <li key={espacio.id} className="list-group-item">
            <strong>{espacio.nombre}</strong> — {espacio.tipo} —{" "}
            {espacio.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
