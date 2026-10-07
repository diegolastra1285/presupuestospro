# Feature Specification: Rediseño Visual, Sistema de Diseño y Catálogo de Pantallas

**Feature Branch**: `002-redisenio-visual-inicio`

**Created**: 2026-10-05

**Updated**: 2026-10-07

**Status**: En revisión

**Input**: User description: "Reescribir la especificación 002-redisenio-visual-inicio incorporando íntegramente las directrices de diseño, catálogo completo de vistas y patrones de interfaz de la pre-especificación visual (specs/pre-especificacion-visual.md): página de inicio (dashboard) con resumen de métricas y accesos rápidos, listado de presupuestos con filtros y exportación, editor de presupuestos en dos columnas con visor interactivo en tiempo real, gestión concisa de clientes con validación visual de NIF/CIF/NIE, catálogo de servicios con edición ágil, perfil profesional con carga y previsualización de logotipo, sistema de diseño sobrio centralizado mediante tokens bajo convención propia (--pp-), iconografía vectorial ligera sin dependencias externas ni CDNs, diseño mobile-first (360px+, áreas táctiles >=44x44px), coherencia total con la plantilla de PDF descargable y preservación estricta de la lógica de negocio, datos locales y principios constitucionales (YAGNI, cero alcance fantasma, cero dependencias pesadas)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inicio (Dashboard) y Navegación Compartida Persistente (Priority: P1)

Como profesional autónomo o freelance, cuando accedo a la aplicación en la ruta raíz (`#/`), quiero encontrar una página de inicio estructurada que me ofrezca un cuadro de mando con el resumen cuantitativo de mi actividad comercial (`ResumenMetricas`), accesos directos visibles para las acciones clave (`AccesosRapidos`) y un listado con mis presupuestos más recientes (`ListadoRecientes`), manteniendo una barra de navegación compartida y permanente en todas las pantallas para cambiar de sección con un único clic o toque sin recurrir al botón de retroceso del navegador.

**Why this priority**: Es la puerta de entrada principal y el eje vertebrador de la experiencia de usuario. Proporciona visibilidad del negocio de inmediato y conecta fluidamente todas las áreas de la aplicación.

**Independent Test**: Accediendo a la dirección raíz (`#/`), se verifica que se presenta el cuadro de mando con las tarjetas de métricas, los accesos rápidos y los últimos presupuestos registrados. Al pulsar sobre cualquier sección en la barra superior compartida, se transiciona a ella de forma instantánea manteniendo el indicador de sección activa.

**Acceptance Scenarios**:

1. **Given** que el usuario accede a la raíz de la aplicación (`#/`), **When** se presenta la pantalla, **Then** se visualiza el dashboard con:
   - Bloques cuantitativos de métricas (`ResumenMetricas`) con el total de presupuestos y el conteo por cada uno de los 5 estados (Borrador, Enviado, Aceptado, Rechazado, Caducado).
   - Accesos directos de alta visibilidad (`AccesosRapidos`) para «Nuevo Presupuesto», «Ver Presupuestos», «Nuevo Cliente» y «Perfil».
   - Tabla o lista compacta con los presupuestos más recientes (`ListadoRecientes`), mostrando fecha, número, cliente, importe y distintivo de estado.
2. **Given** que el usuario se encuentra en cualquier vista de la aplicación (por ejemplo en Clientes o en el Catálogo), **When** observa la cabecera, **Then** la barra de navegación compartida permanece visible de forma fija o superior con accesos directos a Inicio, Presupuestos, Clientes, Catálogo y Perfil, resaltando visualmente la sección en la que se encuentra.
3. **Given** que el usuario interactúa con la barra de navegación, **When** pulsa en cualquier destino, **Then** cambia de pantalla de forma inmediata en una sola interacción sin recargar la página ni perder datos de la sesión.

---

### User Story 2 - Editor de Presupuestos en Dos Columnas con Visor PDF en Tiempo Real (Priority: P1)

