import { h } from 'preact';

/**
 * Componente Alerta reutilizable
 * @param {'info'|'warning'|'danger'|'success'} [tipo='info']
 */
export function Alerta({ tipo = 'info', children, icono, onCerrar }) {
  const mapaTipos = {
    exito: 'success',
    error: 'danger',
    info: 'info',
    warning: 'warning',
    danger: 'danger',
    success: 'success'
  };
  const tipoNorm = mapaTipos[tipo] || tipo;

  const iconosPorDefecto = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '⛔',
    success: '✅'
  };

  const ico = icono || iconosPorDefecto[tipoNorm] || 'ℹ️';

  return (
    <div class={`alert alert-${tipoNorm}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{ico}</span>
      <div style={{ flex: 1 }}>{children}</div>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: '0 0.25rem',
            color: 'inherit',
            opacity: 0.7
          }}
          aria-label="Cerrar aviso"
        >
          ×
        </button>
      )}
    </div>
  );
}

