import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

export default function Calendario() {
  const eventos = [
    {
      id: '1',
      title: 'Taller de suturas',
      start: '2026-10-29T09:00:00',
      end: '2026-10-29T11:00:00',
      backgroundColor: '#dcfce7',
      borderColor: '#86c99a',
      textColor: '#166534',
    },
    {
      id: '2',
      title: 'Práctica RCP',
      start: '2026-10-29T11:00:00',
      end: '2026-10-29T13:00:00',
      backgroundColor: '#fee2e2',
      borderColor: '#dc2626',
      textColor: '#991b1b',
    },
  ];

  return (
    <div className="container-fluid p-3">

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate="2026-10-29"
        locale={esLocale}
        firstDay={1}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        slotDuration="00:30:00"
        height="auto"
        events={eventos}
        selectable={true}
        dateClick={(info) => {
          console.log('Fecha seleccionada:', info.dateStr);
        }}
      />
    </div>
  );
}