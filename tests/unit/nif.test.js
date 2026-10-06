import { describe, it, expect } from 'vitest';
import { validarIdentificadorFiscal } from '../../src/domain/nif.js';

describe('Validación de identificadores fiscales españoles (src/domain/nif.js)', () => {
  it('valida DNI correcto (12345678Z)', () => {
    const res = validarIdentificadorFiscal('12345678Z');
    expect(res.valido).toBe(true);
    expect(res.tipo).toBe('DNI');
    expect(res.motivo).toBeNull();
  });

  it('detecta letra errónea en DNI (12345678A)', () => {
    const res = validarIdentificadorFiscal('12345678A');
    expect(res.valido).toBe(false);
    expect(res.tipo).toBe('DNI');
    expect(res.motivo).toContain('letra de control no coincide');
  });

  it('valida CIF correcto (B98765431)', () => {
    const res = validarIdentificadorFiscal('B98765431');
    expect(res.valido).toBe(true);
    expect(res.tipo).toBe('CIF');
    expect(res.motivo).toBeNull();
  });

  it('detecta dígito de control erróneo en CIF de la spec (B98765432)', () => {
    const res = validarIdentificadorFiscal('B98765432');
    expect(res.valido).toBe(false);
    expect(res.tipo).toBe('CIF');
    expect(res.motivo).toContain('control no coincide');
  });

  it('valida NIE con letras X, Y, Z', () => {
    // X0000000T (00000000 -> T)
    const resX = validarIdentificadorFiscal('X0000000T');
    expect(resX.valido).toBe(true);
    expect(resX.tipo).toBe('NIE');

    // NIE con letra incorrecta
    const resErr = validarIdentificadorFiscal('X0000000A');
    expect(resErr.valido).toBe(false);
    expect(resErr.tipo).toBe('NIE');
  });

  it('normaliza espacios y guiones', () => {
    const res = validarIdentificadorFiscal(' 12345678 - Z ');
    expect(res.valido).toBe(true);
    expect(res.normalizado).toBe('12345678Z');
  });

  it('admite cadenas vacías como no erróneas (campo opcional)', () => {
    const res = validarIdentificadorFiscal('');
    expect(res.valido).toBe(true);
    expect(res.tipo).toBeNull();
  });
});
