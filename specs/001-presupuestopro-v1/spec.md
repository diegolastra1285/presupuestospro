# Feature Specification: PresupuestoPro v1

**Feature Branch**: `001-presupuestopro-v1`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "PresupuestoPro v1 — herramienta local para que un freelancer genere presupuestos profesionales en PDF, con su marca, catálogo de servicios, agenda de clientes, cálculo automático de IVA (21 %) y retención de IRPF (15 % / 7 %), numeración PRE-{YYYY}-{NNNN}, vista previa en vivo y tema claro/oscuro. Sin cuentas, sin nube, sin facturación."

## Contexto y usuarios

PresupuestoPro permite a un profesional independiente (desarrollador, diseñador, fotógrafo, redactor, locutor, consultor…) entregar en minutos un presupuesto con aspecto profesional en lugar de dedicarle horas o de enviar una hoja de cálculo. Hace las cuentas fiscales por él (IVA e IRPF) de acuerdo con la normativa española.

- **Freelancer (usuario activo)**: introduce sus datos, su catálogo, sus clientes y las líneas del presupuesto, y descarga el PDF. Sabe estimar su trabajo, pero no domina la estructura fiscal ni la presentación ejecutiva.
- **Cliente (usuario pasivo)**: recibe el PDF por el medio que elija el freelancer. Nunca usa la aplicación. Necesita ver con claridad qué incluye el presupuesto, cuánto cuesta, durante cuánto tiempo es válido y las condiciones de pago.

## Clarifications

### Session 2026-10-03

- Q: Cuando el freelancer edita un presupuesto ya emitido, ¿en qué momento nace la versión 2? → A: Al pulsar "Editar" se abre un borrador de la nueva versión; la versión anterior sigue vigente y la nueva solo se crea al pulsar "Generar PDF". El borrador de versión puede descartarse sin dejar rastro.
- Q: ¿Qué puede hacer el freelancer con un presupuesto que ya está anulado? → A: La anulación es definitiva (no se puede editar, versionar ni deshacer); el PDF se puede volver a descargar y lleva una marca visible "ANULADO".
- Q: ¿Qué debe pasar si el freelancer borra de la agenda un cliente asignado a borradores? → A: Se pide confirmación indicando cuántos borradores lo usan; si se confirma, se borra y esos borradores quedan sin cliente (hay que elegir otro antes de emitir).
- Q: ¿Debe la aplicación comprobar que el NIF/DNI del freelancer y el NIF/CIF/DNI del cliente tienen un formato válido? → A: Sí, se comprueba formato y letra/dígito de control (DNI, NIE, CIF); si no cuadra solo se muestra un aviso y se permite emitir.
- Q: ¿Qué tamaño máximo de archivo debe aceptar la aplicación para el logo del freelancer? → A: Hasta 1 MB (PNG o JPG).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear un presupuesto con cálculo fiscal automático y vista previa en vivo (Priority: P1)

El freelancer elige (o crea) un cliente, añade líneas desde su catálogo o escritas a mano, con cantidad y precio unitario, y ve al instante la base imponible, el IVA, la retención de IRPF (cuando corresponde) y el total. A un lado de la pantalla se muestra cómo va quedando el documento final.

**Why this priority**: es el corazón del producto. Sin un cálculo correcto y visible no existe propuesta de valor.

**Independent Test**: se crea un presupuesto con las líneas del ejemplo de referencia y se comprueba que los importes mostrados coinciden al céntimo con la tabla de la sección "Reglas de cálculo".

**Acceptance Scenarios**:

