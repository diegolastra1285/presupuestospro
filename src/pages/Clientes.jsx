import { h } from 'preact';
import { GestionClientes } from '../components/clientes/GestionClientes.jsx';

/**
 * Página de Clientes (T023).
 */
export function ClientesPage(props) {
  return <GestionClientes {...props} />;
}

export default ClientesPage;