Como profesional emisor de presupuestos, cuando creo o edito una propuesta comercial (`#/presupuestos/nuevo` o `#/presupuestos/:id/editar`), quiero disponer en ordenadores y pantallas amplias de una distribución en dos columnas —formulario estructurado de datos, conceptos y desglose fiscal a la izquierda, y visor interactivo del PDF a la derecha— para comprobar el resultado documental final en tiempo real mientras introduzco los datos sin tener que alternar entre ventanas ni realizar descargas preliminares.

**Why this priority**: Es la funcionalidad nuclear del negocio donde el autónomo invierte mayor tiempo operativo; la retroalimentación visual inmediata elimina errores de cálculo, descuidos en datos fiscales y fricción en la entrega.

**Independent Test**: Al entrar en el editor de presupuestos desde un ordenador de sobremesa o portátil, se comprueba que la pantalla se divide limpiamente en dos columnas funcionales: a la izquierda los campos de emisor, cliente, líneas y desglose impositivo; a la derecha el visor en vivo. Al modificar una cantidad o añadir un concepto, el visor actualiza su contenido de forma inmediata.

**Acceptance Scenarios**:

1. **Given** un ancho de pantalla de escritorio (superior a 1024px), **When** el usuario accede al editor de presupuesto, **Then** la vista presenta una maquetación en dos columnas sincronizadas: a la izquierda los bloques de datos (`FormularioDatos`, `LineasArticulos`, `DesgloseFiscal`) y a la derecha el visor documental interactivo (`VisorPdfLive`).
2. **Given** que el usuario modifica un precio unitario, añade una línea o ajusta el porcentaje de IRPF o IVA en el formulario, **When** el valor cambia, **Then** el desglose fiscal numérico en pantalla y el documento mostrado en el visor interactivo se recalculan y actualizan visualmente de forma automática.
3. **Given** un dispositivo móvil o pantalla estrecha (inferior a 768px), **When** se utiliza el editor, **Then** la interfaz adopta una disposición fluida apilada o conmutación por pestañas («Edición» y «Vista Previa PDF») accesible con un solo toque y manteniendo las zonas de pulsación con tamaño cómodo.

---

### User Story 3 - Listado de Presupuestos Optimizado con Acciones Rápidas y Exportación (Priority: P2)

Como usuario que administra un volumen regular de propuestas, cuando accedo al listado de presupuestos (`#/presupuestos`), quiero contar con una cabecera de acciones destacada (`CabeceraAcciones`), filtros rápidos por estado (`FiltroEstados`), una tabla limpia y legible (`TablaPresupuestos` adaptable a tarjetas táctiles en móvil) y un acceso directo a la exportación masiva (`BotonExportarZip`), para gestionar el ciclo de vida de mis propuestas de manera eficiente y ágil.

**Why this priority**: Permite al autónomo buscar, filtrar y ejecutar acciones inmediatas (editar, duplicar, descargar PDF, cambiar estado) sin saturación visual.

**Independent Test**: Accediendo a `#/presupuestos`, se comprueba la presencia del botón para crear presupuesto, el botón para exportar ZIP, los filtros por estado que actualizan la vista en tiempo real y la conversión responsiva de tabla a tarjetas al reducir la pantalla por debajo de 768px.

**Acceptance Scenarios**:

1. **Given** la vista de listado de presupuestos, **When** el usuario pulsa sobre cualquiera de los filtros de estado (Todos, Borrador, Enviado, Aceptado, Rechazado, Caducado), **Then** la lista filtra instantáneamente los registros mostrando únicamente aquellos que coinciden con el estado seleccionado.
2. **Given** un usuario que visualiza el listado en una pantalla móvil (desde 360px), **When** examina la lista, **Then** la información se presenta en tarjetas táctiles estructuradas sin desbordamiento horizontal, con botones de acción rápida de al menos 44x44px.
3. **Given** presupuestos registrados en el sistema, **When** el usuario se sitúa en la cabecera del listado, **Then** el botón «Exportar todo (.zip)» permanece accesible junto al botón principal de «Nuevo Presupuesto».

---

### User Story 4 - Gestión Ágil de Clientes, Catálogo de Servicios y Perfil Profesional (Priority: P2)

Como profesional autónomo, quiero disponer de pantallas dedicadas, concisas y elegantes para gestionar mis clientes con validación visual inmediata de identificadores fiscales españoles (`#/clientes`), administrar mis servicios habituales con edición ágil (`#/catalogo`), y configurar mis datos fiscales y logotipo comercial con previsualización (`#/perfil`), para mantener mis datos base organizados y preparados para emitir presupuestos en segundos.