1. **Given** un presupuesto nuevo para un cliente Particular, **When** el freelancer añade el Ítem A (1 × 100,00 €) y el Ítem B (2 × 50,00 €), **Then** sin pulsar ningún botón de guardado la pantalla muestra base imponible 200,00 €, IVA 42,00 €, IRPF 0,00 € y total 242,00 €.
2. **Given** un presupuesto con base imponible 1.000,00 € para un cliente Empresa/Autónomo, **When** la retención está en 15 %, **Then** la pantalla muestra IVA 210,00 €, retención 150,00 € y total 1.060,00 €; **When** el freelancer cambia la retención a 7 %, **Then** la retención pasa a 70,00 € y el total a 1.140,00 € de forma inmediata.
3. **Given** un presupuesto en edición, **When** el freelancer modifica la cantidad, el precio o la descripción de una línea, o la elimina, **Then** los totales y la vista previa se actualizan al instante.
4. **Given** un cliente de tipo Particular, **When** el freelancer intenta poner una retención distinta de 0 %, **Then** el sistema la mantiene en 0 % y muestra el aviso "A un cliente particular no se le aplica retención de IRPF".
5. **Given** un cliente Empresa/Autónomo y un perfil marcado como "Nuevo autónomo", **When** se crea el presupuesto, **Then** la retención propuesta por defecto es del 7 %. Si el perfil no está marcado, es del 15 %.
6. **Given** una línea añadida desde el catálogo, **When** el freelancer cambia su precio dentro del presupuesto, **Then** el precio del catálogo no se modifica.

---

### User Story 2 - Emitir y descargar el presupuesto en PDF (Priority: P1)

Con el presupuesto completo, el freelancer pulsa "Generar PDF". El presupuesto recibe su número definitivo y se descarga un PDF con su marca, los datos del cliente, la tabla de líneas, los totales, la validez, las condiciones y la leyenda de que no es una factura.

**Why this priority**: el PDF es el entregable que llega al cliente final.

**Independent Test**: se emite el presupuesto del ejemplo, se abre el PDF descargado y se comprueba que contiene todos los elementos obligatorios y que los importes son idénticos a los de la pantalla.

**Acceptance Scenarios**:

1. **Given** un presupuesto en borrador con todos los campos obligatorios completos, **When** el freelancer pulsa "Generar PDF", **Then** en menos de 5 segundos se descarga un archivo `.pdf` llamado `PRE-{YYYY}-{NNNN}_{NombreCliente}.pdf`.
2. **Given** el cliente "Cliente Ejemplo SAS", **When** se abre el PDF, **Then** el encabezado muestra el nombre del cliente, la fecha de emisión, el número del presupuesto y el logotipo del freelancer (o su nombre y NIF/DNI si no tiene logo).
3. **Given** un presupuesto con N líneas, **When** se abre el PDF, **Then** la tabla contiene exactamente esas N líneas con la misma descripción, cantidad, precio unitario e importe, y la base, el IVA, la retención y el total son idénticos a los de la pantalla.
4. **Given** cualquier PDF emitido, **When** se abre, **Then** muestra de forma visible el título "PRESUPUESTO", la leyenda "Este documento no es una factura", la fecha de validez, el bloque de condiciones/notas y los datos de pago del freelancer (si los ha configurado).
5. **Given** que falta el nombre del cliente o no hay ninguna línea, **When** el freelancer pulsa "Generar PDF", **Then** no se descarga nada, no se asigna número y los campos que faltan se resaltan con un aviso visual.
6. **Given** una línea con importe igual o menor que cero, **When** el freelancer pulsa "Generar PDF", **Then** no se descarga nada y esa línea se marca en rojo con un mensaje que pide corregirla o eliminarla.
7. **Given** una línea con una descripción de más de 120 caracteres, **When** se genera el PDF, **Then** el texto continúa en varias líneas dentro de su celda sin tapar las columnas de precios, y el bloque de totales sigue visible y completo.

---

### User Story 3 - Configurar el perfil y la marca del freelancer (Priority: P2)

El freelancer guarda una sola vez su nombre o razón social, su NIF/DNI, sus datos de contacto, su dirección, su logo, si es "Nuevo autónomo", sus datos de pago y sus condiciones por defecto. Todos sus presupuestos los usan automáticamente.

**Why this priority**: evita volver a escribir los mismos datos y da al documento una imagen profesional. Se puede emitir un presupuesto sin logo, pero no sin perfil.

**Independent Test**: se rellena el perfil, se cierra la aplicación, se vuelve a abrir y se comprueba que los datos siguen ahí y que aparecen en un presupuesto nuevo.

**Acceptance Scenarios**:

