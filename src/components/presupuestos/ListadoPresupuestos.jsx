import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { formatearMoneda } from '../../utils/moneda.js';
import { formatearFecha, obtenerNombreMes } from '../../utils/fechas.js';
import { calcularTotalesPresupuesto } from '../../domain/calculos.js';
import { 
  exportarTodoZip, 
  dispararDescargaArchivo, 
  obtenerPresupuestosExportables 
} from '../../services/exportacion-zip.js';
import { Alerta } from '../comun/Alerta.jsx';

export function obtenerEstadoPresupuesto(p) {
  const estado = String(p.estado || '').toLowerCase();
  const versionActiva = p.versiones && p.versiones[p.versiones.length - 1];
  const fechaValidez = p.fechaValidez || versionActiva?.fechaValidez;
  const esCaducado = fechaValidez && new Date(fechaValidez) < new Date();

  if (estado === 'borrador') {
    return { key: 'borrador', texto: 'Borrador', badgeClase: 'badge--borrador' };
  }
  if (estado === 'aceptado') {
    return { key: 'aceptado', texto: 'Aceptado', badgeClase: 'badge--aceptado' };
  }
  if (estado === 'rechazado') {
    return { key: 'rechazado', texto: 'Rechazado', badgeClase: 'badge--rechazado' };
  }
  if (estado === 'anulado') {
    return { key: 'rechazado', texto: 'ANULADO', badgeClase: 'badge--rechazado' };
  }
  if (estado === 'caducado' || (esCaducado && (estado === 'emitido' || estado === 'enviado'))) {
    return { key: 'caducado', texto: 'Caducado', badgeClase: 'badge--caducado' };
  }
  if (estado === 'enviado' || estado === 'emitido') {
    return { key: 'enviado', texto: 'Enviado', badgeClase: 'badge--enviado' };
  }
  return { key: 'borrador', texto: 'Borrador', badgeClase: 'badge--borrador' };
}

