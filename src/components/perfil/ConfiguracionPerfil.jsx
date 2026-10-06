import { h } from 'preact';
import { useState } from 'preact/hooks';
import { validarIdentificadorFiscal } from '../../domain/nif.js';
import { crearDatosSemilla } from '../../domain/estado-inicial.js';
import { Alerta } from '../comun/Alerta.jsx';
import { RespaldoDatos } from './RespaldoDatos.jsx';

export function ConfiguracionPerfil({ estado, dispatch, navegar }) {
  const perfilActual = estado.perfil || {};

  const [nombre, setNombre] = useState(perfilActual.nombre || '');
  const [nif, setNif] = useState(perfilActual.nif || '');
  const [email, setEmail] = useState(perfilActual.email || '');
  const [telefono, setTelefono] = useState(perfilActual.telefono || '');
  const [direccion, setDireccion] = useState(perfilActual.direccion || '');
  const [logo, setLogo] = useState(perfilActual.logo || null);
  const [nuevoAutonomo, setNuevoAutonomo] = useState(perfilActual.nuevoAutonomo || false);
  const [datosPago, setDatosPago] = useState(perfilActual.datosPago || '');
  const [condicionesPorDefecto, setCondicionesPorDefecto] = useState(perfilActual.condicionesPorDefecto || '');
  const [diasValidezPorDefecto, setDiasValidezPorDefecto] = useState(perfilActual.diasValidezPorDefecto || 30);

  const [avisoLogo, setAvisoLogo] = useState('');
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  const [errorNombre, setErrorNombre] = useState('');

  const validacionNif = nif.trim() ? validarIdentificadorFiscal(nif) : null;

  // Subida de logo con validación estricta (PNG/JPG <= 1MB)
  const handleLogoUpload = (e) => {
    setAvisoLogo('');
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    // Validar tipo de archivo
    const tipoValido = archivo.type === 'image/png' || archivo.type === 'image/jpeg' || archivo.type === 'image/jpg';
    if (!tipoValido) {
      setAvisoLogo('Formato no válido: el logo debe ser exclusivamente una imagen PNG o JPG.');
      e.target.value = '';
      return;
    }

    // Validar tamaño máximo 1 MB (1.048.576 bytes)
    const MAX_BYTES = 1024 * 1024;
    if (archivo.size > MAX_BYTES) {
      setAvisoLogo('Tamaño excedido: el archivo supera el límite de 1 MB.');
      e.target.value = '';
      return;
    }

    const lector = new FileReader();
    lector.onload = (evento) => {
      setLogo(evento.target.result);
      setAvisoLogo('');
    };
    lector.onerror = () => {
      setAvisoLogo('Error al leer el archivo de imagen.');
    };
    lector.readAsDataURL(archivo);
  };

  const handleEliminarLogo = () => {
    setLogo(null);
    setAvisoLogo('');
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorNombre('El nombre o razón social es obligatorio para poder emitir presupuestos.');
      return;
    }

    const dias = parseInt(diasValidezPorDefecto, 10);
    const diasValidos = isNaN(dias) || dias < 1 ? 30 : dias;

    const perfilActualizado = {
      nombre: nombre.trim(),
      nif: nif.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      logo,
      nuevoAutonomo: Boolean(nuevoAutonomo),
      datosPago: datosPago.trim(),
      condicionesPorDefecto: condicionesPorDefecto.trim(),
      diasValidezPorDefecto: diasValidos
    };

    dispatch({
      tipo: 'ACTUALIZAR_PERFIL',
      payload: perfilActualizado
    });

    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 3000);
  };

  const handleCargarSemilla = () => {
    const semilla = crearDatosSemilla();
    dispatch({ tipo: 'REEMPLAZAR_ESTADO_COMPLETO', payload: semilla });
    setNombre(semilla.perfil.nombre);
    setNif(semilla.perfil.nif);
    setEmail(semilla.perfil.email);
    setTelefono(semilla.perfil.telefono);
    setDireccion(semilla.perfil.direccion);
    setLogo(semilla.perfil.logo);
    setNuevoAutonomo(semilla.perfil.nuevoAutonomo);
    setDatosPago(semilla.perfil.datosPago);
    setCondicionesPorDefecto(semilla.perfil.condicionesPorDefecto);
    setDiasValidezPorDefecto(semilla.perfil.diasValidezPorDefecto);
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 3000);
  };

  return (
    <div class="view-container">
      <div class="view-header">
        <h2 class="view-title">Perfil y Marca del Freelancer</h2>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          onClick={handleCargarSemilla}
          title="Carga datos de prueba de la especificación (DevStudio Freelance, Acme, catálogo)"
        >
          🪄 Cargar datos de prueba de la spec
        </button>
      </div>

      {mensajeGuardado && (
        <Alerta tipo="success" icono="✅">
          Perfil guardado correctamente en tu dispositivo.
        </Alerta>
      )}

      <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Identidad y datos fiscales */}
        <div class="card">
          <h3 class="card-title">Identidad del Emisor</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre profesional o Razón social *</label>
              <input
                type="text"
                value={nombre}
                placeholder="Ej: DevStudio Freelance o María García"
                class={errorNombre ? 'error' : ''}
                onInput={(e) => {
                  setNombre(e.target.value);
                  if (errorNombre) setErrorNombre('');
                }}
              />
              {errorNombre && <span class="form-error">{errorNombre}</span>}
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>NIF / NIE / CIF *</span>
                {validacionNif && !validacionNif.valido && (
                  <span class="badge badge-draft" style={{ textTransform: 'none', fontWeight: 'normal' }}>
                    ⚠️ {validacionNif.motivo}
                  </span>
                )}
                {validacionNif && validacionNif.valido && validacionNif.tipo && (
                  <span class="badge badge-success" style={{ textTransform: 'none', fontWeight: 'normal' }}>
                    ✓ {validacionNif.tipo} válido
                  </span>
                )}
              </label>
              <input
                type="text"
                value={nif}
                placeholder="Ej: 12345678Z o B98765431"
                onInput={(e) => setNif(e.target.value)}
              />
              <span class="form-hint">Aviso no bloqueante si no es DNI/NIE/CIF válido</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                placeholder="contacto@miempresa.es"
                onInput={(e) => setEmail(e.target.value)}
              />
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono de contacto</label>
              <input
                type="tel"
                value={telefono}
                placeholder="+34 600 000 000"
                onInput={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Dirección fiscal o postal</label>
            <textarea
              rows="2"
              value={direccion}
              placeholder="Calle, número, código postal y ciudad"
              onInput={(e) => setDireccion(e.target.value)}
            />
          </div>
        </div>

        {/* Logotipo y Marca */}
        <div class="card">
          <h3 class="card-title">Logotipo y Marca</h3>
          <p class="form-hint">
            Solo archivos PNG o JPG de tamaño ≤ 1 MB. Si no tienes logotipo, en su lugar se mostrará tu nombre y NIF en texto destacado.
          </p>

          {avisoLogo && (
            <Alerta tipo="warning" icono="⚠️">
              {avisoLogo}
            </Alerta>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {logo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff' }}>
                  <img src={logo} alt="Logo actual" style={{ maxHeight: '80px', maxWidth: '180px', objectFit: 'contain' }} />
                </div>
                <button type="button" class="btn btn-danger btn-sm" onClick={handleEliminarLogo}>
                  Eliminar logotipo
                </button>
              </div>
            ) : (
              <div style={{ padding: '1rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Sin logotipo (se mostrará nombre y NIF)
              </div>
            )}

            <div class="form-group" style={{ flex: 1, minWidth: '220px' }}>
              <label class="form-label">Subir nuevo logotipo</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleLogoUpload}
                style={{ padding: '0.5rem' }}
              />
            </div>
          </div>
        </div>

        {/* Configuración Fiscal y Condiciones por defecto */}
        <div class="card">
          <h3 class="card-title">Fiscalidad y Condiciones por Defecto</h3>

          <div class="form-group" style={{ marginBottom: '1rem' }}>
            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={nuevoAutonomo}
                onChange={(e) => setNuevoAutonomo(e.target.checked)}
              />
              <span>
                <strong>Nuevo autónomo</strong> (aplica 7 % de IRPF por defecto en lugar de 15 % con clientes empresa)
              </span>
            </label>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Validez por defecto del presupuesto (días)</label>
              <input
                type="number"
                min="1"
                value={diasValidezPorDefecto}
                onInput={(e) => setDiasValidezPorDefecto(e.target.value)}
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Datos de pago (aparecen en el PDF)</label>
            <textarea
              rows="2"
              value={datosPago}
              placeholder="Ej: Transferencia bancaria: ES12 3456 7890 1234 5678 9012"
              onInput={(e) => setDatosPago(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label class="form-label">Condiciones por defecto para nuevos presupuestos</label>
            <textarea
              rows="3"
              value={condicionesPorDefecto}
              placeholder="Ej: Pago 50% por adelantado y 50% al finalizar los trabajos."
              onInput={(e) => setCondicionesPorDefecto(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button type="submit" class="btn btn-primary" style={{ minWidth: '200px' }}>
            💾 Guardar perfil
          </button>
        </div>
      </form>

      {/* Sección Copia de Seguridad */}
      <RespaldoDatos estado={estado} dispatch={dispatch} />
    </div>
  );
}
