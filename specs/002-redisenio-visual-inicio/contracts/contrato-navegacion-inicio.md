# Contrato: Navegación Compartida y Página de Inicio

**Fuente**: FR-001, FR-002, FR-003, FR-004, FR-005, SC-001, SC-002, SC-003 · Spec: [spec.md](../spec.md)

Este contrato define el comportamiento y estructura de la navegación unificada y de la página de inicio (Index / Cuadro de Mando).

---

## 1. Mapa de rutas y navegación

| Ruta | Vista | Propósito |
|---|---|---|
| `#/` o vacía | `PaginaInicio` | **Punto de entrada de la aplicación** con resumen de actividad y accesos rápidos. |
| `#/presupuestos` | `ListadoPresupuestos` | Historial y gestión de presupuestos. |
| `#/presupuesto/:id` | `EditorPresupuesto` o `DetallePresupuesto` | Creación, edición y visualización de un presupuesto. |
| `#/clientes` | `GestionClientes` | Directorio y mantenimiento de clientes. |
| `#/catalogo` | `GestionCatalogo` | Catálogo de servicios y precios de mercado. |
| `#/perfil` | `ConfiguracionPerfil` | Perfil profesional, datos fiscales y copias de seguridad. |

---

## 2. Componente de Navegación Compartida (`Header` y `MobileNavBar`)

1. **Persistencia**: Está visible en todas y cada una de las pantallas de la aplicación.
2. **Elementos de navegación**:
   - Marca/Logo: Enlace directo a Inicio (`#/`).
   - Enlaces principales:
     - «Inicio» (`#/`)
     - «Presupuestos» (`#/presupuestos`)
     - «Clientes» (`#/clientes`)
     - «Catálogo» (`#/catalogo`)
     - «Perfil» (`#/perfil`)
3. **Indicador de estado activo**:
   - La opción correspondiente a la ruta actual recibe la clase `.nav-link--active` con subrayado o fondo distintivo en `--pp-primary`.
4. **Comportamiento responsive**:
   - En pantallas ≥ 900px: Se muestra en la barra de navegación horizontal superior.
   - En pantallas < 900px: Barra de navegación inferior fija o cabecera compacta que permite cambiar de sección con 1 toque táctil sin ocultar controles esenciales.

---

## 3. Estructura de la Página de Inicio (`PaginaInicio`)

La vista de inicio se divide en los siguientes bloques:

### Bloque A: Cabecera de bienvenida
- Título: «Panel de Actividad» o saludo profesional.
- Subtítulo explicativo: resumen de situación del autónomo.
- Botón de acción principal: `+ Nuevo Presupuesto` (redirige a `#/presupuesto/nuevo`).

### Bloque B: Tarjetas de resumen de presupuestos
Rejilla responsive de tarjetas métricas con los contadores en tiempo real:
- **Total de presupuestos**: Conteo acumulado de registros.
- **Borrador**: Presupuestos pendientes de completar o emitir.
- **Enviado**: Presupuestos remitidos pendientes de decisión del cliente.
- **Aceptado**: Presupuestos aceptados con éxito.
- **Rechazado**: Propuestas no aprobadas.
- **Caducado**: Presupuestos cuya fecha de validez ha vencido.

Cada tarjeta incluye su badge distintivo y permite hacer clic para acceder directamente al listado filtrado de presupuestos.

### Bloque C: Accesos directos a secciones clave
Cuatro tarjetas de navegación directa hacia:
1. **Presupuestos**: «Ver listado completo y crear nuevas propuestas».
2. **Clientes**: «Gestionar cartera de contactos y datos fiscales».
3. **Catálogo**: «Consultar tarifas de servicios y precios de mercado».
4. **Perfil**: «Ajustar datos profesionales y copias de seguridad».
