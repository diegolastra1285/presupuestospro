import { h } from 'preact';
import { formatearMoneda } from '../../utils/moneda.js';
import { formatearFecha } from '../../utils/fechas.js';
import { BadgeEstado } from '../comun/BadgeEstado.jsx';

/**
 * Tabla de presupuestos adaptativa: tabla clásica en escritorio y tarjetas táctiles en móvil (FR-008, T020).
 */
export function TablaPresupuestos({ presupuestos, obtenerInfoFila, obtenerEstadoPresupuesto, navegar }) {
  if (presupuestos.length === 0) {
    return (
      <div class="empty-state" style={{ margin: '1rem 0' }}>
        <span class="empty-state-icon">🔍</span>
        <p class="empty-state-title">No se encontraron presupuestos</p>
        <p class="empty-state-text">
          No hay presupuestos que coincidan con los filtros seleccionados o aún no has creado ninguno.
        </p>
      </div>
    );
  }

  return (
    <div class="presupuestos-list-container">
      {/* VISTA ESCRITORIO: TABLA (>= 768px) */}
      <div class="table-container desktop-table-view">
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
            {presupuestos.map((p) => {
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
                  <td style={{ textAlign: 'right', fontWeight: '700', fontFamily: 'var(--pp-font-mono)' }}>
                    {formatearMoneda(info.totalCentimos)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <BadgeEstado estado={p.estado} fechaValidez={p.fechaValidez} />
                  </td>
                  <td>
                    <div class="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm touch-target"
                        style={{ minHeight: '44px', minWidth: '44px' }}
                        onClick={() => navegar(`#/presupuesto/${p.id}`)}
                      >
                        {esBorrador ? 'Editar' : 'Ver'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VISTA MÓVIL: TARJETAS TÁCTILES (< 768px) */}
      <div class="mobile-cards-view" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem' }}>
        {presupuestos.map((p) => {
          const info = obtenerInfoFila(p);
          const estadoInfo = obtenerEstadoPresupuesto(p);
          const esBorrador = estadoInfo.key === 'borrador';

          return (
            <div 
              key={p.id}
              class="card mobile-budget-card" 
              style={{ padding: '1rem', borderLeft: '4px solid var(--pp-primary)', gap: '0.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '1rem', color: esBorrador ? 'var(--pp-badge-borrador-text)' : 'var(--pp-primary)' }}>
                  {info.numero}
                </span>
                <BadgeEstado estado={p.estado} fechaValidez={p.fechaValidez} />
              </div>

              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                {info.clienteNombre}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--pp-text-muted)' }}>
                  {formatearFecha(info.fecha)}
                </span>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', fontFamily: 'var(--pp-font-mono)', color: 'var(--pp-text)' }}>
                  {formatearMoneda(info.totalCentimos)}
                </span>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm touch-target"
                  style={{ minHeight: '44px', width: '100%' }}
                  onClick={() => navegar(`#/presupuesto/${p.id}`)}
                >
                  {esBorrador ? '✏️ Continuar editando' : '📄 Ver detalle del presupuesto'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
