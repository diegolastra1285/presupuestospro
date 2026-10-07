import { zip, strToU8 } from 'fflate';
import { generarPdfBuffer } from '../pdf/generador.js';
import { normalizarNombrePdfLote } from '../utils/archivos.js';
import { obtenerFechaHoyISO } from '../utils/fechas.js';
import { generarCopiaSeguridadJson } from '../components/perfil/RespaldoDatos.jsx';

/**
 * Devuelve el nombre estándar del archivo ZIP de exportación.
 * Patrón: presupuestospro-copia-AAAA-MM-DD.zip
 * @param {string} [fechaIso]
 * @returns {string}
 */
export function obtenerNombreArchivoZip(fechaIso) {
  const f = fechaIso || obtenerFechaHoyISO();
  return `presupuestospro-copia-${f}.zip`;
}

/**
 * Filtra los presupuestos consolidados aptos para exportación documental en PDF.
 * Incluye presupuestos con número oficial asignado y versiones, excluyendo borradores.
 * @param {Array<object>} presupuestos
 * @returns {Array<object>}
 */
export function obtenerPresupuestosExportables(presupuestos) {
  if (!Array.isArray(presupuestos)) return [];
  return presupuestos.filter((p) => {
    return (
      Boolean(p?.numero) &&
      p?.estado !== 'borrador' &&
      Array.isArray(p?.versiones) &&
      p.versiones.length > 0
    );
  });
}

/**
 * Orquesta la generación en lote de PDFs, conformación de datos.json y compresión en ZIP.
 *
 * @param {object} estado - Estado global de la aplicación (IndexedDB)
 * @param {function} [onProgreso] - Callback para notificar el progreso a la UI:
 *        ({ fase, completados, total }) => void
 *        - fase: 'generando' | 'comprimiendo'
 *        - completados: número de PDFs procesados
 *        - total: total de presupuestos a generar
 * @returns {Promise<{ blob: Blob, nombreArchivo: string, totalPdfs: number }>}
 * @throws {Error} Si falla la generación o compresión
 */
export async function exportarTodoZip(estado, onProgreso = () => {}) {
  const presupuestosExportables = obtenerPresupuestosExportables(estado?.presupuestos || []);
  const total = presupuestosExportables.length;

  onProgreso({ fase: 'generando', completados: 0, total });

  // 1. Conformar datos.json (volcado íntegro de la aplicación con sangría de 2 espacios)
  const jsonSeguridadStr = generarCopiaSeguridadJson(estado);
  const archivosZip = {
    'datos.json': strToU8(jsonSeguridadStr)
  };

  // 2. Generar secuencialmente cada PDF asegurando nombres únicos
  const nombresExistentes = new Set();

  for (let i = 0; i < total; i++) {
    const presupuesto = presupuestosExportables[i];
    const versionActiva = presupuesto.versiones[presupuesto.versiones.length - 1];
    const esAnulado = presupuesto.estado === 'anulado';
    const nombreCliente = versionActiva?.cliente?.nombre;

    const nombrePdf = normalizarNombrePdfLote(presupuesto.numero, nombreCliente, nombresExistentes);
    const pdfBuffer = await generarPdfBuffer(presupuesto.numero, versionActiva, esAnulado);

    archivosZip[nombrePdf] = pdfBuffer;

    onProgreso({ fase: 'generando', completados: i + 1, total });

    // Ceder el hilo de ejecución para refrescar la interfaz de usuario
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // 3. Fase de compresión ZIP
  onProgreso({ fase: 'comprimiendo', completados: total, total });
  await new Promise((resolve) => setTimeout(resolve, 0));

  const zipUint8 = await new Promise((resolve, reject) => {
    zip(archivosZip, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const blob = new Blob([zipUint8], { type: 'application/zip' });
  const nombreArchivo = obtenerNombreArchivoZip();

  return { blob, nombreArchivo, totalPdfs: total };
}

/**
 * Desencadena la descarga de un Blob en el navegador sin recargar la página.
 *
 * @param {Blob} blob - Archivo binario a descargar
 * @param {string} nombreArchivo - Nombre sugerido para el archivo descargado
 */
export function dispararDescargaArchivo(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
