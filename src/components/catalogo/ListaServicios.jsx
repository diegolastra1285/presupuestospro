import { h } from 'preact';
import { formatearMoneda } from '../../utils/moneda.js';

/**
 * Listado de conceptos y tarifas del catálogo (FR-013, T024).
 */
export function ListaServicios({ servicios, onEditar, onEliminar }) {
  if (servicios.length === 0) {
    return (
      <div class="empty-state" style={{ margin: '1.5rem 0' }}>
        <span class="empty-state-icon">🏷️</span>
        <p class="empty-state-title">Catálogo sin conceptos</p>
        <p class="empty-state-text">
          Añade tus servicios o tarifas habituales para agilizar la creación de presupuestos.
        </p>
      </div>
    );
  }

  return (
    <div class="table-container" style={{ marginTop: '1rem' }}>
      <table class="table">
        <thead>
          <tr>
            <th style={{ width: '45%' }}>Concepto / Servicio</th>
            <th style={{ width: '20%', textAlign: 'right' }}>Precio Base</th>
            <th style={{ width: '15%', textAlign: 'center' }}>IVA Sugerido</th>
            <th style={{ width: '20%', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s) => (
            <tr key={s.id}>
              <td>
                <span style={{ fontWeight: '600' }}>{s.descripcion}</span>
                {s.mercadoMinCentimos !== null && s.mercadoMaxCentimos !== null && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--pp-text-muted)', marginTop: '0.25rem' }}>
                    Orientativo mercado: {formatearMoneda(s.mercadoMinCentimos)} – {formatearMoneda(s.mercadoMaxCentimos)}
                  </div>
                )}
              </td>
              <td style={{ textAlign: 'right', fontWeight: '700', fontFamily: 'var(--pp-font-mono)' }}>
                {formatearMoneda(s.precioCentimos)}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span class="badge badge--borrador">
                  {s.ivaSugerido || 21}%
                </span>
              </td>
              <td>
                <div class="table-actions" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm touch-target"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                    onClick={() => onEditar(s)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm touch-target"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                    onClick={() => onEliminar(s)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
