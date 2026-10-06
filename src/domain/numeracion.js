/**
 * Módulo de dominio para la numeración correlativa anual de presupuestos.
 * Formato: PRE-{YYYY}-{NNNN} (ej: PRE-2026-0001, PRE-2026-0042)
 * Si supera 9999 se muestra completo (ej: PRE-2026-10000).
 */

/**
 * Formatea el número de presupuesto anual correlativo.
 * @param {number|string} anio - Año de emisión
 * @param {number} secuencial - Número secuencial dentro del año
 * @returns {string}
 */
export function formatearNumeroPresupuesto(anio, secuencial) {
  const anioStr = String(anio);
  const num = Number(secuencial);
  const secStr = num < 10000 ? String(num).padStart(4, '0') : String(num);
  return `PRE-${anioStr}-${secStr}`;
}

/**
 * Calcula el siguiente número para el año dado y devuelve los nuevos contadores.
 * Operación pura (no muta el objeto contadores recibido).
 * @param {object} contadores - Diccionario { [año: string]: number }
 * @param {number|string} anio - Año natural de emisión
 * @returns {{ numero: string, anio: number, secuencial: number, nuevosContadores: object }}
 */
export function asignarSiguienteNumero(contadores = {}, anio) {
  const anioNum = Number(anio);
  const anioStr = String(anioNum);
  const ultimoSecuencial = contadores[anioStr] ?? 0;
  const nuevoSecuencial = ultimoSecuencial + 1;

  const numero = formatearNumeroPresupuesto(anioNum, nuevoSecuencial);
  const nuevosContadores = {
    ...contadores,
    [anioStr]: nuevoSecuencial
  };

  return {
    numero,
    anio: anioNum,
    secuencial: nuevoSecuencial,
    nuevosContadores
  };
}
