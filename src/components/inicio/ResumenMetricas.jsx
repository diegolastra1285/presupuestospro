import { h } from 'preact';

/**
 * Resumen cuantitativo de actividad en tarjetas métricas (FR-002).
 */
export function ResumenMetricas({ resumen, navegar }) {
  if (resumen.total === 0) {
    return (
      <div class="empty-state">
        <span class="empty-state-icon">📋</span>
        <p class="empty-state-title">Aún no tienes presupuestos registrados</p>
        <p class="empty-state-text">
          Crea tu primera propuesta comercial para comenzar a registrar tu actividad y emitir presupuestos en PDF.
        </p>
        <button
          type="button"
          class="btn btn-primary touch-target"
          style={{ minHeight: '44px', minWidth: '44px' }}
          onClick={() => navegar('#/presupuesto/nuevo')}
        >
          Crear primer presupuesto
        </button>
      </div>
    );
  }

  const items = [
    {
      titulo: 'Total',
      valor: resumen.total,
      icono: '📑',
      desc: 'Presupuestos registrados',
      badgeClass: null,
      badgeText: null
    },
    {
      titulo: 'Borradores',
      valor: resumen.borradores,
      icono: null,
      desc: 'En preparación o edición',
      badgeClass: 'badge badge--borrador',
      badgeText: 'Borrador'
    },
    {
      titulo: 'Enviados',
      valor: resumen.enviados,
      icono: null,
      desc: 'Pendientes de respuesta',
      badgeClass: 'badge badge--enviado',
      badgeText: 'Enviado'
    },
    {
      titulo: 'Aceptados',
      valor: resumen.aceptados,
      icono: null,
      desc: 'Propuestas aprobadas',
      badgeClass: 'badge badge--aceptado',
      badgeText: 'Aceptado'
    },
    {
      titulo: 'Rechazados',
      valor: resumen.rechazados,
      icono: null,
      desc: 'Propuestas desestimadas',
      badgeClass: 'badge badge--rechazado',
      badgeText: 'Rechazado'
    },
    {
      titulo: 'Caducados',
      valor: resumen.caducados,
      icono: null,
      desc: 'Plazo de validez vencido',
      badgeClass: 'badge badge--caducado',
      badgeText: 'Caducado'
    }
  ];

  return (
    <div class="metric-grid">
      {items.map((item, idx) => (
        <div
          key={idx}
          class="metric-card"
          role="button"
          tabIndex={0}
          onClick={() => navegar('#/presupuestos')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegar('#/presupuestos'); }}
          title={`Ver presupuestos - ${item.titulo}`}
        >
          <div class="metric-card-header">
            <span class="metric-card-title">{item.titulo}</span>
            {item.icono && <span style={{ fontSize: '1.25rem' }}>{item.icono}</span>}
            {item.badgeClass && <span class={item.badgeClass}>{item.badgeText}</span>}
          </div>
          <div class="metric-card-value">{item.valor}</div>
          <div class="metric-card-footer">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}
