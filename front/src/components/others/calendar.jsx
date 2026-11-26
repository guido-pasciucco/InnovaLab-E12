import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getActividades } from '../../services/apiRoutes';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext.jsx";
import ModalEditarReserva from '../modals/editReservationModal.jsx';
import "./calendar.css";

export default function Calendario({ eventos, onRefrescarEventos }) {
  const [actividades, setActividades] = useState([]);
  const { getTokken } = useContext(AuthContext);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const getData = async () => {
    const res = await getActividades(getTokken());
    setActividades(res.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const nombresDeEventos = eventos.map((ev) => {
    const actividad = actividades.find((act) => act.id === ev.actividad_id);
    return actividad ? actividad.nombre : 'Evento sin nombre';
  });

  const nombresDeSalas = eventos.map((ev) => ev.espacio?.nombre || 'Sala sin nombre');

  const eventosFormatados = eventos.map((ev, index) => ({
    id: String(ev.id),
    title: `${nombresDeEventos[index]} - ${nombresDeSalas[index]}`,
    start: ev.fecha_hora_inicio,
    end: ev.fecha_hora_fin,
    extendedProps: {
      reserva: ev,
    },
  }));

  const handleEventClick = (info) => {
    const reserva =
      info.event.extendedProps.reserva ||
      eventos.find((ev) => String(ev.id) === String(info.event.id));

    if (reserva) {
      setReservaSeleccionada(reserva);
      setMostrarModal(true);
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setReservaSeleccionada(null);
  };

  return (
    <div className="container-fluid p-3 calendario-wrapper">
      {/*
        La clave 'key={eventos.length}' recrea FullCalendar cuando cambia la cantidad de eventos.
      */}
      <FullCalendar
        key={eventos.length}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={esLocale}
        firstDay={1}
        allDaySlot={false}
        slotMinTime="09:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        height="auto"
        events={eventosFormatados}
        selectable={true}
        eventClick={handleEventClick}
        dateClick={(info) => {
          console.log('Fecha seleccionada:', info.dateStr);
        }}
      />

      <ModalEditarReserva
        show={mostrarModal}
        onHide={handleCerrarModal}
        reserva={reservaSeleccionada}
        onActualizado={onRefrescarEventos}
      />
    </div>
  );
}