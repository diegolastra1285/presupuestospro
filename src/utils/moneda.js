/**
 * Utilidades para manejo y formateo de moneda en euros (EUR) y formato es-ES.
 * La moneda interna siempre se representa en céntimos enteros.
 */

const formateadorMoneda = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Convierte céntimos enteros a cadena formateada en euros.
 * Ej: 127200 -> "1.272,00 €" o "1.272,00\u00A0€"
 * @param {number} centimos - Importe en céntimos
 * @param {boolean} [normalizarEspacio=true] - Si reemplaza espacio no separable por espacio normal
 * @returns {string}
 */
export function formatearMoneda(centimos, normalizarEspacio = true) {
  if (centimos === null || centimos === undefined || isNaN(centimos)) {
    centimos = 0;
  }
  const euros = centimos / 100;
  const formateado = formateadorMoneda.format(euros);
  return normalizarEspacio ? formateado.replace(/\u00A0/g, ' ') : formateado;
}

/**
 * Convierte céntimos a número en euros con 2 decimales
 * @param {number} centimos
 * @returns {number}
 */
export function centimosAEuros(centimos) {
  return (centimos || 0) / 100;
}

/**
 * Convierte euros a céntimos redondeando al entero más cercano
 * @param {number|string} euros
 * @returns {number}
 */
export function eurosACentimos(euros) {
  if (typeof euros === 'string') {
    euros = parsearImporteACentimos(euros) / 100;
  }
  return Math.round((euros || 0) * 100);
}

/**
 * Parsea un texto ingresado por el usuario (admite coma o punto) a céntimos enteros.
 * @param {string|number} texto
 * @returns {number}
 */
export function parsearImporteACentimos(texto) {
  if (typeof texto === 'number') {
    return Math.round(texto * 100);
  }
  if (!texto || typeof texto !== 'string') return 0;
  
  // Limpiar espacios y símbolo de euro
  const limpio = texto.trim().replace(/€/g, '').trim();
  if (!limpio) return 0;

  // Reemplazar coma por punto si es formato decimal español (ej: 12,50)
  // Si contiene puntos de miles y comas (ej: 1.200,50)
  let normalizado = limpio;
  if (limpio.includes(',') && limpio.includes('.')) {
    normalizado = limpio.replace(/\./g, '').replace(',', '.');
  } else if (limpio.includes(',')) {
    normalizado = limpio.replace(',', '.');
  }

  const num = parseFloat(normalizado);
  return isNaN(num) ? 0 : Math.round(num * 100);
}
