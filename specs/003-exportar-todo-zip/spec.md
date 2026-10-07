# Feature Specification: Exportar todos mis presupuestos en un archivo comprimido .zip

**Feature Branch**: `003-exportar-todo-zip`

**Created**: 2026-10-06

**Status**: Publicada

**Input**: User description: "Exportar todos mis presupuestos en un .zip. Objetivo: Que el freelancer pueda llevarse TODOS sus presupuestos de una sola vez, en un único archivo comprimido .zip, como copia de seguridad y para archivarlos donde quiera. Hoy sus datos viven solo en su navegador (decisión de la constitution): si formatea el ordenador, cambia de navegador o borra el historial, lo pierde todo. Este botón es su seguro de vida. Usuario: El mismo freelancer de siempre: autónomo, no técnico. Sabe descargar un archivo y descomprimir un .zip con doble clic. No sabe (ni tiene por qué saber) qué hay dentro de un 'archivo de datos'. Alcance: Un botón 'Exportar todo (.zip)' en un lugar visible de la lista de presupuestos. Al pulsarlo se descarga UN único archivo .zip que contiene: Un PDF por cada presupuesto existente, exactamente el mismo PDF que ya genera la app para ese presupuesto; Un único archivo de datos con toda la información (presupuestos, catálogo de servicios y perfil del freelancer, logo incluido), pensado para poder restaurar la aplicación en el futuro. Funciona con los datos que haya: 1 presupuesto o 200. Reglas de negocio: Nombre del .zip: 'presupuestospro-copia-AAAA-MM-DD.zip', con la fecha del día de la exportación. Nombre de cada PDF dentro del zip: número + cliente ('2026-001 - Estudio García.pdf'). La exportación NO modifica nada: es solo lectura. Los PDF del zip deben cuadrar al céntimo con los que genera la app uno a uno. Criterios de éxito: Con 3 presupuestos creados, pulso el botón y descargo un único .zip; al descomprimirlo veo 3 PDF con nombre 'número - cliente' y un archivo de datos; abro cualquiera de los PDF y es idéntico al descargado individualmente; con 0 presupuestos, el botón avisa de que no hay nada que exportar. Casos límite: sin presupuestos, cliente con caracteres conflictivos, muchos presupuestos (50+). Fuera de alcance: importar la copia, exportar a Excel/CSV, copias automáticas, envío por email o nube."

## Clarifications

### Session 2026-10-06

- Q: ¿Qué estados de presupuesto deben incluirse en la generación de documentos PDF dentro del archivo ZIP? → A: Se incluyen en PDF todos los presupuestos con número oficial consolidado (estados emitido, enviado, aceptado, rechazado, caducado y anulado), excluyendo de los PDF únicamente los borradores provisionales sin numerar (preservados íntegramente en datos.json).
- Q: ¿Debe el botón «Exportar todo (.zip)» exportar siempre el histórico completo de presupuestos o debe respetar los filtros visuales (estado, año o mes) que el usuario tenga aplicados en el listado? → A: Exporta siempre el histórico completo de presupuestos y datos del negocio, ignorando cualquier filtro de estado, año o mes que esté activo en la pantalla en ese momento.
- Q: ¿Cómo deben estructurarse las carpetas y archivos dentro del archivo comprimido ZIP? → A: Estructura plana en la raíz: todos los archivos PDF y el archivo datos.json se ubican directamente en la raíz del ZIP, sin subcarpetas ni carpetas intermedias.
- Q: ¿Qué tipo de indicador de progreso visual debe mostrarse mientras se generan los PDF y se empaqueta el archivo ZIP? → A: Texto de avance dinámico en el propio botón de exportación (mostrando recuento en curso ej: «Generando (X/N)...» y fase final «Comprimiendo ZIP...»), deshabilitado durante la operación para evitar pulsaciones concurrentes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descarga consolidada de todos los presupuestos en un .zip (Priority: P1)

