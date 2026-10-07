import { h } from 'preact';
import { Header, MobileNavBar } from './Header.jsx';

/**
 * Shell base con la barra de navegación persistente compartida (FR-005, FR-006).
 */
export function Layout({ rutaActual, tema, onCambiarTema, children }) {
  return (
    <div class="app-container">
      <Header 
        rutaActual={rutaActual} 
        tema={tema} 
        onCambiarTema={onCambiarTema} 
      />

      <main class="main-content">
        {children}
      </main>

      <MobileNavBar rutaActual={rutaActual} />
    </div>
  );
}
