import { h } from 'preact';

export function Header({ rutaActual, tema, onCambiarTema }) {
  const rutas = [
    { hash: '#/', texto: 'Inicio', icono: '🏠' },
    { hash: '#/presupuestos', texto: 'Presupuestos', icono: '📄' },
    { hash: '#/clientes', texto: 'Clientes', icono: '👥' },
    { hash: '#/catalogo', texto: 'Catálogo', icono: '🏷️' },
    { hash: '#/perfil', texto: 'Perfil y ajustes', icono: '⚙️' }
  ];

  const esRutaActiva = (hash) => {
    if (hash === '#/') {
      return rutaActual === '#/' || rutaActual === '#' || rutaActual === '';
    }
    return rutaActual.startsWith(hash);
  };

  return (
    <header class="header-bar">
      <a href="#/" class="brand" title="Ir a la página de inicio">
        <svg class="brand-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#1e3a8a" />
          <path d="M30 25 h40 a5 5 0 0 1 5 5 v40 a5 5 0 0 1 -5 5 h-40 a5 5 0 0 1 -5 -5 v-40 a5 5 0 0 1 5 -5 z" fill="#ffffff" />
          <rect x="35" y="35" width="30" height="4" rx="2" fill="#1e3a8a" />
          <rect x="35" y="43" width="20" height="4" rx="2" fill="#93c5fd" />
          <text x="50" y="65" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#1e3a8a" text-anchor="middle">€</text>
        </svg>
        <span>PresupuestosPro</span>
      </a>

      <nav class="nav-menu" aria-label="Navegación principal">
        {rutas.map((r) => {
          const activa = esRutaActiva(r.hash);
          return (
            <li class="nav-item" key={r.hash}>
              <a href={r.hash} class={activa ? 'active nav-link--active' : ''}>
                <span>{r.icono}</span>
                <span>{r.texto}</span>
              </a>
            </li>
          );
        })}
      </nav>

      <div class="header-actions">
        <button
          type="button"
          class="theme-toggle-btn touch-target"
          onClick={onCambiarTema}
          title={tema === 'oscuro' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          aria-label="Cambiar tema"
        >
          {tema === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </div>
    </header>
  );
}

export function MobileNavBar({ rutaActual }) {
  const rutas = [
    { hash: '#/', texto: 'Inicio', icono: '🏠' },
    { hash: '#/presupuestos', texto: 'Presupuestos', icono: '📄' },
    { hash: '#/clientes', texto: 'Clientes', icono: '👥' },
    { hash: '#/catalogo', texto: 'Catálogo', icono: '🏷️' },
    { hash: '#/perfil', texto: 'Perfil', icono: '⚙️' }
  ];

  const esRutaActiva = (hash) => {
    if (hash === '#/') {
      return rutaActual === '#/' || rutaActual === '#' || rutaActual === '';
    }
    return rutaActual.startsWith(hash);
  };

  return (
    <nav class="mobile-nav-bar" aria-label="Navegación móvil">
      {rutas.map((r) => {
        const activa = esRutaActiva(r.hash);
        return (
          <a
            key={r.hash}
            href={r.hash}
            class={`mobile-nav-link ${activa ? 'active nav-link--active' : ''}`}
          >
            <span class="mobile-nav-icon">{r.icono}</span>
            <span>{r.texto}</span>
          </a>
        );
      })}
    </nav>
  );
}
