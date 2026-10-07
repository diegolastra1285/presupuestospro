/**
 * Utilidades para manejo, saneamiento y normalización de nombres de archivos.
 */

/**
 * Genera un nombre de archivo seguro y único para un PDF dentro del lote ZIP.
 *
 * Reglas aplicadas:
 * 1. Elimina caracteres conflictivos en sistemas de archivos (Windows/macOS/Linux): \ / : * ? " < > |
 * 2. Elimina caracteres de control ASCII (0x00 a 0x1F y 0x7F).
 * 3. Colapsa secuencias de espacios en blanco a un único espacio y recorta bordes.
 * 4. Trunca el nombre de cliente a un máximo de 60 caracteres.
 * 5. Si el cliente queda vacío tras el saneamiento, utiliza 'Cliente'.
 * 6. Concatena: `${numero} - ${clienteLimpio}.pdf`
 * 7. Si el nombre ya existe en `nombresExistentes`, agrega sufijo correlativo `_${i}` antes de .pdf.
 *
 * @param {string} numero - Código oficial del presupuesto (ej. 'PRE-2026-0001' o '2026-001')
 * @param {string} [nombreCliente] - Razón social o nombre comercial del cliente
 * @param {Set<string>} [nombresExistentes] - Set mutable de nombres ya registrados en el lote actual
 * @returns {string} Nombre de archivo limpio y único terminado en .pdf
 */
export function normalizarNombrePdfLote(numero, nombreCliente, nombresExistentes = new Set()) {
  let limpio = typeof nombreCliente === 'string' ? nombreCliente : '';

  // 1. Eliminar caracteres prohibidos en sistemas de archivos y de control ASCII
  // eslint-disable-next-line no-control-regex
  limpio = limpio.replace(/[\\/:*?"<>|\x00-\x1F\x7F]/g, '');

  // 2. Colapsar espacios múltiples y recortar extremos
  limpio = limpio.replace(/\s+/g, ' ').trim();

  // 3. Truncar a máximo 60 caracteres
  if (limpio.length > 60) {
    limpio = limpio.slice(0, 60).trim();
  }

  // 4. Valor por defecto si queda vacío
  if (!limpio) {
    limpio = 'Cliente';
  }

  // 5. Nombre base
  const nombreBase = `${numero} - ${limpio}`;
  let nombreFinal = `${nombreBase}.pdf`;

  // 6. Desambiguación ante colisiones
  if (nombresExistentes.has(nombreFinal)) {
    let indice = 2;
    while (nombresExistentes.has(`${nombreBase}_${indice}.pdf`)) {
      indice++;
    }
    nombreFinal = `${nombreBase}_${indice}.pdf`;
  }

  nombresExistentes.add(nombreFinal);
  return nombreFinal;
}
