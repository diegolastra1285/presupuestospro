import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { obtenerFechaHoyISO, formatearFecha } from '../../utils/fechas.js';
import { guardarEstadoInmediato } from '../../storage/idb.js';
import { Alerta } from '../comun/Alerta.jsx';
import { Modal } from '../comun/Modal.jsx';

export function obtenerNombreArchivoCopia(fechaIso) {
  const f = fechaIso || obtenerFechaHoyISO();
  return `presupuestopro-copia-${f}.json`;
}

export function generarCopiaSeguridadJson(estado) {
  const carga = {
    aplicacion: 'PresupuestoPro',
    formato: 1,
    exportadoEn: new Date().toISOString(),
    datos: estado
  };
  return JSON.stringify(carga, null, 2);
}

export function validarEsquemaCopiaSeguridad(obj) {
  if (!obj || typeof obj !== 'object') {
    return { valido: false, error: 'El archivo seleccionado no contiene un objeto JSON válido.' };
  }

  if (obj.aplicacion !== 'PresupuestoPro') {
    return { valido: false, error: 'Este archivo no es una copia de seguridad de PresupuestoPro.' };
  }

  if (obj.formato !== 1) {
    return { valido: false, error: `Formato de copia desconocido (formato ${obj.formato}). Solo se admite la versión 1.` };
  }

  const datos = obj.datos;
  if (!datos || typeof datos !== 'object') {
    return { valido: false, error: 'La copia está dañada o incompleta: faltan los datos principales.' };
  }

  if (!Array.isArray(datos.clientes) || !Array.isArray(datos.catalogo) || !Array.isArray(datos.presupuestos)) {
    return { valido: false, error: 'La copia está dañada o incompleta: faltan los clientes, el catálogo o los presupuestos.' };
  }

  if (!datos.contadores || typeof datos.contadores !== 'object') {
    return { valido: false, error: 'La copia está dañada o incompleta: faltan los contadores de numeración.' };
  }

  // Comprobar integridad de presupuestos emitidos y anulados
  for (const p of datos.presupuestos) {
    if (p.estado === 'emitido' || p.estado === 'anulado') {
      if (!p.numero || !Array.isArray(p.versiones) || p.versiones.length < 1) {
        return {
          valido: false,
          error: `La copia está dañada o incompleta: los presupuestos emitidos o anulados (${p.numero || p.id}) carecen de número o versiones válidas.`
        };
      }
    }
  }

  // Comprobar coherencia de los contadores de numeración
  for (const p of datos.presupuestos) {
    if (p.anio && p.secuencial) {
      const anioStr = String(p.anio);
      const contadorAnio = datos.contadores[anioStr] ?? 0;
      if (p.secuencial > contadorAnio) {
        return {
          valido: false,
          error: `Los contadores de numeración son incoherentes: para el año ${anioStr} el último emitido (${p.secuencial}) supera el contador guardado (${contadorAnio}).`
        };
      }
    }
  }

  return { valido: true, error: null };
}

