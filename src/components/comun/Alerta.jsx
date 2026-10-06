import { h } from 'preact';

/**
 * Componente Alerta reutilizable
 * @param {'info'|'warning'|'danger'|'success'} [tipo='info']
 */
export function Alerta({ tipo = 'info', children, icono }) {
  const iconosPorDefecto = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '⛔',
    success: '✅'
  };

  const ico = icono || iconosPorDefecto[tipo] || 'ℹ️';

  return (
    <div class={`alert alert-${tipo}`}>
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{ico}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
