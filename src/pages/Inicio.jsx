import { h } from 'preact';
import { PaginaInicio } from '../components/inicio/PaginaInicio.jsx';

/**
 * Vista de Inicio / Dashboard (T012, FR-001).
 */
export function Inicio(props) {
  return <PaginaInicio {...props} />;
}

export default Inicio;
