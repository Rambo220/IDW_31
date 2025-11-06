
// Función helper que calcula el precio final de la consulta.
// Si la obra social elegida está dentro de medico.obrasSociales => 50% de descuento.

export function calcularPrecioConsulta(medico, obraSocialId) {
  // base = precio del médico
  const base = Number(medico?.valorConsulta ?? 0);
  if (!Number.isFinite(base) || base <= 0) return 0;

  // si no choqué obra social, cobro base
  const obraId = Number(obraSocialId);
  const cubre = Array.isArray(medico?.obrasSociales) && medico.obrasSociales.includes(obraId);

  // si cubre es la mitad, si no la base
  const precio = cubre ? base * 0.5 : base;

  return Math.round(precio);
}
