# Contrato: Pantallas de la interfaz

Fuente: Historias 1–8, FR-010, FR-026, FR-027 · Decisiones: research D3, D10, D13.

La aplicación tiene **6 pantallas**, a las que se llega desde una barra de navegación. Cada una tiene su dirección (`#hash`), de modo que el botón "Atrás" del móvil funciona.

| Pantalla | Dirección | Historias |
|---|---|---|
| Presupuestos (historial) | `#/presupuestos` (inicio) | US6 |
| Editor de presupuesto | `#/presupuesto/{id}` | US1, US2, US5.2–3, US6.5–6 |
| Detalle de presupuesto emitido o anulado | `#/presupuesto/{id}` (solo lectura si no hay borrador) | US6 |
| Clientes | `#/clientes` | US5 |
| Catálogo | `#/catalogo` | US4 |
| Perfil y ajustes | `#/perfil` | US3, US8 |

El selector de **tema claro/oscuro** está siempre visible en la cabecera (US7). La primera vez que se abre la app sin perfil, la pantalla de inicio muestra un aviso con un enlace a "Completar mi perfil".

## Diseño adaptable

| Ancho de pantalla | Navegación | Editor |
|---|---|---|
| ≥ 900 px (ordenador, tablet horizontal) | Barra superior | **Dos columnas**: formulario a la izquierda, vista previa a la derecha (FR-010) |
| < 900 px (móvil) | Barra inferior fija con iconos y texto | Pestañas **"Editar / Vista previa"** + barra fija con el **TOTAL** y el botón "Generar PDF" |

Requisitos táctiles: botones y campos de al menos 44 × 44 px; teclado numérico decimal en cantidades y precios (`inputmode="decimal"`); se aceptan tanto la coma como el punto como separador decimal.

## Editor de presupuesto

- **Cliente**: selector con búsqueda + botón "Nuevo cliente" (abre un formulario y deja el cliente creado seleccionado, US5.3).
- **Líneas**: botón "Añadir desde catálogo" (lista con búsqueda) y "Añadir línea libre". Cada línea: descripción, cantidad, precio unitario, importe calculado, botones subir/bajar y eliminar. Si viene del catálogo con rango: texto "Mercado: 300,00 € – 600,00 €" y botones **"Aplicar mín."** / **"Aplicar máx."** (US4.2).
- **Retención IRPF**: selector 15 % / 7 % / 0 %. Desactivado en 0 % con el aviso "A un cliente particular no se le aplica retención de IRPF" si el cliente es particular (US1.4).
- **Validez y condiciones**: fecha de validez editable y texto de condiciones (FR-013).
- **Totales**: base imponible, IVA 21 %, retención, TOTAL; se actualizan con cada pulsación (< 1 s, SC-004).
- **Acciones**: "Generar PDF" (principal), "Descartar borrador" (con confirmación). No hay botón "Guardar": todo se guarda solo.
- **Errores al emitir**: se resaltan en rojo todos los campos con problemas y aparece un resumen arriba ("Faltan 2 datos para poder generar el PDF"), con desplazamiento automático al primero.
- **Vista previa**: réplica del PDF; mientras es borrador, muestra "BORRADOR" en lugar del número y la fecha de hoy como fecha de emisión provisional.

## Presupuestos (historial)

- Botón principal "Nuevo presupuesto".
- Filtros: estado (Todos / Borradores / Emitidos / Anulados), año y mes de emisión. Recuento visible: "5 presupuestos en octubre de 2026" (US6.7).
- Cada fila: número (o "Borrador"), cliente, fecha, total y estado. Los anulados muestran la etiqueta **ANULADO** y aparecen atenuados.
- Detalle de un emitido: lista de versiones con "Descargar PDF" en cada una, y los botones "Editar (nueva versión)" y "Anular" (con confirmación: *"La anulación es definitiva. El número PRE-2026-0042 se conserva y no se podrá reutilizar."*).
- Detalle de un anulado: solo "Descargar PDF" por versión (con marca de agua). Sin editar, sin deshacer (US6.9).
- Un emitido no tiene opción de borrar (US6.4).

## Clientes / Catálogo

- Lista con búsqueda, botón "Nuevo" y edición en un formulario.
- Borrar pide confirmación; en clientes con borradores asociados, indica cuántos (US5.5).
- Avisos de NIF/CIF no válido junto al campo, en ámbar, sin bloquear el guardado.
- Catálogo: aviso y bloqueo de guardado si mínimo > máximo (US4.4).

## Perfil y ajustes

- Formulario del perfil (FR-001), con subida de logo y miniatura; rechazo con aviso si no es PNG/JPG o supera 1 MB.
- Sección "Copia de seguridad": "Exportar copia" e "Importar copia" ([copia-de-seguridad.md](./copia-de-seguridad.md)) y un texto de ayuda: *"Tus datos solo están en este dispositivo. Exporta una copia de vez en cuando y guárdala en un lugar seguro."*

## Mensajes

Todos los textos de la interfaz, incluidos los errores, están en español de España, en lenguaje llano y sin códigos técnicos.
