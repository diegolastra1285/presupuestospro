# Research: Exportar todos mis presupuestos en un archivo comprimido .zip

**Feature**: `003-exportar-todo-zip`  
**Fecha**: 2026-10-06  
**Estado**: Completado

Este documento consolida las decisiones de arquitectura, investigación de dependencias y patrones técnicos necesarios para implementar la exportación completa de presupuestos en formato ZIP con generación de PDFs en lote y volcado íntegro de datos en el cliente.

---

## 1. Generación y compresión de archivos ZIP en el navegador

### Contexto
La aplicación es 100% cliente (SPA/PWA) y la Constitución prohíbe terminantemente el uso de servidores o APIs externas para procesar datos de usuarios (Principio V: Privacidad y Datos con Respeto). La compresión del archivo `.zip` debe realizarse localmente en memoria del navegador y ofrecer rendimiento óptimo sin bloquear la interfaz.

### Decisión
Utilizar **`fflate`** (`^0.8.3`) como biblioteca de compresión ZIP.

### Justificación
- **Ligereza extrema**: Pesa aproximadamente ~8 KB gzipped (frente a los ~100 KB de `jszip`).
- **Cero dependencias**: Paquete puro ESM autónomo, sin dependencias transitivas ni polyfills de Node.js (como `Buffer` o `stream`).
- **Compatibilidad con Vite**: Se integra nativamente en el árbol de módulos ES sin advertencias de empaquetado ni configuración especial.
- **Rendimiento**: Es el descompresor/compresor de JavaScript más rápido en navegador moderno, utilizando `Uint8Array` nativos y APIs de `Blob`.
- **Estructura plana y control binario**: Permite armar archivos ZIP en estructura plana pasando un diccionario plano de rutas `{ 'datos.json': Uint8Array, '2026-001 - Cliente.pdf': Uint8Array }`.
- **Alineamiento con la Constitución**: Cumple con el Principio I (*Simplicidad ante todo / YAGNI*) al ser la opción más ligera y de menor impacto en el bundle final.

### Alternativas consideradas
- **`jszip`**: Biblioteca madura y muy conocida, pero obsoleta en diseño interno (arrastra dependencias legacy, polyfills y un tamaño 10 veces mayor sin aportar ventajas funcionales para nuestro caso de uso).
- **`client-zip`**: Muy ligera (~4 KB), pero orientada principalmente a streaming de respuestas HTTP (fetch), con una API menos intuitiva para buffers en memoria ya resueltos.
- **Implementación manual de ZIP con `CompressionStream`**: Aunque las APIs modernas de navegador soportan compresión Deflate/Gzip mediante `CompressionStream`, no implementan el formato contenedor PKZIP (.zip) con cabeceras de directorio central de forma nativa sin código artesanal complejo.

---

## 2. Generación de PDFs en lote sin bloqueo de interfaz

### Contexto
La aplicación ya cuenta con `pdfmake` y la función `construirDefinicionPdf(numero, version, esAnulado)` en `src/pdf/generador.js`. Sin embargo, `descargarPdf()` invoca directamente `.download()` en `pdfMake`, lo que dispararía múltiples ventanas/diálogos de descarga individuales en el navegador en lugar de capturar los datos binarios para empaquetarlos.

### Decisión
1. Incorporar en `src/pdf/generador.js` (o en un servicio modular `src/services/exportacion-zip.js`) la función:
   ```javascript
   export async function generarPdfBlob(numero, version, esAnulado = false)
   ```
   que obtiene el `docDefinition` y resuelve una `Promise<Uint8Array>` mediante `pdfMake.createPdf(docDefinition).getBuffer()` (o `.getBlob()` y conversión a `Uint8Array`).
2. Procesar los presupuestos de manera **secuencial asíncrona** en un bucle controlado con `await`:
   - Permite reportar el progreso exacto (`Generando (1/N)...`, `Generando (2/N)...`).
   - Cede el hilo de eventos periódicamente (`await new Promise(r => setTimeout(r, 0))` si es necesario) para permitir al navegador repintar el botón.
   - Evita picos de memoria por la instanciación simultánea de decenas de instancias de `pdfmake`.

### Justificación
- Reutiliza al 100% la lógica visual, tipográfica, cálculo de totales y marcas de agua («ANULADO») existentes en `src/pdf/generador.js`, garantizando paridad milimétrica y al céntimo con las descargas individuales (FR-007, FR-008).
- La ejecución secuencial controlada asegura una experiencia fluida incluso en lotes grandes (50-200 documentos), cumpliendo SC-004.

### Alternativas consideradas
- **Generación en paralelo con `Promise.all`**: Para 50 o 100 presupuestos podría saturar la memoria del navegador o generar cuellos de botella en la compilación de fuentes de pdfmake, además de impedir un contador de progreso secuencial inteligible para el usuario.
- **Web Workers**: Aportaría aislamiento del hilo principal, pero `pdfmake` requiere configuración específica de importScripts/Vite workers para fuentes y DOM, lo que violaría el Principio I (*Simplicidad ante todo*) dada la rapidez con que se procesan 20 presupuestos (< 3 segundos).

---

## 3. Respaldo de datos (`datos.json`) y compatibilidad con restauración

### Contexto
El archivo comprimido debe contener en su raíz el archivo `datos.json` con la totalidad de la base de datos de la aplicación (perfil con logo, catálogo, clientes, numeración correlativa y todos los presupuestos, incluyendo borradores). Debe validar positivamente con el validador existente `validarEsquemaCopiaSeguridad()` (SC-008).

