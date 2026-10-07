import { describe, it, expect } from 'vitest';
import { normalizarNombrePdfLote } from '../../src/utils/archivos.js';

describe('normalizarNombrePdfLote (normalización de nombres de archivo PDF)', () => {
  it('genera el nombre estándar para un cliente y número válidos', () => {
    const resultado = normalizarNombrePdfLote('2026-001', 'Estudio García');
    expect(resultado).toBe('2026-001 - Estudio García.pdf');
  });

  it('elimina caracteres prohibidos en sistemas de archivos (\\ / : * ? " < > |)', () => {
    const resultado = normalizarNombrePdfLote('2026-002', 'Diseño/Web: "Norte" <SL>');
    expect(resultado).toBe('2026-002 - DiseñoWeb Norte SL.pdf');
  });

  it('elimina caracteres de control ASCII (0x00 a 0x1F y 0x7F)', () => {
    const nombreConControles = 'Cliente\x00Especial\x1F\x7F';
    const resultado = normalizarNombrePdfLote('2026-003', nombreConControles);
    expect(resultado).toBe('2026-003 - ClienteEspecial.pdf');
  });

  it('colapsa secuencias de espacios en blanco y recorta bordes', () => {
    const resultado = normalizarNombrePdfLote('2026-003', '   Espacios   múltiples   ');
    expect(resultado).toBe('2026-003 - Espacios múltiples.pdf');
  });

  it('utiliza "Cliente" por defecto si el nombre queda vacío o es nulo/indefinido', () => {
    expect(normalizarNombrePdfLote('2026-004', '')).toBe('2026-004 - Cliente.pdf');
    expect(normalizarNombrePdfLote('2026-004', '   ')).toBe('2026-004 - Cliente.pdf');
    expect(normalizarNombrePdfLote('2026-004', null)).toBe('2026-004 - Cliente.pdf');
    expect(normalizarNombrePdfLote('2026-004', undefined)).toBe('2026-004 - Cliente.pdf');
    expect(normalizarNombrePdfLote('2026-004', '///:::***???')).toBe('2026-004 - Cliente.pdf');
  });

  it('trunca el nombre de cliente a un máximo de 60 caracteres', () => {
    const clienteLargo = 'A'.repeat(80);
    const resultado = normalizarNombrePdfLote('2026-005', clienteLargo);
    expect(resultado).toBe(`2026-005 - ${'A'.repeat(60)}.pdf`);
  });

  it('agrega sufijo correlativo _2, _3 cuando hay colisiones en el set de nombres', () => {
    const nombres = new Set();
    const res1 = normalizarNombrePdfLote('2026-001', 'Estudio García', nombres);
    const res2 = normalizarNombrePdfLote('2026-001', 'Estudio García', nombres);
    const res3 = normalizarNombrePdfLote('2026-001', 'Estudio García', nombres);

    expect(res1).toBe('2026-001 - Estudio García.pdf');
    expect(res2).toBe('2026-001 - Estudio García_2.pdf');
    expect(res3).toBe('2026-001 - Estudio García_3.pdf');
    expect(nombres.has('2026-001 - Estudio García.pdf')).toBe(true);
    expect(nombres.has('2026-001 - Estudio García_2.pdf')).toBe(true);
    expect(nombres.has('2026-001 - Estudio García_3.pdf')).toBe(true);
  });
});
