# Research — PresupuestoPro v1

**Fase 0 del plan** · Fecha: 2026-10-03 · Spec: [spec.md](./spec.md)

Criterio rector (constitución, principio I y petición del usuario): **ante dos opciones, la más simple**. Una V1 que se publique online enseguida, que funcione bien en el móvil y sin infraestructura que la spec no pida (sin cuentas, sin base de datos en la nube, sin servidor propio).

Cada decisión se explica primero en **lenguaje de negocio** y después con el detalle técnico.

---

## D1. Tipo de aplicación: web estática que funciona entera en el navegador

**En lenguaje de negocio**: la aplicación es una página web que se abre con un enlace, en el ordenador o en el móvil, sin instalar nada. No hay "servidor de la empresa" que mantener, pagar ni proteger: los datos del freelancer nunca salen de su dispositivo. Publicarla es tan sencillo como subir una carpeta de archivos a un alojamiento gratuito.

- **Decision**: Single Page Application 100 % en el cliente, publicada como ficheros estáticos (HTML, CSS, JS).
- **Rationale**: cumple FR-024 (sin cuentas, sin envío de datos, sin conexión) por diseño; coste de alojamiento cero; despliegue en minutos.
- **Alternatives considered**:
  - App con servidor propio y base de datos → rechazada: la spec la excluye (Out of Scope) y añade coste, seguridad y mantenimiento.
  - App nativa (iOS/Android) o de escritorio (Electron) → rechazada: publicación lenta (tiendas, firmas) y varias bases de código.

## D2. Funcionamiento sin conexión e "instalable" en el móvil (PWA)

**En lenguaje de negocio**: tras la primera visita, la aplicación sigue funcionando aunque no haya internet (en el tren, en casa de un cliente). Además, el freelancer puede "añadirla a la pantalla de inicio" de su móvil y abrirla como si fuera una app.

- **Decision**: Progressive Web App con un *service worker* generado automáticamente (plugin `vite-plugin-pwa`, modo `generateSW`) y un manifiesto con nombre e iconos.
- **Rationale**: FR-024 exige funcionar sin conexión; una sola línea de configuración lo resuelve. Instalarla en la pantalla de inicio además protege los datos en iPhone (ver D4).
- **Alternatives considered**: escribir el *service worker* a mano → más código y más riesgo de errores de caché; no ofrecer modo sin conexión → incumple FR-024.

## D3. Tecnología de la interfaz: Preact + Vite, en JavaScript

**En lenguaje de negocio**: usamos una herramienta muy ligera (Preact, ~4 KB) que hace que la vista previa se actualice al instante mientras se escribe, sin que el cursor "salte" ni se pierda lo tecleado. Es una versión mínima de la tecnología más usada del mercado, así que cualquier desarrollador podrá mantenerla.

- **Decision**: Preact (componentes con JSX) empaquetado con Vite. Lenguaje: **JavaScript** moderno (sin TypeScript). Estilos con **CSS propio** y variables CSS (sin frameworks de estilos).
- **Rationale**: la pantalla dividida con vista previa en vivo (FR-010, SC-004) obliga a repintar en cada pulsación; hacerlo a mano con JavaScript puro hace perder el foco de los campos y multiplica el código. Preact lo resuelve con una dependencia mínima. Vite da servidor de desarrollo, build optimizado y pruebas (Vitest) con una sola herramienta.
- **Alternatives considered**:
  - JavaScript puro sin librería → más simple en dependencias, pero más complejo en código para formularios reactivos (rechazado por el principio I aplicado al código total).
  - React / Vue / Angular / Next.js → más pesados o con más conceptos; Next.js presupone servidor.
  - TypeScript → más seguridad de tipos, pero añade configuración; las reglas críticas (dinero, numeración) se protegen con pruebas automáticas.
  - Tailwind u otros frameworks CSS → innecesarios para ~6 pantallas.

