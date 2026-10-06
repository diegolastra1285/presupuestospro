import { h } from 'preact';
import { useState } from 'preact/hooks';
import { formatearMoneda, parsearImporteACentimos } from '../../utils/moneda.js';
import { Modal } from '../comun/Modal.jsx';
import { Alerta } from '../comun/Alerta.jsx';

export function GestionCatalogo({ estado, dispatch }) {
  const catalogo = estado.catalogo || [];

  const [filtro, setFiltro] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);

  // Campos del formulario
  const [descripcion, setDescripcion] = useState('');
  const [precioTexto, setPrecioTexto] = useState('');
  const [minTexto, setMinTexto] = useState('');
  const [maxTexto, setMaxTexto] = useState('');
  const [errorForm, setErrorForm] = useState('');

  // Modal para eliminar
  const [servicioAEliminar, setServicioAEliminar] = useState(null);

  const filtrados = catalogo.filter(s =>
    s.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  const abrirModalNuevo = () => {
    setServicioEditando(null);
    setDescripcion('');
    setPrecioTexto('');
    setMinTexto('');
    setMaxTexto('');
    setErrorForm('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (servicio) => {
    setServicioEditando(servicio);
    setDescripcion(servicio.descripcion);
    setPrecioTexto(((servicio.precioCentimos || 0) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }));
    setMinTexto(servicio.mercadoMinCentimos !== null && servicio.mercadoMinCentimos !== undefined
      ? ((servicio.mercadoMinCentimos / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }))
      : '');
    setMaxTexto(servicio.mercadoMaxCentimos !== null && servicio.mercadoMaxCentimos !== undefined
      ? ((servicio.mercadoMaxCentimos / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }))
      : '');
    setErrorForm('');
    setModalAbierto(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    setErrorForm('');

    if (!descripcion.trim()) {
      setErrorForm('La descripción del servicio es obligatoria.');
      return;
    }

    const precioCentimos = parsearImporteACentimos(precioTexto);
    if (precioCentimos < 0) {
      setErrorForm('El precio habitual no puede ser negativo.');
      return;
    }

    const minCentimos = minTexto.trim() ? parsearImporteACentimos(minTexto) : null;
    const maxCentimos = maxTexto.trim() ? parsearImporteACentimos(maxTexto) : null;

    // Validación de rango de mercado: si existen ambos, mín <= máx (US4.4)
    if (minCentimos !== null && maxCentimos !== null) {
      if (minCentimos > maxCentimos) {
        setErrorForm('El precio de mercado mínimo no puede ser superior al precio máximo.');
        return;
      }
    }

    const servicioGuardar = {
      id: servicioEditando ? servicioEditando.id : ('srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      descripcion: descripcion.trim(),
      precioCentimos,
      mercadoMinCentimos: minCentimos,
      mercadoMaxCentimos: maxCentimos
    };

    dispatch({
      tipo: 'GUARDAR_SERVICIO',
      payload: servicioGuardar
    });

    setModalAbierto(false);
  };

  const handleConfirmarEliminar = () => {
    if (servicioAEliminar) {
      dispatch({
        tipo: 'ELIMINAR_SERVICIO',
        payload: servicioAEliminar.id
      });
      setServicioAEliminar(null);
    }
  };

  return (
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-title">Catálogo de Servicios y Conceptos</h2>
          <p class="form-hint">Gestiona tus servicios habituales con sus precios de referencia y rangos de mercado.</p>
        </div>
        <button
          type="button"
          class="btn btn-primary"
          onClick={abrirModalNuevo}
        >
          + Nuevo servicio
        </button>
      </div>

      <div class="card">
        <div class="form-group" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={filtro}
            onInput={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Descripción</th>
                <th style={{ textAlign: 'right', width: '20%' }}>Precio habitual</th>
                <th style={{ textAlign: 'center', width: '20%' }}>Rango de mercado</th>
                <th style={{ textAlign: 'right', width: '15%' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    {filtro ? 'No hay servicios que coincidan con la búsqueda.' : 'No tienes ningún servicio en el catálogo. Añade el primero con el botón "+ Nuevo servicio".'}
                  </td>
                </tr>
              ) : (
                filtrados.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '600' }}>{s.descripcion}</td>
                    <td style={{ textAlign: 'right' }}>{formatearMoneda(s.precioCentimos)}</td>
                    <td style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {s.mercadoMinCentimos !== null && s.mercadoMaxCentimos !== null
                        ? `${formatearMoneda(s.mercadoMinCentimos)} – ${formatearMoneda(s.mercadoMaxCentimos)}`
                        : '—'}
                    </td>
                    <td>
                      <div class="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm"
                          onClick={() => abrirModalEditar(s)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          onClick={() => setServicioAEliminar(s)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Añadir / Editar Servicio */}
      <Modal
        abierto={modalAbierto}
        titulo={servicioEditando ? 'Editar servicio' : 'Nuevo servicio del catálogo'}
        onClose={() => setModalAbierto(false)}
      >
        <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {errorForm && (
            <Alerta tipo="danger" icono="⛔">
              {errorForm}
            </Alerta>
          )}

          <div class="form-group">
            <label class="form-label">Descripción del servicio o concepto *</label>
            <input
              type="text"
              value={descripcion}
              placeholder="Ej: Auditoría de arquitectura web"
              onInput={(e) => setDescripcion(e.target.value)}
              autoFocus
            />
          </div>

          <div class="form-group">
            <label class="form-label">Precio habitual (€) *</label>
            <input
              type="text"
              inputMode="decimal"
              value={precioTexto}
              placeholder="Ej: 450,00"
              onInput={(e) => setPrecioTexto(e.target.value)}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Rango de precios de mercado (opcional)
            </p>
            <p class="form-hint" style={{ marginBottom: '0.75rem' }}>
              Permite fijar precios de referencia mínimo y máximo para negociar en cada presupuesto.
            </p>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Precio mín. (€)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={minTexto}
                  placeholder="Ej: 300,00"
                  onInput={(e) => setMinTexto(e.target.value)}
                />
              </div>

              <div class="form-group">
                <label class="form-label">Precio máx. (€)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={maxTexto}
                  placeholder="Ej: 600,00"
                  onInput={(e) => setMaxTexto(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" class="btn btn-secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Guardar en catálogo
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal
        abierto={!!servicioAEliminar}
        titulo="¿Eliminar servicio del catálogo?"
        onClose={() => setServicioAEliminar(null)}
        acciones={
          <>
            <button class="btn btn-secondary" onClick={() => setServicioAEliminar(null)}>
              Cancelar
            </button>
            <button class="btn btn-danger" onClick={handleConfirmarEliminar}>
              Sí, eliminar
            </button>
          </>
        }
      >
        <p>
          ¿Seguro que deseas eliminar <strong>{servicioAEliminar?.descripcion}</strong>?
        </p>
        <p class="form-hint" style={{ marginTop: '0.5rem' }}>
          Los presupuestos ya existentes que contengan este servicio no se verán afectados.
        </p>
      </Modal>
    </div>
  );
}
