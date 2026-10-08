import Navbar from "../components/topbar";

export default function DashboardPrincipalPage() {
  const actividades = [
    {
      hora: "11:00",
      actividad: "Taller de suturas",
      espacio: "Sala Sim 2",
      estado: "Reservado",
    },
    {
      hora: "12:30",
      actividad: "Simulación clínica",
      espacio: "Auditorio",
      estado: "Reservado",
    },
    {
      hora: "14:00",
      actividad: "Reunión docente",
      espacio: "Sala Sim 1",
      estado: "Pendiente",
    },
  ];
  const espacios = [
    { nombre: "Sim 1", porcentaje: 80 },
    { nombre: "Sim 2", porcentaje: 55 },
    { nombre: "Debrief", porcentaje: 35 },
    { nombre: "Auditorio", porcentaje: 90 },
    { nombre: "Taller", porcentaje: 65 },
  ];

  return (
    <div className="container-fluid p-4">
      {/* Título */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h1 mb-0">Hoy en el centro</h2>
          <small className="text-muted">Viernes 2 de octubre</small>
        </div>

        <button className="btn btn-primary">Nueva reserva</button>
      </div>
      {/* Gráfico + alertas */}
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                Ocupación por espacio · esta semana
              </h5>

              <div
                className="d-flex align-items-end justify-content-around"
                style={{ height: "150px" }}
              >
                {espacios.map((espacio) => (
                  <div
                    key={espacio.nombre}
                    className="d-flex flex-column align-items-center"
                  >
                    <small>{espacio.porcentaje}%</small>

                    <div
                      className="bg-primary rounded-top"
                      style={{
                        width: "40px",
                        height: `${espacio.porcentaje}px`,
                      }}
                    />

                    <small>{espacio.nombre}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Alertas</h5>

              <span className="badge text-bg-danger">▲ Conflicto</span>

              <p className="small text-muted">
                2 conflictos · Sala Sim 1, mié 11:00
              </p>

              <span className="badge text-bg-warning">En mantenimiento</span>

              <p className="small text-muted">
                Sala Debriefing, hasta el viernes
              </p>

              <span className="badge text-bg-secondary">Pendiente</span>

              <p className="small text-muted">5 reservas por aprobar</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Próximas actividades</h5>

          <table className="table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Actividad</th>
                <th>Espacio</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {actividades.map((item, index) => (
                <tr key={index}>
                  <td>{item.hora}</td>
                  <td>{item.actividad}</td>
                  <td>{item.espacio}</td>
                  <td>
                    <span className="badge text-bg-primary">{item.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
