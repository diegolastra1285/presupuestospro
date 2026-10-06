/**
 * Validación de identificadores fiscales españoles (DNI, NIE, CIF).
 * Devuelve { valido: boolean, tipo: string | null, motivo: string | null }.
 * Según la especificación, los fallos son avisos no bloqueantes.
 */

const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';
const LETRAS_CIF = 'JABCDEFGHI';

/**
 * Normaliza y valida un NIF/NIE/CIF español.
 * @param {string} valor
 * @returns {{ valido: boolean, tipo: string | null, motivo: string | null, normalizado: string }}
 */
export function validarIdentificadorFiscal(valor) {
  if (!valor || typeof valor !== 'string') {
    return { valido: true, tipo: null, motivo: null, normalizado: '' };
  }

  const limpio = valor.trim().toUpperCase().replace(/[\s-]/g, '');
  if (!limpio) {
    return { valido: true, tipo: null, motivo: null, normalizado: '' };
  }

  // 1. Comprobar DNI (8 dígitos + letra)
  const dniMatch = limpio.match(/^(\d{8})([A-Z])$/);
  if (dniMatch) {
    const numero = parseInt(dniMatch[1], 10);
    const letraEsperada = LETRAS_DNI[numero % 23];
    const letraDada = dniMatch[2];
    if (letraDada === letraEsperada) {
      return { valido: true, tipo: 'DNI', motivo: null, normalizado: limpio };
    } else {
      return {
        valido: false,
        tipo: 'DNI',
        motivo: `La letra de control no coincide (esperada: ${letraEsperada})`,
        normalizado: limpio
      };
    }
  }

  // 2. Comprobar NIE (X, Y o Z + 7 dígitos + letra)
  const nieMatch = limpio.match(/^([XYZ])(\d{7})([A-Z])$/);
  if (nieMatch) {
    const prefijoLetra = nieMatch[1];
    let prefijoNum = '0';
    if (prefijoLetra === 'Y') prefijoNum = '1';
    else if (prefijoLetra === 'Z') prefijoNum = '2';

    const numero = parseInt(prefijoNum + nieMatch[2], 10);
    const letraEsperada = LETRAS_DNI[numero % 23];
    const letraDada = nieMatch[3];
    if (letraDada === letraEsperada) {
      return { valido: true, tipo: 'NIE', motivo: null, normalizado: limpio };
    } else {
      return {
        valido: false,
        tipo: 'NIE',
        motivo: `La letra de control no coincide (esperada: ${letraEsperada})`,
        normalizado: limpio
      };
    }
  }

  // 3. Comprobar CIF (Letra + 7 dígitos + control número o letra)
  const cifMatch = limpio.match(/^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/);
  if (cifMatch) {
    const letraTipo = cifMatch[1];
    const digitos = cifMatch[2];
    const controlDado = cifMatch[3];

    // Algoritmo CIF
    let sumaPares = 0;
    let sumaImpares = 0;

    for (let i = 0; i < 7; i++) {
      const d = parseInt(digitos[i], 10);
      if (i % 2 === 1) {
        // Posiciones pares (0-indexed 1, 3, 5 -> dígitos 2, 4, 6)
        sumaPares += d;
      } else {
        // Posiciones impares (0-indexed 0, 2, 4, 6 -> dígitos 1, 3, 5, 7)
        const mult = d * 2;
        sumaImpares += Math.floor(mult / 10) + (mult % 10);
      }
    }

    const sumaTotal = sumaPares + sumaImpares;
    const unidades = sumaTotal % 10;
    const digitoControl = (10 - unidades) % 10;
    const letraControl = LETRAS_CIF[digitoControl];

    // Tipos de CIF que requieren solo letra: P, Q, S, R, W, N
    const soloLetra = ['P', 'Q', 'S', 'R', 'W', 'N'].includes(letraTipo);
    // Tipos de CIF que requieren solo número: A, B, E, H
    const soloNumero = ['A', 'B', 'E', 'H'].includes(letraTipo);

    let coincide = false;
    if (soloLetra) {
      coincide = controlDado === letraControl;
    } else if (soloNumero) {
      coincide = controlDado === String(digitoControl);
    } else {
      // Admite tanto número como letra
      coincide = controlDado === String(digitoControl) || controlDado === letraControl;
    }

    if (coincide) {
      return { valido: true, tipo: 'CIF', motivo: null, normalizado: limpio };
    } else {
      return {
        valido: false,
        tipo: 'CIF',
        motivo: `El dígito o letra de control no coincide`,
        normalizado: limpio
      };
    }
  }

  return {
    valido: false,
    tipo: 'Desconocido',
    motivo: 'Formato no reconocido para DNI, NIE o CIF español',
    normalizado: limpio
  };
}
