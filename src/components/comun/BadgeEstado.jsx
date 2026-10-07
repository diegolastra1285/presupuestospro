import { h } from 'preact';

/**
 * Distintivo visual semántico para estados de presupuesto (FR-016).
 * Valores: borrador, enviado, aceptado, rechazado, caducado.
 */
export function BadgeEstado({ estado, fechaValidez }) {
  const normalizado = String(estado || 'borrador').toLowerCase();
  const hoy = new Date();
  
  // Detección de caducidad si está enviado o emitido con validez vencida
  const esCaducado = fechaValidez && new Date(fechaValidez) < hoy;
  
  let clase = 'badge--borrador';
  let texto = 'Borrador';

  if (normalizado === 'aceptado') {
    clase = 'badge--aceptado';
    texto = 'Aceptado';
  } else if (normalizado === 'rechazado' || normalizado === 'anulado') {
    clase = 'badge--rechazado';
    texto = normalizado === 'anulado' ? 'Rechazado' : 'Rechazado';
  } else if (normalizado === 'caducado' || (esCaducado && (normalizado === 'enviado' || normalizado === 'emitido'))) {
    clase = 'badge--caducado';
    texto = 'Caducado';
  } else if (normalizado === 'enviado' || normalizado === 'emitido') {
    clase = 'badge--enviado';
    texto = 'Enviado';
  }

  return (
    <span class={`badge ${clase}`}>
      {texto}
    </span>
  );
}
