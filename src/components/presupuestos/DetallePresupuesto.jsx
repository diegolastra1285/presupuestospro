import { h } from 'preact';
import { useState } from 'preact/hooks';
import { formatearMoneda } from '../../utils/moneda.js';
import { formatearFecha } from '../../utils/fechas.js';
import { descargarPdf } from '../../pdf/generador.js';
import { VistaPrevia } from './VistaPrevia.jsx';
import { obtenerEstadoPresupuesto } from './ListadoPresupuestos.jsx';
import { Modal } from '../comun/Modal.jsx';
import { Alerta } from '../comun/Alerta.jsx';

export function DetallePresupuesto({ presupuesto, estado, dispatch, navegar }) {
  const [modalAnularAbierto, setModalAnularAbierto] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [versionSeleccionadaIdx, setVersionSeleccionadaIdx] = useState(
    (presupuesto.versiones?.length || 1) - 1
  );

  const versiones = presupuesto.versiones || [];
  const versionActual = versiones[versionSeleccionadaIdx] || versiones[versiones.length - 1];
  const esAnulado = presupuesto.estado === 'anulado';

  const handleDescargarVersion = async (version) => {
    setDescargando(true);
    try {
      await descargarPdf(presupuesto.numero, version, esAnulado);
    } catch (err) {
      console.error('Error al descargar versión PDF:', err);
      alert('No se pudo generar el archivo PDF.');
    } finally {
      setDescargando(false);
    }
  };

  const handleIniciarNuevaVersion = () => {
    // Al pulsar editar, se inicializa el borrador a partir de la última versión
    const ultima = versiones[versiones.length - 1];
    if (!ultima) return;

    // Buscar si el cliente existe en la agenda
    const clienteExistente = estado.clientes.find(c => c.nombre === ultima.cliente?.nombre);

    const borradorNuevaVersion = {
      clienteId: clienteExistente ? clienteExistente.id : null,
      lineas: ultima.lineas.map((l, idx) => ({
        id: 'lin_' + Date.now() + '_' + idx,
        descripcion: l.descripcion,
        cantidadCentesimas: l.cantidadCentesimas,
        precioCentimos: l.precioCentimos,
        servicioId: null,
        mercadoMinCentimos: null,
        mercadoMaxCentimos: null
      })),
      irpfPct: ultima.irpfPct,
      condiciones: ultima.condiciones || '',
      fechaValidezManual: ultima.fechaValidez
    };

    dispatch({
      tipo: 'GUARDAR_PRESUPUESTO',
      payload: {
        ...presupuesto,
        borrador: borradorNuevaVersion
      }
    });
  };

  const handleConfirmarAnulacion = () => {
    dispatch({
      tipo: 'ANULAR_PRESUPUESTO',
      payload: presupuesto.id
    });
    setModalAnularAbierto(false);
  };

  return (
    <div class="view-container">
      {/* Cabecera de la vista de detalle */}
      <div class="view-header">
        <div>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            onClick={() => navegar('#/presupuestos')}
            style={{ marginBottom: '0.5rem' }}
          >
            ← Volver al historial
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 class="view-title" style={{ margin: 0 }}>
              {presupuesto.numero}
            </h2>
            {(() => {
              const estInfo = obtenerEstadoPresupuesto(presupuesto);
              return <span class={`badge ${estInfo.badgeClase}`}>{estInfo.texto}</span>;
            })()}
          </div>
        </div>

        {/* Acciones principales */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {!esAnulado && (
            <>
              <button
                type="button"
                class="btn btn-secondary touch-target"
                onClick={handleIniciarNuevaVersion}
              >
                ✏️ Editar (nueva versión)
              </button>
              <button
                type="button"
                class="btn btn-danger touch-target"
                onClick={() => setModalAnularAbierto(true)}
              >
                Anular presupuesto
              </button>
            </>
          )}

          {versionActual && (
            <button
              type="button"
              class="btn btn-primary touch-target"
              disabled={descargando}
              onClick={() => handleDescargarVersion(versionActual)}
            >
              {descargando ? 'Descargando...' : '⬇️ Descargar PDF'}
            </button>
          )}
        </div>
      </div>

      {esAnulado && (
        <Alerta tipo="danger" icono="⛔">
          <strong>Presupuesto anulado:</strong> La anulación es definitiva. Este presupuesto no puede editarse, versionarse ni reactivarse. Al descargar cualquier versión del PDF, este incluirá la marca de agua diagonal «ANULADO».
        </Alerta>
      )}

      {/* Historial de Versiones */}
      <div class="card">
        <h3 class="card-title">Historial de Versiones Emitidas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {versiones.map((v, idx) => {
            const esSeleccionada = idx === versionSeleccionadaIdx;
            return (
              <div
                key={v.numeroVersion}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: esSeleccionada ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                  cursor: 'pointer'
                }}
                onClick={() => setVersionSeleccionadaIdx(idx)}
              >
                <div>
                  <p style={{ fontWeight: '700', margin: 0 }}>
                    Versión {v.numeroVersion} {idx === versiones.length - 1 ? '(vigente al emitirse)' : ''}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Emitida el {formatearFecha(v.emitidaEn)} · Válida hasta {formatearFecha(v.fechaValidez)} · Cliente: {v.cliente?.nombre}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                    {formatearMoneda(v.totales?.totalCentimos)}
                  </span>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDescargarVersion(v);
                    }}
                  >
                    ⬇️ Descargar PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vista previa de la versión seleccionada */}
      {versionActual && (
        <div class="card">
          <h3 class="card-title">
            Vista Previa de la Versión {versionActual.numeroVersion}
          </h3>
          <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
            <VistaPrevia
              presupuesto={{
                numero: presupuesto.numero,
                emitidaEn: versionActual.emitidaEn,
                versionActual: versionActual.numeroVersion
              }}
              emisor={versionActual.emisor}
              cliente={versionActual.cliente}
              lineasCalculadas={versionActual.lineas}
              totales={versionActual.totales}
              esBorrador={false}
              fechaValidez={versionActual.fechaValidez}
              condiciones={versionActual.condiciones}
              esAnulado={esAnulado}
            />
          </div>
        </div>
      )}

      {/* Modal Confirmar Anulación */}
      <Modal
        abierto={modalAnularAbierto}
        titulo="¿Anular este presupuesto definitivamente?"
        onClose={() => setModalAnularAbierto(false)}
        acciones={
          <>
            <button class="btn btn-secondary" onClick={() => setModalAnularAbierto(false)}>
              Cancelar
            </button>
            <button class="btn btn-danger" onClick={handleConfirmarAnulacion}>
              Sí, anular definitivamente
            </button>
          </>
        }
      >
        <p style={{ lineHeight: '1.5' }}>
          La anulación es definitiva. El número <strong>{presupuesto.numero}</strong> se conservará en el registro y no se podrá reutilizar ni modificar. Todas las versiones futuras del PDF llevarán la marca de agua «ANULADO».
        </p>
      </Modal>
    </div>
  );
}