## D4. Dónde se guardan los datos: en el propio navegador (IndexedDB)

**En lenguaje de negocio**: todo (perfil, catálogo, clientes, presupuestos) se guarda automáticamente en el dispositivo del freelancer, sin botón de "guardar". Hay espacio de sobra para miles de presupuestos y para el logo. La contrapartida: si el freelancer borra los datos del navegador o cambia de dispositivo, los pierde, salvo que use la **copia de seguridad** (Historia 8).

- **Decision**: IndexedDB a través de la micro-librería `idb-keyval` (~600 bytes). Todo el estado de la aplicación se guarda como **un único documento** bajo una clave (`presupuestopro:estado`), con guardado automático tras cada cambio (con un retardo de ~300 ms para no escribir en cada tecla). Al arrancar se solicita almacenamiento persistente (`navigator.storage.persist()`).
- **Rationale**: FR-023 y "cierre inesperado" (Edge Cases). Un único documento es lo más simple de leer, guardar, exportar e importar (la copia de seguridad es literalmente ese documento). IndexedDB admite cientos de MB, frente a los ~5 MB de `localStorage`, donde un logo de 1 MB (≈1,4 MB en texto) más el historial podría llenarlo.
- **Alternatives considered**:
  - `localStorage` → API más simple, pero límite de ~5 MB y escritura bloqueante; riesgo real de quedarse sin espacio.
  - Base de datos en la nube (Firebase, Supabase) → excluida por la spec y por el usuario.
  - Una tabla por entidad en IndexedDB → más flexible, pero más código sin necesidad para un solo usuario.
- **Riesgo conocido (iPhone/Safari)**: Safari borra los datos de una web si no se visita en 7 días de uso del navegador. **Las apps añadidas a la pantalla de inicio están exentas.** Mitigación dentro del alcance: PWA instalable (D2) + copia de seguridad (FR-025). Ver "User Review Required" en el plan.

## D5. Varias pestañas abiertas a la vez

**En lenguaje de negocio**: si el freelancer abre la aplicación en dos pestañas, no se deben pisar los datos ni repetirse un número de presupuesto (SC-006).

- **Decision**: (1) la asignación de número se hace con una operación atómica de lectura-escritura sobre los datos guardados (`update()` de `idb-keyval`), leyendo siempre el contador más reciente; (2) cada vez que una pestaña guarda, avisa a las demás (`BroadcastChannel`) y estas recargan el estado.
- **Rationale**: garantiza "sin huecos ni duplicados" con ~20 líneas de código y sin servidor.
- **Alternatives considered**: bloquear la segunda pestaña → peor experiencia; ignorarlo → riesgo de números duplicados.

## D6. Generación del PDF: pdfmake, en el propio dispositivo

**En lenguaje de negocio**: el PDF se fabrica en el dispositivo del freelancer en uno o dos segundos, sin enviarlo a ningún sitio. El texto es real (se puede seleccionar y buscar), se ve nítido al imprimir, las tablas largas continúan en la página siguiente repitiendo la cabecera, los totales nunca se cortan y las páginas van numeradas. La marca de agua "ANULADO" viene incluida de serie.

- **Decision**: `pdfmake` con su tipografía por defecto (Roboto, incluye tildes, ñ y €). Se carga **solo al pulsar "Generar PDF"** (carga diferida) para que la aplicación abra rápido en el móvil; tras la primera vez queda en caché para uso sin conexión.
- **Rationale**: pdfmake es declarativo (se describe el documento, no se dibuja píxel a píxel) y trae de serie lo que pide la spec: ajuste de texto en celdas (US2.7), cabecera de tabla repetida (`headerRows`), bloque de totales indivisible (`unbreakable`), pie con número de página y `watermark` para "ANULADO" (FR-020). Cumple SC-003 (< 5 s).
- **Alternatives considered**:
  - `jsPDF` + `autotable` → viable, pero más imperativo y la marca de agua y el bloque indivisible requieren código manual.
  - Imprimir la vista previa HTML con el navegador (`window.print()`) → no permite controlar el nombre del archivo (FR-016), varía entre navegadores y en móvil es poco fiable.
  - Convertir HTML a imagen y luego a PDF (`html2canvas`) → texto borroso no seleccionable y archivos pesados.
  - Generarlo en un servidor → requiere infraestructura excluida.

