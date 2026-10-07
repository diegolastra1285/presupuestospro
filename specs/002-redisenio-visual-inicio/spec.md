# Feature Specification: Rediseño visual, página de inicio y navegación compartida

**Feature Branch**: `002-redisenio-visual-inicio`

**Created**: 2026-10-05

**Status**: Publicada

**Input**: User description: "Mejorar la presentación de PresupuestosPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente. Primero: añadir una página de inicio (index) que sea el punto de entrada de la aplicación al acceder a la raíz del servidor, con navegación clara hacia las cuatro secciones existentes (Presupuestos, Clientes, Catálogo y Perfil) y un pequeño resumen de actividad (por ejemplo, número de presupuestos por estado). Además, todas las páginas deben compartir una navegación común visible para moverse entre secciones sin usar el botón atrás. Segundo: rediseñar la apariencia visual de toda la aplicación para que resulte profesional y sobria: tipografía consistente, paleta de colores limitada definida en un único lugar, espaciado uniforme, jerarquía visual clara entre títulos, tablas, formularios y totales, y estados visuales distinguibles para los presupuestos (Borrador, Enviado, Aceptado, Rechazado, Caducado). El rediseño debe aplicarse también a la plantilla del PDF para que el documento que recibe el cliente transmita la misma imagen profesional. Debe mantenerse el enfoque mobile-first ya existente y todos los textos en español de España. La lógica de negocio, los cálculos, la API y el esquema de datos no deben cambiar en absoluto."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceso a la página de inicio y navegación compartida (Priority: P1)

Como profesional autónomo o freelance, cuando abro la aplicación en la dirección raíz del servicio, quiero ser recibido por una página de inicio clara que me ofrezca una visión resumida de mi actividad y me permita desplazarme directamente a cualquiera de las secciones principales (Presupuestos, Clientes, Catálogo y Perfil), manteniendo una barra o menú de navegación compartido y visible en todo momento para cambiar de sección sin recurrir al botón de retroceso del navegador.

**Why this priority**: Es la puerta de entrada principal y el pilar estructural que conecta toda la experiencia de usuario. Proporciona contexto inmediato sobre el negocio y elimina la necesidad de depender del historial del navegador.

**Independent Test**: Se puede comprobar accediendo a la URL raíz del servicio: se verifica que carga la página de inicio con los enlaces directos y el menú común, y que al hacer clic en cada sección se accede de forma inmediata y se puede regresar o cambiar de sección desde la barra de navegación persistente.

**Acceptance Scenarios**:

1. **Given** que el usuario accede por primera vez o recarga la aplicación en la ruta raíz (`/`), **When** se presenta la pantalla, **Then** se muestra la página de inicio con enlaces directos visibles hacia las secciones de Presupuestos, Clientes, Catálogo y Perfil, junto con la navegación común superior o principal.
2. **Given** que el usuario se encuentra en cualquier sección de la aplicación (por ejemplo, en el Catálogo o en el Editor de Presupuesto), **When** observa la parte superior/navegación de la interfaz, **Then** visualiza de forma permanente la navegación compartida con accesos directos a Inicio, Presupuestos, Clientes, Catálogo y Perfil, con indicación visual de la sección actualmente activa.
3. **Given** que el usuario pulsa sobre cualquiera de las opciones de la navegación compartida, **When** se selecciona otra sección, **Then** la aplicación transiciona inmediatamente a la sección solicitada sin perder el estado global ni obligar a usar el botón «Atrás» del navegador.

---

### User Story 2 - Resumen de actividad de presupuestos en la página de inicio (Priority: P2)

Como usuario profesional, quiero ver en la página de inicio un resumen cuantitativo del estado de mis presupuestos (cuántos tengo en Borrador, Enviados, Aceptados, Rechazados y Caducados) junto con accesos rápidos para crear un nuevo presupuesto o consultar la lista completa, para conocer el pulso comercial de mi actividad en un solo vistazo.

**Why this priority**: Aporta valor de negocio inmediato y orientación de trabajo al profesional cada vez que inicia su jornada o abre la herramienta.

**Independent Test**: Creando presupuestos con diferentes estados en la aplicación y accediendo a la página de inicio, se verifica que las tarjetas de resumen muestran el conteo exacto de presupuestos para cada estado y permiten navegar al listado correspondiente.