1. **Given** un perfil con logo, **When** se genera un PDF, **Then** el logo aparece en el encabezado.
2. **Given** un perfil sin logo, **When** se genera un PDF, **Then** en el lugar del logo aparecen el nombre del freelancer y su NIF/DNI.
3. **Given** unas condiciones por defecto guardadas en el perfil, **When** se crea un presupuesto nuevo, **Then** el bloque de condiciones viene ya relleno con ese texto, y editarlo en ese presupuesto no cambia el perfil.
4. **Given** que el perfil no tiene nombre ni NIF/DNI, **When** el freelancer intenta generar un PDF, **Then** el sistema lo impide y le indica que complete esos datos del perfil.

---

### User Story 4 - Gestionar el catálogo de servicios con precios de referencia (Priority: P2)

El freelancer ve, añade, edita y elimina los servicios de su catálogo. Cada servicio tiene descripción, precio habitual y, de forma opcional, un rango de mercado (mínimo y máximo) que escribe él mismo.

**Why this priority**: acelera la creación de presupuestos y ayuda a fijar el precio según el mercado.

**Independent Test**: se crean dos servicios con su rango de mercado, se usan en un presupuesto y se aplica el mínimo o el máximo con un clic.

**Acceptance Scenarios**:

1. **Given** el catálogo, **When** el freelancer añade, edita o elimina un servicio, **Then** el cambio se guarda y se mantiene al volver a abrir la aplicación.
2. **Given** un servicio con rango de mercado 300,00 €–600,00 €, **When** se añade a un presupuesto, **Then** junto a la línea se muestra "Mercado: 300,00 € – 600,00 €" y hay botones para aplicar el mínimo o el máximo como precio unitario con un solo clic.
3. **Given** un servicio eliminado del catálogo, **When** se abre un presupuesto antiguo que lo usaba, **Then** la línea de ese presupuesto se mantiene intacta.
4. **Given** un rango con un mínimo mayor que el máximo, **When** el freelancer intenta guardarlo, **Then** el sistema no lo guarda y muestra un aviso.

---

### User Story 5 - Gestionar la agenda de clientes (Priority: P2)

El freelancer mantiene una lista local de clientes con nombre o razón social, NIF/CIF/DNI, tipo (Particular o Empresa/Autónomo), email y dirección. Puede crear un cliente desde el propio presupuesto.

**Why this priority**: el tipo de cliente determina si se aplica retención, y reutilizar clientes ahorra tiempo.

**Independent Test**: se crea un cliente Particular y otro Empresa/Autónomo y se comprueba que la retención por defecto cambia según el que se elija.

**Acceptance Scenarios**:

1. **Given** la agenda, **When** el freelancer crea, edita o elimina un cliente, **Then** el cambio se guarda y se mantiene al volver a abrir la aplicación.
2. **Given** un presupuesto en borrador, **When** el freelancer cambia el cliente de Empresa/Autónomo a Particular, **Then** la retención pasa automáticamente a 0 % y se muestra un aviso.
3. **Given** un presupuesto en borrador, **When** el freelancer crea un cliente nuevo desde el propio presupuesto, **Then** el cliente queda guardado en la agenda y seleccionado en el presupuesto.
4. **Given** un presupuesto emitido, **When** después se editan los datos de su cliente en la agenda, **Then** el presupuesto emitido conserva los datos que tenía al emitirse.
5. **Given** un cliente asignado a 2 borradores, **When** el freelancer intenta borrarlo, **Then** el sistema pide confirmación indicando "2 borradores usan este cliente"; si confirma, el cliente desaparece de la agenda, esos borradores quedan sin cliente y al pulsar "Generar PDF" se resalta el campo de cliente como obligatorio.

---

### User Story 6 - Historial, numeración, versiones y anulación (Priority: P3)

El freelancer ve todos sus presupuestos (borradores, emitidos y anulados), los filtra por año y por mes, vuelve a descargar un PDF, crea una nueva versión de un presupuesto emitido o lo anula.

**Why this priority**: da orden y trazabilidad, y garantiza una numeración sin huecos.

**Independent Test**: se emiten tres presupuestos, se anula el segundo, se edita el tercero y se comprueba la numeración, las versiones y los filtros.

