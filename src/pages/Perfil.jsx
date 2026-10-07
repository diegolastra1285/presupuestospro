import { h } from 'preact';
import { ConfiguracionPerfil } from '../components/perfil/ConfiguracionPerfil.jsx';

/**
 * Página de Perfil y Ajustes (T027).
 */
export function PerfilPage(props) {
  return <ConfiguracionPerfil {...props} />;
}

export default PerfilPage;