export function ListadoPresupuestos({ estado, dispatch, navegar }) {
  const presupuestos = estado.presupuestos || [];

  // Estado de exportación ZIP (US1, US2, US3)
  const [estadoExportacion, setEstadoExportacion] = useState('inactivo'); // 'inactivo' | 'generando' | 'comprimiendo'
  const [progresoExportacion, setProgresoExportacion] = useState({ completados: 0, total: 0 });
  const [alertaExportacion, setAlertaExportacion] = useState(null); // null | { tipo, mensaje }

  // Presupuestos oficiales exportables
  const presupuestosExportables = useMemo(() => {
    return obtenerPresupuestosExportables(presupuestos);
  }, [presupuestos]);

  const sinPresupuestosExportables = presupuestosExportables.length === 0;

  const handleExportarTodoZip = async () => {
    if (sinPresupuestosExportables || estadoExportacion !== 'inactivo') return;

    setAlertaExportacion(null);
    setEstadoExportacion('generando');
    setProgresoExportacion({ completados: 0, total: presupuestosExportables.length });

    try {
      const resultado = await exportarTodoZip(estado, ({ fase, completados, total }) => {
        setEstadoExportacion(fase);
        setProgresoExportacion({ completados, total });
      });

      dispararDescargaArchivo(resultado.blob, resultado.nombreArchivo);

      setAlertaExportacion({
        tipo: 'exito',
        mensaje: `Copia de seguridad y ${resultado.totalPdfs} presupuestos descargados con éxito en ${resultado.nombreArchivo}.`
      });

      setTimeout(() => {
        setAlertaExportacion((actual) => (actual?.tipo === 'exito' ? null : actual));
      }, 6000);
    } catch (err) {
      console.error('Error durante la exportación ZIP:', err);
      setAlertaExportacion({
        tipo: 'error',
        mensaje: 'No se pudo completar la exportación del archivo ZIP. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setEstadoExportacion('inactivo');
    }
  };

  let textoBotonExportar = 'Exportar todo (.zip)';
  if (estadoExportacion === 'generando') {
    textoBotonExportar = `Generando (${progresoExportacion.completados}/${progresoExportacion.total})...`;
  } else if (estadoExportacion === 'comprimiendo') {
    textoBotonExportar = 'Comprimiendo ZIP...';
  }

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos' | 'borrador' | 'enviado' | 'aceptado' | 'rechazado' | 'caducado'
  const [filtroAnio, setFiltroAnio] = useState(() => String(new Date().getFullYear()));
  const [filtroMes, setFiltroMes] = useState('todos'); // 'todos' | '1' .. '12'

  // Años disponibles según los presupuestos registrados
  const aniosDisponibles = useMemo(() => {
    const anioActual = new Date().getFullYear();
    const setAnios = new Set([anioActual]);
    presupuestos.forEach(p => {
      if (p.anio) setAnios.add(p.anio);
      if (p.creadoEn) setAnios.add(new Date(p.creadoEn).getFullYear());
    });
    return Array.from(setAnios).sort((a, b) => b - a);
  }, [presupuestos]);

  // Filtrado de presupuestos
  const presupuestosFiltrados = useMemo(() => {
    return presupuestos.filter(p => {
      // Filtro de estado
      if (filtroEstado !== 'todos') {
        const estInfo = obtenerEstadoPresupuesto(p);
        if (estInfo.key !== filtroEstado && p.estado !== filtroEstado) {
          return false;
        }
      }

      // Para año y mes:
      // Si está emitido o anulado, usamos p.anio y p.mesEmision (FR-022)
      // Si es borrador, usamos su fecha de creación
      const anioPresupuesto = p.anio || (p.creadoEn ? new Date(p.creadoEn).getFullYear() : null);
      const mesPresupuesto = p.mesEmision || (p.creadoEn ? (new Date(p.creadoEn).getMonth() + 1) : null);

      if (filtroAnio !== 'todos' && String(anioPresupuesto) !== String(filtroAnio)) {
        return false;
      }

      if (filtroMes !== 'todos' && String(mesPresupuesto) !== String(filtroMes)) {
        return false;
      }

      return true;
    });
  }, [presupuestos, filtroEstado, filtroAnio, filtroMes]);

  // Texto del recuento (US6.7)
  const textoRecuento = useMemo(() => {
    const total = presupuestosFiltrados.length;
    const palabra = total === 1 ? 'presupuesto' : 'presupuestos';

    if (filtroMes !== 'todos' && filtroAnio !== 'todos') {
      const nombreMes = obtenerNombreMes(Number(filtroMes));
      return `${total} ${palabra} en ${nombreMes} de ${filtroAnio}`;
    }
    if (filtroAnio !== 'todos') {
      return `${total} ${palabra} en el año ${filtroAnio}`;
    }
    return `${total} ${palabra} en total`;
  }, [presupuestosFiltrados.length, filtroMes, filtroAnio]);

  // Helper para obtener cliente y total de cualquier presupuesto
  const obtenerInfoFila = (p) => {
    if (p.estado === 'emitido' || p.estado === 'anulado') {
      const ultima = p.versiones && p.versiones.length > 0 
        ? p.versiones[p.versiones.length - 1] 
        : null;
      return {
        numero: p.numero,
        clienteNombre: ultima?.cliente?.nombre || 'Cliente sin nombre',
        fecha: ultima?.emitidaEn || p.creadoEn,
        totalCentimos: ultima?.totales?.totalCentimos ?? 0
      };
    }

    // Es borrador
    const cliente = estado.clientes.find(c => c.id === p.borrador?.clienteId);
    const lineas = p.borrador?.lineas || [];
    const irpf = p.borrador?.irpfPct ?? 15;
    const totales = calcularTotalesPresupuesto(lineas, irpf);

    return {
      numero: 'Borrador',
      clienteNombre: cliente?.nombre || '(Sin cliente seleccionado)',
      fecha: p.creadoEn,
      totalCentimos: totales.totalCentimos
    };
  };

  return (
    <div class="view-container">
      {alertaExportacion && (
        <div style={{ marginBottom: '1rem' }}>
          <Alerta
            tipo={alertaExportacion.tipo}
            onCerrar={() => setAlertaExportacion(null)}
          >
            {alertaExportacion.mensaje}
          </Alerta>
        </div>
      )}

      <div class="view-header">
        <div>
          <h2 class="view-title">Historial de Presupuestos</h2>
          <p class="form-hint">Consulta, edita o emite presupuestos para tus clientes.</p>
        </div>
        <div class="header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            class={`btn btn-secondary ${estadoExportacion !== 'inactivo' ? 'btn--loading' : ''}`}
            id="btn-exportar-todo-zip"
            disabled={sinPresupuestosExportables || estadoExportacion !== 'inactivo'}
            title={sinPresupuestosExportables ? 'No hay presupuestos emitidos para exportar en PDF' : undefined}
            aria-label="Exportar todos los presupuestos emitidos y copia de datos en formato ZIP"
            aria-busy={estadoExportacion !== 'inactivo' ? 'true' : undefined}
            onClick={handleExportarTodoZip}
          >
            {textoBotonExportar}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => navegar('#/presupuesto/nuevo')}
          >
            + Nuevo presupuesto
          </button>
        </div>
      </div>

      {/* Tarjeta de Filtros y Recuento */}
      <div class="card">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div class="form-group" style={{ minWidth: '150px' }}>
              <label class="form-label" style={{ fontSize: '0.75rem' }}>Estado</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="todos">Todos los estados</option>
                <option value="borrador">Solo borradores</option>
                <option value="enviado">Solo enviados</option>
                <option value="aceptado">Solo aceptados</option>
                <option value="rechazado">Solo rechazados</option>
                <option value="caducado">Solo caducados</option>
              </select>
            </div>

            <div class="form-group" style={{ minWidth: '130px' }}>
              <label class="form-label" style={{ fontSize: '0.75rem' }}>Año</label>
              <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)}>
                <option value="todos">Todos los años</option>
                {aniosDisponibles.map(a => (
                  <option key={a} value={String(a)}>{a}</option>
                ))}
              </select>
            </div>

            <div class="form-group" style={{ minWidth: '150px' }}>
              <label class="form-label" style={{ fontSize: '0.75rem' }}>Mes de emisión</label>
              <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
                <option value="todos">Todos los meses</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={String(m)}>{obtenerNombreMes(m)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Banner de recuento visible (FR-022, US6.7) */}
          <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.9rem' }}>
            📊 {textoRecuento}
          </div>
        </div>

        {/* Tabla de presupuestos */}
        <div class="table-container" style={{ marginTop: '0.5rem' }}>
          <table class="table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Número</th>
                <th style={{ width: '32%' }}>Cliente</th>
                <th style={{ width: '15%' }}>Fecha</th>
                <th style={{ textAlign: 'right', width: '15%' }}>Total</th>
                <th style={{ textAlign: 'center', width: '10%' }}>Estado</th>
                <th style={{ textAlign: 'right', width: '10%' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {presupuestosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)' }}>
                    No se encontraron presupuestos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                presupuestosFiltrados.map((p) => {
                  const info = obtenerInfoFila(p);
                  const estadoInfo = obtenerEstadoPresupuesto(p);
                  const esAnulado = p.estado === 'anulado' || p.estado === 'rechazado';
                  const esBorrador = estadoInfo.key === 'borrador';

                  return (
                    <tr
                      key={p.id}
                      style={esAnulado ? { opacity: 0.7, backgroundColor: 'var(--pp-surface-subtle)' } : {}}
                    >
                      <td style={{ fontWeight: '700', color: esBorrador ? 'var(--pp-badge-borrador-text)' : 'inherit' }}>
                        {info.numero}
                        {p.versiones && p.versiones.length > 1 && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--pp-text-muted)', marginLeft: '0.25rem' }}>
                            (v{p.versiones.length})
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: '600' }}>{info.clienteNombre}</span>
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>
                        {formatearFecha(info.fecha)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700' }}>
                        {formatearMoneda(info.totalCentimos)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span class={`badge ${estadoInfo.badgeClase}`}>{estadoInfo.texto}</span>
                      </td>
                      <td>
                        <div class="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                            onClick={() => navegar(`#/presupuesto/${p.id}`)}
                          >
                            {esBorrador ? 'Editar' : 'Ver detalle'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
