# Contrato: Documento PDF del presupuesto

Fuente: FR-016, FR-017, FR-018, FR-019, FR-020, FR-026, FR-027, US2, US3, US6.9 · Implementación: pdfmake (research D6).

El PDF es el entregable que recibe el cliente final. Este contrato define **qué** debe contener y **cómo** se comporta, de forma comprobable abriendo el archivo.

## 1. Nombre del archivo

```text
v1:   {numero}_{NombreCliente}.pdf          → PRE-2026-0042_Acme_Digital_Corp.pdf
v≥2:  {numero}_{NombreCliente}_v{N}.pdf     → PRE-2026-0042_Acme_Digital_Corp_v2.pdf
```

Normalización de `{NombreCliente}` (nombre del cliente **congelado en la versión**):

1. Se eliminan los caracteres no válidos en nombres de archivo: `\ / : * ? " < > |` y caracteres de control.
2. Los espacios (uno o varios) se sustituyen por un `_`.
3. Se conservan tildes y ñ.
4. Se recorta a 60 caracteres.
5. Si queda vacío → `Cliente`.

## 2. Formato general

| Aspecto | Valor |
|---|---|
| Tamaño | A4 vertical, márgenes ~40 pt |
| Colores | Siempre fondo blanco y texto oscuro, sin importar el tema de la interfaz (FR-026, US7.2) |
| Tipografía | Roboto (incluida en pdfmake; admite tildes, ñ y €) |
| Idioma | Español de España; importes `1.272,00 €`; fechas `dd/mm/aaaa` (FR-027) |
| Texto | Seleccionable (no es una imagen) |

## 3. Contenido obligatorio (FR-017), en orden

| # | Bloque | Contenido |
|---|---|---|
| 1 | **Encabezado** | Izquierda: logo del emisor (máx. ~160 × 60 pt, proporción conservada) **o**, si no hay logo, nombre y NIF/DNI del emisor en texto destacado (FR-002). Derecha: título **"PRESUPUESTO"**, número (`PRE-2026-0042` o `PRE-2026-0042 (v2)`), fecha de emisión y fecha de validez ("Válido hasta: dd/mm/aaaa"). |
| 2 | **Leyenda** | "Este documento no es una factura", visible bajo el encabezado. |
| 3 | **Emisor** | Nombre o razón social, NIF/DNI, dirección, email y teléfono (los que existan). |
| 4 | **Cliente** | Nombre o razón social, NIF/CIF/DNI, dirección y email (los que existan). |
| 5 | **Tabla de líneas** | Columnas: Descripción · Cantidad · Precio unitario · Importe. Cantidad con formato es-ES sin decimales sobrantes (`15`, `2,5`). |
| 6 | **Totales** | Base imponible · IVA (21 %) · Retención IRPF (15 %, 7 % o 0 %) **siempre presente**, aunque sea `0,00 €` · **TOTAL** destacado. La retención se muestra en negativo (`−180,00 €`). |
| 7 | **Condiciones / notas** | Texto del presupuesto (se omite el bloque si está vacío). |
| 8 | **Datos de pago** | Solo si el emisor los configuró. |
| 9 | **Pie** | "Página X de Y" en todas las páginas. |

Todas las cifras proceden de los `totales` guardados en la versión, idénticos a los de la pantalla (FR-018, SC-002).

## 4. Comportamiento en documentos largos (FR-019, US2.7, SC-008)

- Las descripciones largas (hasta 500 caracteres o más) **continúan en varias líneas dentro de su celda**. Las columnas numéricas tienen un ancho fijo y nunca se solapan.
- Si la tabla no cabe en una página, continúa en la siguiente **repitiendo la cabecera de la tabla**.
- El bloque de **totales es indivisible**: si no cabe entero al final de una página, pasa completo a la siguiente.
- Una sola fila nunca se parte de forma que el importe quede en una página y la descripción en otra (filas indivisibles salvo que una sola fila supere una página, caso no previsto).

## 5. Presupuestos anulados (FR-020, US6.9)

- Al volver a descargar **cualquier versión** de un presupuesto anulado, el PDF incluye una marca de agua diagonal **"ANULADO"** en todas las páginas, en rojo semitransparente, que no impide leer el contenido.
- El nombre del archivo no cambia.

## 6. Rendimiento (SC-003)

- Desde que se pulsa "Generar PDF" hasta que empieza la descarga: **< 5 s** en un móvil de gama media. La librería se descarga la primera vez (≈1 MB) y luego queda en caché, también sin conexión.

## 7. Comprobación

- **Automática**: pruebas que construyen la definición del documento con el ejemplo de referencia (PRE-2026-0042) y verifican que contiene los textos e importes esperados, la marca "ANULADO" cuando corresponde y el nombre de archivo correcto.
- **Manual**: [quickstart.md](../quickstart.md), escenarios 2, 6 y 9.