**Acceptance Scenarios**:

1. **Given** que el último presupuesto emitido en 2026 es PRE-2026-0041, **When** se emite otro en 2026, **Then** recibe el número PRE-2026-0042.
2. **Given** que el último presupuesto emitido en 2026 es PRE-2026-0187, **When** se emite el primero de 2027, **Then** recibe el número PRE-2027-0001.
3. **Given** un borrador, **When** se guarda o se descarta, **Then** no consume ningún número.
4. **Given** un presupuesto emitido, **When** el freelancer intenta borrarlo, **Then** el sistema no lo permite y solo ofrece "Anular". El presupuesto anulado conserva su número y aparece como "ANULADO".
5. **Given** un presupuesto emitido PRE-2026-0042, **When** el freelancer lo edita y lo vuelve a emitir, **Then** se crea la versión 2 con el mismo número, el PDF indica "PRE-2026-0042 (v2)" y la versión 1 sigue disponible en el historial.
6. **Given** un presupuesto emitido PRE-2026-0042 (v1), **When** el freelancer pulsa "Editar", hace cambios y descarta el borrador, **Then** no se crea ninguna versión nueva y la v1 sigue siendo la vigente, sin cambios.
7. **Given** el historial, **When** el freelancer filtra por "octubre 2026", **Then** solo ve los presupuestos emitidos en ese mes, junto con cuántos son.
8. **Given** cualquier presupuesto guardado, **When** se cierra y se vuelve a abrir la aplicación, **Then** el presupuesto conserva sus líneas, su base, su IVA, su retención y su total.
9. **Given** un presupuesto anulado, **When** el freelancer lo abre en el historial, **Then** no hay opción de editarlo, versionarlo ni deshacer la anulación, y al volver a descargar su PDF este muestra una marca visible "ANULADO".

---

### User Story 7 - Tema claro / oscuro (Priority: P3)

El freelancer cambia el aspecto de la interfaz entre claro y oscuro.

**Why this priority**: es una cuestión de comodidad y no bloquea el valor principal.

**Independent Test**: se cambia el tema, se cierra la aplicación y se comprueba que al volver a abrirla mantiene el tema elegido.

**Acceptance Scenarios**:

1. **Given** el tema claro, **When** el freelancer pulsa el selector de tema, **Then** toda la interfaz pasa a tema oscuro y la elección se recuerda al volver a abrir la aplicación.
2. **Given** cualquier tema de la interfaz, **When** se genera un PDF, **Then** el PDF tiene siempre el mismo aspecto (fondo claro, apto para imprimir).

---

### User Story 8 - Copia de seguridad local (Priority: P3)

El freelancer exporta todos sus datos (perfil, catálogo, clientes y presupuestos) a un archivo en su ordenador y puede importarlos después, por ejemplo en otro equipo.

**Why this priority**: como los datos solo existen en el ordenador, sin copia de seguridad se pierden si cambia de equipo o borra los datos.

**Independent Test**: se exportan los datos, se borran los datos de la aplicación, se importa el archivo y se comprueba que todo vuelve a estar ahí.

**Acceptance Scenarios**:

1. **Given** datos existentes, **When** el freelancer pulsa "Exportar copia", **Then** se descarga un archivo con todos sus datos.
2. **Given** un archivo de copia válido, **When** el freelancer lo importa y confirma que quiere sustituir los datos actuales, **Then** se restauran el perfil, el catálogo, los clientes, los presupuestos y los contadores de numeración.
3. **Given** un archivo que no es válido, **When** se intenta importar, **Then** no se modifica ningún dato y se muestra un mensaje de error comprensible.

---

### Edge Cases

