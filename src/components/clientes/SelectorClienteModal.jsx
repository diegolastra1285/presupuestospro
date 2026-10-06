import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Modal } from '../comun/Modal.jsx';
import { validarIdentificadorFiscal } from '../../domain/nif.js';

export function SelectorClienteModal({ abierto, onClose, onClienteCreado }) {
  const [nombre, setNombre] = useState('');
  const [nif, setNif] = useState('');
  const [tipo, setTipo] = useState('empresa');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [errorNombre, setErrorNombre] = useState('');

  const validacionNif = nif.trim() ? validarIdentificadorFiscal(nif) : null;

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorNombre('El nombre o razón social es obligatorio');
      return;
    }

    const nuevoCliente = {
      id: 'cli_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      nombre: nombre.trim(),
      nif: nif.trim(),
      tipo,
      email: email.trim(),
      direccion: direccion.trim()
    };

    onClienteCreado(nuevoCliente);
    onClose();
  };

  return (
    <Modal abierto={abierto} titulo="Crear nuevo cliente" onClose={onClose}>
      <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div class="form-group">
          <label class="form-label">
            Nombre o razón social *
          </label>
          <input
            type="text"
            value={nombre}
            onInput={(e) => {
              setNombre(e.target.value);
              if (errorNombre) setErrorNombre('');
            }}
            placeholder="Ej: Acme Corp o Juan Pérez"
            class={errorNombre ? 'error' : ''}
            autoFocus
          />
          {errorNombre && <span class="form-error">{errorNombre}</span>}
        </div>

        <div class="form-group">
          <label class="form-label">
            Tipo de cliente *
          </label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="empresa">Empresa / Autónomo (con retención IRPF)</option>
            <option value="particular">Particular (sin retención IRPF, 0 %)</option>
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
            onInput={(e) => setNif(e.target.value)}
            placeholder="Ej: B12345678 o 12345678Z"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onInput={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Dirección fiscal / postal</label>
          <textarea
            rows="2"
            value={direccion}
            onInput={(e) => setDireccion(e.target.value)}
            placeholder="Calle, número, código postal y ciudad"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" class="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            Guardar cliente
          </button>
        </div>
      </form>
    </Modal>
  );
}
