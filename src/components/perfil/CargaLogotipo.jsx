import { h } from 'preact';
import { Alerta } from '../comun/Alerta.jsx';

/**
 * Carga de logotipo y previsualización gráfica instantánea (FR-014, T026).
 */
export function CargaLogotipo({
  logo,
  avisoLogo,
  onSubirLogo,
  onEliminarLogo
}) {
  return (
    <div class="card">
      <h3 class="card-title">Logotipo y Marca Comercial</h3>
      <p class="form-hint">
        Archivos PNG o JPG de tamaño ≤ 1 MB. La previsualización gráfica se actualiza de inmediato y se refleja en los presupuestos PDF.
      </p>

      {avisoLogo && (
        <Alerta tipo="warning" icono="⚠️">
          {avisoLogo}
        </Alerta>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        {logo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.5rem', border: '1px solid var(--pp-border)', borderRadius: 'var(--pp-radius-md)', backgroundColor: '#ffffff' }}>
              <img src={logo} alt="Logo actual" style={{ maxHeight: '80px', maxWidth: '180px', objectFit: 'contain' }} />
            </div>
            <button 
              type="button" 
              class="btn btn-danger btn-sm touch-target" 
              style={{ minHeight: '44px' }}
              onClick={onEliminarLogo}
            >
              Eliminar logotipo
            </button>
          </div>
        ) : (
          <div style={{ padding: '1rem', border: '2px dashed var(--pp-border)', borderRadius: 'var(--pp-radius-md)', textAlign: 'center', color: 'var(--pp-text-muted)' }}>
            Sin logotipo asignado (se mostrará nombre y NIF en texto destacado)
          </div>
        )}

        <div class="form-group" style={{ flex: 1, minWidth: '220px' }}>
          <label class="form-label">Cargar archivo de imagen</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={onSubirLogo}
            style={{ padding: '0.5rem', minHeight: '44px' }}
          />
        </div>
      </div>
    </div>
  );
}