### Decisión
Reutilizar la función `generarCopiaSeguridadJson(estado)` definida en `src/components/perfil/RespaldoDatos.jsx` (extrayéndola o importándola directamente):
```javascript
{
  aplicacion: "PresupuestoPro",
  formato: 1,
  exportadoEn: new Date().toISOString(),
  datos: estado // copia íntegra inmutable del estado
}
```
El archivo se empaqueta en la raíz del ZIP como `datos.json`, codificado en UTF-8 con sangría de 2 espacios (FR-010, FR-011).

### Justificación
- Garantiza total compatibilidad con la función de restauración existente de PresupuestosPro.
- Elimina duplicación de lógica (DRY).

---

## 4. Normalización de nombres de archivo y prevención de colisiones

### Contexto
Los sistemas de archivos (Windows NTFS, macOS APFS, Linux ext4) tienen restricciones estrictas sobre caracteres prohibidos en nombres de archivos (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`) y longitud máxima de rutas.
La spec requiere:
- Nombre del archivo ZIP: `presupuestospro-copia-AAAA-MM-DD.zip` (fecha local de hoy).
- Nombre de cada PDF: `{Número} - {Cliente}.pdf`.
- Estructura plana en la raíz del ZIP sin subcarpetas.
- Soporte para nombres conflictivos y prevención de colisiones accidentales.

### Decisión
Crear una función utilitaria específica para el nombre de archivo en exportación ZIP:
```javascript
export function normalizarNombrePdfLote(numero, nombreCliente, nombresExistentes = new Set())
```
Reglas de saneamiento:
1. Eliminar caracteres no permitidos: `[\\/:*?"<>|]` y caracteres de control (`[\x00-\x1F\x7F]`).
2. Reemplazar múltiples espacios o tabulaciones por un único espacio (`\s+` → `' '`).
3. Truncar el nombre de cliente a un máximo de 60 caracteres.
4. Si el nombre de cliente queda vacío o es nulo, usar `'Cliente'`.
5. Formatear como: `${numero} - ${clienteLimpio}.pdf`.
6. Si el nombre resultante ya existe en el conjunto `nombresExistentes`, añadir un sufijo correlativo `_${i}` antes de la extensión `.pdf` (ej. `2026-001 - Empresa_2.pdf`) para prevenir sobreescrituras en el ZIP (FR-006, US4).

### Justificación
Cumple rigurosamente con los requisitos de la spec, garantizando que el ZIP pueda descomprimirse con doble clic en Windows, macOS y Linux sin advertencias.

---

## 5. Criterio de inclusión de presupuestos y estados del botón

### Contexto
- Qué presupuestos generan PDF: Solo aquellos con número oficial asignado (estados: `emitido`, `enviado`, `aceptado`, `rechazado`, `caducado`, `anulado`).
- Presupuestos excluidos de PDF: Borradores sin número (`borrador`). Todos los borradores se preservan íntegros en `datos.json`.
- En presupuestos con múltiples versiones (`v1`, `v2`, etc.), se toma la última versión activa para el PDF (A-003).
- La exportación no respeta filtros visuales de la vista (año, mes, estado); exporta todo el histórico (FR-003, Clarificación 2026-10-06).

### Decisión de UI en `ListadoPresupuestos.jsx`
1. **Detección de exportabilidad**:
   ```javascript
   const presupuestosExportables = useMemo(() => {
     return (estado.presupuestos || []).filter(p => 
       p.numero && p.estado !== 'borrador' && Array.isArray(p.versiones) && p.versiones.length > 0
     );
   }, [estado.presupuestos]);
   const hayExportables = presupuestosExportables.length > 0;
   ```
2. **Estados del botón «Exportar todo (.zip)»**:
   - **Inactivo / Deshabilitado**: Si `!hayExportables`. Muestra `title="No hay presupuestos emitidos para exportar en PDF"` o texto de ayuda explicativo.
   - **Activo / Disponible**: Si `hayExportables` y no está en proceso. Texto: «Exportar todo (.zip)».
   - **En progreso**: Deshabilitado, con texto dinámico:
     - «Generando (X/N)...» durante la creación de PDFs.
     - «Comprimiendo ZIP...» durante la compresión.
3. **Disparo de descarga en el navegador**:
   - Mediante creación dinámica de enlace `<a>` con `URL.createObjectURL(blob)` y atributo `download="presupuestospro-copia-AAAA-MM-DD.zip"`, seguido de liberación con `URL.revokeObjectURL()`.
4. **Notificación**:
   - Al finalizar con éxito, mensaje temporal tipo alerta: `«Se ha descargado la copia de seguridad y N presupuestos en formato .zip.»`
   - En caso de error, restaurar botón y mostrar alerta de error amigable en español.

---

## Conclusiones

Todas las dudas técnicas e integraciones han quedado clarificadas y alineadas con la Constitución del proyecto y la especificación `003-exportar-todo-zip`:
- Biblioteca elegida: `fflate` (^0.8.3).
- Cero dependencias backend; 100% ejecución en cliente.
- Total compatibilidad con el esquema de respaldo existente.
- Cobertura completa de casos límite (0 presupuestos, caracteres conflictivos, colisiones, filtros visuales ignorados).
