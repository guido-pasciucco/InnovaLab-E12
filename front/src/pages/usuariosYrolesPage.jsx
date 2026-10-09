export default function UsuariosYRolesPage() {
  const usuarios = [
    {
      id: 1,
      nombre: "Juan Pérez",
      rol: "Administrador",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "María Gómez",
      rol: "Cordinador",
      estado: "Inactivo",
    },
    {
      id: 3,
      nombre: "Pedro López",
      rol: "Cordinador",
      estado: "Activo",
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h1 className="h1">Usuarios y roles page</h1>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#miModal"
        >
          Agregar usuario
        </button>
      </div>
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>

              <td>
                <span className="badge text-bg-primary">{usuario.rol}</span>
              </td>

              <td>
                <span
                  className={
                    usuario.estado === "Activo"
                      ? "badge text-bg-success"
                      : "badge text-bg-danger"
                  }
                >
                  {usuario.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* modal al tocar boton */}
      <div
        className="modal fade"
        id="miModal"
        tabIndex="-1"
        aria-labelledby="miModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Encabezado */}
            <div className="modal-header">
              <h5 className="modal-title" id="miModalLabel">
                Título del Modal
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            {/* Cuerpo */}
            <div className="modal-body">Contenido del modal...</div>

            {/* Pie */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="button" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