- **Campos obligatorios vacíos**: al pulsar "Generar PDF", se resaltan todos los campos que faltan (nombre del cliente, al menos una línea, descripción de cada línea, nombre y NIF/DNI del perfil) y no se descarga nada.
- **Líneas con importe ≤ 0** (cantidad o precio cero o negativos): se pueden tener mientras el presupuesto es borrador, pero impiden emitirlo hasta corregirlas o borrarlas.
- **Retención incoherente**: con un cliente Particular, la retención se fuerza a 0 % y se avisa al freelancer. Si la retención se marcó por error con un cliente Empresa/Autónomo, el freelancer puede cambiarla libremente a 15 %, 7 % o 0 %.
- **Cambio de año**: el primer presupuesto emitido en el nuevo año natural recibe el número 0001. La fecha de emisión que cuenta es la del momento de emitir, no la de creación del borrador.
- **Borrador creado en diciembre y emitido en enero**: recibe la numeración del año en que se emite.
- **Descripciones largas (> 120 caracteres)**: el texto continúa en varias líneas dentro de su celda. Si la tabla no cabe en una página, continúa en la siguiente, y el bloque de totales nunca se corta ni queda fuera de la página.
- **Presupuesto con muchas líneas**: el PDF ocupa varias páginas, repite el encabezado de la tabla y numera las páginas.
- **Logo con formato o tamaño no admitido** (formato distinto de PNG/JPG o archivo de más de 1 MB): se rechaza con un aviso y el perfil sigue sin logo, es decir, se muestran el nombre y el NIF/DNI.
- **Decimales**: las cantidades admiten decimales (por ejemplo 2,5 horas) y los precios se introducen con como máximo 2 decimales.
- **Más de 9.999 presupuestos en un año**: el secuencial sigue creciendo sin perder dígitos (PRE-2026-10000). Se considera improbable.
- **Cierre inesperado de la aplicación**: lo último que se guardó de un borrador no se pierde.
- **Identificador fiscal no válido**: si el NIF/DNI del perfil o el NIF/CIF/DNI del cliente no supera la comprobación de formato y letra/dígito de control, se muestra un aviso junto al campo, pero se puede guardar y emitir igualmente.

## Requirements *(mandatory)*

### Functional Requirements

**Perfil y marca**

- **FR-001**: El sistema DEBE permitir guardar el perfil del freelancer: nombre o razón social, NIF/DNI, email, teléfono, dirección, logo (opcional), indicador "Nuevo autónomo", datos de pago (opcional, texto libre, por ejemplo un IBAN), condiciones por defecto (texto libre) y validez por defecto en días (30 si no se indica otra).
- **FR-002**: Si el freelancer no tiene logo, el sistema DEBE mostrar en su lugar su nombre y su NIF/DNI, tanto en la vista previa como en el PDF.

**Catálogo**

- **FR-003**: El sistema DEBE permitir ver, añadir, editar y eliminar servicios del catálogo, cada uno con descripción, precio habitual y un rango de mercado opcional (mínimo y máximo, con mínimo ≤ máximo).
- **FR-004**: Al añadir una línea desde el catálogo, el sistema DEBE copiar la descripción y el precio habitual a la línea, mostrar el rango de mercado si existe y permitir aplicar el mínimo o el máximo como precio unitario con un solo clic.
- **FR-005**: Los cambios en el catálogo NO DEBEN modificar las líneas de los presupuestos ya existentes.

**Clientes**

- **FR-006**: El sistema DEBE permitir crear, editar y eliminar clientes con nombre o razón social (obligatorio), NIF/CIF/DNI, tipo (Particular o Empresa/Autónomo; obligatorio), email y dirección, y DEBE permitir crear un cliente desde el propio presupuesto. Al borrar un cliente asignado a uno o más borradores, el sistema DEBE pedir confirmación indicando cuántos borradores lo usan; si se confirma, esos borradores quedan sin cliente y no podrán emitirse hasta asignarles otro (FR-014). Los presupuestos emitidos no se ven afectados (FR-007). El sistema DEBE comprobar el formato y la letra/dígito de control de los identificadores fiscales (DNI, NIE y CIF) del perfil y de los clientes; si no son válidos, DEBE mostrar un aviso sin impedir guardar ni emitir.
- **FR-007**: Al emitir, el sistema DEBE guardar una copia de los datos del cliente y del freelancer dentro del presupuesto, para que los cambios posteriores en el perfil o en la agenda no alteren los presupuestos emitidos.

**Edición del presupuesto**

