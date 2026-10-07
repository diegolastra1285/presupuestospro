import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { parsearImporteACentimos } from '../../utils/moneda.js';
import { Modal } from '../comun/Modal.jsx';

/**
 * Modal y formulario de edición/alta de servicio o concepto (FR-013, T024).
 */
export function FormServicio({
  abierto,
  servicioEditando,
  onGuardar,
  onClose
}) {
  const [descripcion, setDescripcion] = useState('');
  const [precioTexto, setPrecioTexto] = useState('');
  const [ivaSugerido, setIvaSugerido] = useState(21);
  const [minTexto, setMinTexto] = useState('');
  const [maxTexto, setMaxTexto] = useState('');
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    if (servicioEditando) {
      setDescripcion(servicioEditando.descripcion || '');
      setPrecioTexto(((servicioEditando.precioCentimos || 0) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }));
      setIvaSugerido(servicioEditando.ivaSugerido || 21);
      setMinTexto(servicioEditando.mercadoMinCentimos !== null && servicioEditando.mercadoMinCentimos !== undefined
        ? ((servicioEditando.mercadoMinCentimos / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }))
        : '');
      setMaxTexto(servicioEditando.mercadoMaxCentimos !== null && servicioEditando.mercadoMaxCentimos !== undefined
        ? ((servicioEditando.mercadoMaxCentimos / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }))
        : '');
      setErrorForm('');
    } else {
      setDescripcion('');
      setPrecioTexto('');
      setIvaSugerido(21);
      setMinTexto('');
      setMaxTexto('');
      setErrorForm('');
    }
  }, [servicioEditando, abierto]);

  const handleSubmit = (e) => {
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

    if (minCentimos !== null && maxCentimos !== null && minCentimos > maxCentimos) {
      setErrorForm('El precio de mercado mínimo no puede ser superior al máximo.');
      return;
    }

    onGuardar({
      id: servicioEditando ? servicioEditando.id : ('srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      descripcion: descripcion.trim(),
      precioCentimos,
      ivaSugerido: Number(ivaSugerido),
      mercadoMinCentimos: minCentimos,
      mercadoMaxCentimos: maxCentimos
    });
  };

  return (
    <Modal
      abierto={abierto}
      titulo={servicioEditando ? 'Editar Concepto' : 'Nuevo Concepto o Servicio'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {errorForm && <div class="form-error" style={{ fontSize: '0.85rem' }}>{errorForm}</div>}

        <div class="form-group">
          <label class="form-label">Descripción del servicio o concepto *</label>
          <input
            type="text"
            value={descripcion}
            placeholder="Ej: Consultoría web y auditoría SEO"
            onInput={(e) => setDescripcion(e.target.value)}
            style={{ minHeight: '44px' }}
            autoFocus
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Precio base habitual (€) *</label>
            <input
              type="text"
              inputMode="decimal"
              value={precioTexto}
              placeholder="0,00"
              onInput={(e) => setPrecioTexto(e.target.value)}
              style={{ minHeight: '44px' }}
            />
          </div>

          <div class="form-group">
            <label class="form-label">IVA sugerido (%)</label>
            <select
              value={ivaSugerido}
              onChange={(e) => setIvaSugerido(Number(e.target.value))}
              style={{ minHeight: '44px' }}
            >
              <option value={21}>21% (General)</option>
              <option value={10}>10% (Reducido)</option>
              <option value={4}>4% (Superreducido)</option>
              <option value={0}>0% (Exento)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Mercado orientativo mín. (€)</label>
            <input
              type="text"
              inputMode="decimal"
              value={minTexto}
              placeholder="Opcional"
              onInput={(e) => setMinTexto(e.target.value)}
              style={{ minHeight: '44px' }}
            />
          </div>

          <div class="form-group">
            <label class="form-label">Mercado orientativo máx. (€)</label>
            <input
              type="text"
              inputMode="decimal"
              value={maxTexto}
              placeholder="Opcional"
              onInput={(e) => setMaxTexto(e.target.value)}
              style={{ minHeight: '44px' }}
            />
          </div>
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
            {servicioEditando ? 'Guardar Cambios' : 'Añadir Servicio'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
