import { h } from 'preact';
import { useState, useEffect, useReducer } from 'preact/hooks';
import { crearEstadoVacio, crearDatosSemilla } from './domain/estado-inicial.js';
import { 
  cargarEstado, 
  autoguardarEstado, 
  guardarEstadoInmediato,
  solicitarAlmacenamientoPersistente, 
  suscribirSincronizacion 
} from './storage/idb.js';
import { Header, MobileNavBar } from './components/comun/Header.jsx';
import { PaginaInicio } from './components/inicio/PaginaInicio.jsx';
import { ListadoPresupuestos } from './components/presupuestos/ListadoPresupuestos.jsx';
import { EditorPresupuesto } from './components/presupuestos/EditorPresupuesto.jsx';
import { DetallePresupuesto } from './components/presupuestos/DetallePresupuesto.jsx';
import { GestionClientes } from './components/clientes/GestionClientes.jsx';
import { GestionCatalogo } from './components/catalogo/GestionCatalogo.jsx';
import { ConfiguracionPerfil } from './components/perfil/ConfiguracionPerfil.jsx';

function reducer(estado, accion) {
  let nuevoEstado = estado;

  switch (accion.tipo) {
    case 'CARGAR_ESTADO': {
      nuevoEstado = { ...accion.payload };
      break;
    }

    case 'CAMBIAR_TEMA': {
      const nuevoTema = accion.payload || (estado.tema === 'oscuro' ? 'claro' : 'oscuro');
      nuevoEstado = { ...estado, tema: nuevoTema };
      break;
    }

    case 'ACTUALIZAR_PERFIL': {
      nuevoEstado = { ...estado, perfil: { ...accion.payload } };
      break;
    }

    case 'GUARDAR_CLIENTE': {
      const cliente = accion.payload;
      const index = estado.clientes.findIndex(c => c.id === cliente.id);
      let clientesActualizados;
      if (index >= 0) {
        clientesActualizados = [...estado.clientes];
        clientesActualizados[index] = cliente;
      } else {
        clientesActualizados = [...estado.clientes, cliente];
      }
      nuevoEstado = { ...estado, clientes: clientesActualizados };
      break;
    }

    case 'ELIMINAR_CLIENTE': {
      const clienteId = accion.payload;
      const clientesFiltrados = estado.clientes.filter(c => c.id !== clienteId);
      // Actualizar borradores que referenciaban este cliente a clienteId: null (FR-006, US5.5)
      const presupuestosActualizados = estado.presupuestos.map(p => {
        if (p.borrador && p.borrador.clienteId === clienteId) {
          return {
            ...p,
            borrador: {
              ...p.borrador,
              clienteId: null
            }
          };
        }
        return p;
      });
      nuevoEstado = {
        ...estado,
        clientes: clientesFiltrados,
        presupuestos: presupuestosActualizados
      };
      break;
    }

    case 'GUARDAR_SERVICIO': {
      const servicio = accion.payload;
      const index = estado.catalogo.findIndex(s => s.id === servicio.id);
      let catalogoActualizado;
      if (index >= 0) {
        catalogoActualizado = [...estado.catalogo];
        catalogoActualizado[index] = servicio;
      } else {
        catalogoActualizado = [...estado.catalogo, servicio];
      }
      nuevoEstado = { ...estado, catalogo: catalogoActualizado };
      break;
    }

    case 'ELIMINAR_SERVICIO': {
      const servicioId = accion.payload;
      nuevoEstado = {
        ...estado,
        catalogo: estado.catalogo.filter(s => s.id !== servicioId)
      };
      break;
    }

    case 'GUARDAR_PRESUPUESTO': {
      const presupuesto = accion.payload;
      const index = estado.presupuestos.findIndex(p => p.id === presupuesto.id);
      let presupuestosActualizados;
      if (index >= 0) {
        presupuestosActualizados = [...estado.presupuestos];
        presupuestosActualizados[index] = presupuesto;
      } else {
        presupuestosActualizados = [presupuesto, ...estado.presupuestos];
      }

      // Si incluye nuevos contadores
      const contadores = accion.nuevosContadores || estado.contadores;

      nuevoEstado = {
        ...estado,
        presupuestos: presupuestosActualizados,
        contadores
      };
      break;
    }

    case 'ELIMINAR_BORRADOR_PRESUPUESTO': {
      const id = accion.payload;
      nuevoEstado = {
        ...estado,
        presupuestos: estado.presupuestos.filter(p => p.id !== id)
      };
      break;
    }

    case 'ANULAR_PRESUPUESTO': {
      const id = accion.payload;
      const presupuestosActualizados = estado.presupuestos.map(p => {
        if (p.id === id) {
          return {
            ...p,
            estado: 'anulado',
            anuladoEn: new Date().toISOString(),
            borrador: null // se cancela cualquier edición en curso
          };
        }
        return p;
      });
      nuevoEstado = {
        ...estado,
        presupuestos: presupuestosActualizados
      };
      break;
    }

    case 'REEMPLAZAR_ESTADO_COMPLETO': {
      nuevoEstado = { ...accion.payload };
      break;
    }

    default:
      return estado;
  }

  // Guardado automático diferido
  if (accion.tipo !== 'CARGAR_ESTADO') {
    autoguardarEstado(nuevoEstado);
  }

  return nuevoEstado;
}

