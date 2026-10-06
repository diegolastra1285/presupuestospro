import { describe, it, expect } from 'vitest';
import { formatearNumeroPresupuesto, asignarSiguienteNumero } from '../../src/domain/numeracion.js';

describe('Numeración de presupuestos (PRE-{YYYY}-{NNNN})', () => {
  it('formatea correctamente números de 4 dígitos con ceros a la izquierda', () => {
    expect(formatearNumeroPresupuesto(2026, 1)).toBe('PRE-2026-0001');
    expect(formatearNumeroPresupuesto(2026, 42)).toBe('PRE-2026-0042');
    expect(formatearNumeroPresupuesto(2026, 187)).toBe('PRE-2026-0187');
    expect(formatearNumeroPresupuesto(2026, 9999)).toBe('PRE-2026-9999');
  });

  it('permite más de 9999 presupuestos en un año sin truncar dígitos', () => {
    expect(formatearNumeroPresupuesto(2026, 10000)).toBe('PRE-2026-10000');
    expect(formatearNumeroPresupuesto(2026, 123456)).toBe('PRE-2026-123456');
  });

  it('incrementa correlativamente el secuencial a partir de un contador existente', () => {
    const contadores = { '2026': 41 };
    const resultado = asignarSiguienteNumero(contadores, 2026);

    expect(resultado.numero).toBe('PRE-2026-0042');
    expect(resultado.secuencial).toBe(42);
    expect(resultado.anio).toBe(2026);
    expect(resultado.nuevosContadores['2026']).toBe(42);
    // Inmutabilidad del objeto original
    expect(contadores['2026']).toBe(41);
  });

  it('reinicia a 0001 con el cambio de año (rollover anual)', () => {
    const contadores = { '2026': 187 };
    const resultado2027 = asignarSiguienteNumero(contadores, 2027);

    expect(resultado2027.numero).toBe('PRE-2027-0001');
    expect(resultado2027.secuencial).toBe(1);
    expect(resultado2027.anio).toBe(2027);
    expect(resultado2027.nuevosContadores['2026']).toBe(187);
    expect(resultado2027.nuevosContadores['2027']).toBe(1);
  });

  it('inicializa en 0001 si el contador está vacío o no contiene el año', () => {
    const resultado = asignarSiguienteNumero({}, 2026);
    expect(resultado.numero).toBe('PRE-2026-0001');
    expect(resultado.secuencial).toBe(1);
    expect(resultado.nuevosContadores['2026']).toBe(1);
  });
});
