import { formatearMoneda } from '../utils/moneda.js';
import { formatearFecha } from '../utils/fechas.js';

/**
 * Normaliza el nombre del cliente para el nombre de archivo según el contrato:
 * 1. Elimina caracteres no válidos: \ / : * ? " < > | y caracteres de control
 * 2. Espacios sustituidos por _
 * 3. Conserva tildes y ñ
 * 4. Recorta a 60 caracteres
 * 5. Si queda vacío -> "Cliente"
 * @param {string} nombre
 * @returns {string}
 */
export function normalizarNombreCliente(nombre) {
  if (!nombre || typeof nombre !== 'string') return 'Cliente';

  let limpio = nombre
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  if (limpio.length > 60) {
    limpio = limpio.substring(0, 60);
  }

  // Eliminar guiones bajos sobrantes al inicio/fin
  limpio = limpio.replace(/^_+|_+$/g, '');

  return limpio || 'Cliente';
}

/**
 * Genera el nombre del archivo PDF según el número, cliente y versión:
 * v1: PRE-2026-0042_Acme_Digital_Corp.pdf
 * v2+: PRE-2026-0042_Acme_Digital_Corp_v2.pdf
 * @param {string} numero - Código PRE-YYYY-NNNN
 * @param {string} nombreCliente
 * @param {number} [numeroVersion=1]
 * @returns {string}
 */
export function obtenerNombreArchivoPdf(numero, nombreCliente, numeroVersion = 1) {
  const normCliente = normalizarNombreCliente(nombreCliente);
  const sufijo = (numeroVersion && numeroVersion > 1) ? `_v${numeroVersion}` : '';
  return `${numero}_${normCliente}${sufijo}.pdf`;
}

/**
 * Construye la definición declarativa del documento para pdfmake.
 * Cumple con contracts/documento-pdf.md y requisitos de impresión con fondo blanco.
 * @param {string} numero - Número asignado o 'BORRADOR'
 * @param {object} version - Snapshot de versión (emisor, cliente, lineas, totales...)
 * @param {boolean} [esAnulado=false]
 * @returns {object} docDefinition para pdfmake
 */