## D7. Vista previa en pantalla: HTML, no el PDF

**En lenguaje de negocio**: lo que el freelancer ve a la derecha mientras escribe es una réplica fiel del documento, dibujada con la propia página web para que responda al instante. Las cifras salen exactamente del mismo cálculo que el PDF, así que siempre coinciden al céntimo.

- **Decision**: componente `VistaPrevia` en HTML/CSS que imita el diseño del PDF. Ambos consumen el mismo objeto `totales` producido por un único módulo de cálculo.
- **Rationale**: regenerar un PDF real en cada pulsación tardaría más de 1 s en móviles (SC-004). Un único cálculo compartido garantiza FR-018.
- **Alternatives considered**: incrustar el PDF real en un visor → lento y poco compatible en móviles (iOS no muestra bien PDFs incrustados).

## D8. Dinero sin errores de redondeo: céntimos enteros

**En lenguaje de negocio**: los ordenadores cometen pequeños errores al sumar decimales (por ejemplo 0,1 + 0,2 = 0,30000000000000004). Para que el IVA, el IRPF y el total cuadren siempre al céntimo, internamente todo se cuenta en **céntimos enteros**, y la cantidad en **centésimas** (2,5 horas = 250).

- **Decision**:
  - Precio unitario: entero en céntimos (máx. 2 decimales, Edge Cases).
  - Cantidad: entero en centésimas → **máximo 2 decimales** (2,5 h, 0,75 h). *Interpretación de la spec* ("las cantidades admiten decimales").
  - Subtotal de línea (céntimos) = redondeo Half-Up de `cantidadCentésimas × precioCéntimos / 100`.
  - IVA = Half-Up de `base × 21 / 100`; IRPF = Half-Up de `base × pct / 100`; Total = base + IVA − IRPF.
  - Half-Up simétrico con enteros: `signo(x) × floor((|x| + 50) / 100)`.
- **Rationale**: aritmética entera exacta; reproduce todos los ejemplos de la spec (p. ej. 250 × 3333 = 833 250 → 8 332,5 → 8 333 céntimos = 83,33 €).
- **Alternatives considered**: librería decimal (`decimal.js`, `big.js`) → correcta, pero dependencia innecesaria; números decimales nativos → errores de céntimo.

## D9. Validación de NIF / NIE / CIF (aviso, no bloqueo)

**En lenguaje de negocio**: si el freelancer teclea mal un NIF, la aplicación le avisa ("La letra de control no coincide"), pero le deja continuar por si se trata de un caso raro (aclaración de la sesión 2026-10-03).

- **Decision**: función propia `validarIdentificadorFiscal(texto)` que reconoce DNI (8 dígitos + letra), NIE (X/Y/Z + 7 dígitos + letra) y CIF (letra + 7 dígitos + control dígito/letra), normalizando espacios y guiones. Devuelve `{ valido, tipo, motivo }`.
- **Rationale**: algoritmo público, corto (~40 líneas) y fácil de probar; evita una dependencia.
- **Alternatives considered**: librería externa de validación → dependencia para algo trivial.

## D10. Pantalla dividida en el móvil

**En lenguaje de negocio**: en ordenador y tablet en horizontal, el formulario y la vista previa están lado a lado (FR-010). En un móvil no caben las dos cosas legibles a la vez, así que se muestra el formulario con una **barra fija inferior con el total** y un botón **"Ver vista previa"** que alterna entre editar y ver el documento.

