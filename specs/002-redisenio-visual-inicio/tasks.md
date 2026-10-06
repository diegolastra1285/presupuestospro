# Tasks: Rediseño visual, página de inicio y navegación compartida

**Feature**: `002-redisenio-visual-inicio`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Infraestructura de presentación)

**Purpose**: Inicialización de la estructura de archivos de la capa visual y plantillas

- [X] T001 Crear el directorio `public/css/` y el archivo base `public/css/estilos.css`
- [X] T002 [P] Enlazar la hoja de estilos centralizada `public/css/estilos.css` en `index.html` y retirar las importaciones legadas de `src/styles/*.css` en `src/index.jsx` para unificar la fuente de estilos
- [X] T003 [P] Crear el directorio `src/services/plantillas/` para la plantilla HTML del presupuesto

---

## Phase 2: Foundational (Sistema visual centralizado)

**Purpose**: Definición de variables CSS y tokens del sistema de diseño que bloquean las historias de usuario

- [X] T004 Declarar las variables CSS en `:root` dentro de `public/css/estilos.css` (paleta sobria, escala tipográfica, espaciados estándar, radios y sombras) según `specs/002-redisenio-visual-inicio/contracts/contrato-sistema-visual.md`
- [X] T005 [P] Definir el reseteo tipográfico, jerarquía de encabezados (`h1`, `h2`, `h3`) y superficies sobrias en `public/css/estilos.css`
- [X] T006 [P] Definir las clases e insignias semánticas de estado (`.badge--borrador`, `.badge--enviado`, `.badge--aceptado`, `.badge--rechazado`, `.badge--caducado`) en `public/css/estilos.css`

**Checkpoint**: Tokens visuales y componentes base listos en `public/css/estilos.css`.

---

## Phase 3: User Story 1 - Acceso a la página de inicio y navegación compartida (Priority: P1) 🎯 MVP

**Goal**: Permitir el acceso directo a la página de inicio al entrar a la raíz del servidor (`#/` o `/`) y proporcionar una barra de navegación compartida permanente entre todas las secciones.

**Independent Test**: Acceder a `http://localhost:5173/` y verificar que carga la nueva página de inicio con enlaces directos, y que la barra superior y móvil permite navegar entre Inicio, Presupuestos, Clientes, Catálogo y Perfil sin usar el botón «Atrás» del navegador.

### Implementation for User Story 1

- [X] T007 [US1] Crear el componente de la página de inicio en `src/components/inicio/PaginaInicio.jsx` con contenedor principal, título de bienvenida y accesos rápidos a las cuatro secciones
- [X] T008 [US1] Actualizar el componente `Header` en `src/components/comun/Header.jsx` para incluir permanentemente el enlace a «Inicio» (`#/`) junto a Presupuestos, Clientes, Catálogo y Perfil, con indicador visual de ruta activa
- [X] T009 [US1] Actualizar el componente `MobileNavBar` en `src/components/comun/Header.jsx` para incluir el botón de Inicio y mantener navegación persistente de 5 secciones en pantallas móviles
- [X] T010 [US1] Configurar el enrutador en `src/app.jsx` para que la ruta por defecto (`#/`, `#` o vacía) se normalice y renderice `PaginaInicio` pasando `estado`, `dispatch` y `navegar`

**Checkpoint**: User Story 1 completa y verificable como MVP independiente.

---

## Phase 4: User Story 2 - Resumen de actividad de presupuestos en la página de inicio (Priority: P2)

**Goal**: Mostrar en la página de inicio un resumen cuantitativo del estado de presupuestos (total y desglose en Borrador, Enviado, Aceptado, Rechazado, Caducado) con accesos rápidos.

**Independent Test**: Abrir la página de inicio con presupuestos existentes y verificar que los contadores coinciden con los registros reales, o con cero registros mostrando una llamada a la acción para crear el primer presupuesto.

### Implementation for User Story 2

- [X] T011 [US2] Implementar la función de cálculo en memoria del resumen de actividad (`ResumenActividad`) en `src/components/inicio/PaginaInicio.jsx` evaluando el array `estado.presupuestos`
- [X] T012 [US2] Construir la rejilla de tarjetas métricas (`.metric-card`) en `src/components/inicio/PaginaInicio.jsx` con el recuento total y el desglose de los 5 estados acompañados de sus badges
- [X] T013 [US2] Implementar el estado vacío para cuando no existan presupuestos (`total === 0`) con mensaje informativo y botón de «Crear primer presupuesto» en `src/components/inicio/PaginaInicio.jsx`
- [X] T014 [US2] Conectar los eventos de clic en las tarjetas de estado y en el botón de acción rápida para navegar a `#/presupuestos` o `#/presupuesto/nuevo` en `src/components/inicio/PaginaInicio.jsx`

**Checkpoint**: Página de inicio con resumen dinámico de presupuestos totalmente operativa.

---

## Phase 5: User Story 3 - Rediseño visual profesional, sobrio y estados distinguibles (Priority: P3)

**Goal**: Rediseñar la apariencia de toda la aplicación para proyectar una imagen sobria y profesional con jerarquía clara y estados distinguibles.

