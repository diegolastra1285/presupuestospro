import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Modal } from '../comun/Modal.jsx';
import { formatearMoneda } from '../../utils/moneda.js';

export function SelectorConceptoModal({ abierto, catalogo = [], onSeleccionar, onClose }) {
  const [filtro, setFiltro] = useState('');

  const filtrados = catalogo.filter(item => 
    item.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Modal abierto={abierto} titulo="Añadir concepto del catálogo" onClose={onClose}>
      <div class="form-group">
        <input
          type="text"
          placeholder="Buscar concepto o servicio..."
          value={filtro}
          onInput={(e) => setFiltro(e.target.value)}
          autoFocus
        />
      </div>

      <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        {filtrados.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem' }}>
            No se encontraron servicios en el catálogo.
          </p>
        ) : (
          filtrados.map((item) => (
            <div
              key={item.id}
              onClick={() => onSeleccionar(item)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                backgroundColor: 'var(--color-surface)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
            >
              <div>
                <p style={{ fontWeight: '600', margin: 0 }}>{item.descripcion}</p>
                {item.mercadoMinCentimos !== null && item.mercadoMinCentimos !== undefined && (
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Mercado: {formatearMoneda(item.mercadoMinCentimos)} – {formatearMoneda(item.mercadoMaxCentimos)}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                  {formatearMoneda(item.precioCentimos)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
