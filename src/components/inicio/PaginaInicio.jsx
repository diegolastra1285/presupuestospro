import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { ResumenMetricas } from './ResumenMetricas.jsx';
import { AccesosRapidos } from './AccesosRapidos.jsx';
import { ListadoRecientes } from './ListadoRecientes.jsx';

/**
 * Calcula en memoria el resumen cuantitativo de presupuestos por estado.
 * Fuente: specs/002-redisenio-visual-inicio/data-model.md (ResumenActividad)
 */
export function calcularResumenActividad(presupuestos = []) {
  const hoy = new Date();
  let borradores = 0;
  let enviados = 0;
  let aceptados = 0;
  let rechazados = 0;
  let caducados = 0;

  presupuestos.forEach((p) => {
    const estado = String(p.estado || '').toLowerCase();
    const versionActiva = p.versiones && p.versiones[p.versiones.length - 1];
    const fechaValidez = p.fechaValidez || versionActiva?.fechaValidez;
    const esCaducado = fechaValidez && new Date(fechaValidez) < hoy;

    if (estado === 'borrador') {
      borradores++;
    } else if (estado === 'aceptado') {
      aceptados++;
    } else if (estado === 'rechazado' || estado === 'anulado') {
      rechazados++;
    } else if (estado === 'caducado' || (esCaducado && (estado === 'emitido' || estado === 'enviado'))) {
      caducados++;
    } else if (estado === 'enviado' || estado === 'emitido') {
      enviados++;
    } else {
      borradores++;
    }
  });

  return {
    total: presupuestos.length,
    borradores,
    enviados,
    aceptados,
    rechazados,
    caducados
  };
}

/**
 * Componente principal de la Página de Inicio (Dashboard) (FR-001 - FR-004, US1).
 */
export function PaginaInicio({ estado, dispatch, navegar }) {
  const presupuestos = estado?.presupuestos || [];
  const clientes = estado?.clientes || [];
  const resumen = useMemo(() => calcularResumenActividad(presupuestos), [presupuestos]);
  const nombreUsuario = estado?.perfil?.nombre ? ` de ${estado.perfil.nombre}` : '';

  return (
    <div class="view-container">
      {/* Bloque A: Cabecera de bienvenida y acción rápida */}
      <div class="view-header">
        <div>
          <h1 class="page-title" style={{ marginBottom: '0.25rem' }}>
            Panel de Actividad
          </h1>
          <p class="text-muted">
            Bienvenido al panel principal{nombreUsuario}. Consulta el estado de tus propuestas y accede a las herramientas de trabajo.
          </p>
        </div>
        <div>
          <button
            type="button"
            class="btn btn-primary touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
            onClick={() => navegar('#/presupuesto/nuevo')}
          >
            + Nuevo Presupuesto
          </button>
        </div>
      </div>

      {/* Bloque B: Resumen de actividad de presupuestos */}
      <section aria-labelledby="resumen-actividad-titulo">
        <h2 id="resumen-actividad-titulo" class="section-title">
          Resumen de Presupuestos
        </h2>
        <ResumenMetricas resumen={resumen} navegar={navegar} />
      </section>

      {/* Bloque C: Accesos directos a las cuatro secciones clave */}
      <section aria-labelledby="accesos-directos-titulo" style={{ marginTop: '2rem' }}>
        <h2 id="accesos-directos-titulo" class="section-title">
          Acceso Rápido a Secciones
        </h2>
        <AccesosRapidos navegar={navegar} />
      </section>

      {/* Bloque D: Actividad reciente */}
      {presupuestos.length > 0 && (
        <ListadoRecientes 
          presupuestos={presupuestos} 
          clientes={clientes} 
          navegar={navegar} 
        />
      )}
    </div>
  );
}