**Independent Test**: Recorrer las pantallas de presupuestos, clientes, catálogo y perfil comprobando espaciados uniformes, contrastes WCAG AA, estilos de tabla y visualización inequívoca de los 5 estados de presupuesto.

### Implementation for User Story 3

- [X] T015 [US3] Añadir estilos sobrios para tablas, tarjetas, formularios y cajas de totales (`.metric-card`, `.nav-link--active`, `.totals-box`) en `public/css/estilos.css`
- [X] T016 [US3] Actualizar `src/components/presupuestos/ListadoPresupuestos.jsx` para integrar las nuevas clases de badges de estado sobrios y encabezados consistentes
- [X] T017 [US3] Actualizar `src/components/presupuestos/DetallePresupuesto.jsx` y `src/components/presupuestos/VistaPrevia.jsx` para utilizar las nuevas insignias de estado y la caja de totales rediseñada
- [X] T018 [P] [US3] Aplicar las clases y espaciados de `public/css/estilos.css` en `src/components/clientes/GestionClientes.jsx` y `src/components/catalogo/GestionCatalogo.jsx`
- [X] T019 [P] [US3] Ajustar la apariencia y márgenes de los formularios en `src/components/perfil/ConfiguracionPerfil.jsx` para armonizar con el sistema visual sobrio

**Checkpoint**: Todas las vistas de la aplicación reflejan la nueva identidad visual sobria.

---

## Phase 6: User Story 4 - Documento PDF con estética profesional coherente (Priority: P4)

**Goal**: Aplicar la misma estética sobria y profesional a la plantilla del presupuesto en PDF que recibe el cliente final.

**Independent Test**: Descargar un presupuesto en PDF y comprobar visualmente que la maquetación es limpia, con azul marino sobrio, bordes finos, tablas alineadas y totales destacados, pasando todas las pruebas de contrato de PDF.

### Implementation for User Story 4

- [X] T020 [US4] Crear la plantilla HTML de referencia de diseño en `src/services/plantillas/presupuesto.html` con estructura limpia de emisor, cliente, tabla de líneas y totales destacados según `specs/002-redisenio-visual-inicio/contracts/contrato-plantilla-pdf.md`
- [X] T021 [US4] Actualizar la definición del generador en `src/pdf/generador.js` para aplicar la paleta sobria (azul corporativo `#1e3a8a`, bordes `#cbd5e1`, jerarquía de totales) manteniendo el fondo blanco
- [X] T022 [US4] Ejecutar y validar que los tests de contrato en `tests/contract/pdf-definicion.test.js` pasen al 100% sin regresiones de formato ni estructura

**Checkpoint**: El documento PDF proyecta la misma imagen profesional que la web.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finales de responsividad mobile-first, pruebas de no regresión y validación interactiva

- [X] T023 [P] Ajustar las reglas de diseño responsivo en `public/css/estilos.css` para anchos de 320 px a 375 px, garantizando que la navegación móvil no oculte controles ni la barra de totales
- [X] T024 [P] Ejecutar la suite completa de pruebas unitarias y de contratos (`npm test -- --run`) confirmando cero regresiones
- [X] T025 Ejecutar la validación funcional interactiva completa siguiendo los 4 escenarios de `specs/002-redisenio-visual-inicio/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias, inicio inmediato.
- **Foundational (Phase 2)**: Depende de Phase 1. Bloquea la implementación de las historias de usuario.
- **User Story 1 (Phase 3)**: Depende de Phase 2. MVP inicial.
- **User Story 2 (Phase 4)**: Depende de US1 (monta sobre `PaginaInicio.jsx`).
- **User Story 3 (Phase 5)**: Depende de Phase 2; puede desarrollarse en paralelo con US2 o a continuación.
- **User Story 4 (Phase 6)**: Depende de Phase 2; independiente de la UI web (enfoque en PDF).
- **Polish (Phase 7)**: Depende de la finalización de todas las historias de usuario.

### Parallel Opportunities

- T002 y T003 pueden ejecutarse en paralelo con T001.
- T005 y T006 pueden desarrollarse en paralelo una vez iniciado T004.
- T018 y T019 (Clientes, Catálogo y Perfil) pueden ejecutarse en paralelo.
- T020 (Plantilla HTML) y T021 (Generador PDF) pueden prepararse de forma desacoplada de la UI web.
- T023 y T024 en la fase de Polish pueden correr en paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup (T001-T003) y Foundational (T004-T006).
2. Implementar User Story 1 (T007-T010).
3. Validar de forma independiente: comprobar que entrar en `/` muestra la página de inicio y que la navegación compartida permite moverse entre secciones.

### Incremental Delivery

1. Foundation: Sistema visual en `public/css/estilos.css`.
2. Incremento 1 (MVP): Página de inicio y navegación permanente (US1).
3. Incremento 2: Resumen dinámico de presupuestos por estado (US2).
4. Incremento 3: Rediseño visual global de tablas, formularios y badges (US3).
5. Incremento 4: Plantilla PDF sobria y profesional (US4).
6. Verificación final y cierre: Polish y suite de tests (Phase 7).