export function construirDefinicionPdf(numero, version, esAnulado = false) {
  const emisor = version.emisor || {};
  const cliente = version.cliente || {};
  const totales = version.totales || {};
  const lineas = version.lineas || [];

  const fechaEmision = formatearFecha(version.emitidaEn);
  const fechaValidez = formatearFecha(version.fechaValidez);
  const numeroConVersion = (version.numeroVersion && version.numeroVersion > 1)
    ? `${numero} (v${version.numeroVersion})`
    : numero;

  const irpfPct = totales.irpfPct ?? version.irpfPct ?? 15;
  const irpfCentimos = totales.irpfCentimos ?? 0;
  const textoIrpf = irpfCentimos > 0 ? `-${formatearMoneda(irpfCentimos)}` : '0,00 €';

  const filasTabla = [
    [
      { text: 'Descripción', style: 'tableHeader' },
      { text: 'Cantidad', style: 'tableHeaderRight' },
      { text: 'Precio unitario', style: 'tableHeaderRight' },
      { text: 'Importe', style: 'tableHeaderRight' }
    ]
  ];

  lineas.forEach((lin) => {
    const cantidad = ((lin.cantidadCentesimas || 0) / 100).toLocaleString('es-ES', {
      maximumFractionDigits: 2
    });
    filasTabla.push([
      { text: lin.descripcion || '', style: 'tableCell' },
      { text: cantidad, style: 'tableCellRight' },
      { text: formatearMoneda(lin.precioCentimos), style: 'tableCellRight' },
      { text: formatearMoneda(lin.subtotalCentimos), style: 'tableCellBoldRight' }
    ]);
  });

  // Cabecera izquierda: logo o texto
  let cabeceraIzquierda;
  if (emisor.logo) {
    cabeceraIzquierda = {
      image: emisor.logo,
      fit: [160, 60]
    };
  } else {
    cabeceraIzquierda = {
      stack: [
        { text: emisor.nombre || '', style: 'emisorTitulo' },
        emisor.nif ? { text: `NIF/CIF: ${emisor.nif}`, style: 'emisorNif' } : null
      ].filter(Boolean)
    };
  }

  const cabeceraDerecha = {
    stack: [
      { text: 'PRESUPUESTO', style: 'tituloPresupuesto' },
      { text: numeroConVersion, style: 'numeroPresupuesto' },
      { text: `Fecha de emisión: ${fechaEmision}`, style: 'metaTexto' },
      fechaValidez ? { text: `Válido hasta: ${fechaValidez}`, style: 'metaTexto' } : null
    ].filter(Boolean),
    alignment: 'right'
  };

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 45],
    footer: function (currentPage, pageCount) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'center',
        fontSize: 9,
        color: '#64748b',
        margin: [0, 10, 0, 0]
      };
    },
    content: [
      // 1. Encabezado
      {
        columns: [
          cabeceraIzquierda,
          cabeceraDerecha
        ],
        marginBottom: 10
      },
      // 2. Leyenda obligatoria
      {
        text: 'Este documento no es una factura',
        style: 'leyenda',
        marginBottom: 15
      },
      // 3 y 4. Emisor y Cliente
      {
        columns: [
          {
            stack: [
              { text: 'DE (EMISOR)', style: 'seccionLabel' },
              { text: emisor.nombre || '', style: 'parteNombre' },
              emisor.nif ? { text: `NIF: ${emisor.nif}`, style: 'parteTexto' } : null,
              emisor.direccion ? { text: emisor.direccion, style: 'parteTexto' } : null,
              emisor.email ? { text: emisor.email, style: 'parteTexto' } : null,
              emisor.telefono ? { text: emisor.telefono, style: 'parteTexto' } : null
            ].filter(Boolean)
          },
          {
            stack: [
              { text: 'PARA (CLIENTE)', style: 'seccionLabel' },
              { text: cliente.nombre || '', style: 'parteNombre' },
              cliente.nif ? { text: `NIF/CIF: ${cliente.nif}`, style: 'parteTexto' } : null,
              cliente.direccion ? { text: cliente.direccion, style: 'parteTexto' } : null,
              cliente.email ? { text: cliente.email, style: 'parteTexto' } : null
            ].filter(Boolean)
          }
        ],
        marginBottom: 20
      },
      // 5. Tabla de líneas (con cabecera repetida)
      {
        table: {
          headerRows: 1,
          widths: ['*', 70, 85, 90],
          body: filasTabla
        },
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: (i) => i === 1 ? '#cbd5e1' : '#e2e8f0',
          paddingTop: () => 6,
          paddingBottom: () => 6
        },
        marginBottom: 15
      },
      // 6. Bloque de Totales (unbreakable)
      {
        unbreakable: true,
        columns: [
          { width: '*', text: '' },
          {
            width: 250,
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Base imponible:', style: 'totalLabel' },
                  { text: formatearMoneda(totales.baseCentimos), style: 'totalVal' }
                ],
                [
                  { text: 'IVA (21 %):', style: 'totalLabel' },
                  { text: formatearMoneda(totales.ivaCentimos), style: 'totalVal' }
                ],
                [
                  { text: `Retención IRPF (${irpfPct} %):`, style: 'totalLabel' },
                  { text: textoIrpf, style: irpfCentimos > 0 ? 'totalValNegative' : 'totalVal' }
                ],
                [
                  { text: 'TOTAL:', style: 'totalFinalLabel' },
                  { text: formatearMoneda(totales.totalCentimos), style: 'totalFinalVal' }
                ]
              ]
            },
            layout: {
              hLineWidth: (i) => i === 3 ? 1.5 : 0,
              vLineWidth: () => 0,
              hLineColor: () => '#0f172a',
              paddingTop: () => 4,
              paddingBottom: () => 4
            }
          }
        ],
        marginBottom: 20
      },
      // 7. Condiciones / Notas
      version.condiciones ? {
        stack: [
          { text: 'CONDICIONES Y NOTAS', style: 'seccionLabel' },
          { text: version.condiciones, style: 'condicionesTexto' }
        ],
        marginBottom: 15
      } : null,
      // 8. Datos de Pago
      emisor.datosPago ? {
        stack: [
          { text: 'DATOS DE PAGO', style: 'seccionLabel' },
          { text: emisor.datosPago, style: 'condicionesTexto' }
        ],
        marginBottom: 10
      } : null
    ].filter(Boolean),
    styles: {
      emisorTitulo: { fontSize: 13, bold: true, color: '#0f172a' },
      emisorNif: { fontSize: 9, color: '#64748b', marginTop: 2 },
      tituloPresupuesto: { fontSize: 18, bold: true, color: '#1e3a8a', letterSpacing: 1 },
      numeroPresupuesto: { fontSize: 12, bold: true, color: '#0f172a', marginTop: 2 },
      metaTexto: { fontSize: 9, color: '#64748b', marginTop: 1 },
      leyenda: { fontSize: 9, italics: true, color: '#64748b', alignment: 'center' },
      seccionLabel: { fontSize: 8, bold: true, color: '#94a3b8', letterSpacing: 0.5, marginBottom: 4 },
      parteNombre: { fontSize: 11, bold: true, color: '#0f172a' },
      parteTexto: { fontSize: 9, color: '#334155', marginTop: 1 },
      tableHeader: { fontSize: 9, bold: true, color: '#334155', fillColor: '#f1f5f9' },
      tableHeaderRight: { fontSize: 9, bold: true, color: '#334155', fillColor: '#f1f5f9', alignment: 'right' },
      tableCell: { fontSize: 9, color: '#1e293b' },
      tableCellRight: { fontSize: 9, color: '#1e293b', alignment: 'right' },
      tableCellBoldRight: { fontSize: 9, bold: true, color: '#1e293b', alignment: 'right' },
      totalLabel: { fontSize: 10, color: '#475569' },
      totalVal: { fontSize: 10, bold: true, color: '#1e293b', alignment: 'right' },
      totalValNegative: { fontSize: 10, bold: true, color: '#b91c1c', alignment: 'right' },
      totalFinalLabel: { fontSize: 12, bold: true, color: '#0f172a' },
      totalFinalVal: { fontSize: 13, bold: true, color: '#1e3a8a', alignment: 'right' },
      condicionesTexto: { fontSize: 9, color: '#334155', lineHeight: 1.3 }
    },
    defaultStyle: {
      color: '#1e293b'
    }
  };

  if (esAnulado) {
    docDefinition.watermark = {
      text: 'ANULADO',
      color: 'red',
      opacity: 0.25,
      bold: true,
      italics: false
    };
  }

  return docDefinition;
}