**Why this priority**: Constituye la base operativa sobre la que se nutren los presupuestos; formularios confusos o sin validación visual incrementan los errores fiscales y el tiempo de emisión.

**Independent Test**: Se comprueba el alta de un cliente verificando que el identificador NIF/CIF/NIE muestra validación visual inmediata; se comprueba el alta de un servicio en el catálogo con precio base e IVA sugerido; y se comprueba la carga de un logotipo en el perfil verificando que se muestra su previsualización gráfica instantánea junto a las condiciones legales.

**Acceptance Scenarios**:

1. **Given** la sección de Clientes (`#/clientes`), **When** el usuario abre el formulario de cliente (`ModalFormCliente`) e introduce un documento fiscal (NIF, CIF o NIE), **Then** el campo proporciona confirmación visual inmediata de validez o advertencia de formato incorrecto según el estándar fiscal español.
2. **Given** la sección de Catálogo (`#/catalogo`), **When** el usuario visualiza o edita sus servicios (`ListaServicios`, `FormServicio`), **Then** los conceptos se presentan con tipografía ordenada, indicando precio base, IVA aplicable y botones de acción rápida para editar o eliminar.
3. **Given** la sección de Perfil (`#/perfil`), **When** el profesional cumplimenta sus datos fiscales (`FormPerfilFiscal`), sube un archivo de imagen para su logotipo (`CargaLogotipo`) o edita sus cláusulas (`CondicionesLegales`), **Then** la previsualización del logotipo se muestra de inmediato en pantalla y los cambios se preservan localmente.

---

### User Story 5 - Sistema de Diseño Sobrio, Tokens Centralizados e Iconografía Ligera (Priority: P3)

Como usuario que busca rigor y claridad visual, quiero que toda la aplicación se rija por un sistema de diseño profesional y sobrio —con paleta corporativa restringida, tokens centralizados bajo el prefijo `--pp-`, distintivos de estado semánticos armónicos, escala de espaciados consistente e iconografía vectorial limpia y ligera sin dependencias externas pesadas ni conexiones a servidores de terceros— para operar en una herramienta rápida, accesible y confiable.

**Why this priority**: Asegura la consistencia estética y la pureza técnica del producto; evita la fragmentación visual, garantiza el cumplimiento de YAGNI y previene dependencias innecesarias de librerías de estilos o iconos de terceros.

**Independent Test**: Se inspecciona la interfaz global constatando que los estilos derivan de variables centralizadas `--pp-`, que los badges de estado tienen contraste óptimo con texto en español de España, que los iconos son vectores SVG inline o caracteres semánticos sin peticiones de red externas, y que las zonas interactivas táctiles miden como mínimo 44x44px.

**Acceptance Scenarios**:

1. **Given** cualquier vista de la interfaz, **When** se analiza la procedencia de colores, márgenes y tipografía, **Then** todos los estilos visuales provienen de variables centralizadas con prefijo `--pp-` (paleta sobria, escala de espaciado modular `--pp-space-1` a `--pp-space-8`, y variables semánticas de estado).
2. **Given** un presupuesto en cualquiera de los cinco estados (Borrador, Enviado, Aceptado, Rechazado, Caducado), **When** se muestra en tablas, tarjetas o cabeceras, **Then** el estado está representado por una insignia visual distinguible con contraste adecuado, fondo y tipografía sobria en español de España.
3. **Given** botones, enlaces y campos interactivos en cualquier dispositivo, **When** se evalúa su tamaño físico de pulsación, **Then** las áreas táctiles alcanzan un mínimo de 44x44 píxeles.
4. **Given** cualquier componente visual que requiera iconografía, **When** se renderiza en el navegador, **Then** se resuelve exclusivamente mediante vectores SVG inline integrados en el marcado o símbolos tipográficos, sin dependencias de fuentes de iconos externas ni librerías de terceros.

---

### User Story 6 - Plantilla de Documento PDF Profesional y Coherente (Priority: P3)

