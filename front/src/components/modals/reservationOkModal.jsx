import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { CheckLg, DiamondFill } from 'react-bootstrap-icons'; // O puedes usar FontAwesome / SVGs

function ReservaConfirmadaModal({ show, onHide, onCrearOtra, onVerCalendario, reservaData }) {
    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered 
            backdrop="static"
            contentClassName="border-0 shadow-lg rounded-4 p-4 text-center"
        >
            <Modal.Body className="d-flex flex-column align-items-center p-0">
                
                {/* Círculo verde con el check */}
                <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3" 
                    style={{ width: '70px', height: '70px', backgroundColor: '#d1fae5' }}
                >
                    <CheckLg size={32} color="#065f46" />
                </div>

                {/* Título */}
                <h3 className="fw-bold text-dark mb-2">Reserva confirmada</h3>

                {/* Subtítulos de detalles */}
                <p className="text-muted mb-1" style={{ fontSize: '0.95rem' }}>
                    {reservaData?.nombre || 'Curso de enfermería'} · {reservaData?.espacio || 'Auditorio'}
                </p>
                <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    {reservaData?.fecha || 'Mié 7/10'} · {reservaData?.hora_inicio || '11:00'}–{reservaData?.hora_fin || '13:00'}
                </p>

                {/* Badge de Estado */}
                <div className="mb-4">
                    <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2 border rounded-pill d-inline-flex align-items-center gap-1 shadow-sm"
                        style={{ fontSize: '0.85rem', color: '#1e3a8a', backgroundColor: '#f0fdf4' }}
                    >
                        <DiamondFill size={10} className="text-primary" /> 
                        <span>Confirmada</span>
                    </Badge>
                </div>

                {/* Botones de acción */}
                <div className="d-flex gap-3 w-100 justify-content-center mt-2">
                    <Button 
                        variant="outline-secondary" 
                        className="w-50 rounded-pill py-2 fw-medium text-dark border-secondary-subtle"
                        onClick={onCrearOtra}
                    >
                        Crear otra reserva
                    </Button>
                    <Button 
                        variant="primary" 
                        className="w-50 rounded-pill py-2 fw-medium border-0"
                        style={{ backgroundColor: '#005f73' }} // Tonalidad azul oscura elegante de la imagen
                        onClick={onVerCalendario}
                    >
                        Ver en el calendario
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
}

export default ReservaConfirmadaModal;