# Contrato: Archivo de copia de seguridad

Fuente: FR-025, US8 · Decisión: research D4 y D14.

## 1. Exportar

- Botón **"Exportar copia"** (pantalla Perfil y ajustes).
- Descarga `presupuestopro-copia-AAAA-MM-DD.json` (fecha local del día).
- Codificación UTF-8, JSON con sangría de 2 espacios (legible si se abre con un editor de texto).

## 2. Estructura

```json
{
  "aplicacion": "PresupuestoPro",
  "formato": 1,
  "exportadoEn": "2026-10-03T17:51:01.000Z",
  "datos": {
    "versionEsquema": 1,
    "perfil": { "...": "ver data-model.md › Perfil" },
    "clientes": [],
    "catalogo": [],
    "presupuestos": [],
    "contadores": { "2026": 42 },
    "tema": "claro"
  }
}
```

`datos` es exactamente el **Estado** descrito en [data-model.md](../data-model.md), incluido el logo como data URL y todas las versiones emitidas.

## 3. Importar

1. Botón **"Importar copia"** → el usuario elige un archivo `.json`.
2. Validación, **sin tocar todavía ningún dato**:
   - Se puede leer como JSON.
   - `aplicacion === "PresupuestoPro"`.
   - `formato` es un número conocido (en v1 solo `1`).
   - `datos` tiene `clientes`, `catalogo` y `presupuestos` como listas, `contadores` como objeto, y `perfil` como objeto o `null`.
   - Cada presupuesto emitido o anulado tiene `numero` y al menos una versión.
   - Los contadores son coherentes: para cada año, el contador es ≥ al mayor secuencial emitido ese año.
3. Si la validación falla → **no se modifica nada** y se muestra un mensaje comprensible (US8.3), por ejemplo:
   - "Este archivo no es una copia de seguridad de PresupuestoPro."
   - "La copia está dañada o incompleta: faltan los presupuestos."
4. Si es válida → diálogo de confirmación: *"Se sustituirán todos tus datos actuales (perfil, catálogo, clientes y presupuestos) por los de la copia del dd/mm/aaaa. Esta acción no se puede deshacer. ¿Continuar?"*
5. Al confirmar → se reemplaza el estado completo de una vez (incluidos los contadores de numeración) y se informa del resultado ("Copia restaurada: 12 clientes, 87 presupuestos").

## 4. Fuera de alcance (v1)

- Combinar ("fusionar") una copia con los datos actuales.
- Copias automáticas o programadas.
- Cifrado de la copia (la copia contiene datos personales: el usuario es responsable de guardarla en un lugar seguro; se indica en un texto de ayuda junto al botón).
