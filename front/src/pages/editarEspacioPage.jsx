import { useLocation, useParams } from "react-router-dom";
import EditarEspacioForm from "../components/editarEspacioForm";
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
import { getEspaciosApi } from "../utils/apiRoutes";
import SelectorEstado from "../components/selectorDeEstados";

export default function EditarEspacioPage() {
    const { id } = useParams();
    const location = useLocation();

    const espacioDelState = location.state?.location;
    console.log(espacioDelState)
    const [espacio, setEspacio] = useState(espacioDelState || null);
    const [loading, setLoading] = useState(!espacioDelState);

    useEffect(() => {

        if (espacioDelState) return;

        const getData = async () => {

            try {
                const res = await getEspaciosApi();
                const espacios = res.data.data;
                const espacioId = espacios.find((espacio) => String(espacio.id) === String(id));
                setEspacio(espacioId);

            } catch (error) {
                console.error("Error al cargar", error);
            } finally {
                setLoading(false);
            }
        };
        getData()

    }, [id, espacioDelState]);

    if (loading) return <p>Cargando datos para editar...</p>;
    
    return (
        <div>
            <div>
                <h1 className="text-start">Editar espacio * {espacio.nombre}</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 p-4">
                <EditarEspacioForm />
                <div className="d-flex flex-column gap-3" style={{ width: '22%' }}>
                    <SelectorEstado />
                    <div className="card p-3 shadow-sm">
                        <h3>Equipamiento asignado</h3>
                        <div className="card p-2 shadow-sm my-3">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column">
                                    <span>
                                        Simulador Adulto A
                                    </span>
                                    <span className="badge bg-secondary">
                                        x Fuera de servicio
                                    </span>
                                </div>
                                <div className="d-flex my-auto">
                                    <button>Quitar</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column">
                                    <span>
                                        Simulador pediátrico
                                    </span>
                                    <span className="badge bg-success">
                                        ● Disponibleo
                                    </span>
                                </div>
                                <div className="d-flex my-auto">
                                    <button>Quitar</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column">
                                    <span>
                                        Monitor de signos
                                    </span>
                                    <span className="badge bg-success">
                                        ● Disponible
                                    </span>
                                </div>
                                <div className="d-flex my-auto">
                                    <button>Quitar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}