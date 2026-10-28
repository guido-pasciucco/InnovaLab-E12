import { Container } from "react-bootstrap";
import { getAlertasApi } from "../../utils/apiRoutes";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AlertasPage() {
  const { getTokken } = useContext(AuthContext);

  const handleGetAlertas = async () => {
    console.log("obteniendo alertas desde api...");
    const res = await getAlertasApi(getTokken());
    console.log("respuesta obtenida: ", res)
  };

  return <Container></Container>;
}