let pdfMakeModule = null;

/**
 * Carga lazy de pdfmake y sus fuentes estándar
 */
async function cargarPdfMake() {
  if (pdfMakeModule) return pdfMakeModule;

  const pdfMakeImport = await import('pdfmake/build/pdfmake.js');
  const pdfFontsImport = await import('pdfmake/build/vfs_fonts.js');

  const pdfMake = pdfMakeImport.default || pdfMakeImport;
  const pdfFonts = pdfFontsImport.default || pdfFontsImport;

  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;
  pdfMakeModule = pdfMake;
  return pdfMake;
}

/**
 * Genera y descarga el documento PDF en el navegador del usuario.
 * @param {string} numero - Código del presupuesto (PRE-YYYY-NNNN)
 * @param {object} version - Snapshot de versión a exportar
 * @param {boolean} [esAnulado=false]
 * @returns {Promise<void>}
 */
export async function descargarPdf(numero, version, esAnulado = false) {
  const pdfMake = await cargarPdfMake();
  const docDefinition = construirDefinicionPdf(numero, version, esAnulado);
  const clienteNombre = version.cliente?.nombre || 'Cliente';
  const nombreArchivo = obtenerNombreArchivoPdf(numero, clienteNombre, version.numeroVersion);

  return new Promise((resolve) => {
    pdfMake.createPdf(docDefinition).download(nombreArchivo, () => {
      resolve();
    });
  });
}
