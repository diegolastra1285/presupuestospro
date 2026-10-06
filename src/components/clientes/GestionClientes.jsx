import { h } from 'preact';
import { useState } from 'preact/hooks';
import { validarIdentificadorFiscal } from '../../domain/nif.js';
import { Modal } from '../comun/Modal.jsx';
import { Alerta } from '../comun/Alerta.jsx';

export function GestionClientes({ estado, dispatch }) {
  const clientes = estado.clientes || [];
  const presupuestos = estado.presupuestos || [];

  const [filtro, setFiltro] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [nif, setNif] = useState('');
  const [tipo, setTipo] = useState('empresa');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [errorNombre, setErrorNombre] = useState('');

  // Borrado
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const validacionNif = nif.trim() ? validarIdentificadorFiscal(nif) : null;

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (c.nif && c.nif.toLowerCase().includes(filtro.toLowerCase()))
  );

  const abrirModalNuevo = () => {
    setClienteEditando(null);
    setNombre('');
    setNif('');
    setTipo('empresa');
    setEmail('');
    setDireccion('');
    setErrorNombre('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (cliente) => {
    setClienteEditando(cliente);
    setNombre(cliente.nombre);
    setNif(cliente.nif || '');
    setTipo(cliente.tipo || 'empresa');
    setEmail(cliente.email || '');
    setDireccion(cliente.direccion || '');
    setErrorNombre('');
    setModalAbierto(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorNombre('El nombre o razón social es obligatorio.');
      return;
    }

    const clienteGuardar = {
      id: clienteEditando ? clienteEditando.id : ('cli_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      nombre: nombre.trim(),
      nif: nif.trim(),
      tipo,
      email: email.trim(),
      direccion: direccion.trim()
    };

    dispatch({
      tipo: 'GUARDAR_CLIENTE',
      payload: clienteGuardar
    });

    setModalAbierto(false);
  };

  // Contar borradores que usan el cliente a eliminar (US5.5, FR-006)
  const contarBorradoresUso = (clienteId) => {
    if (!clienteId) return 0;
    return presupuestos.filter(p => p.borrador && p.borrador.clienteId === clienteId).length;
  };

  const borradoresEnUso = clienteAEliminar ? contarBorradoresUso(clienteAEliminar.id) : 0;

  const handleConfirmarEliminar = () => {
    if (clienteAEliminar) {
      dispatch({
        tipo: 'ELIMINAR_CLIENTE',
        payload: clienteAEliminar.id
      });
      setClienteAEliminar(null);
    }
  };

  return (
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-title">Agenda de Clientes</h2>
          <p class="form-hint">Gestiona los datos fiscales y de contacto de tus clientes para incluirlos en presupuestos.</p>
        </div>
        <button
          type="button"
          class="btn btn-primary"
          onClick={abrirModalNuevo}
        >
          + Nuevo cliente
        </button>
      </div>

      <div class="card">
        <div class="form-group" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o NIF..."
            value={filtro}
            onInput={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre o Razón Social</th>
                <th>Tipo</th>
                <th>NIF / CIF</th>
                <th>Contacto</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    {filtro ? 'No hay clientes que coincidan con la búsqueda.' : 'No tienes ningún cliente registrado. Crea el primero con "+ Nuevo cliente".'}
                  </td>
                </tr>
              ) : (
                filtrados.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <p style={{ fontWeight: '600', margin: 0 }}>{c.nombre}</p>
                      {c.direccion && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{c.direccion}</p>}
                    </td>
                    <td>
                      <span class={`badge ${c.tipo === 'particular' ? 'badge-neutral' : 'badge-draft'}`}>
                        {c.tipo === 'particular' ? 'Particular' : 'Empresa / Autónomo'}
                      </span>
                    </td>
                    <td>{c.nif || '—'}</td>
                    <td>
                      {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : '—'}
                    </td>
                    <td>
                      <div class="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm"
                          onClick={() => abrirModalEditar(c)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          onClick={() => setClienteAEliminar(c)}
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

      {/* Modal Nuevo / Editar Cliente */}
      <Modal
        abierto={modalAbierto}
        titulo={clienteEditando ? 'Editar cliente' : 'Nuevo cliente en la agenda'}
        onClose={() => setModalAbierto(false)}
      >
        <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div class="form-group">
            <label class="form-label">Nombre o razón social *</label>
            <input
              type="text"
              value={nombre}
              placeholder="Ej: Acme Digital Corp o Juan Pérez"
              class={errorNombre ? 'error' : ''}
              onInput={(e) => {
                setNombre(e.target.value);
                if (errorNombre) setErrorNombre('');
              }}
              autoFocus
            />
            {errorNombre && <span class="form-error">{errorNombre}</span>}
          </div>

          <div class="form-group">
            <label class="form-label">Tipo de cliente *</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="empresa">Empresa / Autónomo (con retención de IRPF)</option>
              <option value="particular">Particular (sin retención de IRPF, forzado a 0 %)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span>NIF / CIF / DNI</span>
              {validacionNif && !validacionNif.valido && (
                <span class="badge badge-draft" style={{ textTransform: 'none', fontWeight: 'normal' }}>
                  ⚠️ {validacionNif.motivo}
                </span>
              )}
            </label>
            <input
              type="text"
              value={nif}
              placeholder="Ej: B98765431 o 12345678Z"
              onInput={(e) => setNif(e.target.value)}
            />
            <span class="form-hint">Aviso no bloqueante si el formato no es válido</span>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              placeholder="facturacion@cliente.com"
              onInput={(e) => setEmail(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label class="form-label">Dirección fiscal / postal</label>
            <textarea
              rows="2"
              value={direccion}
              placeholder="Calle, número, código postal y ciudad"
              onInput={(e) => setDireccion(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" class="btn btn-secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Guardar cliente
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación con Conteo de Borradores */}
      <Modal
        abierto={!!clienteAEliminar}
        titulo="¿Eliminar cliente de la agenda?"
        onClose={() => setClienteAEliminar(null)}
        acciones={
          <>
            <button class="btn btn-secondary" onClick={() => setClienteAEliminar(null)}>
              Cancelar
            </button>
            <button class="btn btn-danger" onClick={handleConfirmarEliminar}>
              Sí, eliminar
            </button>
          </>
        }
      >
        <p>
          ¿Seguro que deseas eliminar a <strong>{clienteAEliminar?.nombre}</strong>?
        </p>

        {borradoresEnUso > 0 ? (
          <div style={{ marginTop: '0.75rem' }}>
            <Alerta tipo="warning" icono="⚠️">
              <strong>{borradoresEnUso} {borradoresEnUso === 1 ? 'borrador usa' : 'borradores usan'} este cliente.</strong> Al confirmar, esos borradores quedarán sin cliente y deberás seleccionar uno antes de poder emitirlos.
            </Alerta>
          </div>
        ) : (
          <p class="form-hint" style={{ marginTop: '0.5rem' }}>
            Ningún borrador actual está usando este cliente.
          </p>
        )}

        <p class="form-hint" style={{ marginTop: '0.5rem' }}>
          Los presupuestos ya emitidos conservan su propia copia y no se verán modificados.
        </p>
      </Modal>
    </div>
  );
}
