import { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '..//..//components/others/stepper';
import { AuthContext } from "../../context/AuthContext.jsx";
import ReservationForm from '../../components/forms/reservationForm';
import ReservationForm2 from '../../components/forms/reservationFormPage2';
import ReservationForm3 from '../../components/forms/reservationFormPage3';
import { getEquipamientoApi, getEspaciosApi, getActividades, getReservas, postEquipamientoApi, postReserva } from "../../utils/apiRoutes.js";
import { toast } from 'react-toastify';

export default function NuevaReservaPage() {
    const [equipamientoApi, setEquipamientoApi] = useState([]);
    const [espaciosApi, setEspaciosApi] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const { getTokken } = useContext(AuthContext);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        responsable_id: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        participantes_estimados: "",
        estado: "pendiente",
        espacio: "",
        equipamiento: [],
    });

    const getData = async () => {

        try {
            setShowSpinner(true);
            const res = await getEquipamientoApi(getTokken());
            const res2 = await getEspaciosApi(getTokken())
            const res3 = await getReservas(getTokken());
            const res4 = await getActividades(getTokken());
            setEquipamientoApi(res.data.data);
            setEspaciosApi(res2.data.data)
            setReservas(res3.data.data)
            setActividades(res4.data.data)
        } catch (err) {
            console.log("Error al cargar datos:", err);
        } finally {
            setShowSpinner(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    console.log("ESTADO GLOBAL formData ACTUAL:", formData);
    console.log("VALOR ACTUAL DE formData.espacio:", formData.espacio);
    const steps = ['Actividad y horario', 'Espacio y equipamiento', 'Confirmación'];

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCustomChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setFormData({
            nombre: "",
            tipo: "",
            responsable_id: "",
            fecha: "",
            hora_inicio: "",
            hora_fin: "",
            participantes_estimados: "",
            estado: "pendiente",
            espacio: "",
            equipamiento: [],
        });
        setActiveStep(0);
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinalSubmit = async () => {
    
        const completeData = formData;

        // 1. Mapeo de la actividad (buscando por nombre o tipo)
        const actividadEncontrada = actividades.find(act => 
            String(act.id) === String(completeData.actividad_id) || 
            act.nombre === completeData.nombre || 
            act.nombre === completeData.tipo
        );
        const actividadId = actividadEncontrada ? actividadEncontrada.id : (actividades[0]?.id || 1);

        // 2. Mapeo del espacio
        const espacioId = espaciosApi.find(esp => esp.nombre === completeData.espacio)?.id || null;

        // 3. Mapeo del equipamiento (si aplica)
        const equipamientoId = equipamientoApi.find(eq => eq.nombre === completeData.equipamiento)?.id || null;

        // 4. Formato ISO estándar requerido por tu backend (YYYY-MM-DDTHH:mm:ss)
        const fechaInicioCompleta = (completeData.fecha && completeData.hora_inicio)
            ? `${completeData.fecha}T${completeData.hora_inicio.length === 5 ? completeData.hora_inicio + ':00' : completeData.hora_inicio}`
            : null;

        const fechaFinCompleta = (completeData.fecha && completeData.hora_fin)
            ? `${completeData.fecha}T${completeData.hora_fin.length === 5 ? completeData.hora_fin + ':00' : completeData.hora_fin}`
            : null;

        const datosParaEnviar = {
            nombre: completeData.nombre || "",
            tipo: completeData.tipo || "",
            responsable_id: completeData.responsable_id || null,
            fecha: completeData.fecha || "",
            hora_inicio: completeData.hora_inicio || "",
            hora_fin: completeData.hora_fin || "",
            participantes_estimados: completeData.participantes_estimados ? Number(completeData.participantes_estimados) : 0,
            estado: completeData.estado || "pendiente",
            actividad_id: actividadId,
            espacio_id: espacioId,
            equipamiento_id: equipamientoId,
            fecha_hora_inicio: fechaInicioCompleta,
            fecha_hora_fin: fechaFinCompleta
        };
            
        try {
            await postReserva(datosParaEnviar, getTokken());
            
            setActiveStep(steps.length);
            toast.success("¡Reserva guardada con éxito!");
        } catch (err) {
            console.error("Error detallado del servidor:", err);
            
            if (err.response && err.response.data) {
                console.error("Mensaje de validación del backend:", err.response.data);
            }
            
            toast.error("Hubo un error al guardar la reserva. Revisa los datos.");
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <ReservationForm
                        onSubmitForm={handleNextStep}
                        formData={formData}
                        handleChange={handleChange}
                    />
                );
            case 1:
                return (
                    <ReservationForm2
                        onSubmitForm={handleNextStep}
                        onBack={handleBack}
                        formData={formData}
                        handleChange={handleChange}
                        onCustomChange={handleCustomChange}
                    />
                );
            case 2:
                return (
                    <ReservationForm3
                        // Envolvemos la llamada para asegurarnos de que NUNCA reciba el evento por accidente
                        onSubmitFinal={() => handleFinalSubmit()}
                        onBack={handleBack}
                        formData={formData}
                        handleChange={handleChange}
                    />
                );
            default:
                return <Typography>Paso desconocido</Typography>;
        }
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {/* 1. El Stepper ahora recibe el activeStep controlado */}
            <div className="d-flex flex-column align-items-start justify-content-center">
                <h1 className="text-start h1">Nueva reserva</h1>
                <div style={{ width: '50%' }} className="my-3">
                    <Stepper
                        steps={steps}
                        activeStep={activeStep}
                    />
                </div>
            </div>

            {/* 2. Contenedor de la sección actual del formulario */}
            <Box className="bg-light p-3 rounded-3 gap-3">
                {activeStep === steps.length ? (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>¡Reserva completada con éxito!</Typography>
                        <button className="btn btn-primary" onClick={handleReset}>Hacer otra reserva</button>
                    </Box>
                ) : (
                    renderStepContent(activeStep)
                )}

            </Box>
        </Box>
    );
}