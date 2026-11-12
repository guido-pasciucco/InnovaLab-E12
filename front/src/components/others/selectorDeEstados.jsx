import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function SelectorEstado() {
  
  const [estado, setEstado] = useState('disponible');

  return (
    <div className="card p-2 gap-3 shadow-sm my-3">
      <div className="d-flex gap-3 align-items-center">
        <Form.Check 
          type="radio" 
          name="estadoProducto"
          checked={estado === 'disponible'}
          onChange={() => setEstado('disponible')}
          aria-label="Disponible" 
        />
        <span className="badge bg-success">● Disponible</span>
      </div>

      <div className="d-flex gap-3 align-items-center">
        <Form.Check 
          type="radio" 
          name="estadoProducto"
          checked={estado === 'mantenimiento'}
          onChange={() => setEstado('mantenimiento')}
          aria-label="En mantenimiento" 
        />
        <span className="badge bg-warning">■ En mantenimiento</span>
      </div>

      <div className="d-flex gap-3 align-items-center">
        <Form.Check 
          type="radio" 
          name="estadoProducto"
          checked={estado === 'fuera_de_servicio'}
          onChange={() => setEstado('fuera_de_servicio')}
          aria-label="Fuera de servicio" 
        />
        <span className="badge bg-secondary">x Fuera de servicio</span>
      </div>
    </div>
  );
}

export default SelectorEstado;