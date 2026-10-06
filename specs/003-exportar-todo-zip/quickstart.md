# Quickstart: Validación Funcional de Exportación Masiva en ZIP

**Feature**: `003-exportar-todo-zip`  
**Objetivo**: Guía paso a paso para verificar el funcionamiento de la exportación completa en formato ZIP en el navegador y mediante pruebas automatizadas.

---

## 1. Prerrequisitos y Arranque

1. Tener Node.js instalado (v20+).
2. Asegurar que las dependencias estén instaladas:
   ```bash
   npm install
   ```
3. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: `http://localhost:5173`.

---

## 2. Escenarios de Validación Funcional en Navegador

### Escenario 1: Control con cero presupuestos o solo borradores (P2 / SC-006)
1. Con la aplicación limpia (sin presupuestos o con la base de datos recién iniciada):
2. Ir a la sección **Presupuestos** (`#/presupuestos`).
3. Observar la cabecera «Historial de Presupuestos».
4. **Resultado esperado**:
   - El botón **«Exportar todo (.zip)»** está visible pero deshabilitado (`disabled`).
   - Al pasar el cursor, muestra un texto indicando que no hay presupuestos emitidos para exportar.
5. Crear un presupuesto nuevo y guardarlo únicamente como **Borrador**.
6. Volver a **Presupuestos**.
7. **Resultado esperado**: El botón continúa deshabilitado porque solo existen borradores sin numerar.

---

### Escenario 2: Exportación consolidada con varios presupuestos (P1 / SC-001, SC-002, SC-003)
1. Emitir al menos 2 o 3 presupuestos para diferentes clientes:
   - Presupuesto 1: Cliente `Estudio García` (ej. total 1.210,00 €).
   - Presupuesto 2: Cliente con caracteres especiales `Diseño/Web: "Norte" & Cía. <SL>` (ej. total 3.604,00 €).
   - (Opcional) Cambiar el estado de uno de ellos a `Anulado`.
2. Ir al **Historial de Presupuestos** (`#/presupuestos`).
3. **Resultado esperado**: El botón **«Exportar todo (.zip)»** se encuentra ahora habilitado.
4. Hacer clic en **«Exportar todo (.zip)»**.
5. **Resultado esperado durante la operación**:
   - El botón se deshabilita temporalmente para evitar clics duplicados.
   - El texto del botón cambia dinámicamente: `«Generando (1/3)...»`, `«Generando (2/3)...»`, y finalmente `«Comprimiendo ZIP...»`.
6. **Resultado esperado al terminar**:
   - El navegador inicia automáticamente la descarga de un archivo con el nombre `presupuestospro-copia-AAAA-MM-DD.zip` (donde `AAAA-MM-DD` coincide con la fecha de hoy).
   - En la interfaz aparece un aviso de éxito en español confirmando la descarga.
   - El botón vuelve a su estado normal.

---

### Escenario 3: Comprobación del contenido descomprimido del ZIP (P4 / SC-004, SC-005, SC-008)
1. Localizar el archivo `.zip` en la carpeta de descargas del ordenador.
2. Hacer doble clic para descomprimirlo.
3. **Resultado esperado en la carpeta descomprimida (estructura plana)**:
   - Existe un archivo `datos.json`.
   - Existen los archivos PDF correspondientes a los presupuestos emitidos o anulados:
     - `PRE-2026-0001 - Estudio García.pdf`
     - `PRE-2026-0002 - DiseñoWeb Norte & Cía. SL.pdf` (sin barras `/`, ni comillas `"`, ni caracteres `<>`).
   - Ningún PDF está dentro de subcarpetas.
4. Abrir `datos.json` con cualquier editor de texto:
   - Contiene `{ "aplicacion": "PresupuestoPro", "formato": 1, ... }`.
   - Incluye tanto los presupuestos emitidos como los borradores y catálogo de clientes.
5. Abrir los archivos PDF:
   - Los importes, impuestos y desglose coinciden al céntimo con la aplicación.
   - El presupuesto anulado (si lo hubiera) luce la marca de agua «ANULADO».

---

### Escenario 4: Independencia de filtros visuales activos (FR-003)
1. En el listado de presupuestos, seleccionar en el desplegable de estado: `Solo enviados`.
2. Verificar que en la tabla solo se muestra 1 presupuesto filtrado.
3. Pulsar **«Exportar todo (.zip)»**.
4. Descomprimir el nuevo archivo descargado.
5. **Resultado esperado**: El ZIP contiene todos los presupuestos emitidos del sistema (no solo el presupuesto visible por el filtro).

---

## 3. Pruebas Automatizadas

Ejecutar la suite completa con Vitest:
```bash
npm test
```

### Cobertura de pruebas unitarias y contratos:
1. `tests/unit/archivos.test.js`: Saneamiento de nombres de archivo y resolución de colisiones.
2. `tests/contract/exportacion-zip.test.js`: Conformación del paquete ZIP, inclusión de `datos.json` y estructura plana.
3. Tests preexistentes de cálculos, numeración y respaldos.
