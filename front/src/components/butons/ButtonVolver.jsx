import { Button } from 'react-bootstrap'
import { BsArrowLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'

export default function ButtonVolver({ link_volver }) {
  return (
    <div className="d-flex">
      <Button
        as={Link}
        to={link_volver}
        className="rounded-circle"
        variant="secondary"
      >
        <BsArrowLeft />
        Volver
      </Button>
    </div>
  )
}