**Acceptance Scenarios**:

1. **Given** que existen presupuestos registrados en distintos estados (Borrador, Enviado, Aceptado, Rechazado, Caducado), **When** el usuario visualiza la página de inicio, **Then** se muestran bloques o tarjetas con el total general y el desglose de unidades por cada uno de los 5 estados disponibles.
2. **Given** que no existen presupuestos todavía en la aplicación (estado inicial o base de datos vacía), **When** el usuario entra en la página de inicio, **Then** el resumen de actividad muestra contadores a cero acompañados de una llamada a la acción amistosa para crear el primer presupuesto.
3. **Given** que el usuario hace clic en el resumen o en el botón de acción rápida de «Nuevo Presupuesto» en la página de inicio, **When** acciona dicho enlace, **Then** se abre directamente el flujo de creación de presupuesto.

---

### User Story 3 - Rediseño visual profesional, sobrio y estados distinguibles (Priority: P3)

Como profesional que gestiona propuestas comerciales, quiero que la interfaz tenga una apariencia sobria, elegante y uniforme —con tipografía legible y jerárquica, una paleta cromática restringida y armoniosa, espaciados consistentes y distinciones visuales inequívocas para los estados de presupuesto— para trabajar cómodamente y proyectar rigor profesional.

**Why this priority**: Una interfaz bien jerarquizada y con colores sobrios reduce el cansancio visual, minimiza errores en formularios y tablas complejas, y mejora la percepción de calidad del producto.

**Independent Test**: Inspeccionando visualmente las tablas, formularios, títulos y tarjetas en todas las pantallas (tanto en escritorio como en móvil), comprobando que los estilos (tipografías, márgenes, colores de fondo y bordes) provienen de un conjunto unificado y que cada estado (Borrador, Enviado, Aceptado, Rechazado, Caducado) cuenta con una etiqueta/insignia con contraste adecuado y fácilmente reconocible.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla de la aplicación, **When** se evalúa la jerarquía tipográfica y espacial, **Then** los encabezados, textos auxiliares, tablas, controles de formulario y bloques de totales guardan proporciones y márgenes consistentes y armónicos.
2. **Given** un presupuesto en cualquiera de sus posibles estados (Borrador, Enviado, Aceptado, Rechazado, Caducado), **When** se lista en tablas o se muestra en la cabecera del detalle, **Then** aparece representado con una etiqueta visual distintiva cuyo color y estilo semántico es sobrio y claramente diferenciado de los otros cuatro estados.
3. **Given** una tabla de conceptos o un formulario con campos de entrada (cliente, emisor, líneas de presupuesto), **When** el usuario interactúa con ellos, **Then** los estados de foco, selección y error mantienen el esquema de color sobrio y una clara diferenciación respecto al fondo.

---

### User Story 4 - Documento PDF con estética profesional coherente (Priority: P4)

Como profesional que entrega propuestas a clientes finales, quiero que el archivo PDF descargable refleje exactamente el mismo rediseño visual sobrio y cuidado de la aplicación, con tipografía ordenada, distribución limpia de cabecera, datos de las partes, tabla de líneas y bloque de totales con impuestos desglosados, para que el cliente final reciba un documento formal de alta calidad.

**Why this priority**: El PDF es el entregable que ve el cliente final; su apariencia condiciona directamente la imagen de marca y la confianza en el profesional que emite la propuesta.

**Independent Test**: Generando y descargando un PDF desde la vista previa o detalle de un presupuesto, y abriéndolo en un visor estándar para constatar que la tipografía es sobria y nítida, los márgenes y alineaciones son regulares, la paleta cromática es contenida y profesional, y los datos fiscales y desgloses de impuestos se leen con total claridad.

**Acceptance Scenarios**:

1. **Given** un presupuesto con emisor, cliente, líneas de catálogo, notas y totales calculados, **When** el usuario pulsa en descargar o previsualizar el PDF, **Then** el documento resultante presenta un diseño sobrio, con cabecera jerarquizada, datos de contacto alineados, tabla con bordes limpios y tipografía homogénea.
2. **Given** el bloque de importes y totales en el PDF (subtotal, desglose de IVA, retención de IRPF y total a pagar en euros €), **When** se inspecciona visualmente el documento, **Then** las cantidades están alineadas a la derecha con un formateo monetario nítido y una jerarquía visual que destaca el total sin estridencias de color.

