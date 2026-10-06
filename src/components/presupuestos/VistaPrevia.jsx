import { h } from 'preact';
import { formatearMoneda } from '../../utils/moneda.js';
import { formatearFecha, obtenerFechaHoyISO } from '../../utils/fechas.js';

export function VistaPrevia({ 
  presupuesto, 
  emisor, 
  cliente, 
  lineasCalculadas = [], 
  totales = {}, 
  esBorrador = true,
  fechaValidez,
  condiciones,
  esAnulado = false
}) {
  const hoyISO = obtenerFechaHoyISO();
  const fechaEmisionFormateada = formatearFecha(presupuesto?.emitidaEn || hoyISO);
  const fechaValidezFormateada = formatearFecha(fechaValidez);
  
  const numeroTexto = esBorrador 
    ? 'BORRADOR' 
    : (presupuesto?.numero 
        ? `${presupuesto.numero}${presupuesto.versionActual > 1 ? ` (v${presupuesto.versionActual})` : ''}` 
        : 'BORRADOR');

  const irpfPct = totales.irpfPct ?? 15;
  const irpfCentimos = totales.irpfCentimos ?? 0;

  // Formato cantidad es-ES sin decimales sobrantes (ej: 15, 2.5 -> 2,5)
  const formatearCantidad = (centesimas) => {
    const valor = (centesimas || 0) / 100;
    return valor.toLocaleString('es-ES', { maximumFractionDigits: 2 });
  };

  return (
    <div class="documento-papel">
      {esAnulado && <div class="watermark-anulado">ANULADO</div>}

      {/* Cabecera: Logo / Emisor a la izquierda; Título y Datos a la derecha */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', gap: '1rem' }}>
        <div style={{ maxWidth: '60%' }}>
          {emisor?.logo ? (
            <img 
              src={emisor.logo} 
              alt={emisor.nombre || 'Logo'} 
              style={{ maxHeight: '70px', maxWidth: '200px', objectFit: 'contain' }} 
            />
          ) : (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {emisor?.nombre || 'Nombre del Emisor / Empresa'}
              </h2>
              {emisor?.nif && (
                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>
                  NIF/CIF: {emisor.nif}
                </p>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e3a8a', margin: 0, letterSpacing: '0.05em' }}>
            PRESUPUESTO
          </h1>
          <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0.25rem 0 0' }}>
            {numeroTexto}
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Fecha: {fechaEmisionFormateada}
          </p>
          {fechaValidezFormateada && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Válido hasta: {fechaValidezFormateada}
            </p>
          )}
        </div>
      </div>

      {/* Leyenda obligatoria */}
      <div style={{ textAlign: 'center', padding: '0.5rem 0', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: '1px solid #f1f5f9' }}>
        Este documento no es una factura
      </div>

      {/* Bloque Emisor y Cliente */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '1.25rem 0' }}>
        {/* Emisor */}
        <div>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
            De (Emisor)
          </h4>
          <p style={{ fontWeight: '700', margin: 0, color: '#0f172a' }}>
            {emisor?.nombre || '—'}
          </p>
          {emisor?.nif && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155' }}>NIF/CIF: {emisor.nif}</p>}
          {emisor?.direccion && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line' }}>{emisor.direccion}</p>}
          {emisor?.email && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155' }}>{emisor.email}</p>}
          {emisor?.telefono && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155' }}>{emisor.telefono}</p>}
        </div>

        {/* Cliente */}
        <div>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
            Para (Cliente)
          </h4>
          {cliente ? (
            <div>
              <p style={{ fontWeight: '700', margin: 0, color: '#0f172a' }}>{cliente.nombre}</p>
              {cliente.nif && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155' }}>NIF/CIF: {cliente.nif}</p>}
              {cliente.direccion && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line' }}>{cliente.direccion}</p>}
              {cliente.email && <p style={{ margin: '0.125rem 0', fontSize: '0.85rem', color: '#334155' }}>{cliente.email}</p>}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
              [Ningún cliente seleccionado]
            </p>
          )}
        </div>
      </div>

      {/* Tabla de Líneas */}
      <table>
        <thead>
          <tr>
            <th style={{ width: '55%' }}>Descripción</th>
            <th style={{ textAlign: 'right', width: '15%' }}>Cantidad</th>
            <th style={{ textAlign: 'right', width: '15%' }}>Precio</th>
            <th style={{ textAlign: 'right', width: '15%' }}>Importe</th>
          </tr>
        </thead>
        <tbody>
          {lineasCalculadas.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem', fontStyle: 'italic' }}>
                Sin líneas añadidas
              </td>
            </tr>
          ) : (
            lineasCalculadas.map((linea, idx) => (
              <tr key={linea.id || idx}>
                <td style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                  {linea.descripcion || <span style={{ color: '#dc2626' }}>[Sin descripción]</span>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {formatearCantidad(linea.cantidadCentesimas)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {formatearMoneda(linea.precioCentimos)}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                  {formatearMoneda(linea.subtotalCentimos)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Bloque de Totales */}
      <div class="documento-totales-bloque">
        <div class="documento-totales-fila">
          <span style={{ color: '#475569' }}>Base Imponible:</span>
          <span style={{ fontWeight: '600' }}>{formatearMoneda(totales.baseCentimos)}</span>
        </div>
        <div class="documento-totales-fila">
          <span style={{ color: '#475569' }}>IVA (21 %):</span>
          <span style={{ fontWeight: '600' }}>{formatearMoneda(totales.ivaCentimos)}</span>
        </div>
        <div class="documento-totales-fila">
          <span style={{ color: '#475569' }}>Retención IRPF ({irpfPct} %):</span>
          <span style={{ fontWeight: '600', color: irpfCentimos > 0 ? '#b91c1c' : 'inherit' }}>
            {irpfCentimos > 0 ? `-${formatearMoneda(irpfCentimos)}` : '0,00 €'}
          </span>
        </div>
        <div class="documento-totales-fila documento-totales-total">
          <span>TOTAL:</span>
          <span style={{ color: '#1e3a8a' }}>{formatearMoneda(totales.totalCentimos)}</span>
        </div>
      </div>

      {/* Condiciones y notas */}
      {condiciones && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
            Condiciones y Notas
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line', margin: 0 }}>
            {condiciones}
          </p>
        </div>
      )}

      {/* Datos de pago */}
      {emisor?.datosPago && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 0.25rem', letterSpacing: '0.05em' }}>
            Datos de Pago
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line', margin: 0 }}>
            {emisor.datosPago}
          </p>
        </div>
      )}
    </div>
  );
}
