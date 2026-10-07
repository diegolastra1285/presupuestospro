import { h } from 'preact';
import { GestionCatalogo } from '../components/catalogo/GestionCatalogo.jsx';

/**
 * Página de Catálogo (T025).
 */
export function CatalogoPage(props) {
  return <GestionCatalogo {...props} />;
}

export default CatalogoPage;
