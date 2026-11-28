
import { useState, useEffect, useRef, useContext } from 'react'
import {
  Card,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap'
import { postChatIa } from '../../services/apiRoutes'
import { AuthContext } from '../../context/AuthContext'
import { BsSendFill } from 'react-icons/bs'
import PageHelmet from '../../helmet/PageHelmet'
import AlertInfo from '../../components/alerts/AlertInfo'

const preguntasFrecuentes = [
  '¿Qué salas están libres hoy?',
  '¿Qué equipamiento está en mantenimiento?',
  'Resumen del estado operativo',
]

export default function ChatIaPage() {
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const [mensajes, setMensajes] = useState([
    {
      tipo: 'ia',
      texto: '¡Hola! ¿En qué puedo ayudarte?',
    },
  ])

  const { getTokken } = useContext(AuthContext)
  const token = getTokken()

  const mensajesEndRef = useRef(null)

  // Scroll automático al último mensaje
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [mensajes])

  // Formatear respuesta de la IA
  const formatearMensaje = (texto) => {
    if (!texto) return ''

    return texto
      .replace(/:\s*/g, ':\n\n')
      .replace(/\s*•\s*/g, '\n\n• ')
      .replace(/\s+(\d+\.)\s+/g, '\n\n$1 ')
  }

  // Consultar API
  const recibirMensajeApi = async (texto) => {
    try {
      console.log('Haciendo consulta mensaje:', texto)

      const res = await postChatIa(token, texto)

      console.log('Respuesta api chat ia:', res)

      return res.data?.respuesta

    } catch (err) {
      const mensajeError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error al consultar el asistente IA'

      throw new Error(mensajeError)
    }
  }

  // Enviar mensaje
  const enviarMensaje = async (texto) => {
    const nuevoMensaje = texto.trim()

    if (!nuevoMensaje || cargando) return

    setMensajes((prev) => [
      ...prev,
      { tipo: 'usuario', texto: nuevoMensaje },
    ])

    setMensaje('')
    setCargando(true)

    try {
      const mensajeIa = await recibirMensajeApi(nuevoMensaje)

      setMensajes((prev) => [
        ...prev,
        {
          tipo: 'ia',
          texto: mensajeIa || 'No se recibió una respuesta.',
        },
      ])

    } catch (err) {
      const mensajeError = 'Intente nuevamente: ' + err.message

      setMensajes((prev) => [
        ...prev,
        { tipo: 'ia', texto: mensajeError },
      ])

    } finally {
      setCargando(false)
    }
  }

  // Enviar desde el formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    enviarMensaje(mensaje)
  }

  return (
    <>
      <PageHelmet
        title="Chat IA"
        description="Chat IA para consultar sobre la aplicación"
      />

      <AlertInfo
        title="Información sobre el servicio"
        description="Este chat se conecta con un modelo de inteligencia artificial externo para responder consultas. No se envían datos personales del usuario al proveedor del servicio. El servicio puede presentar limitaciones o interrupciones ajenas a la plataforma. Si no está disponible, intentá nuevamente en unos minutos."
      />

      <Card className="shadow-sm h-100">

        <Card.Header className="background-primary text-white">
          <strong>Asistente IA</strong>
          <div className="small">Asistente virtual</div>
        </Card.Header>

        <Card.Body
          className="d-flex flex-column"
          style={{
            height: '500px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* Contenedor general de mensajes */}
          <div className="d-flex flex-column gap-3 w-100">

            {mensajes.map((item, index) => (
              <div
                key={index}
                className={`d-flex w-100 ${
                  item.tipo === 'usuario'
                    ? 'justify-content-end'
                    : 'justify-content-start'
                }`}
              >
                {/* Burbuja del mensaje */}
                <div
                  className={`p-3 rounded-3 ${
                    item.tipo === 'usuario'
                      ? 'background-primary text-white'
                      : 'bg-light text-dark'
                  }`}
                  style={{
                    width: 'fit-content',
                    maxWidth: '80%',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {item.tipo === 'ia'
                    ? formatearMensaje(item.texto)
                    : item.texto}
                </div>
              </div>
            ))}

            {/* Indicador de carga */}
            {cargando && (
              <div className="d-flex justify-content-start">
                <div className="bg-light text-muted p-3 rounded-3 small">
                  <Spinner
                    size="sm"
                    animation="border"
                    className="me-2"
                  />
                  La IA está escribiendo...
                </div>
              </div>
            )}

            <div ref={mensajesEndRef} />

          </div>
        </Card.Body>

        {/* Formulario y preguntas frecuentes */}
        <Card.Footer>

          <div className="mb-3">
            <small className="text-muted fw-semibold d-block mb-2">
              Preguntas frecuentes
            </small>

            <div className="d-flex flex-wrap gap-2">
              {preguntasFrecuentes.map((pregunta) => (
                <Button
                  key={pregunta}
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-pill"
                  disabled={cargando}
                  onClick={() => enviarMensaje(pregunta)}
                >
                  {pregunta}
                </Button>
              ))}
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <div className="d-flex gap-2">

              <Form.Control
                type="text"
                placeholder="Escribí tu mensaje..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                disabled={cargando}
              />

              <Button
                type="submit"
                className="btn-primary"
                disabled={cargando || !mensaje.trim()}
              >
                <BsSendFill className="me-2" />
                Enviar
              </Button>

            </div>
          </Form>
        </Card.Footer>

      </Card>
    </>
  )
}
