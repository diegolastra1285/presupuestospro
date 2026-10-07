import { h } from 'preact';

/**
 * Cabecera de acciones destacadas para el listado de presupuestos (FR-007, T017).
 * Botones para Nuevo Presupuesto y Exportar todo (.zip).
 */
export function CabeceraAcciones({
  navegar,
  onExportarZip,
  deshabilitarExportar,
  textoBotonExportar,
  estadoExportacion
}) {
  return (
    <div class="view-header">
      <div>
        <h2 class="view-title">Historial de Presupuestos</h2>
        <p class="form-hint">Consulta, edita o emite presupuestos para tus clientes.</p>
      </div>
      <div class="header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          class={`btn btn-secondary touch-target ${estadoExportacion !== 'inactivo' ? 'btn--loading' : ''}`}
          id="btn-exportar-todo-zip"
          disabled={deshabilitarExportar}
          title={deshabilitarExportar ? 'No hay presupuestos emitidos para exportar en PDF' : undefined}
          aria-label="Exportar todos los presupuestos emitidos y copia de datos en formato ZIP"
          aria-busy={estadoExportacion !== 'inactivo' ? 'true' : undefined}
          onClick={onExportarZip}
          style={{ minHeight: '44px' }}
        >
          {textoBotonExportar}
        </button>
        <button
          type="button"
          class="btn btn-primary touch-target"
          onClick={() => navegar('#/presupuesto/nuevo')}
          style={{ minHeight: '44px' }}
        >
          + Nuevo Presupuesto
        </button>
      </div>
    </div>
  );
}