- **FR-008**: El sistema DEBE permitir añadir, editar, reordenar y eliminar líneas (desde el catálogo o escritas a mano), cada una con descripción, cantidad y precio unitario, mientras el presupuesto no se ha emitido.
- **FR-009**: El sistema DEBE calcular y mostrar en tiempo real el subtotal de cada línea, la base imponible, el IVA, la retención de IRPF y el total, aplicando las reglas de cálculo de esta especificación.
- **FR-010**: El sistema DEBE mostrar una pantalla dividida, con el formulario de edición a un lado y la vista previa del documento al otro, que se actualiza con cada cambio.
- **FR-011**: El sistema DEBE proponer la retención por defecto según el tipo de cliente y el perfil: Particular → 0 %; Empresa/Autónomo → 15 %, o 7 % si el perfil está marcado como "Nuevo autónomo".
- **FR-012**: El sistema DEBE permitir cambiar la retención de cada presupuesto solo entre 15 %, 7 % y 0 %. Con un cliente Particular DEBE forzar el 0 % y avisar al freelancer.
- **FR-013**: El sistema DEBE permitir editar, en cada presupuesto, la fecha de validez (que por defecto es la fecha de emisión más los días de validez del perfil) y el bloque de condiciones/notas (que viene relleno con las condiciones por defecto).

**Emisión, PDF y numeración**

- **FR-014**: Al pulsar "Generar PDF", el sistema DEBE comprobar los campos obligatorios y las líneas con importe ≤ 0. Si algo falla, NO DEBE descargar nada ni asignar número, y DEBE resaltar los problemas.
- **FR-015**: La primera vez que se emite un presupuesto, el sistema DEBE asignarle el siguiente número con el formato `PRE-{YYYY}-{NNNN}`, según las reglas de numeración.
- **FR-016**: El sistema DEBE descargar el PDF en menos de 5 segundos con el nombre `PRE-{YYYY}-{NNNN}_{NombreCliente}.pdf` (con el sufijo `_v{N}` a partir de la versión 2).
- **FR-017**: El PDF DEBE contener: el título "PRESUPUESTO"; la leyenda "Este documento no es una factura"; el número (y la versión si es mayor que 1); la fecha de emisión y la fecha de validez; el logo o, si no hay, el nombre y NIF/DNI del freelancer; los datos de contacto del freelancer; los datos del cliente; una tabla con la descripción, la cantidad, el precio unitario y el importe de cada línea; la base imponible, el IVA (21 %), la retención de IRPF (con su porcentaje, o una línea a 0,00 € si no se aplica) y el total; las condiciones/notas; y los datos de pago si existen.
- **FR-018**: Los importes del PDF DEBEN ser idénticos a los mostrados en pantalla.
- **FR-019**: El PDF DEBE gestionar las descripciones largas y las tablas extensas sin solapar columnas ni cortar el bloque de totales (ver Edge Cases).

**Historial y ciclo de vida**

- **FR-020**: El sistema DEBE manejar tres estados: **Borrador** (sin número, se puede editar y borrar), **Emitido** (con número, no se puede borrar) y **Anulado** (conserva su número y aparece marcado como "ANULADO"). La anulación es definitiva: un presupuesto anulado NO DEBE poder editarse, versionarse ni volver a Emitido. Su PDF DEBE poder volver a descargarse y DEBE mostrar una marca visible "ANULADO".
- **FR-021**: Al pulsar "Editar" en un presupuesto emitido, el sistema DEBE abrir un borrador de nueva versión basado en la última versión emitida, sin alterar esta. La nueva versión (mismo número, versión N+1) solo DEBE crearse al pulsar "Generar PDF" y superar las validaciones de FR-014. El borrador de versión DEBE poder descartarse sin crear ninguna versión. Las versiones anteriores se conservan y se pueden consultar y volver a descargar.
- **FR-022**: El sistema DEBE mostrar un historial de presupuestos filtrable por estado, año y mes de emisión, con el recuento de presupuestos emitidos en el periodo filtrado, y DEBE permitir volver a descargar el PDF de cualquier presupuesto emitido.

**Persistencia, privacidad y entorno**

