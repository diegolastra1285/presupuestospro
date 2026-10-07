import { h } from 'preact';
import { 
  IconoPresupuestos, 
  IconoClientes, 
  IconoCatalogo, 
  IconoPerfil,
  IconoPlus 
} from '../comun/iconos.jsx';

/**
 * Accesos directos destacados del Dashboard (FR-003, FR-018).
 * Asegura áreas táctiles mínimas de 44x44px.
 */
export function AccesosRapidos({ navegar }) {
  const acciones = [
    {
      titulo: 'Nuevo Presupuesto',
      desc: 'Crear una nueva propuesta comercial con visor PDF en tiempo real.',
      ruta: '#/presupuesto/nuevo',
      icono: <IconoPlus size={22} color="var(--pp-primary)" />,
      primario: true
    },
    {
      titulo: 'Ver Presupuestos',
      desc: 'Listado completo, filtros por estado y exportación masiva ZIP.',
      ruta: '#/presupuestos',
      icono: <IconoPresupuestos size={22} color="var(--pp-primary)" />
    },
    {
      titulo: 'Nuevo Cliente',
      desc: 'Añadir cliente con validación fiscal interactiva de NIF/CIF/NIE.',
      ruta: '#/clientes',
      icono: <IconoClientes size={22} color="var(--pp-primary)" />
    },
    {
      titulo: 'Perfil Profesional',
      desc: 'Configurar datos de emisor, logotipo y condiciones legales.',
      ruta: '#/perfil',
      icono: <IconoPerfil size={22} color="var(--pp-primary)" />
    }
  ];

  return (
    <div class="nav-shortcut-grid">
      {acciones.map((acc, index) => (
        <a 
          key={index} 
          href={acc.ruta} 
          class={`nav-shortcut-card ${acc.primario ? 'nav-shortcut-card--primary' : ''}`}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <div class="nav-shortcut-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {acc.icono}
          </div>
          <div class="nav-shortcut-title">{acc.titulo}</div>
          <div class="nav-shortcut-desc">{acc.desc}</div>
        </a>
      ))}
    </div>
  );
}
