function ReservationForm3({ onSubmitFinal, onBack, formData, handleChange }) {

    console.log("Datos de la reserva en el paso 3:", formData);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        // 2. Llamamos a onSubmitFinal pasando un objeto vacío (o los datos locales si los hubiera),
        // evitando por completo que se propague el evento del navegador al componente padre.
        onSubmitFinal({}); 
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='d-flex mb-2'>
                <h3>Resumen de la reserva</h3>
            </div>
            <div className="d-flex flex-column mb-5 align-items-start">
                <span>Actividad: {formData.nombre}</span>
                <span>Fecha y hora: {formData.fecha}. {formData.hora_inicio} - {formData.hora_fin}</span>
                <span>Ubicación: {formData.espacio}</span>
                <span>Participantes: {formData.participantes_estimados}</span>
                <span>Equipamiento: {formData.equipamiento}</span>
                <span>Responsable: {formData.resposable_id}</span>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    Volver
                </button>
                <button className="btn btn-primary" type="submit">
                    Confirmar Reserva
                </button>
            </div>
        </form>
    );
}

export default ReservationForm3;