- **FR-023**: El sistema DEBE guardar automáticamente en el ordenador del freelancer el perfil, el catálogo, los clientes, los presupuestos (con sus líneas y sus importes calculados de base, IVA, retención y total), los contadores de numeración y la preferencia de tema. Al volver a abrir la aplicación, todo DEBE seguir disponible.
- **FR-024**: El sistema NO DEBE pedir cuentas ni contraseñas ni enviar datos a ningún servicio externo, y DEBE funcionar sin conexión a internet.
- **FR-025**: El sistema DEBE permitir exportar todos los datos a un archivo local e importarlos desde él, validando el archivo y pidiendo confirmación antes de sustituir los datos existentes.
- **FR-026**: El sistema DEBE permitir alternar la interfaz entre tema claro y oscuro, y recordar la elección. El PDF no depende del tema.
- **FR-027**: Toda la interfaz y el PDF DEBEN estar en español de España, con importes en euros con formato es-ES (`1.272,00 €`) y fechas en formato `dd/mm/aaaa`.

### Reglas de numeración

- Formato: `PRE-{YYYY}-{NNNN}`. `{YYYY}` es el año de emisión con 4 dígitos y `{NNNN}` un secuencial correlativo con ceros a la izquierda hasta 4 dígitos (por ejemplo, `PRE-2026-0001`).
- El secuencial es **anual**: solo se reinicia a 0001 con el primer presupuesto emitido de cada año natural.
- El número se asigna **al emitir**, no al crear el borrador. Los borradores descartados no consumen número.
- **Sin huecos**: un presupuesto emitido no se puede borrar, solo anular. Las nuevas versiones reutilizan el mismo número.
- Se guarda el mes de emisión de cada presupuesto, lo que permite consultar y contar los presupuestos por mes sin alterar el secuencial anual.

| Situación | Número asignado |
|---|---|
| Primer presupuesto emitido el 15/01/2026 | PRE-2026-0001 |
| Siguiente tras PRE-2026-0041 (emitido el 03/10/2026) | PRE-2026-0042 |
| Nueva versión de PRE-2026-0042 | PRE-2026-0042 (v2) |
| Primer presupuesto emitido el 02/01/2027 (el último de 2026 fue PRE-2026-0187) | PRE-2027-0001 |

### Reglas de cálculo fiscal

- **Subtotal de línea** = cantidad × precio unitario, redondeado a 2 decimales.
- **Base imponible** = Σ subtotales de línea.
- **IVA** = base imponible × 0,21, redondeado a 2 decimales.
- **Retención de IRPF** = base imponible × (% IRPF / 100), redondeado a 2 decimales, donde el % es 15 (general, cliente Empresa/Autónomo), 7 (nuevo autónomo, cliente Empresa/Autónomo) o 0 (cliente Particular, siempre).
- **Total** = base imponible + IVA − retención de IRPF.
- **Redondeo**: simétrico a la mitad más cercana (Half-Up) a 2 decimales, en cada subtotal de línea, en el IVA y en la retención. Ejemplo: 2,5 × 33,33 = 83,325 → 83,33.

**Ejemplo de referencia** — PRE-2026-0042. Emisor: DevStudio Freelance (NIF 12345678Z). Cliente: Acme Digital Corp (CIF B98765432), tipo Empresa/Autónomo.

| Línea | Cantidad | Precio unitario | Subtotal |
|---|---|---|---|
| Auditoría de arquitectura web y rendimiento | 1 | 450,00 € | 450,00 € |
| Implementación frontend (horas) | 15 | 40,00 € | 600,00 € |
| Configuración de pipeline CI/CD y despliegue | 1 | 150,00 € | 150,00 € |
| **Base imponible** | | | **1.200,00 €** |

| Caso | Base | IVA 21 % | Retención IRPF | Total |
|---|---|---|---|---|
| Empresa/Autónomo, IRPF 15 % | 1.200,00 € | 252,00 € | 180,00 € | **1.272,00 €** |
| Empresa/Autónomo, nuevo autónomo IRPF 7 % | 1.200,00 € | 252,00 € | 84,00 € | **1.368,00 €** |
| Particular, IRPF 0 % | 1.200,00 € | 252,00 € | 0,00 € | **1.452,00 €** |

