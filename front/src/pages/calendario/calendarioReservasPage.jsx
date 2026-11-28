import Calendario from '../../components/others/calendar'
import GenericSelect from '../../components/others/select'
import { Link } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { Spinner } from 'react-bootstrap'
import { getEspaciosApi, getActividades, getReservas } from '../../services/apiRoutes'
import { PlusCircle } from 'react-bootstrap-icons'
import PageHelmet from '../../helmet/PageHelmet.jsx'
import AlertInfo from '../../components/alerts/AlertInfo.jsx'

export default function CalendarioReservasPage() {
  const [actividades, setActividades] = useState([])
  const [espaciosApi, setEspaciosApi] = useState([])
  const [reservas, setReservas] = useState([])
  const [showSpinner, setShowSpinner] = useState(false)
  const { getTokken } = useContext(AuthContext)
  const hoy = new Date()
  const diffLunes = (hoy.getDay() + 6) % 7
  const lunes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate() - diffLunes,
  )
  const domingo = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate() - diffLunes + 6,
  )
  // Extraemos los números de día y el nombre del mes
  const diaInicial = lunes.getDate()
  const diaFinal = domingo.getDate()
  const nombreDelMes = lunes.toLocaleDateString('es-ES', { month: 'long' }) // Ej: "noviembre"
  // Resultado armado dinámicamente:
  const textoSemana = `Semana del ${diaInicial} al ${diaFinal} de ${nombreDelMes}`

  const extraerLista = (res) => {
    const payload = res?.data?.data ?? res?.data ?? res;
    return Array.isArray(payload) ? payload : [];
  }
  const getData = async () => {
    try {
      setShowSpinner(true)
      const [espaciosRes, reservasRes, actividadesRes] = await Promise.all([
        getEspaciosApi(getTokken()),
        getReservas(getTokken()),
        getActividades(getTokken()),
      ])
      const reservas = extraerLista(reservasRes);
      const espacios = extraerLista(espaciosRes);
      const actividades = extraerLista(actividadesRes);

      setReservas(reservas)
      setEspaciosApi(espacios)
      setActividades(actividades)
      
    } catch (err) {
      console.log('Error al cargar datos:', err)
    } finally {
      setShowSpinner(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  console.log('reservas', reservas)
  return (
    <>
      {/* espacio para helmet */}
      <PageHelmet
        title="Calendario"
        description="pagina para reserva de actividades"
      />
      <AlertInfo
        title="Calendario y Gestión de Reservas"
        description="En esta sección podés visualizar las actividades programadas en el calendario, consultar sus fechas, horarios y espacios asignados, así como registrar nuevas reservas de espacios y equipamiento."
      />

      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-column justify-content-center">
          <h1 className="text-start h1">Calendario</h1>
          <p>{textoSemana} * Sala Sim 1</p>
        </div>
        <div className="d-flex flex-row gap-2">
          <button className="btn btn-secondary">Hoy</button>
          <Link to="/dashboard/nueva-reserva" className="btn btn-primary">
            <PlusCircle className="mb-1 me-1" />
            Nueva reserva / Actividad
          </Link>
        </div>
      </div>
      <div className="d-flex flex-column my-3 gap-3">
        <div className="d-flex flex-row gap-3">
          <GenericSelect
            text="Espacio: "
            opciones={espaciosApi.map((item) => item.nombre)}
          />
          <GenericSelect text="Recurso: " opciones={['Todos']} />
          <GenericSelect
            text="Actividad"
            opciones={actividades.map((item) => item.nombre)}
          />
        </div>
        {/* <div className="bg-danger p-3 rounded-3 shadow-sm">
          Alerta de superposición
        </div> */}
        <div className="d-flex flex-row gap-2">
          <span className="bg-primary p-1 rounded-3 shadow-sm text-white">Programada</span>
          <span className="bg-success p-1 rounded-3 shadow-sm text-white">En curso</span>
          <span className="bg-secondary p-1 rounded-3 shadow-sm text-white">Finalizada</span>
          <span className="bg-danger p-1 rounded-3 shadow-sm text-white">Cancelada</span>
          {/* <span className="bg-warning p-1 rounded-3 shadow-sm">Pendiente</span>
          <span className="bg-warning p-1 rounded-3 shadow-sm">
            Mantenimiento
          </span>
          <span className="bg-danger p-1 rounded-3 shadow-sm">Conflicto</span> */}
        </div>
      </div>
      {showSpinner ? <Spinner /> :
        <Calendario
          eventos={reservas}
          onRefrescarEventos={getData}
        />}
    </>
  )
}
