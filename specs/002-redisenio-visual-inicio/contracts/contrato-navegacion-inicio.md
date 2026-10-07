# Contrato: Navegación e Inicio

Este documento especifica las rutas hash y el comportamiento de la capa principal de navegación, implementando la FR-001, FR-005 y FR-006.

## Rutas Hash y Mapas Visuales
La aplicación reacciona puramente al hash (`window.location.hash`) manteniendo un estado reactivo único.
- `#/` o `#/inicio`: Dashboard (Inicio). Resumen de métricas y tarjetas de actividad.
- `#/presupuestos`: Listado de presupuestos emitidos, filtrado y acciones masivas.
- `#/presupuesto/nuevo`: Editor (Modo creación de registro limpio).
- `#/presupuesto/:id/editar`: Editor (Modo modificación con carga de datos previos).
- `#/clientes`: Directorio de clientes con alta y validación fiscal.
- `#/catalogo`: Conceptos estándar.
- `#/perfil`: Configuración global y fiscal.

## Comportamiento de Barra Compartida (Header Global)
- **Persistencia**: La estructura `div.header-bar` estará renderizada globalmente por encima del `<main>` central.
- **Indicador Activo**: Al cambiar la ruta (escuchando el evento `hashchange`), el menú iterará sobre las cinco áreas madre (Inicio, Presupuestos, Clientes, Catálogo, Perfil) y aplicará la clase CSS restrictiva `.nav-link--active` al área donde empiece la URL, resaltando visualmente (color primario, subrayado grueso).
- **Single-click / Touch**: La navegación no recargará el DOM, operando al nivel de la memoria.
