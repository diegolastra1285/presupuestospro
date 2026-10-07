import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FormServicio } from './FormServicio.jsx';
import { ListaServicios } from './ListaServicios.jsx';
import { Modal } from '../comun/Modal.jsx';

export function GestionCatalogo({ estado, dispatch }) {
  const catalogo = estado.catalogo || [];

  const [filtro, setFiltro] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);

  const filtrados = catalogo.filter(s =>
    s.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  const abrirModalNuevo = () => {
    setServicioEditando(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (servicio) => {
    setServicioEditando(servicio);
    setModalAbierto(true);
  };

  const handleGuardar = (servicioGuardar) => {
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
          <h2 class="view-title">Catálogo de Servicios y Tarifas</h2>
          <p class="form-hint">Define tus conceptos habituales y precios para añadirlos rápidamente al redactar presupuestos.</p>
        </div>
        <div>
          <button
            type="button"
            class="btn btn-primary touch-target"
            style={{ minHeight: '44px' }}
            onClick={abrirModalNuevo}
          >
            + Nuevo concepto
          </button>
        </div>
      </div>

      <div class="card">
        {/* Barra de Búsqueda */}
        <div class="form-group" style={{ maxWidth: '400px' }}>
          <label class="form-label">Buscar concepto</label>
          <input
            type="text"
            placeholder="Filtrar por nombre o descripción..."
            value={filtro}
            onInput={(e) => setFiltro(e.target.value)}
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Listado de Servicios (FR-013, T024) */}
        <ListaServicios
          servicios={filtrados}
          onEditar={abrirModalEditar}
          onEliminar={(s) => setServicioAEliminar(s)}
        />
      </div>

      {/* Formulario Modal (FR-013, T024) */}
      <FormServicio
        abierto={modalAbierto}
        servicioEditando={servicioEditando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      {/* Modal Confirmar Eliminación */}
      <Modal
        abierto={!!servicioAEliminar}
        titulo="¿Eliminar concepto del catálogo?"
        onClose={() => setServicioAEliminar(null)}
        acciones={
          <>
            <button class="btn btn-secondary touch-target" style={{ minHeight: '44px' }} onClick={() => setServicioAEliminar(null)}>
              Cancelar
            </button>
            <button class="btn btn-danger touch-target" style={{ minHeight: '44px' }} onClick={handleConfirmarEliminar}>
              Sí, eliminar concepto
            </button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que deseas eliminar <strong>{servicioAEliminar?.descripcion}</strong>?
        </p>
        <p class="form-hint" style={{ marginTop: '0.5rem' }}>
          Esta acción no modificará los presupuestos emitidos ni los borradores existentes que ya contengan este concepto.
        </p>
      </Modal>
    </div>
  );
}
