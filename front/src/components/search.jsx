function BuscadorEnTiempoReal({text, terminoBusqueda, setTerminoBusqueda}) {
    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder={text}
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
            </div>
        </div>
    );
}

export default BuscadorEnTiempoReal;