**Ejemplos breves**

| Líneas | Cliente / IRPF | Base | IVA | IRPF | Total |
|---|---|---|---|---|---|
| 1 × 100,00 + 2 × 50,00 | Particular / 0 % | 200,00 € | 42,00 € | 0,00 € | 242,00 € |
| base 1.000,00 | Empresa / 15 % | 1.000,00 € | 210,00 € | 150,00 € | 1.060,00 € |
| base 1.000,00 | Empresa / 7 % | 1.000,00 € | 210,00 € | 70,00 € | 1.140,00 € |

### Key Entities *(include if feature involves data)*

- **Perfil del freelancer**: perfil único con su identidad fiscal y de contacto, logo opcional, indicador de nuevo autónomo, datos de pago, condiciones por defecto, validez por defecto y preferencia de tema.
- **Cliente**: destinatario de presupuestos, con nombre o razón social, identificación fiscal, tipo (Particular / Empresa-Autónomo), email y dirección.
- **Servicio (catálogo)**: descripción, precio habitual y rango de mercado opcional (mínimo y máximo).
- **Presupuesto**: estado (Borrador / Emitido / Anulado), número (solo si se ha emitido), año y mes de emisión, fecha de validez, porcentaje de IRPF, condiciones/notas y, si se ha emitido, una copia de los datos del freelancer y del cliente. Tiene una o varias versiones.
- **Versión de presupuesto**: número de versión, fecha, líneas e importes calculados (base, IVA, retención, total).
- **Línea**: descripción, cantidad, precio unitario, subtotal y, si procede, el servicio del catálogo del que viene.
- **Contador de numeración**: último secuencial emitido para cada año.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con el perfil, el catálogo y el cliente ya configurados, un freelancer crea y descarga un presupuesto de 3 líneas en menos de 2 minutos.
- **SC-002**: El 100 % de los ejemplos numéricos de esta especificación coinciden al céntimo en la pantalla y en el PDF.
- **SC-003**: El PDF se descarga en menos de 5 segundos desde que se pulsa "Generar PDF".
- **SC-004**: La vista previa y los totales reflejan cada cambio de forma perceptiblemente instantánea (menos de 1 segundo).
- **SC-005**: Después de cerrar y volver a abrir la aplicación se conservan el 100 % de los datos guardados.
- **SC-006**: En una serie de presupuestos emitidos y anulados no hay ningún hueco ni ningún número duplicado.
- **SC-007**: Una persona no técnica que reciba el PDF identifica, sin ayuda, qué incluye el presupuesto, el total que debe pagar, la fecha de validez y que no es una factura.
- **SC-008**: Ningún PDF con descripciones de hasta 500 caracteres muestra texto solapado o cortado, ni totales fuera de la página.

## Assumptions

- Un único freelancer usa la aplicación en un único ordenador. No hay varios perfiles ni varios usuarios.
- El régimen fiscal es el de **España**: el freelancer siempre repercute el IVA del 21 %. Quedan fuera de alcance los servicios exentos, el recargo de equivalencia, Canarias, Ceuta, Melilla y las operaciones intracomunitarias o internacionales.
- La moneda es siempre el euro (€). No se puede configurar.
- El rango de mercado lo introduce manualmente el freelancer. La aplicación no consulta fuentes externas.
- La validez por defecto es de 30 días y se puede cambiar.
- El freelancer envía el PDF por su cuenta (email, mensajería, etc.).
- El logo admite los formatos PNG y JPG, con un tamaño máximo de 1 MB.

## Out of Scope

- Chat o funciones de inteligencia artificial.
- Servicio web alojado, enlaces públicos de solo lectura o vista interactiva para el cliente.
- Cuentas de usuario, inicio de sesión o contraseñas.
- Guardar o sincronizar datos en la nube.
- Enviar el PDF por email desde la aplicación.
- Descuentos por línea o globales.
- Facturas, facturación electrónica o conversión de un presupuesto en factura.
- Otros regímenes fiscales, otros países u otras monedas.
- Consulta automática de precios de mercado.
