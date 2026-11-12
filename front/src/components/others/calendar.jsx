import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getActividades } from '../../utils/apiRoutes';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext.jsx";


export default function Calendario({ eventos }) {
  const [actividades, setActividades] = useState([]);
  const { getTokken } = useContext(AuthContext);

  const getData = async () => {
    const res = await getActividades(getTokken());
    setActividades(res.data.data)
  };

  useEffect(() => {
    getData();
  }, []);

  console.log("Reservas en Calendario:", eventos);
  const nombresDeEventos = eventos.map(ev => {
    const actividad = actividades.find(act => act.id === ev.actividad_id);
    return actividad ? actividad.nombre : 'Evento sin nombre';
  });
  const nombresDeSalas = eventos.map(ev => {
    const sala = ev.espacio.nombre;
    return sala ? sala : 'Sala sin nombre';
  });

  console.log("nombresDeEventos", nombresDeEventos);
  console.log("nombresDeSalas", nombresDeSalas);

  const eventosFormatados = eventos.map(ev => ({
    id: ev.id,
    title: nombresDeEventos[eventos.indexOf(ev)] + ' - ' + nombresDeSalas[eventos.indexOf(ev)],
    start: ev.fecha_hora_inicio,
    end: ev.fecha_hora_fin,
  }));

  return (
    <div className="container-fluid p-3">
      {/* 
        La clave 'key={eventos.length}' es clave aquí: 
        Cuando 'eventos' pasa de 0 a 5, React recrea el FullCalendar con los datos ya listos.
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
        dateClick={(info) => {
          console.log('Fecha seleccionada:', info.dateStr);
        }}
      />
    </div>
  );
}