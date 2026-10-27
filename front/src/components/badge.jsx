import Badge from "react-bootstrap/Badge";

function SelectedBadge({ bg = "success", label }) {
  if ((label == "disponible")) {
    return (
        <Badge pill bg={bg}>
          Disponible
        </Badge>
    );
  } 
  
  if ((label == "fuera_de_servicio")){
    return (
      <Badge pill bg={"danger"}>
        Fuera de servicio
      </Badge>
    )
  }
  else{
    return(
        <Badge pill bg={"warning"}>
          {label}
        </Badge>
    )
  }
}

export default SelectedBadge;