- **Decision**: diseño *mobile-first* con un punto de corte en 900 px: por encima, dos columnas; por debajo, pestañas "Editar / Vista previa" y barra de totales siempre visible.
- **Rationale**: cumple el objetivo de la spec (ver los totales y el documento al instante) respetando el requisito del usuario de funcionar bien en el móvil.
- **Alternatives considered**: forzar dos columnas en el móvil → ilegible; ocultar la vista previa en el móvil → incumple FR-010.

## D11. Publicación online

**En lenguaje de negocio**: se publica en un alojamiento estático gratuito con HTTPS (obligatorio para el modo sin conexión). Cada cambio aprobado se publica subiendo la carpeta generada; no hay servidores que vigilar.

- **Decision**: cualquier hosting estático con HTTPS. Recomendado **Netlify** o **Cloudflare Pages** (gratuitos, permiten "arrastrar y soltar" la carpeta `dist/` o conectar un repositorio). La app usa navegación interna sin rutas de servidor (pantallas por estado / `#hash`), por lo que no necesita reglas de redirección.
- **Alternatives considered**: GitHub Pages → igual de válido, pero requiere configurar la ruta base del repositorio; servidor propio (VPS) → infraestructura innecesaria.

## D12. Pruebas

**En lenguaje de negocio**: las reglas que no pueden fallar (cuentas fiscales, numeración, validación del NIF, copia de seguridad, nombre del archivo) se comprueban automáticamente con todos los ejemplos de la spec cada vez que se cambia algo. El resto se verifica a mano en el navegador siguiendo la guía [quickstart.md](./quickstart.md), como exige la constitución (principio IV).

- **Decision**: Vitest (incluido en el ecosistema Vite) para pruebas unitarias de los módulos de dominio y de la definición del PDF (se comprueba el contenido del documento sin abrirlo). Verificación funcional manual guiada por `quickstart.md`.
- **Alternatives considered**: pruebas end-to-end con navegador automatizado (Playwright) → valiosas, pero añaden instalación y mantenimiento; se aplazan a una versión futura.

## D13. Navegación y estado

- **Decision**: sin librería de rutas ni de estado global. Un componente raíz guarda el estado de la aplicación (`useReducer`) y lo persiste (D4). La pantalla activa se refleja en el `#hash` de la URL (`#/presupuestos`, `#/presupuesto/<id>`, `#/clientes`, `#/catalogo`, `#/perfil`) para que el botón "Atrás" del móvil funcione.
- **Rationale**: 6 pantallas no justifican un *router* ni un *store* externos.

## D14. Formato de la copia de seguridad

**En lenguaje de negocio**: la copia es un único archivo `.json` con todos los datos (incluido el logo) que se puede guardar en el ordenador, en un pendrive o en el correo, e importar en cualquier navegador.

- **Decision**: archivo `presupuestopro-copia-AAAA-MM-DD.json` con cabecera de identificación y versión de formato. Contrato: [contracts/copia-de-seguridad.md](./contracts/copia-de-seguridad.md).
- **Rationale**: es el mismo documento que se guarda en IndexedDB (D4) envuelto con metadatos; exportar e importar son triviales y verificables.

---

## Dependencias resultantes (todas de código abierto, sin claves ni servicios externos)

| Dependencia | Para qué | Peso aprox. en el móvil |
|---|---|---|
| `preact` | Interfaz reactiva | ~4 KB |
| `idb-keyval` | Guardado local en IndexedDB | < 1 KB |
| `pdfmake` | Generar el PDF | ~1 MB, **solo se descarga al generar el primer PDF** |
| `vite`, `@preact/preset-vite`, `vite-plugin-pwa`, `vitest` | Desarrollo, build, modo sin conexión y pruebas | 0 KB (no llegan al usuario) |

**Todos los "NEEDS CLARIFICATION" del contexto técnico quedan resueltos.**
