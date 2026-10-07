import { describe, it, expect } from 'vitest';
import { 
  normalizarNombreCliente, 
  obtenerNombreArchivoPdf, 
  construirDefinicionPdf,
  generarPdfBuffer 
} from '../../src/pdf/generador.js';

describe('Contrato: Documento PDF del presupuesto (contracts/documento-pdf.md)', () => {
  describe('Normalización del nombre de archivo (FR-016)', () => {
    it('normaliza nombres sustituyendo espacios por guiones bajos y eliminando caracteres prohibidos', () => {
      expect(normalizarNombreCliente('Acme Digital Corp')).toBe('Acme_Digital_Corp');
      expect(normalizarNombreCliente('Cliente: / Con * Caracteres? "Raros"')).toBe('Cliente_Con_Caracteres_Raros');
      expect(normalizarNombreCliente('Diseño & Programación SL')).toBe('Diseño_&_Programación_SL');
    });

    it('recorta a 60 caracteres y recurre a "Cliente" si queda vacío', () => {
      const largo = 'A'.repeat(80);
      expect(normalizarNombreCliente(largo).length).toBe(60);
      expect(normalizarNombreCliente('   ???///:::   ')).toBe('Cliente');
      expect(normalizarNombreCliente('')).toBe('Cliente');
    });

    it('genera nombre de archivo para v1 y para v2+', () => {
      expect(obtenerNombreArchivoPdf('PRE-2026-0042', 'Acme Digital Corp', 1))
        .toBe('PRE-2026-0042_Acme_Digital_Corp.pdf');

      expect(obtenerNombreArchivoPdf('PRE-2026-0042', 'Acme Digital Corp', 2))
        .toBe('PRE-2026-0042_Acme_Digital_Corp_v2.pdf');

      expect(obtenerNombreArchivoPdf('PRE-2026-0042', 'Acme Digital Corp', 3))
        .toBe('PRE-2026-0042_Acme_Digital_Corp_v3.pdf');
    });
  });

  describe('Estructura de la definición del PDF (docDefinition de pdfmake)', () => {
    const versionMock = {
      numeroVersion: 1,
      emitidaEn: '2026-10-03T10:00:00.000Z',
      fechaValidez: '2026-11-02',
      emisor: {
        nombre: 'DevStudio Freelance',
        nif: '12345678Z',
        direccion: 'Calle Gran Vía 28, Madrid',
        email: 'contacto@devstudio.es',
        telefono: '+34 600 000 000',
        datosPago: 'ES12 3456 7890'
      },
      cliente: {
        nombre: 'Acme Digital Corp',
        nif: 'B98765431',
        tipo: 'empresa',
        email: 'facturacion@acmedigital.com',
        direccion: 'Castellana 100'
      },
      lineas: [
        {
          descripcion: 'Auditoría de arquitectura web',
          cantidadCentesimas: 100,
          precioCentimos: 45000,
          subtotalCentimos: 45000
        },
        {
          descripcion: 'Implementación frontend',
          cantidadCentesimas: 1500,
          precioCentimos: 4000,
          subtotalCentimos: 60000
        }
      ],
      irpfPct: 15,
      condiciones: 'Pago al 50% inicial.',
      totales: {
        baseCentimos: 105000,
        ivaCentimos: 22050,
        irpfCentimos: 15750,
        totalCentimos: 111300
      }
    };

    it('construye documento A4 con cabecera repetida en tabla (headerRows: 1) y pie de página', () => {
      const doc = construirDefinicionPdf('PRE-2026-0042', versionMock, false);

      expect(doc.pageSize).toBe('A4');
      expect(typeof doc.footer).toBe('function');

      // Buscar tabla de líneas en el contenido
      const nodoTabla = doc.content.find(nodo => nodo.table && nodo.table.headerRows === 1);
      expect(nodoTabla).toBeDefined();
      expect(nodoTabla.table.headerRows).toBe(1);

      // Verificar que el bloque de totales es unbreakable
      const nodoTotales = doc.content.find(nodo => nodo.unbreakable === true);
      expect(nodoTotales).toBeDefined();
    });

    it('incluye watermark "ANULADO" si el presupuesto está anulado', () => {
      const docEmitido = construirDefinicionPdf('PRE-2026-0042', versionMock, false);
      expect(docEmitido.watermark).toBeUndefined();

      const docAnulado = construirDefinicionPdf('PRE-2026-0042', versionMock, true);
      expect(docAnulado.watermark).toBeDefined();
      expect(docAnulado.watermark.text).toBe('ANULADO');
    });

    it('incluye la leyenda obligatoria "Este documento no es una factura"', () => {
      const doc = construirDefinicionPdf('PRE-2026-0042', versionMock, false);
      const jsonStr = JSON.stringify(doc);
      expect(jsonStr).toContain('Este documento no es una factura');
    });

    it('genera un buffer binario Uint8Array válido con generarPdfBuffer', async () => {
      const buffer = await generarPdfBuffer('PRE-2026-0042', versionMock, false);
      expect(buffer).toBeInstanceOf(Uint8Array);
      expect(buffer.length).toBeGreaterThan(100);
      // Cabecera %PDF- en los primeros 4 bytes: [37, 80, 68, 70]
      expect(buffer[0]).toBe(0x25); // '%'
      expect(buffer[1]).toBe(0x50); // 'P'
      expect(buffer[2]).toBe(0x44); // 'D'
      expect(buffer[3]).toBe(0x46); // 'F'
    });
  });
});