export function App() {
  const [estado, dispatch] = useReducer(reducer, crearEstadoVacio());
  const [cargado, setCargado] = useState(false);
  const [ruta, setRuta] = useState(window.location.hash || '#/');

  // Inicialización y carga de IndexedDB
  useEffect(() => {
    solicitarAlmacenamientoPersistente();

    async function init() {
      const guardado = await cargarEstado();
      // Si no hay datos (perfil null y presupuestos vacíos), permitir semilla si se desea o dejar vacío
      dispatch({ tipo: 'CARGAR_ESTADO', payload: guardado });
      setCargado(true);
    }
    init();

    // Sincronización entre pestañas
    const desuscribir = suscribirSincronizacion(async () => {
      const actualizado = await cargarEstado();
      dispatch({ tipo: 'CARGAR_ESTADO', payload: actualizado });
    });

    // Control de rutas por hash
    const onHashChange = () => {
      setRuta(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      desuscribir();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // Aplicar tema en el elemento html
  useEffect(() => {
    const tema = estado.tema || 'claro';
    document.documentElement.setAttribute('data-theme', tema);
  }, [estado.tema]);

  if (!cargado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando PresupuestoPro...</p>
      </div>
    );
  }

  // Navegar helper
  const navegar = (nuevoHash) => {
    window.location.hash = nuevoHash;
  };

  // Determinar vista activa
  const renderVista = () => {
    // #/, #/inicio o ruta vacía -> PaginaInicio (FR-001, US1)
    if (ruta === '#/' || ruta === '' || ruta === '#' || ruta === '#/inicio') {
      return (
        <PaginaInicio 
          estado={estado} 
          dispatch={dispatch} 
          navegar={navegar} 
        />
      );
    }

    // #/presupuestos -> ListadoPresupuestos
    if (ruta.startsWith('#/presupuestos')) {
      return (
        <ListadoPresupuestos 
          estado={estado} 
          dispatch={dispatch} 
          navegar={navegar} 
        />
      );
    }

    // #/presupuesto/:id
    if (ruta.startsWith('#/presupuesto/')) {
      const id = ruta.replace('#/presupuesto/', '');
      const presupuesto = estado.presupuestos.find(p => p.id === id);

      // Si existe y es emitido o anulado Y NO tiene borrador abierto -> Vista Detalle
      if (presupuesto && (presupuesto.estado === 'emitido' || presupuesto.estado === 'anulado') && !presupuesto.borrador) {
        return (
          <DetallePresupuesto 
            presupuesto={presupuesto} 
            estado={estado} 
            dispatch={dispatch} 
            navegar={navegar} 
          />
        );
      }

      // En cualquier otro caso (es nuevo, es borrador, o es emitido con borrador de nueva versión en curso) -> Editor
      return (
        <EditorPresupuesto 
          presupuestoId={id} 
          presupuestoExistente={presupuesto} 
          estado={estado} 
          dispatch={dispatch} 
          navegar={navegar} 
        />
      );
    }

    // #/clientes
    if (ruta.startsWith('#/clientes')) {
      return (
        <GestionClientes 
          estado={estado} 
          dispatch={dispatch} 
          navegar={navegar} 
        />
      );
    }

    // #/catalogo
    if (ruta.startsWith('#/catalogo')) {
      return (
        <GestionCatalogo 
          estado={estado} 
          dispatch={dispatch} 
          navegar={navegar} 
        />
      );
    }

    // #/perfil
    if (ruta.startsWith('#/perfil')) {
      return (
        <ConfiguracionPerfil 
          estado={estado} 
          dispatch={dispatch} 
          navegar={navegar} 
        />
      );
    }

    return (
      <div class="empty-state">
        <p class="empty-state-title">Página no encontrada</p>
        <button class="btn btn-primary" onClick={() => navegar('#/')}>
          Volver al Inicio
        </button>
      </div>
    );
  };

  const perfilIncompleto = !estado.perfil || !estado.perfil.nombre || !estado.perfil.nif;

  return (
    <div class="app-container">
      <Header 
        rutaActual={ruta} 
        tema={estado.tema} 
        onCambiarTema={() => dispatch({ tipo: 'CAMBIAR_TEMA' })} 
      />

      <main class="main-content">
        {perfilIncompleto && (
          <div class="alert alert-warning" style={{ marginBottom: '1rem' }}>
            <span>⚠️</span>
            <div>
              <strong>Perfil no configurado:</strong> Para poder emitir presupuestos profesionales en PDF, es necesario indicar al menos tu nombre y NIF en los ajustes.
              {' '}<a href="#/perfil" style={{ fontWeight: '600', textDecoration: 'underline' }}>Completar mi perfil ahora</a>
            </div>
          </div>
        )}

        {renderVista()}
      </main>

      <MobileNavBar rutaActual={ruta} />
    </div>
  );
}
