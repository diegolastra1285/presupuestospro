import { h } from 'preact';
import { formatearMoneda } from '../../utils/moneda.js';

/**
 * Componente modular para el desglose impositivo (Base, IVA, IRPF y Total) (T013, FR-009).
 */
export function DesgloseFiscal({ totales }) {
  if (!totales) return null;

  return (
    <div class="desglose-fiscal-container" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--pp-surface-subtle)', borderRadius: 'var(--pp-radius-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        <span>Base Imponible:</span>
        <span style={{ fontWeight: '600', fontFamily: 'var(--pp-font-mono)' }}>{formatearMoneda(totales.baseImponibleCentimos)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        <span>IVA ({totales.ivaPct || 21}%):</span>
        <span style={{ fontWeight: '600', fontFamily: 'var(--pp-font-mono)' }}>+{formatearMoneda(totales.ivaCentimos)}</span>
      </div>

      {totales.irpfPct > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-danger)' }}>
          <span>Retención IRPF (-{totales.irpfPct}%):</span>
          <span style={{ fontWeight: '600', fontFamily: 'var(--pp-font-mono)' }}>-{formatearMoneda(totales.irpfCentimos)}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--pp-border)', paddingTop: '0.75rem', marginTop: '0.5rem', fontWeight: '800', fontSize: '1.1rem' }}>
        <span>Total a Pagar:</span>
        <span style={{ color: 'var(--pp-primary)', fontFamily: 'var(--pp-font-mono)' }}>{formatearMoneda(totales.totalCentimos)}</span>
      </div>
    </div>
  );
}
