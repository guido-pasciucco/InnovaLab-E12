import Form from 'react-bootstrap/Form';

export default function ResolverConflictoPage() {

    return (
        <>
            <div>
                <h1 className="text-start">Resolver conflicto</h1>
            </div>
            <div className="d-flex flex-column w-100 gap-4 ">
                <div className="d-flex card p-3 shadow-sm w-100 badge text-bg-danger">
                    <span>
                        ▲ Superposición de espacio. Ambas reservas usan Sala Sim 1 el miércoles de 11:00 a 12:00
                    </span>
                </div>
                <div className="d-flex flex-row w-100 gap-2 card p-3 shadow-sm">
                    <div className="d-flex flex-column card p-2 w-50">
                        <h3>Reserva A</h3>
                        <span>Actividad: Practica RCP</span>
                        <span>Espacio: Sala Sim 1</span>
                        <span>Horario Mié 10:00 a 12:00</span>
                        <span>Responsable: Laura Gómez</span>
                        <span>● Confirmada</span>
                    </div>
                    <div className="d-flex flex-column card p-2 shadow-sm w-50">
                        <h3>Reserva B</h3>
                        <span>Actividad: Curso de enfermería</span>
                        <span>Espacio: Sala Sim 1</span>
                        <span>Horario Mié 11:00 a 13:00</span>
                        <span>Responsable: Martín Paz</span>
                        <span>● Pendiente</span>
                    </div>
                </div>
                <div className="d-flex flex-column w-100 card p-3 shadow-sm">
                    <h3>Opciones de resolución</h3>
                    <Form>
                        {['radio'].map((type) => (
                            <div key={`reverse-${type}`} className="d-flex flex-column gap-3 my-3">
                                <Form.Check
                                    className='d-flex flex-row align-items-center gap-5 w-100 card p-1 shadow-sm'
                                    reverse
                                    label="Mover la reserva B a otro horario"
                                    name="group1"
                                    type={type}
                                    id={`reverse-${type}-1`}
                                />
                                <Form.Check
                                    className='d-flex flex-row align-items-center gap-5 w-100 card p-1 shadow-sm'
                                    reverse
                                    label="Mover la reserva B a otro espacio"
                                    name="group1"
                                    type={type}
                                    id={`reverse-${type}-2`}
                                />
                                <Form.Check
                                    className='d-flex flex-row align-items-center gap-5 w-100 card p-1 shadow-sm'
                                    reverse
                                    label="Cancelar una de las reservas"
                                    name="group1"
                                    type={type}
                                    id={`reverse-${type}-3`}
                                />
                            </div>
                        ))}
                    </Form>
                </div>
            </div>

        </>
    )

}