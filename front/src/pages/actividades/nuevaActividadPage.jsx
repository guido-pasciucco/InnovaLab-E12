import ActivityForm from '../../components/forms/activityForm';

import PageHelmet from '../../helmet/PageHelmet';

function NuevaActividadPage() {
    return (
        <>

            <PageHelmet title='Conflictos' description='pagina de visualizacion de conflictos' />
            <div className="d-flex flex-column justify-content-center align-items-start">
                <div className="d-flex flex-column justify-content-center align-items-start">
                    <h1 className="h1">Nueva Actividad</h1>
                    <p>
                        Reservas / Actividades / Nueva
                    </p>
                </div>
                <div className="d-flex flex-column w-100 gap-4 ">
                    <ActivityForm />
                </div>
            </div>
        </>
    )
}

export default NuevaActividadPage;