Como profesional autónomo o freelance que gestiona sus propuestas en la aplicación, cuando consulto mi historial de presupuestos quiero disponer de un botón visible para descargar de una sola vez un archivo comprimido `.zip` que contenga tanto un documento PDF listo para archivar de cada presupuesto emitido o cerrado como un archivo de datos completo con toda la información de mi negocio (perfil, logo, clientes, catálogo y presupuestos), para tener una copia de respaldo segura en mi ordenador sin tener que descargar cada presupuesto uno a uno.

**Why this priority**: Es la funcionalidad nuclear del requerimiento. Proporciona al profesional la tranquilidad de no perder su histórico de trabajo ante problemas en el navegador o cambio de equipo, resolviendo la necesidad crítica de respaldo local.

**Independent Test**: Con al menos un presupuesto emitido o anulado en la aplicación, se pulsa el botón «Exportar todo (.zip)» en la pantalla de presupuestos. Se comprueba que el navegador descarga un archivo con nombre `presupuestospro-copia-AAAA-MM-DD.zip` (con la fecha local de hoy) y que, al descomprimirlo, contiene un PDF por cada presupuesto con el formato `{Número} - {Cliente}.pdf` y el archivo de datos `datos.json`, coincidiendo los importes e información de los PDF exactamente con los que se descargan de forma individual.

**Acceptance Scenarios**:

1. **Given** que el usuario tiene presupuestos emitidos en la aplicación, **When** accede a la pantalla de presupuestos («Historial de Presupuestos»), **Then** visualiza un botón claramente identificado como «Exportar todo (.zip)» en una posición destacada de la cabecera o controles del listado.
2. **Given** que el usuario hace clic en «Exportar todo (.zip)», **When** el proceso se completa satisfactoriamente, **Then** el navegador descarga automáticamente un archivo comprimido con el nombre exacto `presupuestospro-copia-AAAA-MM-DD.zip` (donde AAAA-MM-DD corresponde a la fecha local del día en que se efectúa la exportación).
3. **Given** el archivo `.zip` descargado, **When** el usuario lo descomprime en su ordenador, **Then** encuentra directamente en la raíz de la carpeta descomprimida (estructura plana sin subcarpetas):
   - Un archivo PDF por cada presupuesto con número oficial asignado (estados emitido, enviado, aceptado, rechazado, caducado o anulado), nombrado como `{Número} - {Cliente}.pdf` (utilizando la versión activa más reciente).
   - Un único archivo `datos.json` que contiene el volcado íntegro del estado de la aplicación (perfil profesional, logotipo, clientes, catálogo de servicios, numeraciones y presupuestos completos, incluyendo borradores).
4. **Given** cualquiera de los archivos PDF incluidos dentro del archivo `.zip`, **When** el usuario lo abre en cualquier visor de documentos, **Then** su diseño visual, datos de emisor, datos de cliente, conceptos, importes y desglose de impuestos (IVA e IRPF) son exactamente idénticos al PDF que se obtiene al pulsar el botón de descarga individual para ese mismo presupuesto, cuadrando al céntimo (por ejemplo, 3.604,00 € en el caso de control).
5. **Given** que la exportación finaliza, **When** el usuario examina sus datos en la aplicación, **Then** todos sus presupuestos, clientes, catálogo y perfil continúan intactos y sin ninguna modificación (operación estrictamente de solo lectura).
6. **Given** que el usuario tiene aplicados filtros por estado, año o mes en el listado de presupuestos, **When** pulsa el botón «Exportar todo (.zip)», **Then** el archivo descargado incluye los presupuestos y datos de todo el histórico de la aplicación, sin restringirse a los elementos que coinciden con los filtros visuales activos.

---

### User Story 2 - Control visual y prevención ante cero presupuestos exportables (Priority: P2)