---

### Edge Cases

- **Cero registros existentes**: Al acceder por primera vez sin presupuestos, clientes ni catálogo, la página de inicio y la navegación deben renderizarse de forma ordenada, con los contadores en 0 y sin mostrar áreas vacías deformadas o mensajes de error técnico.
- **Títulos o descripciones extensas en tablas y resúmenes**: En pantallas de teléfono móvil estrechas (320px - 375px), los textos largos de conceptos o nombres de clientes no deben desbordar la pantalla ni romper la estructura de las tarjetas o navegación.
- **Nombres de estados en badges**: Los cinco estados en español de España («Borrador», «Enviado», «Aceptado», «Rechazado», «Caducado») deben mantener el texto completo visible y legible dentro de sus respectivas insignias sin truncamiento indeseado.
- **Navegación en pantallas móviles estrechas**: La navegación compartida debe ser completamente accesible en terminales táctiles pequeños, ya sea mediante barra de iconos/texto compacta o menú colapsable accesible, sin ocultar contenido ni superponerse a los formularios o botones principales de acción.
- **Generación de PDF con muchas líneas**: Si el presupuesto contiene múltiples conceptos que ocupan más de una página en el PDF, la maquetación debe mantener los encabezados legibles y la jerarquía de totales al pie de la última página de forma consistente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE establecer la página de inicio (Index / Cuadro de mando) como la vista inicial por defecto cuando el usuario accede a la raíz de la aplicación.
- **FR-002**: La página de inicio DEBE presentar una sección de bienvenida y resumen de actividad que muestre el número total de presupuestos y el desglose de cantidades clasificadas por cada uno de los cinco estados: Borrador, Enviado, Aceptado, Rechazado y Caducado.
- **FR-003**: La página de inicio DEBE proporcionar enlaces directos o accesos destacados hacia las cuatro secciones existentes de la aplicación: Presupuestos, Clientes, Catálogo y Perfil, además de un acceso directo para crear un nuevo presupuesto.
- **FR-004**: El sistema DEBE disponer de un componente de navegación común y visible en todas las páginas y vistas de la aplicación, permitiendo saltar a Inicio, Presupuestos, Clientes, Catálogo o Perfil con un único clic/toque sin necesidad de recurrir al historial de navegación del navegador.
- **FR-005**: La navegación común DEBE destacar visualmente la sección en la que se encuentra el usuario en cada momento (estado activo).
- **FR-006**: Toda la interfaz de usuario DEBE emplear una paleta de colores sobria y limitada, definida de manera centralizada en un único punto del sistema de diseño, garantizando coherencia visual en toda la aplicación.
- **FR-007**: Toda la aplicación DEBE emplear una escala tipográfica estructurada y consistente para títulos principales, títulos de sección, cuerpo de texto, etiquetas y valores numéricos.
- **FR-008**: Los cinco estados del presupuesto (Borrador, Enviado, Aceptado, Rechazado, Caducado) DEBEN disponer de distintivos visuales (etiquetas/insignias) claramente reconocibles y diferenciados entre sí mediante colores semánticos sobrios y texto legible en español de España.
- **FR-009**: La disposición de elementos, formularios, tablas y cajas de totales DEBE aplicar un sistema de espaciado uniforme y armónico en todas las vistas de la herramienta.
- **FR-010**: El diseño de la interfaz DEBE mantener el enfoque «mobile-first», garantizando una experiencia visual y de interacción cómoda tanto en pantallas de teléfonos inteligentes como en tabletas y ordenadores de sobremesa.
- **FR-011**: La plantilla de generación de documentos PDF DEBE adoptar el mismo lenguaje estético sobrio y profesional que la aplicación web, incluyendo tipografía armónica, paleta de colores contenida, tablas alineadas y jerarquía destacada para el resumen de impuestos (IVA, IRPF) y el total a pagar en euros (€).
- **FR-012**: El sistema DEBE garantizar que todos los textos, rótulos, mensajes de ayuda y estados permanezcan redactados íntegramente en español de España (es-ES) y con la moneda Euro (€).
- **FR-013**: El sistema DEBE conservar estrictamente intacta toda la lógica de negocio, las fórmulas de cálculo de importes e impuestos, la estructura de almacenamiento de datos existente y los contratos funcionales previos sin alteración de datos de usuario.

