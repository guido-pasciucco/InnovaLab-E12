import { Alert } from "react-bootstrap"

export default function AlertInfo({ title, description, isDismisible = true }) {
  return (
    <Alert variant="info" className="mb-3" dismissible={isDismisible}>
      <Alert.Heading className="fs-6">{title} </Alert.Heading>

      <p className="mb-0 small">{description}</p>
    </Alert>
  )
}