Como profesional que envía presupuestos a clientes finales, quiero que el documento PDF descargable adopte exactamente el mismo lenguaje visual sobrio y ordenado que la aplicación web —con cabecera equilibrada con logotipo, datos de emisor y cliente alineados, tabla de conceptos limpia con importes formateados en euros (€), y desglose impositivo destacado— para que mis clientes reciban una propuesta comercial de impecable presencia formal.

**Why this priority**: El presupuesto en PDF es el producto final tangible recibido por los clientes; su calidad gráfica condiciona la imagen de profesionalidad y la confianza en la contratación.

**Independent Test**: Al descargar o previsualizar el PDF de un presupuesto con logotipo, líneas con diferentes tipos de IVA y retención de IRPF, se comprueba que la maquetación respeta la estética sobria, los márgenes son homogéneos, las cantidades se alinean rigurosamente a la derecha con el símbolo € y los datos fiscales se leen con total nitidez.

**Acceptance Scenarios**:

1. **Given** un presupuesto con logotipo configurado y datos fiscales completos, **When** se genera el PDF, **Then** el encabezado presenta el logotipo dimensionado armónicamente y los bloques fiscales de emisor y receptor dispuestos con equilibrio visual.
2. **Given** la tabla de líneas y el bloque de totales en el PDF, **When** se examinan los importes, **Then** los precios y totales aparecen tabulados a la derecha, con tipografía uniforme y un bloque de totales destacado que desglosa Base Imponible, cuotas de IVA, retención de IRPF y Total a Pagar en euros (€).

---

### Edge Cases