### Key Entities *(include if feature involves data)*

- **Resumen de Actividad**: Entidad de presentación que consolida la información agregada para la página de inicio.
  - Atributos conceptuales: total de presupuestos registrados, cantidad de presupuestos en borrador, cantidad de presupuestos enviados, cantidad de presupuestos aceptados, cantidad de presupuestos rechazados y cantidad de presupuestos caducados.
- **Estado de Presupuesto (Identidad Visual)**: Entidad que asocia cada valor del ciclo de vida del presupuesto con su representación en la interfaz.
  - Valores: Borrador, Enviado, Aceptado, Rechazado, Caducado.
  - Atributos visuales: texto identificativo en español de España, variante de color semántico sobrio (tono de fondo, tono de texto y borde acorde con la paleta centralizada).
- **Tema Visual / Sistema de Diseño**: Entidad conceptual que gobierna la apariencia de la aplicación y del PDF.
  - Atributos: paleta de colores centralizada (colores neutros principales, color primario corporativo sobrio, colores semánticos para estados y alertas), escala tipográfica normalizada y escala de espaciados uniformes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al acceder a la dirección raíz de la aplicación, el 100% de los usuarios son dirigidos directamente a la página de inicio en un tiempo de carga visual inmediato (inferior a 1 segundo en condiciones normales).
- **SC-002**: Desde cualquier pantalla o sección de la aplicación, el usuario puede cambiar a cualquiera de las restantes cuatro secciones o volver al inicio en exactamente 1 interacción (un clic o toque) a través de la navegación común visible.
- **SC-003**: El resumen de actividad de la página de inicio refleja de forma exacta (100% de fidelidad) el número de presupuestos existentes en cada uno de los 5 estados en base a los registros almacenados.
- **SC-004**: Los cinco estados de presupuesto cuentan con distintivos visuales diferenciados que superan los criterios de contraste visual y legibilidad, permitiendo a los usuarios identificar el estado de una propuesta de un solo vistazo.
- **SC-005**: El 100% de las variables cromáticas principales de la interfaz están definidas en un único archivo de configuración de estilos centralizado.
- **SC-006**: El documento PDF generado y descargado exhibe la nueva plantilla sobria y profesional, manteniendo la totalidad de los datos fiscales, conceptos y cálculos monetarios idénticos a los del presupuesto en pantalla.
- **SC-007**: El 100% de los componentes de navegación, páginas y formularios se adaptan fluidamente a anchos de pantalla móviles (desde 320 píxeles de ancho) sin presentar desbordamientos horizontales no deseados.
- **SC-008**: Ninguna prueba o funcionalidad de cálculo de totales, guardado de clientes, guardado de conceptos ni almacenamiento de presupuestos sufre regresiones funcionales ni cambios en su esquema de datos.

## Assumptions

- **A-001**: La aplicación continúa funcionando como una solución web cliente, conservando el almacenamiento local previamente implementado sin requerir un servidor de autenticación ni backend externo para este rediseño.
- **A-002**: Las cuatro secciones existentes (Presupuestos, Clientes, Catálogo y Perfil) conservan sus rutas y componentes funcionales internos, actuando la página de inicio como centro de bienvenida y punto de partida de la navegación.
- **A-003**: La paleta sobria y profesional utilizará tonos neutros (grises estructurados, pizarra o similar) combinados con un color corporativo principal sobrio (como un azul petróleo o marino clásico) y toques de color semántico moderados para estados (verde para aceptado, ámbar/ocre para enviado o caducado, rojo apagado para rechazado, gris neutro para borrador).
- **A-004**: El rediseño de la plantilla PDF mantiene el formato estándar A4 vertical y se actualiza exclusivamente en cuanto a maquetación, tipografías, colores de acento y márgenes, sin alterar los campos legales de emisor, cliente ni conceptos tributarios (IVA, IRPF).
