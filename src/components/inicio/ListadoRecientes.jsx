import { h } from 'preact';
import { formatearMoneda } from '../../utils/moneda.js';
import { formatearFecha } from '../../utils/fechas.js';
import { BadgeEstado } from '../comun/BadgeEstado.jsx';

/**
 * Tabla/lista de presupuestos más recientes para la página de inicio (FR-004).
 */
export function ListadoRecientes({ presupuestos = [], clientes = [], navegar }) {
  if (!presupuestos || presupuestos.length === 0) {
    return null;
  }

  // Tomar los 5 presupuestos más recientes ordenados por fecha descendente o de creación
  const recientes = [...presupuestos]
    .sort((a, b) => {
      const fechaA = a.fechaCreacion || a.fecha || '';
      const fechaB = b.fechaCreacion || b.fecha || '';
      return fechaB.localeCompare(fechaA);
    })
    .slice(0, 5);

  const getNombreCliente = (p) => {
    if (p.clienteNombre) return p.clienteNombre;
    if (p.cliente?.nombre) return p.cliente.nombre;
    const c = clientes.find(item => item.id === p.clienteId);
    return c ? c.nombre : 'Cliente sin asignar';
  };

  const getImporteTotal = (p) => {
    if (p.totalCentimos !== undefined) return p.totalCentimos;
    if (p.totales?.totalCentimos !== undefined) return p.totales.totalCentimos;
    const v = p.versiones && p.versiones[p.versiones.length - 1];
    if (v?.totales?.totalCentimos !== undefined) return v.totales.totalCentimos;
    return 0;
  };

  const getFechaValidez = (p) => {
    const v = p.versiones && p.versiones[p.versiones.length - 1];
    return p.fechaValidez || v?.fechaValidez;
  };

  return (
    <section class="card" aria-labelledby="recientes-titulo" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 id="recientes-titulo" class="section-title" style={{ margin: 0 }}>
          Presupuestos Recientes
        </h2>
        <a href="#/presupuestos" class="btn btn-secondary btn-sm" style={{ minHeight: '36px' }}>
          Ver todos ({presupuestos.length})
        </a>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Número</th>
              <th>Cliente</th>
              <th style={{ textAlign: 'right' }}>Importe</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {recientes.map((p) => {
              const version = p.versiones && p.versiones[p.versiones.length - 1];
              const fecha = p.fecha || version?.fecha || p.fechaCreacion;
              const numero = p.numero || (version?.numero) || 'Borrador';
              const clienteNombre = getNombreCliente(p);
              const totalCentimos = getImporteTotal(p);
              const fechaValidez = getFechaValidez(p);

              return (
                <tr key={p.id}>
                  <td>{formatearFecha(fecha)}</td>
                  <td style={{ fontWeight: 600 }}>{numero}</td>
                  <td>{clienteNombre}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--pp-font-mono)' }}>
                    {formatearMoneda(totalCentimos)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <BadgeEstado estado={p.estado} fechaValidez={fechaValidez} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      class="btn btn-secondary btn-sm"
                      style={{ minHeight: '36px' }}
                      onClick={() => navegar(`#/presupuesto/${p.id}`)}
                    >
                      Abrir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