- **Ausencia total de datos (primer uso o base vacía)**: Al abrir la aplicación sin clientes, catálogo ni presupuestos, el dashboard y los listados deben renderizar estados vacíos proactivos, con contadores en cero y llamadas a la acción amigables para crear el primer registro sin pantallas rotas ni avisos de error.
- **Pantallas móviles compactas (360px de ancho)**: Todos los componentes, formularios, modales y tablas adaptadas deben encajar dentro del ancho útil de 360px sin desbordamiento horizontal accidental, manteniendo un margen mínimo de seguridad y áreas de toque >=44x44px.
- **Nombres y conceptos extensos**: Textos de servicios, descripciones de líneas o nombres de clientes de gran longitud deben ajustarse adecuadamente sin superponerse a los importes ni alterar la maquetación de tarjetas o tablas.
- **Visualización simultánea en pantallas intermedias (Tablets entre 768px y 1024px)**: El editor de presupuestos debe alternar fluidamente entre la disposición apilada y la de dos columnas sin solapamiento entre la columna de formulario y el visor interactivo.
- **Contraste y legibilidad en badges de estado**: Los colores de fondo y texto de los 5 distintivos semánticos deben cumplir los estándares de contraste visual accesible para lectura nítida en modo claro sobre fondos estándar.
- **Presupuestos con múltiples páginas en PDF**: La maquetación del PDF debe dividir ordenadamente las tablas extensas entre páginas consecutivas, repitiendo encabezados cuando proceda y ubicando el bloque de totales al final de forma limpia.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar la vista de Inicio / Dashboard (`#/`) como pantalla por defecto al acceder a la raíz de la aplicación.
- **FR-002**: El Dashboard DEBE incluir un componente de métricas (`ResumenMetricas`) que presente el total global de presupuestos y el desglose cuantitativo para cada uno de los 5 estados: Borrador, Enviado, Aceptado, Rechazado y Caducado.
- **FR-003**: El Dashboard DEBE disponer de accesos directos destacados (`AccesosRapidos`) que permitan iniciar la creación de un nuevo presupuesto, consultar el listado completo, añadir un cliente o acceder al perfil profesional en 1 clic/toque.
- **FR-004**: El Dashboard DEBE mostrar un bloque de actividad reciente (`ListadoRecientes`) con los últimos presupuestos registrados, indicando fecha, número correlativo, cliente, importe total y distintivo de estado.
- **FR-005**: El sistema DEBE incorporar una barra de navegación compartida y permanente visible en todas las vistas de la aplicación, con enlaces directos a Inicio (`#/`), Presupuestos (`#/presupuestos`), Clientes (`#/clientes`), Catálogo (`#/catalogo`) y Perfil (`#/perfil`).
- **FR-006**: La barra de navegación compartida DEBE resaltar de forma unívoca la sección que se encuentre activa en cada momento.
- **FR-007**: El listado de presupuestos (`#/presupuestos`) DEBE incluir una cabecera de acciones (`CabeceraAcciones`) con acceso directo a «Nuevo Presupuesto» y «Exportar todo (.zip)», filtros rápidos por estado (`FiltroEstados`) y tabla de registros (`TablaPresupuestos`).
- **FR-008**: En dispositivos móviles con pantallas estrechas (ancho inferior a 768px), la tabla de presupuestos DEBE transformarse en tarjetas táctiles independientes que eviten el desplazamiento horizontal y ofrezcan botones de acción rápida accesibles.
- **FR-009**: El editor de presupuestos (`#/presupuestos/nuevo` y `#/presupuestos/:id/editar`) DEBE ofrecer en pantallas de escritorio (ancho igual o superior a 1024px) una distribución en dos columnas: columna de edición a la izquierda (`FormularioDatos`, `LineasArticulos`, `DesgloseFiscal`) y visor de PDF interactivo en tiempo real a la derecha (`VisorPdfLive`).
- **FR-010**: En el editor de presupuestos, cualquier alteración en los campos del formulario, conceptos o tipos impositivos DEBE reflejarse de forma automática e inmediata en el desglose fiscal y en la vista previa del visor interactivo.
- **FR-011**: En dispositivos móviles, el editor de presupuestos DEBE permitir alternar fluidamente entre la edición del formulario y la visualización del PDF mediante navegación secuencial o pestañas accesibles en un toque.
- **FR-012**: La vista de Clientes (`#/clientes`) DEBE presentar el listado de clientes (`TablaClientes`) y un formulario modal conciso (`ModalFormCliente`) con validación visual interactiva en tiempo real del formato de NIF, CIF o NIE español.
- **FR-013**: La vista de Catálogo (`#/catalogo`) DEBE permitir consultar (`ListaServicios`) y dar de alta o modificar conceptos de servicios (`FormServicio`), mostrando el precio unitario base y el tipo de IVA sugerido.
- **FR-014**: La vista de Perfil Profesional (`#/perfil`) DEBE estructurar los campos fiscales del profesional emisor (`FormPerfilFiscal`), permitir la carga y previsualización gráfica instantánea del logotipo (`CargaLogotipo`) y la configuración de cláusulas comerciales (`CondicionesLegales`).
- **FR-015**: Toda la interfaz visual DEBE gobernarse mediante un conjunto centralizado de tokens de diseño bajo el prefijo `--pp-`, incluyendo la paleta de colores corporativos sobrios, sombras sutiles, escala tipográfica y escala modular de espaciados (`--pp-space-1` a `--pp-space-8`).
- **FR-016**: Los cinco estados de presupuesto (Borrador, Enviado, Aceptado, Rechazado y Caducado) DEBEN disponer de distintivos visuales (*badges*) con estilos semánticos sobrios definidos centralmente y texto completo en español de España sin abreviaciones crípticas.
- **FR-017**: La iconografía funcional de toda la aplicación DEBE componerse exclusivamente de vectores SVG inline nativos y limpios o caracteres tipográficos semánticos, quedando prohibido cargar bibliotecas de iconos de terceros o recursos remotos mediante CDN.
- **FR-018**: Todos los elementos interactivos (botones, pestañas, selectores, enlaces de acción) DEBEN garantizar un área de pulsación táctil mínima de 44x44 píxeles en dispositivos táctiles y móviles.
- **FR-019**: La plantilla de generación de documentos PDF DEBE reflejar fielmente la identidad estética de la aplicación web: cabecera armónica con logotipo, bloques fiscales alineados, tabla ordenada de conceptos y resumen tributario destacado en euros (€).
- **FR-020**: El sistema DEBE mantener estrictamente intacta toda la lógica de negocio previa, la persistencia en almacenamiento local del cliente, la aritmética fiscal en céntimos y los contratos funcionales existentes, sin alterar datos de usuario ni introducir servidores o servicios de telemetría externos.

### Key Entities *(include if feature involves data)*

