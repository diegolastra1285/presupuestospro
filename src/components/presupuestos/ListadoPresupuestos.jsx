import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { calcularTotalesPresupuesto } from '../../domain/calculos.js';
import { 
  exportarTodoZip, 
  dispararDescargaArchivo, 
  obtenerPresupuestosExportables 
} from '../../services/exportacion-zip.js';
import { Alerta } from '../comun/Alerta.jsx';
import { CabeceraAcciones } from './CabeceraAcciones.jsx';
import { FiltroEstados } from './FiltroEstados.jsx';
import { TablaPresupuestos } from './TablaPresupuestos.jsx';
import { obtenerNombreMes } from '../../utils/fechas.js';

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
    return { key: 'rechazado', texto: 'Rechazado', badgeClase: 'badge--rechazado' };
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
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroAnio, setFiltroAnio] = useState(() => String(new Date().getFullYear()));
  const [filtroMes, setFiltroMes] = useState('todos');

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

  // Texto del recuento
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

      {/* Cabecera de acciones (FR-007, T017) */}
      <CabeceraAcciones
        navegar={navegar}
        onExportarZip={handleExportarTodoZip}
        deshabilitarExportar={sinPresupuestosExportables || estadoExportacion !== 'inactivo'}
        textoBotonExportar={textoBotonExportar}
        estadoExportacion={estadoExportacion}
      />

      {/* Tarjeta de Filtros (FR-007, T019) */}
      <FiltroEstados
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroAnio={filtroAnio}
        setFiltroAnio={setFiltroAnio}
        filtroMes={filtroMes}
        setFiltroMes={setFiltroMes}
        aniosDisponibles={aniosDisponibles}
        textoRecuento={textoRecuento}
      />

      {/* Tabla y Tarjetas Responsivas (FR-008, T020) */}
      <TablaPresupuestos
        presupuestos={presupuestosFiltrados}
        obtenerInfoFila={obtenerInfoFila}
        obtenerEstadoPresupuesto={obtenerEstadoPresupuesto}
        navegar={navegar}
      />
    </div>
  );
}
