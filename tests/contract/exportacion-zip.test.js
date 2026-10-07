import { describe, it, expect, vi } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { 
  exportarTodoZip, 
  obtenerPresupuestosExportables,
  obtenerNombreArchivoZip 
} from '../../src/services/exportacion-zip.js';
import { validarEsquemaCopiaSeguridad } from '../../src/components/perfil/RespaldoDatos.jsx';
import { obtenerFechaHoyISO } from '../../src/utils/fechas.js';

describe('Contrato: Servicio de exportación ZIP (contracts/contrato-exportacion-zip.md)', () => {
  const estadoPrueba = {
    versionEsquema: 1,
    perfil: {
      nombre: 'DevStudio Freelance',
      nif: '12345678Z',
      direccion: 'Gran Vía 28',
      email: 'dev@studio.es'
    },
    clientes: [
      { id: 'c1', nombre: 'Acme Digital Corp', nif: 'B98765431' },
      { id: 'c2', nombre: 'Diseño/Web: "Norte" <SL>', nif: 'B11223344' }
    ],
    catalogo: [
      { id: 's1', descripcion: 'Desarrollo web', precioCentimos: 50000 }
    ],
    presupuestos: [
      {
        id: 'p1',
        numero: '2026-001',
        estado: 'emitido',
        anio: 2026,
        secuencial: 1,
        versiones: [
          {
            numeroVersion: 1,
            emitidaEn: '2026-10-01T10:00:00.000Z',
            fechaValidez: '2026-10-31',
            cliente: { nombre: 'Acme Digital Corp', nif: 'B98765431' },
            emisor: { nombre: 'DevStudio Freelance', nif: '12345678Z' },
            lineas: [
              { descripcion: 'Desarrollo web', cantidadCentesimas: 100, precioCentimos: 50000, subtotalCentimos: 50000 }
            ],
            totales: {
              baseCentimos: 50000,
              ivaCentimos: 10500,
              irpfCentimos: 7500,
              totalCentimos: 53000
            }
          }
        ]
      },
      {
        id: 'p2',
        numero: '2026-002',
        estado: 'anulado',
        anio: 2026,
        secuencial: 2,
        versiones: [
          {
            numeroVersion: 1,
            emitidaEn: '2026-10-02T10:00:00.000Z',
            cliente: { nombre: 'Diseño/Web: "Norte" <SL>' },
            emisor: { nombre: 'DevStudio Freelance' },
            lineas: [],
            totales: { baseCentimos: 0, ivaCentimos: 0, irpfCentimos: 0, totalCentimos: 0 }
          }
        ]
      },
      {
        id: 'p3-borrador',
        numero: null,
        estado: 'borrador',
        anio: 2026,
        versiones: []
      }
    ],
    contadores: { '2026': 2 },
    tema: 'claro'
  };

  describe('obtenerPresupuestosExportables', () => {
    it('filtra únicamente presupuestos con número y versiones válidas, excluyendo borradores', () => {
      const exportables = obtenerPresupuestosExportables(estadoPrueba.presupuestos);
      expect(exportables).toHaveLength(2);
      expect(exportables.map(p => p.numero)).toEqual(['2026-001', '2026-002']);
    });
  });

  describe('obtenerNombreArchivoZip', () => {
    it('genera presupuestospro-copia-AAAA-MM-DD.zip con la fecha local', () => {
      const hoy = obtenerFechaHoyISO();
      expect(obtenerNombreArchivoZip()).toBe(`presupuestospro-copia-${hoy}.zip`);
      expect(obtenerNombreArchivoZip('2026-10-06')).toBe('presupuestospro-copia-2026-10-06.zip');
    });
  });

  describe('exportarTodoZip (T005, T006)', () => {
    it('genera un archivo ZIP con estructura plana en la raíz, datos.json válido y los PDFs requeridos', async () => {
      const onProgreso = vi.fn();
      const resultado = await exportarTodoZip(estadoPrueba, onProgreso);

      expect(resultado).toBeDefined();
      expect(resultado.nombreArchivo).toBe(`presupuestospro-copia-${obtenerFechaHoyISO()}.zip`);
      expect(resultado.totalPdfs).toBe(2);
      expect(resultado.blob).toBeInstanceOf(Blob);

      // Descomprimir el ZIP binario para verificar su estructura
      const arrayBuffer = await resultado.blob.arrayBuffer();
      const entradas = unzipSync(new Uint8Array(arrayBuffer));
      const rutasArchivos = Object.keys(entradas);

      // 1. Estructura plana (ninguna ruta contiene '/')
      rutasArchivos.forEach(ruta => {
        expect(ruta).not.toContain('/');
        expect(ruta).not.toContain('\\');
      });

      // 2. Presencia de datos.json
      expect(rutasArchivos).toContain('datos.json');
      const contenidoJsonStr = strFromU8(entradas['datos.json']);
      const objetoJson = JSON.parse(contenidoJsonStr);
      const validacion = validarEsquemaCopiaSeguridad(objetoJson);
      expect(validacion.valido).toBe(true);

      // 3. datos.json incluye todos los presupuestos (incluso borradores)
      expect(objetoJson.datos.presupuestos).toHaveLength(3);

      // 4. Presencia de los PDFs oficiales normalizados
      expect(rutasArchivos).toContain('2026-001 - Acme Digital Corp.pdf');
      expect(rutasArchivos).toContain('2026-002 - DiseñoWeb Norte SL.pdf');

      // 5. Los PDFs son válidos (cabecera %PDF-)
      const pdfBytes = entradas['2026-001 - Acme Digital Corp.pdf'];
      expect(pdfBytes[0]).toBe(0x25); // '%'
      expect(pdfBytes[1]).toBe(0x50); // 'P'
      expect(pdfBytes[2]).toBe(0x44); // 'D'
      expect(pdfBytes[3]).toBe(0x46); // 'F'

      // 6. Callback de progreso invocado adecuadamente
      expect(onProgreso).toHaveBeenCalledWith({ fase: 'generando', completados: 0, total: 2 });
      expect(onProgreso).toHaveBeenCalledWith({ fase: 'generando', completados: 1, total: 2 });
      expect(onProgreso).toHaveBeenCalledWith({ fase: 'generando', completados: 2, total: 2 });
      expect(onProgreso).toHaveBeenCalledWith({ fase: 'comprimiendo', completados: 2, total: 2 });
    });

    it('maneja colisiones de nombres de archivo y truncado a 60 caracteres (T011, T012)', async () => {
      const nombreRepetido = 'Cliente Repetido';
      const nombreExtremadamenteLargo = 'B'.repeat(80);

      const estadoConColisiones = {
        ...estadoPrueba,
        presupuestos: [
          {
            id: 'c1',
            numero: '2026-010',
            estado: 'emitido',
            versiones: [{ numeroVersion: 1, cliente: { nombre: nombreRepetido } }]
          },
          {
            id: 'c2',
            numero: '2026-010',
            estado: 'emitido',
            versiones: [{ numeroVersion: 1, cliente: { nombre: nombreRepetido } }]
          },
          {
            id: 'c3',
            numero: '2026-011',
            estado: 'emitido',
            versiones: [{ numeroVersion: 1, cliente: { nombre: nombreExtremadamenteLargo } }]
          }
        ]
      };

      const resultado = await exportarTodoZip(estadoConColisiones);
      const arrayBuffer = await resultado.blob.arrayBuffer();
      const entradas = unzipSync(new Uint8Array(arrayBuffer));
      const rutasArchivos = Object.keys(entradas);

      expect(rutasArchivos).toContain('2026-010 - Cliente Repetido.pdf');
      expect(rutasArchivos).toContain('2026-010 - Cliente Repetido_2.pdf');
      expect(rutasArchivos).toContain(`2026-011 - ${'B'.repeat(60)}.pdf`);
    });

    it('cumple el objetivo de rendimiento SC-004 generando hasta 20 presupuestos en menos de 10 segundos', async () => {
      const presupuestos = [];
      for (let i = 1; i <= 20; i++) {
        presupuestos.push({
          id: `bench-${i}`,
          numero: `2026-${String(i).padStart(3, '0')}`,
          estado: 'emitido',
          anio: 2026,
          secuencial: i,
          versiones: [
            {
              numeroVersion: 1,
              emitidaEn: '2026-10-01T10:00:00.000Z',
              cliente: { nombre: `Cliente ${i}`, nif: '12345678Z' },
              emisor: { nombre: 'DevStudio Freelance' },
              lineas: [{ descripcion: `Servicio ${i}`, cantidadCentesimas: 100, precioCentimos: 1000, subtotalCentimos: 1000 }],
              totales: { baseCentimos: 1000, ivaCentimos: 210, irpfCentimos: 150, totalCentimos: 1060 }
            }
          ]
        });
      }

      const estadoLote = {
        versionEsquema: 1,
        perfil: { nombre: 'DevStudio' },
        clientes: [],
        catalogo: [],
        presupuestos,
        contadores: { '2026': 20 }
      };

      const inicio = performance.now();
      const resultado = await exportarTodoZip(estadoLote);
      const duracionSegundos = (performance.now() - inicio) / 1000;

      expect(resultado.totalPdfs).toBe(20);
      expect(duracionSegundos).toBeLessThan(10);
    }, 15000);
  });
});

