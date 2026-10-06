import { h } from 'preact';

/**
 * Componente modal accesible y reutilizable
 */
export function Modal({ abierto, titulo, onClose, children, acciones }) {
  if (!abierto) return null;

  return (
    <div class="modal-backdrop" onClick={onClose}>
      <div class="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h3 class="modal-title">{titulo}</h3>
          <button 
            type="button" 
            class="btn-icon touch-target" 
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        <div class="modal-body">
          {children}
        </div>
        {acciones && (
          <div class="modal-footer">
            {acciones}
          </div>
        )}
      </div>
    </div>
  );
}
