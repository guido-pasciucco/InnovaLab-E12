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
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-3 w-100" style={{ maxWidth: '75%' }}>

                    <div className="w-100 align-items-center" style={{ maxWidth: '450px' }}>
                        <Search
                            text="Buscar espacios o equipos"
                            terminoBusqueda={terminoBusqueda}
                            setTerminoBusqueda={setTerminoBusqueda}
                        />
                    </div>
                    <div className="w-100" style={{ maxWidth: '220px' }}>
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
                    Agregar espacio o equipo
                </button>
            </div>

            <GenericTable items={resultadosFiltrados} />
        </>
    )
}