import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";

const CalendarioReservas = () => {
  const [reservas, setReservas] = useState([
    { title: "Reserva Juan Pérez", date: "2026-10-17" },
    { title: "Reserva María López", date: "2026-10-18" },
  ]);

  const handleDateClick = (info) => {
    const cliente = prompt("Nombre del cliente:");
    if (cliente) {
      setReservas([...reservas, { title: `Reserva ${cliente}`, date: info.dateStr }]);
    }
  };

  return (
    <div className="container my-4">
      <h2>Calendario de Reservas</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={reservas}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default CalendarioReservas;
