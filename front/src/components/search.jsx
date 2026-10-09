function BuscadorEnTiempoReal({ text, terminoBusqueda, setTerminoBusqueda }) {
    return (
        <div className="input-group w-100">
            <input
                type="text"
                className="form-control"
                placeholder={text}
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
        </div>
    );
}

export default BuscadorEnTiempoReal;