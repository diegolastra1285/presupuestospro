import { h } from 'preact';
import { VistaPrevia } from './VistaPrevia.jsx';

/**
 * Visor interactivo de documento PDF en tiempo real (FR-009, FR-010, T014).
 * Presenta el documento en pantalla emulando el formato impreso final A4.
 */
export function VisorPdfLive({ 
  presupuesto, 
  emisor, 
  cliente, 
  lineasCalculadas, 
  totales, 
  esBorrador = true,
  fechaValidez,
  condiciones,
  esAnulado = false,
  badgeTexto = 'Borrador'
}) {
  return (
    <div class="visor-pdf-live-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pp-text-muted)' }}>
          Vista Previa en Tiempo Real
        </h3>
        <span class="badge badge--borrador">
          {badgeTexto}
        </span>
      </div>

      <VistaPrevia
        presupuesto={presupuesto}
        emisor={emisor}
        cliente={cliente}
        lineasCalculadas={lineasCalculadas}
        totales={totales}
        esBorrador={esBorrador}
        fechaValidez={fechaValidez}
        condiciones={condiciones}
        esAnulado={esAnulado}
      />
    </div>
  );
}