Como usuario de la aplicación que aún no ha emitido ningún presupuesto (o solo cuenta con borradores sin cerrar), cuando veo la lista de presupuestos quiero que el botón de exportación me indique con claridad que no hay documentos listos para exportar, para no descargar un archivo vacío ni quedarme confundido sobre el estado de mis datos.

**Why this priority**: Evita frustración, clics inútiles y descargas de ficheros vacíos o incompletos cuando el usuario se encuentra en su fase inicial o no tiene documentos consolidados.

**Independent Test**: Accediendo a la aplicación con 0 presupuestos registrados (o únicamente presupuestos en estado borrador), se comprueba que el botón «Exportar todo (.zip)» se encuentra deshabilitado visualmente con un texto de ayuda o indicación accesible que explica que no hay presupuestos emitidos para exportar, impidiendo la activación de descargas vacías.

**Acceptance Scenarios**:

1. **Given** que no existe ningún presupuesto registrado en el sistema, **When** el usuario entra en el listado de presupuestos, **Then** el botón «Exportar todo (.zip)» se muestra deshabilitado, impidiendo el clic y mostrando una indicación explicativa clara.
2. **Given** que en el sistema únicamente existen presupuestos en estado de borrador y ningún presupuesto con número oficial asignado (emitido, enviado, aceptado, rechazado, caducado o anulado), **When** el usuario visualiza el botón de exportación, **Then** el botón permanece inactivo/deshabilitado con un mensaje o texto que aclara que se requiere al menos un presupuesto con número oficial para generar la exportación documental.

---

### User Story 3 - Indicador de estado y progreso durante la exportación en lotes (Priority: P3)

Como usuario que acumula un volumen significativo de presupuestos (por ejemplo, 20, 50 o más de 100 documentos), cuando solicito la exportación completa quiero observar un indicador visual evidente de que la aplicación está trabajando en la compilación de los documentos y el empaquetado del archivo, para tener certeza de que el proceso está activo y evitar pulsaciones repetidas por impaciencia.

**Why this priority**: La generación secuencial de múltiples documentos PDF y su compresión en el cliente puede tomar varios segundos según la potencia del equipo; la retroalimentación inmediata previene bloqueos percibidos y dobles envíos.

**Independent Test**: Con un volumen elevado de presupuestos, al pulsar «Exportar todo (.zip)», se verifica que el botón transiciona de inmediato a un estado de procesamiento deshabilitado mostrando el avance dinámico («Generando (1/N)...», «Generando (2/N)...» y «Comprimiendo ZIP...»), y que tras completarse la descarga vuelve a su estado normal de forma transparente.

**Acceptance Scenarios**:

1. **Given** que el usuario hace clic sobre el botón habilitado «Exportar todo (.zip)», **When** arranca la generación de los documentos, **Then** el botón queda temporalmente deshabilitado para evitar peticiones concurrentes y muestra el progreso dinámico por presupuesto (por ejemplo, «Generando (1/3)...», «Generando (2/3)...») y al concluir la creación documental muestra «Comprimiendo ZIP...».
2. **Given** que el proceso de generación y descarga concluye con éxito, **When** el archivo `.zip` es entregado al navegador para su descarga, **Then** el botón recupera su estado habitual y se presenta un aviso breve de éxito informando del resultado de la exportación.
3. **Given** que se produjera algún fallo inesperado durante la generación de algún documento o la creación del archivo comprimido, **When** se interrumpe el proceso, **Then** la interfaz restaura el botón a su estado operativo y presenta un mensaje de alerta informativo en español explicando que no se pudo completar la exportación, sin dejar la pantalla bloqueada ni perder datos.

---

### User Story 4 - Nombres de archivo seguros y normalizados frente a caracteres conflictivos (Priority: P4)

