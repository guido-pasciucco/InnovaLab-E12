import GenericTable from "../components/table";
import Search from "../components/search";
import GenericSelect from "../components/select";
import { listaItems } from "../services/items";
import { useState } from 'react';

export default function ListadoEspaciosPage() {

    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    const resultadosFiltrados = listaItems.filter((item) =>
        item.nombre
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase())
    );
    
    return (
        <>
            <div>
                <h1 className="text-start">Espacios y equipamiento</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5  flex-wrap">
                <div className="d-flex align-items-center gap-3 w-100" style={{ maxWidth: '75%' }}>
                    <div style={{ minWidth: '250px', width: '100%' }}>
                        <Search
                            text="Buscar espacios o equipos"
                            terminoBusqueda={terminoBusqueda}
                            setTerminoBusqueda={setTerminoBusqueda}
                        />
                    </div>
                    <div style={{ minWidth: '100px', width: '100%' }}>
                        <GenericSelect
                            text="Estado"
                            opciones={["Disponible", "En uso", "Confirmado", "Borrador", "Fuera de servicio", "En mantenimiento"]}
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
        </>
    )
}