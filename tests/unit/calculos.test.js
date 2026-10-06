import { describe, it, expect } from 'vitest';
import { 
  redondearHalfUp, 
  calcularSubtotalLinea, 
  calcularTotalesPresupuesto 
} from '../../src/domain/calculos.js';

describe('Cálculos fiscales y aritmética de céntimos (D8, spec)', () => {
  describe('redondearHalfUp', () => {
    it('redondea .5 hacia arriba para positivos', () => {
      // 8332.5 -> 8333
      expect(redondearHalfUp(8332.5)).toBe(8333);
      expect(redondearHalfUp(0.5)).toBe(1);
      expect(redondearHalfUp(1.49)).toBe(1);
      expect(redondearHalfUp(1.50)).toBe(2);
    });

    it('redondea simétricamente para negativos', () => {
      expect(redondearHalfUp(-1.50)).toBe(-2);
      expect(redondearHalfUp(-1.49)).toBe(-1);
    });
  });

  describe('calcularSubtotalLinea', () => {
    it('calcula correctamente el caso 2,5 × 33,33 € = 83,33 €', () => {
      // cantidadCentesimas: 250 (2,5), precioCentimos: 3333 (33,33 €)
      const subtotal = calcularSubtotalLinea(250, 3333);
      expect(subtotal).toBe(8333);
    });

    it('calcula líneas exactas enteras', () => {
      expect(calcularSubtotalLinea(100, 45000)).toBe(45000); // 1 * 450 = 450
      expect(calcularSubtotalLinea(1500, 4000)).toBe(60000); // 15 * 40 = 600
    });
  });

  describe('Los 6 casos numéricos de la especificación', () => {
    // Líneas del ejemplo de referencia
    const lineasReferencia = [
      { cantidadCentesimas: 100, precioCentimos: 45000 },  // 450,00 €
      { cantidadCentesimas: 1500, precioCentimos: 4000 },  // 600,00 €
      { cantidadCentesimas: 100, precioCentimos: 15000 }   // 150,00 €
    ];

    it('Caso 1: Ejemplo de referencia - Empresa/Autónomo, IRPF 15 %', () => {
      const totales = calcularTotalesPresupuesto(lineasReferencia, 15);

      expect(totales.baseCentimos).toBe(120000);   // 1.200,00 €
      expect(totales.ivaCentimos).toBe(25200);     // 252,00 €
      expect(totales.irpfCentimos).toBe(18000);    // 180,00 €
      expect(totales.totalCentimos).toBe(127200);   // 1.272,00 €
    });

    it('Caso 2: Ejemplo de referencia - Empresa/Autónomo nuevo autónomo, IRPF 7 %', () => {
      const totales = calcularTotalesPresupuesto(lineasReferencia, 7);

      expect(totales.baseCentimos).toBe(120000);   // 1.200,00 €
      expect(totales.ivaCentimos).toBe(25200);     // 252,00 €
      expect(totales.irpfCentimos).toBe(8400);     // 84,00 €
      expect(totales.totalCentimos).toBe(136800);   // 1.368,00 €
    });

    it('Caso 3: Ejemplo de referencia - Particular, IRPF 0 %', () => {
      const totales = calcularTotalesPresupuesto(lineasReferencia, 0);

      expect(totales.baseCentimos).toBe(120000);   // 1.200,00 €
      expect(totales.ivaCentimos).toBe(25200);     // 252,00 €
      expect(totales.irpfCentimos).toBe(0);        // 0,00 €
      expect(totales.totalCentimos).toBe(145200);   // 1.452,00 €
    });

    it('Caso 4: Ejemplo breve 1 - 1 × 100,00 + 2 × 50,00 (Particular / 0 %)', () => {
      const lineas = [
        { cantidadCentesimas: 100, precioCentimos: 10000 },
        { cantidadCentesimas: 200, precioCentimos: 5000 }
      ];
      const totales = calcularTotalesPresupuesto(lineas, 0);

      expect(totales.baseCentimos).toBe(20000);    // 200,00 €
      expect(totales.ivaCentimos).toBe(4200);      // 42,00 €
      expect(totales.irpfCentimos).toBe(0);        // 0,00 €
      expect(totales.totalCentimos).toBe(24200);    // 242,00 €
    });

    it('Caso 5: Ejemplo breve 2 - Base 1.000,00 € (Empresa / 15 %)', () => {
      const lineas = [
        { cantidadCentesimas: 100, precioCentimos: 100000 }
      ];
      const totales = calcularTotalesPresupuesto(lineas, 15);

      expect(totales.baseCentimos).toBe(100000);   // 1.000,00 €
      expect(totales.ivaCentimos).toBe(21000);     // 210,00 €
      expect(totales.irpfCentimos).toBe(15000);    // 150,00 €
      expect(totales.totalCentimos).toBe(106000);   // 1.060,00 €
    });

    it('Caso 6: Ejemplo breve 3 - Base 1.000,00 € (Empresa / 7 %)', () => {
      const lineas = [
        { cantidadCentesimas: 100, precioCentimos: 100000 }
      ];
      const totales = calcularTotalesPresupuesto(lineas, 7);

      expect(totales.baseCentimos).toBe(100000);   // 1.000,00 €
      expect(totales.ivaCentimos).toBe(21000);     // 210,00 €
      expect(totales.irpfCentimos).toBe(7000);      // 70,00 €
      expect(totales.totalCentimos).toBe(114000);   // 1.140,00 €
    });
  });
});
