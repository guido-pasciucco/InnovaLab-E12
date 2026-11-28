import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEspaciosApi, getReservas, getEquipamientoApi } from "../../services/apiRoutes.js";
import { Spinner } from "react-bootstrap";
import { Form } from 'react-bootstrap';

function ReservationForm2({ onSubmitForm, onBack, formData, onCustomChange }) {
    const [showSpinner, setShowSpinner] = useState(false);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [equipamientoApi, setEquipamientoApi] = useState([]);
    const { getTokken } = useContext(AuthContext);

    const getData = async () => {

        try {
            setShowSpinner(true);
            const [espaciosRes, reservasRes, equipamientoRes] = await Promise.all([
                getEspaciosApi(getTokken()),
                getReservas(getTokken()),
                getEquipamientoApi(getTokken()),
            ]);
            setEspaciosApi(espaciosRes.data.data);
            setReservas(reservasRes.data.data);
            setEquipamientoApi(equipamientoRes.data.data);
            console.log("Datos de espacios obtenidos:", espaciosRes.data.data);
        }
        catch (error) {
            console.error("Error al obtener espacios:", error);
        } finally {
            setShowSpinner(false);
        }
    };

    const espaciosDisponibles = espaciosApi.filter((espacio) => {
        const estaOcupado = reservas.some(
            (reserva) =>
                reserva.espacioId === espacio.id &&
                reserva.fecha === dataEncurso?.fecha &&
                reserva.hora_inicio === dataEncurso?.hora_inicio
        );
        return !estaOcupado;
    });

    const espacioElegido = espaciosDisponibles.find(
        (opcion) => String(opcion.nombre) === String(formData.espacio)
    );

    const equipamientosGlobalesSinRepetir = Array.from(
        new Map(
            (equipamientoApi ?? []).map((eq) => [eq.nombre, eq])
        ).values()
    );

    const equipamientosSinRepetirPorEspacio = Array.from(
        new Map(
            (espacioElegido?.equipamientos_habituales ?? []).map((eq) => [eq.nombre, eq])
        ).values()
    );

    console.log('Equipos de la api: ', equipamientosSinRepetirPorEspacio);
    const equipamientoTrasladable = equipamientosGlobalesSinRepetir.filter((equipo) => equipo.tipo_movilidad === 'trasladable');
    console.log('Equipamiento trasladable: ', equipamientoTrasladable);

    const capacidadRequerida = formData.participantes_estimados;

    useEffect(() => {
        getData();
    }, []);

    return (
        <Form onSubmit={onSubmitForm}>
            <div className="d-flex flex-column gap-3 my-3">

                {/* Si aún no cargan los espacios, mostramos un mensaje o spinner para evitar renderizados vacíos */}
                {showSpinner ? (
                    <div className="d-flex flex-column align-items-center text-center my-3">
                        <Spinner animation="border" />
                        <p className="text-muted mt-2 mb-0">Cargando espacios disponibles...</p>
                    </div>
                ) : espaciosDisponibles.length === 0 ? (
                    <p className="text-center text-muted my-3">No hay espacios disponibles para ese horario.</p>
                ) : (
                    <>
                        <h6>Selecciona un espacio para tu actividad</h6>
                        {espaciosDisponibles.map((opcion) => (
                            <Form.Check
                                key={opcion.id}
                                className="d-flex flex-row align-items-center gap-5 w-100 card p-1 shadow-sm"
                                reverse
                                type="radio"
                                label={
                                    <div className="d-flex flex-column align-items-start">
                                        <span>{opcion.nombre}</span>
                                        <small
                                            className={`ms-2 ${opcion.capacidad < capacidadRequerida
                                                ? 'text-danger'
                                                : 'text-black'
                                                }`}
                                        >
                                            {opcion.capacidad >= capacidadRequerida
                                                ? `Capacidad: ${opcion.capacidad}`
                                                : 'Capacidad superada para este espacio'}
                                        </small>
                                    </div>
                                }
                                name="espacio"
                                id={`radio-${opcion.id}`}
                                value={opcion.nombre}
                                checked={String(formData.espacio) === String(opcion.nombre)}
                                onChange={() => onCustomChange('espacio', opcion.nombre)}
                            />
                        ))}
                    </>
                )}
            </div>
            <div className="d-flex flex-column gap-3 my-3">
                {espacioElegido && (
                    <div className="w-100 card p-1 shadow-sm">
                        <h6 className="mb-1">{espacioElegido.nombre}</h6>
                        <p className="mb-2 small text-muted">
                            <strong>Ubicación:</strong> {espacioElegido.ubicacion} · <strong>Capacidad:</strong> {espacioElegido.capacidad}
                        </p>

                        <div className="mb-2">
                            <label htmlFor="equipamientoSelect" className="form-label small fw-bold mb-1">
                                Equipamiento habitual ({equipamientosSinRepetirPorEspacio.length})
                            </label>

                            {equipamientosSinRepetirPorEspacio.length === 0 ? (
                                <p className="mb-0 small text-muted fst-italic">
                                    Este espacio no tiene equipamiento habitual registrado.
                                </p>
                            ) : (
                                <select
                                    id="equipamientoSelect"
                                    className="form-select form-select-sm"
                                    defaultValue=""
                                    onChange={(e) => {
                                        const eq = equipamientosSinRepetirPorEspacio.find(
                                            (item) => item.nombre === e.target.value
                                        );
                                        console.log("Equipamiento elegido:", eq);
                                    }}
                                >
                                    <option value="" disabled>
                                        Selecciona un equipamiento
                                    </option>
                                    {equipamientosSinRepetirPorEspacio.map((eq) => (
                                        <option key={eq.nombre} value={eq.nombre}>
                                            {eq.nombre}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {espacioElegido.descripcion && (
                            <p className="mb-0 small text-muted">{espacioElegido.descripcion}</p>
                        )}
                    </div>
                )}
            </div>
            <div className="d-flex flex-column gap-3 my-3">
                {showSpinner ? (
                    <div className="d-flex flex-column align-items-center text-center my-3">
                        <Spinner animation="border" />
                        <p className="text-muted mt-2 mb-0">Cargando equipamiento...</p>
                    </div>
                ) : (
                    <div className="w-100 card p-3 shadow-sm">
                        <h6 className="mb-1">Aquí puedes seleccionar equipamiento móvil</h6>
                        <p className="mb-2 small text-muted">
                            <strong>Equipos:</strong> {equipamientoTrasladable.length}
                        </p>

                        {equipamientoTrasladable.length === 0 ? (
                            <p className="mb-0 small text-muted fst-italic">
                                No hay equipamiento móvil disponible.
                            </p>
                        ) : (
                            <select
                                id="equipamientoMovilSelect"
                                className="form-select form-select-sm"
                                value={formData.equipamientoMovil ?? ""}
                                onChange={(e) => {
                                    const valorSeleccionado = e.target.value;
                                    const eq = equipamientoTrasladable.find(
                                        (item) => String(item.id ?? item.nombre) === valorSeleccionado
                                    );

                                    onCustomChange("equipamientoMovil", valorSeleccionado);
                                    console.log("Equipamiento móvil elegido:", eq);
                                }}
                            >
                                <option value="" disabled>
                                    Selecciona un equipamiento móvil
                                </option>
                                {equipamientoTrasladable.map((eq) => {
                                    const keyOrVal = String(eq.id ?? eq.nombre);
                                    return (
                                        <option key={keyOrVal} value={keyOrVal}>
                                            {eq.nombre}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" type='button' onClick={onBack}>
                    Volver
                </button>
                <button className="btn btn-primary" type="submit">
                    Continuar
                </button>
            </div>
        </Form>
    );

}

export default ReservationForm2;