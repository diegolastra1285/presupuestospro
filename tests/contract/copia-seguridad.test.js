import { describe, it, expect } from 'vitest';
import { 
  validarEsquemaCopiaSeguridad, 
  generarCopiaSeguridadJson, 
  obtenerNombreArchivoCopia 
} from '../../src/components/perfil/RespaldoDatos.jsx';

describe('Contrato: Archivo de copia de seguridad (contracts/copia-de-seguridad.md)', () => {
  const estadoValido = {
    versionEsquema: 1,
    perfil: { nombre: 'DevStudio Freelance', nif: '12345678Z' },
    clientes: [{ id: 'c1', nombre: 'Acme Digital Corp', tipo: 'empresa' }],
    catalogo: [{ id: 's1', descripcion: 'Auditoría', precioCentimos: 45000 }],
    presupuestos: [
      {
        id: 'p1',
        estado: 'emitido',
        numero: 'PRE-2026-0042',
        anio: 2026,
        secuencial: 42,
        versiones: [{ numeroVersion: 1 }]
      }
    ],
    contadores: { '2026': 42 },
    tema: 'claro'
  };

  it('genera un nombre de archivo con la fecha local AAAA-MM-DD', () => {
    const nombre = obtenerNombreArchivoCopia('2026-10-03');
    expect(nombre).toBe('presupuestopro-copia-2026-10-03.json');
  });

  it('exporta JSON estructurado con encabezado PresupuestoPro y formato 1', () => {
    const jsonStr = generarCopiaSeguridadJson(estadoValido);
    const obj = JSON.parse(jsonStr);

    expect(obj.aplicacion).toBe('PresupuestoPro');
    expect(obj.formato).toBe(1);
    expect(obj.exportadoEn).toBeDefined();
    expect(obj.datos.versionEsquema).toBe(1);
    expect(obj.datos.presupuestos.length).toBe(1);
    expect(obj.datos.contadores['2026']).toBe(42);
  });

  it('valida satisfactoriamente una copia correcta', () => {
    const copia = {
      aplicacion: 'PresupuestoPro',
      formato: 1,
      exportadoEn: '2026-10-03T17:51:01.000Z',
      datos: estadoValido
    };
    const res = validarEsquemaCopiaSeguridad(copia);
    expect(res.valido).toBe(true);
    expect(res.error).toBeNull();
  });

  it('rechaza archivos que no son de PresupuestoPro o con formato desconocido', () => {
    const copiaAjena = { aplicacion: 'OtraApp', formato: 1, datos: {} };
    const res1 = validarEsquemaCopiaSeguridad(copiaAjena);
    expect(res1.valido).toBe(false);
    expect(res1.error).toContain('no es una copia de seguridad de PresupuestoPro');

    const copiaFormato99 = { aplicacion: 'PresupuestoPro', formato: 99, datos: {} };
    const res2 = validarEsquemaCopiaSeguridad(copiaFormato99);
    expect(res2.valido).toBe(false);
  });

  it('rechaza copias con datos incompletos o sin arrays de entidades', () => {
    const copiaIncompleta = {
      aplicacion: 'PresupuestoPro',
      formato: 1,
      datos: {
        clientes: 'no-es-array',
        catalogo: [],
        presupuestos: []
      }
    };
    const res = validarEsquemaCopiaSeguridad(copiaIncompleta);
    expect(res.valido).toBe(false);
    expect(res.error).toContain('dañada o incompleta');
  });

  it('rechaza copias con presupuestos emitidos sin número o sin versiones', () => {
    const copiaPresupuestoInvalido = {
      aplicacion: 'PresupuestoPro',
      formato: 1,
      datos: {
        ...estadoValido,
        presupuestos: [
          { id: 'p1', estado: 'emitido', numero: null, versiones: [] }
        ]
      }
    };
    const res = validarEsquemaCopiaSeguridad(copiaPresupuestoInvalido);
    expect(res.valido).toBe(false);
    expect(res.error).toContain('presupuestos');
  });

  it('rechaza contadores incoherentes (menor que el secuencial emitido)', () => {
    const copiaContadorIncoherente = {
      aplicacion: 'PresupuestoPro',
      formato: 1,
      datos: {
        ...estadoValido,
        contadores: { '2026': 10 } // Emitido es 42, pero contador dice 10
      }
    };
    const res = validarEsquemaCopiaSeguridad(copiaContadorIncoherente);
    expect(res.valido).toBe(false);
    expect(res.error).toContain('contadores');
  });
});
