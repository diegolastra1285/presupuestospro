# Contrato de Interfaz: Servicio de Exportación ZIP y Estructura del Archivo

**Feature**: `003-exportar-todo-zip`  
**Archivo**: `specs/003-exportar-todo-zip/contracts/contrato-exportacion-zip.md`

Este contrato especifica las funciones públicas, firmas de TypeScript/JSDoc, entradas, salidas y estructura interna del paquete ZIP generado por la aplicación.

---

## 1. Estructura del Archivo ZIP

El archivo comprimido generado debe cumplir estrictamente la siguiente jerarquía plana en la raíz:

```text
presupuestospro-copia-AAAA-MM-DD.zip
├── datos.json
├── 2026-001 - Empresa Alfa S.L..pdf
├── 2026-002 - Estudio García.pdf
└── 2026-003 - Cliente Especial.pdf
```

### Reglas de Estructura:
1. **Sin subcarpetas**: Prohibido crear carpetas como `pdfs/`, `datos/` o carpetas intermedias.
2. **Nombre del paquete ZIP**: `presupuestospro-copia-AAAA-MM-DD.zip` (donde `AAAA-MM-DD` es la fecha local en formato ISO de calendario).
3. **Archivo de respaldo**: Exactamente `datos.json`.
4. **Archivos PDF**: Nombrados como `{Número} - {Cliente}.pdf`.

---

## 2. API del Módulo de Normalización de Nombres

Ubicación: `src/utils/archivos.js` (o exportado desde módulo de utilidades).

### `normalizarNombrePdfLote(numero, nombreCliente, nombresExistentes)`

```javascript
/**
 * Genera un nombre de archivo seguro y único para un PDF dentro del lote ZIP.
 * 
 * Reglas aplicadas:
 * 1. Elimina caracteres conflictivos en Windows/macOS/Linux: \ / : * ? " < > |
 * 2. Elimina caracteres de control ASCII (0x00 a 0x1F y 0x7F).
 * 3. Colapsa secuencias de espacios en blanco a un único espacio.
 * 4. Trunca el nombre de cliente a un máximo de 60 caracteres.
 * 5. Si el cliente queda vacío, utiliza 'Cliente'.
 * 6. Concatena: `${numero} - ${clienteLimpio}.pdf`
 * 7. Si el nombre ya existe en `nombresExistentes`, agrega sufijo correlativo `_${i}` antes de .pdf.
 * 
 * @param {string} numero - Código oficial del presupuesto (ej. 'PRE-2026-0001' o '2026-001')
 * @param {string} nombreCliente - Razón social o nombre comercial del cliente
 * @param {Set<string>} [nombresExistentes] - Set mutable de nombres ya registrados en el lote actual
 * @returns {string} Nombre de archivo limpio y único terminado en .pdf
 */
export function normalizarNombrePdfLote(numero, nombreCliente, nombresExistentes = new Set())
```

### Casos de Prueba del Contrato de Nombres:
| Entrada `numero` | Entrada `nombreCliente` | Resultado esperado |
| :--- | :--- | :--- |
| `'2026-001'` | `'Estudio García'` | `'2026-001 - Estudio García.pdf'` |
| `'2026-002'` | `'Diseño/Web: "Norte" <SL>'` | `'2026-002 - DiseñoWeb Norte SL.pdf'` |
| `'2026-003'` | `'   Espacios   múltiples   '` | `'2026-003 - Espacios múltiples.pdf'` |
| `'2026-004'` | `''` (vacío o nulo) | `'2026-004 - Cliente.pdf'` |
| `'2026-005'` | Cadena de >60 caracteres | Truncado a 60 chars en nombre cliente + `.pdf` |
| `'2026-001'` | `'Estudio García'` (duplicado en set) | `'2026-001 - Estudio García_2.pdf'` |

---

## 3. API del Servicio de Exportación ZIP

Ubicación: `src/services/exportacion-zip.js`.

### `exportarTodoZip(estado, onProgreso)`

```javascript
/**
 * Orquesta la generación en lote de PDFs, conformación de datos.json y compresión en ZIP.
 * 
 * @param {object} estado - Estado global de la aplicación (IndexedDB)
 * @param {function} [onProgreso] - Callback para notificar el progreso a la UI:
 *        ({ fase, completados, total }) => void
 *        - fase: 'generando' | 'comprimiendo'
 *        - completados: número de PDFs procesados
 *        - total: total de presupuestos a generar
 * @returns {Promise<{ blob: Blob, nombreArchivo: string, totalPdfs: number }>}
 * @throws {Error} Si falla la generación o compresión
 */
export async function exportarTodoZip(estado, onProgreso = () => {})
```

### Contrato de Eventos de Progreso (`onProgreso`):
1. **Inicio de generación de PDFs**:
   `onProgreso({ fase: 'generando', completados: 0, total: N })`
2. **Durante generación de cada PDF**:
   `onProgreso({ fase: 'generando', completados: 1, total: N })`
   ...
   `onProgreso({ fase: 'generando', completados: N, total: N })`
3. **Inicio de compresión ZIP**:
   `onProgreso({ fase: 'comprimiendo', completados: N, total: N })`

---

## 4. Contrato de Disparo de Descarga en Navegador

### `dispararDescargaArchivo(blob, nombreArchivo)`

```javascript
/**
 * Desencadena la descarga de un Blob en el navegador sin recargar la página.
 * 
 * @param {Blob} blob - Archivo binario a descargar
 * @param {string} nombreArchivo - Nombre sugerido para el archivo descargado
 */
export function dispararDescargaArchivo(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```
