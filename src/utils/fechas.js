/**
 * Utilidades para manejo y formateo de fechas en español de España (dd/mm/aaaa).
 */

const NOMBRES_MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/**
 * Convierte una fecha ISO (AAAA-MM-DD o ISO 8601) a formato dd/mm/aaaa.
 * Si no es válida o está vacía, devuelve cadena vacía.
 * @param {string|Date} fechaISO
 * @returns {string}
 */
export function formatearFecha(fechaISO) {
  if (!fechaISO) return '';
  
  if (typeof fechaISO === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fechaISO)) {
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  const d = new Date(fechaISO);
  if (isNaN(d.getTime())) return '';

  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

/**
 * Devuelve la fecha actual en formato local ISO AAAA-MM-DD
 * @returns {string}
 */
export function obtenerFechaHoyISO() {
  const d = new Date();
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/**
 * Calcula la fecha de validez sumando días a una fecha ISO AAAA-MM-DD
 * @param {string} fechaISO - Fecha base AAAA-MM-DD
 * @param {number} dias - Número de días a sumar (>= 1)
 * @returns {string} Fecha calculada AAAA-MM-DD
 */
export function calcularFechaValidez(fechaISO, dias = 30) {
  if (!fechaISO) fechaISO = obtenerFechaHoyISO();
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const d = new Date(anio, mes - 1, dia);
  d.setDate(d.getDate() + Number(dias));
  
  const resAnio = d.getFullYear();
  const resMes = String(d.getMonth() + 1).padStart(2, '0');
  const resDia = String(d.getDate()).padStart(2, '0');
  return `${resAnio}-${resMes}-${resDia}`;
}

/**
 * Devuelve el nombre en español del mes (1-12)
 * @param {number} mesNumero - 1 a 12
 * @returns {string}
 */
export function obtenerNombreMes(mesNumero) {
  const idx = Number(mesNumero) - 1;
  return NOMBRES_MESES[idx] || '';
}