export function RespaldoDatos({ estado, dispatch }) {
  const [errorImportacion, setErrorImportacion] = useState('');
  const [exitoMensaje, setExitoMensaje] = useState('');
  const [copiaPendiente, setCopiaPendiente] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const fileInputRef = useRef(null);

  // Exportar archivo JSON
  const handleExportar = () => {
    setErrorImportacion('');
    setExitoMensaje('');
    try {
      const jsonStr = generarCopiaSeguridadJson(estado);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const nombreArchivo = obtenerNombreArchivoCopia();

      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExitoMensaje(`Copia de seguridad descargada: ${nombreArchivo}`);
      setTimeout(() => setExitoMensaje(''), 4000);
    } catch (err) {
      console.error('Error al exportar copia de seguridad:', err);
      setErrorImportacion('No se pudo generar el archivo de copia de seguridad.');
    }
  };

  // Seleccionar e iniciar importación
  const handleSeleccionarArchivo = (e) => {
    setErrorImportacion('');
    setExitoMensaje('');
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      try {
        const contenido = JSON.parse(evento.target.result);
        const validacion = validarEsquemaCopiaSeguridad(contenido);

        if (!validacion.valido) {
          setErrorImportacion(validacion.error);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Es válida, pedir confirmación mostrando fecha de exportación
        setCopiaPendiente(contenido);
        setModalConfirmacionAbierto(true);
      } catch (err) {
        setErrorImportacion('El archivo seleccionado no es un formato JSON válido o está corrupto.');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    lector.onerror = () => {
      setErrorImportacion('Error al leer el archivo desde el dispositivo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    lector.readAsText(archivo);
  };

  // Confirmar y aplicar reemplazo total de estado
  const handleConfirmarImportacion = async () => {
    if (!copiaPendiente || !copiaPendiente.datos) return;

    try {
      const nuevosDatos = copiaPendiente.datos;
      // Reemplazo atómico en IndexedDB
      await guardarEstadoInmediato(nuevosDatos);
      // Actualizar estado en memoria
      dispatch({
        tipo: 'REEMPLAZAR_ESTADO_COMPLETO',
        payload: nuevosDatos
      });

      const numClientes = nuevosDatos.clientes?.length || 0;
      const numPresupuestos = nuevosDatos.presupuestos?.length || 0;
      const numCatalogo = nuevosDatos.catalogo?.length || 0;

      setExitoMensaje(`Copia restaurada con éxito: ${numClientes} clientes, ${numPresupuestos} presupuestos y ${numCatalogo} servicios del catálogo.`);
      setModalConfirmacionAbierto(false);
      setCopiaPendiente(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error al restaurar copia de seguridad:', err);
      setErrorImportacion('Se produjo un error al guardar los datos restaurados en el almacenamiento local.');
    }
  };

  const fechaCopiaFormateada = copiaPendiente?.exportadoEn 
    ? formatearFecha(copiaPendiente.exportadoEn) 
    : 'fecha desconocida';

  return (
    <div class="card" style={{ marginTop: '1.5rem' }}>
      <h3 class="card-title">Copia de Seguridad Local</h3>
      <p class="form-hint" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        Tus datos solo están en este dispositivo. Exporta una copia de vez en cuando y guárdala en un lugar seguro (pendrive, disco o correo) para no perderla si borras los datos del navegador o cambias de equipo.
      </p>

      {errorImportacion && (
        <Alerta tipo="danger" icono="⛔">
          {errorImportacion}
        </Alerta>
      )}

      {exitoMensaje && (
        <Alerta tipo="success" icono="✅">
          {exitoMensaje}
        </Alerta>
      )}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button
          type="button"
          class="btn btn-secondary touch-target"
          onClick={handleExportar}
        >
          ⬇️ Exportar copia (.json)
        </button>

        <label class="btn btn-secondary touch-target" style={{ cursor: 'pointer', margin: 0 }}>
          ⬆️ Importar copia
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleSeleccionarArchivo}
          />
        </label>
      </div>

      {/* Modal de confirmación para sustitución total */}
      <Modal
        abierto={modalConfirmacionAbierto}
        titulo="¿Restaurar copia de seguridad?"
        onClose={() => {
          setModalConfirmacionAbierto(false);
          setCopiaPendiente(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        acciones={
          <>
            <button
              class="btn btn-secondary"
              onClick={() => {
                setModalConfirmacionAbierto(false);
                setCopiaPendiente(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Cancelar
            </button>
            <button
              class="btn btn-danger"
              onClick={handleConfirmarImportacion}
            >
              Sí, sustituir todos mis datos
            </button>
          </>
        }
      >
        <p style={{ lineHeight: '1.5' }}>
          Se sustituirán todos tus datos actuales (perfil, catálogo, clientes y presupuestos) por los de la copia del <strong>{fechaCopiaFormateada}</strong>. Esta acción no se puede deshacer. ¿Continuar?
        </p>
      </Modal>
    </div>
  );
}
