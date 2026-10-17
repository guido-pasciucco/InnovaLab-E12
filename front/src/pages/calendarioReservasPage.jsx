import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import esLocale from "@fullcalendar/react/locales/es";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";

export default function Calendar() {
  // Estados para controlar el modal y la reserva seleccionada
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Lista de eventos
  const [events, setEvents] = useState([
    { id: "1", title: "Reserva 1", date: "2026-10-17", extendedProps: { cliente: "Juan Pérez", hora: "10:00 AM" } },
    { id: "2", title: "Reserva 2", date: "2026-10-20", extendedProps: { cliente: "María Gómez", hora: "03:00 PM" } },
  ]);

  // Se ejecuta al hacer clic en una reserva
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setModalOpen(true);
  };

  // Funciones de acción
  const handleVerDatos = () => {
    alert(`Viendo detalles de: ${selectedEvent.title} - Cliente: ${selectedEvent.extendedProps.cliente}`);
  };

  const handleModificar = () => {
    alert(`Modificar reserva: ${selectedEvent.id}`);
    // Aquí puedes abrir un formulario de edición
    setModalOpen(false);
  };

  const handleEliminar = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${selectedEvent.title}"?`)) {
      setEvents(events.filter((ev) => ev.id !== selectedEvent.id));
      setModalOpen(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, themePlugin, multiMonthPlugin]}
        initialView="dayGridMonth"
        locales={[esLocale]}
        locale="es"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,multiMonthYear",
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
          year: "Año",
        }}
        views={{
          multiMonthYear: {
            type: "multiMonth",
            duration: { years: 1 },
          },
        }}
        weekends={true}
        events={events}
        eventClick={handleEventClick} // <--- AQUÍ CAPTURAMOS EL CLIC
        height="auto"
      />

      {/* MODAL DE BOOTSTRAP */}
      {modalOpen && selectedEvent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEvent.title}</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Fecha:</strong> {selectedEvent.startStr}</p>
                <p><strong>Cliente:</strong> {selectedEvent.extendedProps?.cliente || "No especificado"}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-info text-white" onClick={handleVerDatos}>
                  Ver datos
                </button>
                <button type="button" className="btn btn-warning" onClick={handleModificar}>
                  Modificar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleEliminar}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}