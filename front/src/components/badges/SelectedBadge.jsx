import Badge from "react-bootstrap/Badge";

const VARIANTE_POR_ESTADO = {
  disponible: "success",
  confirmada: "success",
  resuelta:"success",
  fuera_de_servicio: "danger",
  cancelada: "danger",
  programada: "primary",
  en_curso: "success",
  finalizada: "secondary"
};

const TEXTO_POR_ESTADO = {
  disponible: "Disponible",
  confirmada: "Confirmada",
  fuera_de_servicio: "Fuera de servicio",
  cancelada: "Cancelada",
  programada: "Programada",
  en_curso: "En curso",
  finalizada: "Finalizada"
};

function normalizarEstado(valor) {
  if (typeof valor !== "string") return "";

  return valor
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function formatearTexto(valor) {
  if (typeof valor !== "string" || !valor.trim()) {
    return "Sin estado";
  }

  return valor
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^|\s)\p{L}/gu, letra =>
      letra.toUpperCase()
    );
}

function SelectedBadge({ bg, label }) {
  let variante;
  let texto;

  if (label === true) {
    variante = bg ?? "success";
    texto = "Activo";
  } else if (label === false) {
    variante = bg ?? "danger";
    texto = "Inactivo";
  } else {
    const clave = normalizarEstado(label);

    variante = bg ?? VARIANTE_POR_ESTADO[clave] ?? "warning";
    texto = TEXTO_POR_ESTADO[clave] ?? formatearTexto(label);
  }

  return (
    <Badge pill bg={variante}>
      {texto}
    </Badge>
  );
}

export default SelectedBadge;