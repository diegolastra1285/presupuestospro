import { h } from 'preact';
import { formatearMoneda } from '../../utils/moneda.js';

export function BarraTotales({ totales, accionPrincipal, accionSecundaria }) {
  const irpfPct = totales.irpfPct ?? 15;
  const irpfCentimos = totales.irpfCentimos ?? 0;
  const textoIrpf = irpfCentimos > 0 ? `-${formatearMoneda(irpfCentimos)}` : '0,00 €';

  return (
    <div class="bottom-totals-bar">
      <div class="totals-group">
        <div class="total-item">
          <span class="total-label">Base Imponible</span>
          <span class="total-value">{formatearMoneda(totales.baseCentimos)}</span>
        </div>

        <div class="total-item">
          <span class="total-label">IVA (21%)</span>
          <span class="total-value">{formatearMoneda(totales.ivaCentimos)}</span>
        </div>

        <div class="total-item">
          <span class="total-label">IRPF ({irpfPct}%)</span>
          <span class="total-value" style={irpfCentimos > 0 ? { color: 'var(--color-danger)' } : {}}>
            {textoIrpf}
          </span>
        </div>

        <div class="total-item">
          <span class="total-label">TOTAL</span>
          <span class="total-highlight">{formatearMoneda(totales.totalCentimos)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {accionSecundaria}
        {accionPrincipal}
      </div>
    </div>
  );
}