Como usuario que trabaja con nombres comerciales variados (clientes con barras, comillas, dos puntos, barras inclinadas o caracteres especiales como «Diseño/Web S.L.»), cuando descargo y abro el archivo `.zip` quiero que todos los nombres de los documentos PDF sigan una nomenclatura limpia y respetuosa con los sistemas de archivos habituales (Windows, macOS, Linux), para que la descompresión no falle ni genere errores en el explorador de archivos.

**Why this priority**: Evita que caracteres reservados o no válidos en rutas del sistema operativo impidan la extracción del archivo `.zip` en el equipo del cliente final.

**Independent Test**: Se crea un presupuesto para un cliente cuyo nombre incluya caracteres no permitidos en nombres de archivos (por ejemplo `Estudio/Creativo: "Norte" & Cía. <SL>`) y se exporta el archivo `.zip`. Al descomprimirlo, se verifica que el PDF se nombra correctamente sustituyendo o suprimiendo los caracteres problemáticos, conservando la legibilidad del nombre (por ejemplo `2026-001 - EstudioCreativo Norte & Cía. SL.pdf`).

**Acceptance Scenarios**:

1. **Given** un presupuesto emitido con número `2026-001` y un cliente llamado `Diseño/Web S.L.`, **When** se examinan los archivos dentro del `.zip`, **Then** el documento PDF asociado lleva un nombre libre de barras y caracteres conflictivos mediante supresión directa (por ejemplo `2026-001 - DiseñoWeb S.L..pdf`).
2. **Given** dos o más presupuestos que pudieran generar una colisión accidental de nombre de archivo dentro del mismo `.zip`, **When** se conforma la estructura del comprimido, **Then** el sistema asegura nombres únicos para cada archivo sin sobreescribir ni omitir ningún documento.
3. **Given** un presupuesto con un nombre de cliente extraordinariamente largo, **When** se construye el nombre de archivo, **Then** la longitud se acota a un límite razonable (hasta 60 caracteres en el nombre del cliente) para evitar que se superen los límites máximos de longitud de ruta de los sistemas operativos.

---

### Edge Cases