- **Resumen Cuantitativo de Actividad (`ResumenMetricas`)**:
  - Representa el balance general de presupuestos calculados en el cliente.
  - Atributos conceptuales: número total de presupuestos registrados, conteo en estado Borrador, conteo en estado Enviado, conteo en estado Aceptado, conteo en estado Rechazado y conteo en estado Caducado.
- **Estado de Presupuesto e Identidad Semántica**:
  - Valores de ciclo de vida: Borrador, Enviado, Aceptado, Rechazado, Caducado.
  - Atributos visuales: etiqueta textual en español de España, colores semánticos sobrios (fondo, texto, borde) asociados a variables del sistema de diseño.
- **Catálogo de Vistas del Sistema**:
  - Dashboard / Inicio (`#/`): punto de entrada con métricas, accesos directos y recientes.
  - Listado de Presupuestos (`#/presupuestos`): tabla/tarjetas de presupuestos con filtros y exportación.
  - Editor de Presupuestos (`#/presupuestos/nuevo`, `#/presupuestos/:id/editar`): formulario y visor en vivo.
  - Clientes (`#/clientes`): directorio y formulario con validación fiscal de NIF/CIF/NIE.
  - Catálogo de Servicios (`#/catalogo`): conceptos habituales con precio base e IVA sugerido.
  - Perfil Profesional (`#/perfil`): datos del emisor, logotipo y condiciones generales.
- **Tokens del Sistema de Diseño (`--pp-*`)**:
  - Entidad de especificación de estilos que centraliza la paleta sobria corporativa, escala modular de espaciados, tipografías y semántica de insignias.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al acceder a la raíz del servicio (`#/`), el 100% de los usuarios acceden directamente al cuadro de mando en un tiempo de carga visual inferior a 1 segundo.
- **SC-002**: La barra de navegación compartida permite desplazarse a cualquiera de las 5 secciones principales en exactamente 1 interacción (un clic o toque) desde cualquier pantalla.
- **SC-003**: El cuadro de métricas del Dashboard refleja con un 100% de precisión y fidelidad el conteo de presupuestos en base a los registros locales existentes.
- **SC-004**: En pantallas de escritorio (>=1024px), el editor presenta la distribución en dos columnas simultáneas, permitiendo al usuario ver el visor interactivo de PDF actualizado en menos de 300 ms tras pausar la edición.
- **SC-005**: En pantallas móviles de 360px o más, el 100% de las pantallas, modales y tarjetas se visualizan de forma íntegra sin presentar barras de desplazamiento horizontal.
- **SC-006**: Todos los elementos táctiles interactivos de la aplicación cumplen con la directriz de accesibilidad de disponer de un área mínima de contacto de 44x44 píxeles.
- **SC-007**: Los 5 estados del ciclo de vida del presupuesto disponen de insignias distintivas claramente diferenciadas y legibles en español de España que superan las pautas de contraste visual.
- **SC-008**: La aplicación no efectúa ninguna petición a redes externas o CDNs para la carga de tipografías, iconos, hojas de estilo o bibliotecas de interfaz gráfica (100% autónoma y local).
- **SC-009**: Ninguna función de cálculo de importes, almacenamiento local en cliente, validación fiscal o exportación sufre regresiones funcionales.

## Assumptions

- **A-001**: La aplicación opera enteramente como Single Page Application (SPA) del lado del cliente, utilizando almacenamiento local en el navegador del usuario sin requerir backend ni base de datos centralizada.
- **A-002**: Las rutas del sistema operan bajo el estándar de enrutamiento por hash (`#/`, `#/presupuestos`, `#/clientes`, `#/catalogo`, `#/perfil`).
- **A-003**: La iconografía se resuelve de forma nativa e inline mediante vectores SVG o tipografía semántica, manteniendo el principio de cero dependencias innecesarias (YAGNI).
- **A-004**: El rediseño de la plantilla PDF mantiene el formato internacional estándar A4 vertical, adaptando su tipografía, márgenes y acentos de color al estilo visual sobrio de la interfaz web.
- **A-005**: Los cálculos fiscales continúan operando con aritmética entera en céntimos para evitar errores de redondeo en IVA e IRPF.
