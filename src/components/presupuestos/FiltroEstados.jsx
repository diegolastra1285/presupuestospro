import { h } from 'preact';
import { obtenerNombreMes } from '../../utils/fechas.js';

/**
 * Filtro rápido por estados y períodos para presupuestos (FR-007, T019).
 */
export function FiltroEstados({
  filtroEstado,
  setFiltroEstado,
  filtroAnio,
  setFiltroAnio,
  filtroMes,
  setFiltroMes,
  aniosDisponibles = [],
  textoRecuento
}) {
  return (
    <div class="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div class="form-group" style={{ minWidth: '150px' }}>
            <label class="form-label" style={{ fontSize: '0.75rem' }}>Estado</label>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ minHeight: '44px' }}
            >
              <option value="todos">Todos los estados</option>
              <option value="borrador">Solo borradores</option>
              <option value="enviado">Solo enviados</option>
              <option value="aceptado">Solo aceptados</option>
              <option value="rechazado">Solo rechazados</option>
              <option value="caducado">Solo caducados</option>
            </select>
          </div>

          <div class="form-group" style={{ minWidth: '130px' }}>
            <label class="form-label" style={{ fontSize: '0.75rem' }}>Año</label>
            <select 
              value={filtroAnio} 
              onChange={(e) => setFiltroAnio(e.target.value)}
              style={{ minHeight: '44px' }}
            >
              <option value="todos">Todos los años</option>
              {aniosDisponibles.map(a => (
                <option key={a} value={String(a)}>{a}</option>
              ))}
            </select>
          </div>

          <div class="form-group" style={{ minWidth: '150px' }}>
            <label class="form-label" style={{ fontSize: '0.75rem' }}>Mes de emisión</label>
            <select 
              value={filtroMes} 
              onChange={(e) => setFiltroMes(e.target.value)}
              style={{ minHeight: '44px' }}
            >
              <option value="todos">Todos los meses</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={String(m)}>{obtenerNombreMes(m)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Indicador de recuento */}
        {textoRecuento && (
          <div style={{ backgroundColor: 'var(--pp-surface-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--pp-radius-md)', fontWeight: '600', fontSize: '0.9rem' }}>
            📊 {textoRecuento}
          </div>
        )}
      </div>
    </div>
  );
}