- **Cero presupuestos en el sistema**: El botón «Exportar todo (.zip)» aparece deshabilitado. No se permite pulsar ni se descarga un archivo zip vacío.
- **Solo existen presupuestos en estado borrador**: Dado que los borradores no tienen numeración consolidada ni versión inmutable de emisión, se excluyen de la generación de PDF; el botón de exportación refleja que no hay documentos emitidos para generar en PDF, aunque los borradores sí quedarán salvaguardados en el archivo `datos.json` cuando se realice una exportación.
- **Presupuestos en estado Anulado**: Los presupuestos anulados que cuentan con número oficial se incluyen en la exportación con su correspondiente PDF, luciendo la marca de agua «ANULADO» tal como lo hace la descarga individual de la aplicación.
- **Presupuestos con múltiples versiones emitidas (v1, v2...)**: Se exporta como PDF la última versión activa del presupuesto (que contiene el estado final acordado). Todas las versiones históricas continúan preservadas dentro de `datos.json`.
- **Nombres de clientes con caracteres reservados en Windows/Unix (`/ \ : * ? " < > |`)**: Se limpian de forma preventiva para asegurar compatibilidad total en cualquier descompresor nativo.
- **Espacios iniciales, finales o múltiples en el nombre de cliente**: Se normalizan a un espacio simple para garantizar una presentación tipográfica limpia en el nombre del fichero.
- **Filtros visuales activos en el listado (año, mes o estado)**: La exportación opera a nivel de base de datos completa y no se ve alterada por los filtros visuales activos en la tabla; siempre empaqueta la totalidad del histórico.
- **Volúmenes altos de documentos (50 a 200 presupuestos)**: La operación se ejecuta en el navegador manteniendo retroalimentación visual continua para evitar que la ventana parezca congelada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación DEBE incorporar un botón de acción con el texto «Exportar todo (.zip)» (o acompañado de icono representativo) en la cabecera o barra de acciones del listado de presupuestos.
- **FR-002**: El botón de exportación DEBE estar deshabilitado cuando no existan presupuestos aptos para exportación documental (presupuestos con número oficial asignado: emitidos, enviados, aceptados, rechazados, caducados o anulados).
- **FR-003**: Al pulsar el botón «Exportar todo (.zip)», el sistema DEBE generar y descargar un único archivo comprimido en formato `.zip` con la totalidad del histórico de presupuestos y datos del negocio, con independencia de los filtros visuales (estado, año o mes) que se encuentren aplicados en ese momento en el listado.
- **FR-004**: El archivo comprimido DEBE nombrarse estrictamente siguiendo el patrón `presupuestospro-copia-AAAA-MM-DD.zip`, donde `AAAA-MM-DD` representa el año, mes y día correspondientes a la fecha local en la que se ejecuta la acción.
- **FR-005**: El archivo `.zip` DEBE contener un documento PDF por cada presupuesto con número oficial asignado (emitidos, enviados, aceptados, rechazados, caducados o anulados) existente en el sistema, generado a partir de su versión activa más reciente y ubicado directamente en la raíz del archivo `.zip` (estructura plana).
- **FR-006**: Cada documento PDF dentro del archivo `.zip` DEBE nombrarse según el formato `{Número} - {Cliente}.pdf`, donde `{Número}` es el código identificativo del presupuesto y `{Cliente}` es el nombre del cliente con caracteres conflictivos saneados.
- **FR-007**: Los documentos PDF empaquetados en el archivo `.zip` DEBEN ser visual y numéricamente idénticos a los documentos generados individualmente por la aplicación para ese mismo presupuesto, cuadrando sus importes, bases imponibles, porcentajes de retención de IRPF, cuotas de IVA y total final al céntimo.
- **FR-008**: Si un presupuesto exportado se encuentra en estado anulado, el documento PDF incluido en el `.zip` DEBE incluir la marca visual distintiva de anulación correspondiente.
- **FR-009**: El archivo `.zip` DEBE contener exactamente un archivo de datos denominado `datos.json` en su raíz (compartiendo el nivel principal con los documentos PDF sin subcarpetas).
- **FR-010**: El archivo `datos.json` DEBE contener la estructura completa de copia de seguridad del negocio (incluyendo datos de perfil del emisor, imagen o logotipo codificado, catálogo de servicios, listado de clientes, contadores correlativos de numeración y el historial completo de presupuestos con todas sus versiones y borradores), apta para futura restauración.
- **FR-011**: El archivo `datos.json` DEBE generarse con codificación UTF-8 y formateo legible (con sangría de 2 espacios).
- **FR-012**: La ejecución de la exportación DEBE ser una operación de solo lectura, sin alterar en ningún modo los registros, estados, fechas ni contadores persistidos en la aplicación.
- **FR-013**: Mientras la aplicación genera los documentos PDF y compone el archivo comprimido, el botón de exportación DEBE adoptar un estado visual de procesamiento deshabilitado reflejando el avance dinámico del lote (mostrando el recuento «Generando (X/N)...» durante la creación de PDFs y «Comprimiendo ZIP...» durante el empaquetado final) para evitar pulsaciones redundantes y confirmar la actividad continua.
- **FR-014**: Al culminar con éxito la descarga del archivo `.zip`, la interfaz DEBE mostrar un mensaje o aviso de confirmación temporal informando de que la exportación ha sido completada satisfactoriamente.
- **FR-015**: Si ocurre un error no recuperable durante la generación, el sistema DEBE notificar al usuario mediante un mensaje amigable en español de España e informar de que la exportación no pudo concluirse, restaurando la interfaz a su estado interactivo habitual.

### Key Entities *(include if feature involves data)*

