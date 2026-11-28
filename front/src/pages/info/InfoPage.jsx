import React from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Accordion,
  Alert,
} from 'react-bootstrap'
import {
  BsHouseDoor,
  BsCalendarEvent,
  BsListCheck,
  BsBuilding,
  BsHeartPulse,
  BsExclamationTriangle,
  BsRobot,
  BsPeople,
  BsInfoCircle,
  BsCheckCircleFill,
  BsShieldLock,
  BsGearWideConnected,
  BsBook,
} from 'react-icons/bs'
import PageHelmet from '../../helmet/PageHelmet'

export default function InfoPage() {
  const reglasNegocio = [
    {
      titulo: '1. Flujo Central de Reservas',
      detalle:
        'Toda actividad, curso o taller nace en el Calendario. Al agendar un evento, se vinculan directamente el espacio físico y el equipamiento requerido para evitar superposiciones.',
      icono: <BsCalendarEvent className="fs-4" />,
    },
    {
      titulo: '2. Control de Disponibilidad Real',
      detalle:
        'Los espacios y dispositivos tienen estados operativos. Si un recurso pasa a mantenimiento o desuso, el sistema genera una alerta y restringe su uso hasta su rehabilitación.',
      icono: <BsGearWideConnected className="fs-4" />,
    },
    {
      titulo: '3. Roles y Soporte Inteligente',
      detalle:
        'En este primer alcance, el perfil Administrador centraliza la creación de cuentas para coordinadores y usuarios. Para dudas rápidas sobre el sistema o los datos, se dispone de un asistente de IA.',
      icono: <BsShieldLock className="fs-4" />,
    },
  ]

  const manualSecciones = [
    {
      id: 'inicio',
      nombre: 'Inicio',
      rol: 'Coordinadores / Admin',
      icono: <BsHouseDoor className="me-2" />,
      resumen: 'Vista general del estado actual del centro de simulación.',
      detalle:
        'Muestra las métricas clave de ocupación y actividad, junto con un resumen de las alertas vigentes (equipamiento o dispositivos en desuso o mantenimiento).',
    },
    {
      id: 'calendario',
      nombre: 'Calendario',
      rol: 'Coordinadores / Admin',
      icono: <BsCalendarEvent className="me-2" />,
      resumen: 'Módulo principal para agendar y gestionar reservas.',
      detalle:
        'Permite crear nuevas reservas de cursos y talleres, definir fechas y horarios, y asignar los espacios físicos junto con el equipamiento necesario para cada evento.',
    },
    {
      id: 'actividades',
      nombre: 'Actividades',
      rol: 'Coordinadores / Admin',
      icono: <BsListCheck className="me-2" />,
      resumen: 'Listado cronológico de la agenda programada.',
      detalle:
        'Funciona como una vista de consulta donde se visualizan todas las actividades, cursos y talleres que ya fueron definidos y programados previamente en el calendario.',
    },
    {
      id: 'espacios',
      nombre: 'Espacios',
      rol: 'Coordinadores / Admin',
      icono: <BsBuilding className="me-2" />,
      resumen: 'Catálogo y administración de salas y áreas físicas.',
      detalle:
        'Permite gestionar las características de las salas donde se dictan los talleres (capacidad, equipamiento base) y actualizar su estado operativo (disponible, en mantenimiento o en desuso).',
    },
    {
      id: 'equipamiento',
      nombre: 'Equipamiento',
      rol: 'Coordinadores / Admin',
      icono: <BsHeartPulse className="me-2" />,
      resumen: 'Inventario de simuladores y dispositivos disponibles.',
      detalle:
        'Muestra los dispositivos disponibles para utilizar dentro de los espacios, detallando sus características técnicas, ubicación y estado actual de uso.',
    },
    {
      id: 'alertas',
      nombre: 'Alertas',
      rol: 'Coordinadores / Admin',
      icono: <BsExclamationTriangle className="me-2" />,
      resumen: 'Visualización en lista de indisponibilidades.',
      detalle:
        'Presenta en formato de lista todos los espacios o equipos alertados por indisponibilidad (mantenimiento, reparación, desuso, etc.) para un rápido seguimiento operativo.',
    },
    {
      id: 'ia',
      nombre: 'Consultas IA',
      rol: 'Coordinadores / Admin',
      icono: <BsRobot className="me-2" />,
      resumen: 'Asistente virtual conectado a la app y base de datos.',
      detalle:
        'Chat interactivo impulsado por un chatbot externo diseñado para resolver preguntas frecuentes sobre el funcionamiento de la aplicación y consultar datos registrados.',
    },
    {
      id: 'usuarios',
      nombre: 'Usuarios',
      rol: 'Solo Administrador',
      icono: <BsPeople className="me-2" />,
      resumen: 'Administración de accesos y cuentas.',
      detalle:
        'En este primer scope, el Administrador cuenta con privilegios exclusivos para añadir nuevos usuarios y coordinadores, editar perfiles y gestionar los accesos a la aplicación.',
    },
    {
      id: 'informacion',
      nombre: 'Información',
      rol: 'Coordinadores / Admin',
      icono: <BsInfoCircle className="me-2" />,
      resumen: 'Manual operativo y registro de actualizaciones.',
      detalle:
        'Documentación de referencia sobre el funcionamiento general de la app en este primer alcance y registro de posteriores modificaciones de funcionalidades o reglas del negocio.',
    },
  ]

  return (
    <>
      <PageHelmet
        title={'Informacion'}
        description={'informacion sobre funcionalidad y reglas del negocio'}
      />

      <Container className="py-4">
        {/* Encabezado tipo Manual */}
        <Card className="border-0 shadow-sm mb-4 bg-light">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <Badge
                bg="secondary"
                className="px-3 py-2 d-inline-flex align-items-center"
              >
                <BsBook className="me-1" /> Manual Operativo • Versión 1.0
                (Scope Inicial)
              </Badge>
              <small className="text-muted">
                Centro de Simulación InnovaLab
              </small>
            </div>
            <h2 className="fw-bold mb-2 h2">
              Guía de Funcionamiento y Secciones
            </h2>
            <p className="text-secondary mb-0">
              Bienvenido a la plataforma de gestión del{' '}
              <strong>Centro de Simulación de InnovaLab</strong>. Este manual
              resume las reglas de negocio vigentes y explica el propósito de
              cada módulo para facilitar la planificación de cursos, talleres y
              recursos.
            </p>
          </Card.Body>
        </Card>

        {/* Sección 1: Lógica del Negocio */}
        <h4 className="fw-bold mb-3">1. Funcionamiento del Negocio</h4>
        <Row className="g-3 mb-5">
          {reglasNegocio.map((regla, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 shadow-sm border-light">
                <Card.Body>
                  <div className="mb-3">{regla.icono}</div>
                  <Card.Title className="fs-6 fw-bold">
                    {regla.titulo}
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    {regla.detalle}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Sección 2: Manual de Módulos (Acordeón interactivo) */}
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div>
            <h4 className="fw-bold mb-1">2. Manual de Secciones de la App</h4>
            <p className="text-muted small mb-0">
              Despliega cada módulo para conocer su detalle operativo y permisos
              asociados.
            </p>
          </div>
        </div>

        <Accordion
          defaultActiveKey={['0', '1']}
          alwaysOpen
          className="shadow-sm mb-5"
        >
          {manualSecciones.map((sec, index) => {
            const esAdmin = sec.rol === 'Solo Administrador'
            return (
              <Accordion.Item eventKey={String(index)} key={sec.id}>
                <Accordion.Header>
                  <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                    <span className="fw-semibold d-flex align-items-center">
                      {sec.icono}
                      {sec.nombre}
                    </span>
                    <Badge
                      bg={esAdmin ? 'warning' : 'secondary'}
                      text={esAdmin ? 'dark' : undefined}
                      style={
                        esAdmin ? { backgroundColor: '#ffc107' } : undefined
                      }
                      pill
                      className="fw-normal"
                    >
                      {sec.rol}
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="bg-white">
                  <p className="fw-medium text-dark mb-1">{sec.resumen}</p>
                  <p className="text-muted small mb-0">{sec.detalle}</p>
                </Accordion.Body>
              </Accordion.Item>
            )
          })}
        </Accordion>

        {/* Sección 3: Control de Versiones / Alcance */}
        <h4 className="fw-bold mb-3">3. Alcance y Actualizaciones</h4>
        <Alert variant="info" className="border-0 shadow-sm">
          <div className="d-flex align-items-start gap-3">
            <BsCheckCircleFill className="fs-4 mt-1 flex-shrink-0" />
            <div>
              <Alert.Heading className="fs-6 fw-bold mb-1">
                Estado Actual: Alcance 1.0
              </Alert.Heading>
              <p className="small mb-2">
                Esta versión contempla la gestión completa del calendario de
                reservas, inventario y estado de espacios/equipamiento,
                monitoreo de alertas, consultas asistidas por IA y
                administración centralizada de usuarios por parte del rol
                Administrador.
              </p>
              <hr />
              <p className="small text-muted mb-0">
                <em>
                  Nota: Esta sección se actualizará periódicamente a medida que
                  se incorporen nuevas funcionalidades o se modifiquen las
                  reglas de negocio del centro.
                </em>
              </p>
            </div>
          </div>
        </Alert>
      </Container>
    </>
  )
}
