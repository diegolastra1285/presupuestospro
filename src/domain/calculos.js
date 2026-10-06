/**
 * Módulo de cálculo fiscal puro (D8, FR-009, FR-018).
 * Aritmética entera en céntimos y redondeo simétrico Half-Up a 2 decimales.
 */

/**
 * Redondeo simétrico a la mitad más cercana (Half-Up).
 * Para enteros o decimales: signo(x) × floor(|x| + 0.5)
 * @param {number} valor
 * @returns {number}
 */
export function redondearHalfUp(valor) {
  if (valor === 0) return 0;
  const signo = valor < 0 ? -1 : 1;
  const abs = Math.abs(valor);
  return signo * Math.floor(abs + 0.5);
}

/**
 * Calcula el subtotal en céntimos enteros de una línea de presupuesto.
 * Cantidad en centésimas (ej: 2,5 h = 250), precio unitario en céntimos (ej: 33,33 € = 3333).
 * subtotal = redondearHalfUp(cantidadCentesimas × precioCentimos / 100)
 * @param {number} cantidadCentesimas
 * @param {number} precioCentimos
 * @returns {number} Subtotal en céntimos
 */
export function calcularSubtotalLinea(cantidadCentesimas, precioCentimos) {
  const cant = Number(cantidadCentesimas) || 0;
  const precio = Number(precioCentimos) || 0;
  const producto = cant * precio;
  const signo = producto < 0 ? -1 : 1;
  const abs = Math.abs(producto);
  return signo * Math.floor((abs + 50) / 100);
}

/**
 * Calcula los totales fiscales de un presupuesto a partir de sus líneas y el porcentaje de IRPF.
 * @param {Array<{ cantidadCentesimas: number, precioCentimos: number, [key: string]: any }>} lineas
 * @param {number} irpfPct - Porcentaje de retención (15, 7 o 0)
 * @returns {{
 *   lineas: Array<any>,
 *   baseCentimos: number,
 *   ivaCentimos: number,
 *   irpfPct: number,
 *   irpfCentimos: number,
 *   totalCentimos: number
 * }}
 */
export function calcularTotalesPresupuesto(lineas = [], irpfPct = 15) {
  let baseCentimos = 0;
  
  const lineasCalculadas = lineas.map((linea) => {
    const subtotalCentimos = calcularSubtotalLinea(
      linea.cantidadCentesimas ?? 0,
      linea.precioCentimos ?? 0
    );
    baseCentimos += subtotalCentimos;
    return {
      ...linea,
      subtotalCentimos
    };
  });

  const pct = Number(irpfPct) || 0;
  const ivaCentimos = redondearHalfUp((baseCentimos * 21) / 100);
  const irpfCentimos = redondearHalfUp((baseCentimos * pct) / 100);
  const totalCentimos = baseCentimos + ivaCentimos - irpfCentimos;

  return {
    lineas: lineasCalculadas,
    baseCentimos,
    ivaCentimos,
    irpfPct: pct,
    irpfCentimos,
    totalCentimos
  };
}