- **Archivo Comprimido de Exportación (.zip)**: Paquete contenedor descargado en el equipo del usuario que agrupa los documentos imprimibles y la copia de seguridad de datos en una estructura plana en raíz.
  - Atributos: nombre de archivo estandarizado con fecha del día (`presupuestospro-copia-AAAA-MM-DD.zip`), contenido plano en la raíz (conjunto de archivos PDF + archivo `datos.json` sin subcarpetas).
- **Documento PDF de Presupuesto en Lote**: Representación digital inmutable e individual de una propuesta comercial lista para lectura e impresión.
  - Atributos: nombre normalizado (`{Número} - {Cliente}.pdf`), contenido gráfico homologado con la plantilla oficial, última versión emitida, estado de emisión o anulación.
- **Archivo de Datos de Respaldo (`datos.json`)**: Archivo de formato estructurado que salvaguarda la totalidad de la información operativa del profesional.
  - Atributos: versión de formato, fecha/hora de exportación, datos de perfil (con logo), clientes, conceptos de catálogo, histórico completo de presupuestos y contadores correlativos por año.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con 1 o más presupuestos con número oficial asignado, el usuario puede iniciar la exportación completa en exactamente 1 interacción (un único clic en «Exportar todo (.zip)»).
- **SC-002**: El archivo descargado contiene exactamente el 100% de los presupuestos con número oficial asignado (emitidos, enviados, aceptados, rechazados, caducados o anulados) en formato PDF y exactamente 1 archivo `datos.json`.
- **SC-003**: El 100% de los importes, subtotales, retenciones de IRPF, cuotas de IVA y totales finales de los PDF dentro del archivo `.zip` coinciden al céntimo con las cifras mostradas en la aplicación y en las descargas individuales.
- **SC-004**: Para un volumen estándar de hasta 20 presupuestos, la generación y descarga del archivo `.zip` se completa en menos de 10 segundos en un ordenador personal estándar sin bloquear la capacidad de respuesta del navegador.
- **SC-005**: El 100% de los nombres de archivo PDF generados dentro del `.zip` son válidos y descomprimibles sin advertencias ni errores en los sistemas operativos Windows, macOS y Linux.
- **SC-006**: Con 0 presupuestos con número oficial asignado, el botón de exportación permanece inactivo o bloquea la descarga en el 100% de los casos, evitando descargas vacías.
- **SC-007**: El 100% de los datos locales (IndexedDB) permanecen idénticos antes y después de cualquier exportación.
- **SC-008**: El archivo `datos.json` generado en la raíz del `.zip` valida positivamente frente al validador de esquema de copia de seguridad ya existente en el sistema.

## Assumptions

- **A-001**: La exportación se procesa de forma completamente autónoma en el navegador del usuario (cliente puro), sin recurrir a servidores ni servicios de compresión en la nube, preservando la política de privacidad y soberanía de datos del proyecto.
- **A-002**: Los presupuestos en estado borrador (sin número asignado ni versión consolidada) se salvaguardan dentro de `datos.json` para no perder el trabajo en curso, pero no generan documento PDF individual en el paquete comprimido.
- **A-003**: En caso de que un presupuesto cuente con varias versiones emitidas en su historial, el PDF del `.zip` plasma la última versión activa de dicho presupuesto, mientras que todas las versiones históricas quedan almacenadas en el archivo `datos.json`.
- **A-004**: La fecha empleada en el nombre del archivo `.zip` (`AAAA-MM-DD`) corresponde a la fecha de la zona horaria local del dispositivo del usuario al momento de ejecutar la acción.
- **A-005**: La sanitización de nombres de clientes reemplaza o elimina caracteres no permitidos en sistemas de archivos habituales (`/ \ : * ? " < > |`) y recorta la longitud del segmento a un máximo de 60 caracteres para garantizar compatibilidad universal.
- **A-006**: La biblioteca o mecanismo de compresión empleado para armar el archivo binario `.zip` debe ser compatible con la arquitectura ligera de la aplicación, ejecutándose en el cliente sin requerir dependencias pesadas ni backend.
