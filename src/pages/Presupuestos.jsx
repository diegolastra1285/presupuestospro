import { h } from 'preact';
import { ListadoPresupuestos } from '../components/presupuestos/ListadoPresupuestos.jsx';

/**
 * Página de Listado de Presupuestos (T021).
 */
export function PresupuestosPage(props) {
  return <ListadoPresupuestos {...props} />;
}

export default PresupuestosPage;
