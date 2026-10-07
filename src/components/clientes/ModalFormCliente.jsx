import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { validarIdentificadorFiscal } from '../../domain/nif.js';
import { Modal } from '../comun/Modal.jsx';

/**
 * Formulario modal conciso con validación visual interactiva de NIF/CIF/NIE (FR-012, T022).
 */
export function ModalFormCliente({
  abierto,
  clienteEditando,
  onGuardar,
  onClose
}) {
  const [nombre, setNombre] = useState('');
  const [nif, setNif] = useState('');
  const [tipo, setTipo] = useState('empresa');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [errorNombre, setErrorNombre] = useState('');

  useEffect(() => {
    if (clienteEditando) {
      setNombre(clienteEditando.nombre || '');
      setNif(clienteEditando.nif || '');
      setTipo(clienteEditando.tipo || 'empresa');
      setEmail(clienteEditando.email || '');
      setDireccion(clienteEditando.direccion || '');
      setErrorNombre('');
    } else {
      setNombre('');
      setNif('');
      setTipo('empresa');
      setEmail('');
      setDireccion('');
      setErrorNombre('');
    }
  }, [clienteEditando, abierto]);

  const validacionNif = nif.trim() ? validarIdentificadorFiscal(nif) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorNombre('El nombre o razón social es obligatorio.');
      return;
    }

    onGuardar({
      id: clienteEditando ? clienteEditando.id : ('cli_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      nombre: nombre.trim(),
      nif: nif.trim(),
      tipo,
      email: email.trim(),
      direccion: direccion.trim()
    });
  };

  return (
    <Modal
      abierto={abierto}
      titulo={clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente en Agenda'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            style={{ minHeight: '44px' }}
            autoFocus
          />
          {errorNombre && <span class="form-error">{errorNombre}</span>}
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de cliente *</label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
            style={{ minHeight: '44px' }}
          >
            <option value="empresa">Empresa / Autónomo (con retención de IRPF)</option>
            <option value="particular">Particular (sin retención de IRPF, 0 %)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span>NIF / CIF / NIE</span>
            {validacionNif && (
              validacionNif.valido ? (
                <span class="badge badge--aceptado" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                  ✓ {validacionNif.tipo || 'Válido'}
                </span>
              ) : (
                <span class="badge badge--rechazado" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                  ⚠️ {validacionNif.motivo}
                </span>
              )
            )}
          </label>
          <input
            type="text"
            value={nif}
            placeholder="Ej: B98765431 o 12345678Z"
            onInput={(e) => setNif(e.target.value)}
            style={{ minHeight: '44px' }}
          />
          <span class="form-hint">Validación automática en tiempo real de identificadores fiscales españoles</span>
        </div>

        <div class="form-group">
          <label class="form-label">Correo electrónico</label>
          <input
            type="email"
            value={email}
            placeholder="facturacion@cliente.com"
            onInput={(e) => setEmail(e.target.value)}
            style={{ minHeight: '44px' }}
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
          <button 
            type="button" 
            class="btn btn-secondary touch-target" 
            style={{ minHeight: '44px' }}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary touch-target" 
            style={{ minHeight: '44px' }}
          >
            {clienteEditando ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
