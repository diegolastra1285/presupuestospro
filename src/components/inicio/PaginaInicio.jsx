import { h } from 'preact';
import { useMemo } from 'preact/hooks';

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
 * Componente principal de la Página de Inicio (Index / Cuadro de Mando).
 * Fuente: specs/002-redisenio-visual-inicio/contracts/contrato-navegacion-inicio.md
 */
export function PaginaInicio({ estado, dispatch, navegar }) {
  const presupuestos = estado?.presupuestos || [];
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
            class="btn btn-primary"
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

        {resumen.total === 0 ? (
          <div class="empty-state">
            <span class="empty-state-icon">📋</span>
            <p class="empty-state-title">Aún no tienes presupuestos registrados</p>
            <p class="empty-state-text">
              Crea tu primera propuesta comercial para comenzar a registrar tu actividad y emitir presupuestos en PDF.
            </p>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => navegar('#/presupuesto/nuevo')}
            >
              Crear primer presupuesto
            </button>
          </div>
        ) : (
          <div class="metric-grid">
            {/* Total general */}
            <div
              class="metric-card"
              role="button"
              tabIndex={0}
              onClick={() => navegar('#/presupuestos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
              title="Ver todos los presupuestos"
            >
              <div class="metric-card-header">
                <span class="metric-card-title">Total</span>
                <span style={{ fontSize: '1.25rem' }}>📑</span>
              </div>
              <div class="metric-card-value">{resumen.total}</div>
              <div class="metric-card-footer">Presupuestos registrados</div>
            </div>

            {/* Borradores */}
            <div
              class="metric-card"
              role="button"
              tabIndex={0}
              onClick={() => navegar('#/presupuestos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
              title="Ver presupuestos en borrador"
            >
              <div class="metric-card-header">
                <span class="metric-card-title">Borradores</span>
                <span class="badge badge--borrador">Borrador</span>
              </div>
              <div class="metric-card-value">{resumen.borradores}</div>
              <div class="metric-card-footer">En preparación o edición</div>
            </div>

            {/* Enviados */}
            <div
              class="metric-card"
              role="button"
              tabIndex={0}
              onClick={() => navegar('#/presupuestos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
              title="Ver presupuestos enviados"
            >
              <div class="metric-card-header">
                <span class="metric-card-title">Enviados</span>
                <span class="badge badge--enviado">Enviado</span>
              </div>
              <div class="metric-card-value">{resumen.enviados}</div>
              <div class="metric-card-footer">Pendientes de respuesta</div>
            </div>

            {/* Aceptados */}
            <div
              class="metric-card"
              role="button"
              tabIndex={0}
              onClick={() => navegar('#/presupuestos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
              title="Ver presupuestos aceptados"
            >
              <div class="metric-card-header">
                <span class="metric-card-title">Aceptados</span>
                <span class="badge badge--aceptado">Aceptado</span>
              </div>
              <div class="metric-card-value">{resumen.aceptados}</div>
              <div class="metric-card-footer">Propuestas aprobadas</div>
            </div>

            {/* Rechazados */}
            <div
              class="metric-card"
              role="button"
              tabIndex={0}
              onClick={() => navegar('#/presupuestos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
              title="Ver presupuestos rechazados"
            >
              <div class="metric-card-header">
                <span class="metric-card-title">Rechazados</span>
                <span class="badge badge--rechazado">Rechazado</span>
              </div>
              <div class="metric-card-value">{resumen.rechazados}</div>
              <div class="metric-card-footer">Propuestas desestimadas</div>
            </div>

            {/* Caducados */}
            <div
              class="metric-card"
              role="button"
              tabIndex={0}
              onClick={() => navegar('#/presupuestos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
              title="Ver presupuestos caducados"
            >
              <div class="metric-card-header">
                <span class="metric-card-title">Caducados</span>
                <span class="badge badge--caducado">Caducado</span>
              </div>
              <div class="metric-card-value">{resumen.caducados}</div>
              <div class="metric-card-footer">Plazo de validez vencido</div>
            </div>
          </div>
        )}
      </section>

      {/* Bloque C: Accesos directos a las cuatro secciones clave */}
      <section aria-labelledby="accesos-directos-titulo">
        <h2 id="accesos-directos-titulo" class="section-title">
          Acceso Rápido a Secciones
        </h2>
        <div class="nav-shortcut-grid">
          <a href="#/presupuestos" class="nav-shortcut-card">
            <span class="nav-shortcut-icon">📄</span>
            <div class="nav-shortcut-title">Presupuestos</div>
            <div class="nav-shortcut-desc">
              Ver el listado completo, filtrar por mes/año y crear o clonar presupuestos.
            </div>
          </a>

          <a href="#/clientes" class="nav-shortcut-card">
            <span class="nav-shortcut-icon">👥</span>
            <div class="nav-shortcut-title">Clientes</div>
            <div class="nav-shortcut-desc">
              Gestionar la cartera de clientes, datos fiscales (NIF/CIF) y direcciones de facturación.
            </div>
          </a>

          <a href="#/catalogo" class="nav-shortcut-card">
            <span class="nav-shortcut-icon">🏷️</span>
            <div class="nav-shortcut-title">Catálogo</div>
            <div class="nav-shortcut-desc">
              Administrar servicios y tarifas con referencias de precios del mercado español.
            </div>
          </a>

          <a href="#/perfil" class="nav-shortcut-card">
            <span class="nav-shortcut-icon">⚙️</span>
            <div class="nav-shortcut-title">Perfil</div>
            <div class="nav-shortcut-desc">
              Configurar tus datos fiscales de emisor, condiciones y gestionar copias de seguridad.
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
