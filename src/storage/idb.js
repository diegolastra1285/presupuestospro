import { get, set, update } from 'idb-keyval';
import { crearEstadoVacio } from '../domain/estado-inicial.js';

const STORAGE_KEY = 'presupuestopro:estado';
const CHANNEL_NAME = 'presupuestopro:sync';

let canalSync = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    canalSync = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel no disponible:', e);
  }
}

/**
 * Solicita almacenamiento persistente en el navegador si está soportado
 */
export async function solicitarAlmacenamientoPersistente() {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const persistido = await navigator.storage.persist();
      return persistido;
    } catch (e) {
      console.warn('Error al solicitar persistencia de almacenamiento:', e);
    }
  }
  return false;
}

/**
 * Carga el estado guardado desde IndexedDB.
 * Si no existe, inicializa con el estado vacío.
 * @returns {Promise<object>}
 */
export async function cargarEstado() {
  try {
    const datos = await get(STORAGE_KEY);
    if (datos && typeof datos === 'object' && datos.versionEsquema === 1) {
      return datos;
    }
  } catch (err) {
    console.error('Error al cargar estado desde IndexedDB:', err);
  }
  return crearEstadoVacio();
}

/**
 * Guarda inmediatamente el estado en IndexedDB y notifica a otras pestañas
 * @param {object} nuevoEstado
 * @returns {Promise<void>}
 */
export async function guardarEstadoInmediato(nuevoEstado) {
  try {
    await set(STORAGE_KEY, nuevoEstado);
    if (canalSync) {
      canalSync.postMessage({ tipo: 'ESTADO_ACTUALIZADO', timestamp: Date.now() });
    }
  } catch (err) {
    console.error('Error al guardar estado en IndexedDB:', err);
  }
}

/**
 * Función debounce para autoguardado diferido (~300ms)
 */
let temporizadorAutoguardado = null;

export function autoguardarEstado(nuevoEstado, retrasoMs = 300) {
  if (temporizadorAutoguardado) {
    clearTimeout(temporizadorAutoguardado);
  }
  return new Promise((resolve) => {
    temporizadorAutoguardado = setTimeout(async () => {
      await guardarEstadoInmediato(nuevoEstado);
      resolve();
    }, retrasoMs);
  });
}

/**
 * Actualiza atómicamente el estado mediante una función de transformación (update de idb-keyval)
 * @param {function(object): object} fnTransformacion
 * @returns {Promise<object>} Estado resultante
 */
export async function actualizarEstadoAtomico(fnTransformacion) {
  let resultadoFinal = null;
  await update(STORAGE_KEY, (estadoActual) => {
    const estadoBase = (estadoActual && estadoActual.versionEsquema === 1) 
      ? estadoActual 
      : crearEstadoVacio();
    resultadoFinal = fnTransformacion(estadoBase);
    return resultadoFinal;
  });

  if (canalSync) {
    canalSync.postMessage({ tipo: 'ESTADO_ACTUALIZADO', timestamp: Date.now() });
  }

  return resultadoFinal;
}

/**
 * Suscribe un listener a cambios ocurridos en otras pestañas
 * @param {function()} callback
 * @returns {function()} Desuscribir
 */
export function suscribirSincronizacion(callback) {
  if (!canalSync) return () => {};
  const handler = (evento) => {
    if (evento.data && evento.data.tipo === 'ESTADO_ACTUALIZADO') {
      callback();
    }
  };
  canalSync.addEventListener('message', handler);
  return () => {
    canalSync.removeEventListener('message', handler);
  };
}
