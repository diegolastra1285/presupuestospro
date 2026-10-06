# Contrato de Interfaz: Componente ListadoPresupuestos y Botón de Exportación

**Feature**: `003-exportar-todo-zip`  
**Archivo**: `specs/003-exportar-todo-zip/contracts/contrato-ui-listado.md`

Este contrato especifica la presentación visual, estados de interacción, textos y comportamiento accesible del botón «Exportar todo (.zip)» en la pantalla de listado de presupuestos (`ListadoPresupuestos.jsx`).

---

## 1. Ubicación y Disposición en Pantalla

El botón de exportación se sitúa en la cabecera de la vista `ListadoPresupuestos` (`.view-header`), en el grupo de acciones principales junto al botón `+ Nuevo presupuesto`:

```html
<div class="view-header">
  <div>
    <h2 class="view-title">Historial de Presupuestos</h2>
    <p class="form-hint">Consulta, edita o emite presupuestos para tus clientes.</p>
  </div>
  <div class="header-actions" style="display: flex; gap: 0.75rem; align-items: center;">
    <button
      type="button"
      class="btn btn-secondary"
      id="btn-exportar-todo-zip"
      ...
    >
      Exportar todo (.zip)
    </button>
    <button
      type="button"
      class="btn btn-primary"
      onClick={() => navegar('#/presupuesto/nuevo')}
    >
      + Nuevo presupuesto
    </button>
  </div>
</div>
```

---

## 2. Estados del Botón y Retroalimentación

| Estado | Condición | Clases CSS / Atributos | Contenido / Texto | Indicador / Ayuda |
| :--- | :--- | :--- | :--- | :--- |
| **Deshabilitado (Sin datos)** | No existen presupuestos con número oficial (`count === 0`) | `disabled={true}`, `class="btn btn-secondary"` | `Exportar todo (.zip)` | Atributo `title="No hay presupuestos emitidos para exportar en PDF"` |
| **Habilitado (Reposo)** | Existen 1+ presupuestos con número oficial y no hay proceso en curso | `disabled={false}`, `class="btn btn-secondary"` | `Exportar todo (.zip)` | Clic inicia proceso de exportación completa |
| **Generando PDFs** | Proceso en curso, fase `'generando'` | `disabled={true}`, `class="btn btn-secondary btn--loading"` | `Generando (X/N)...` | `aria-busy="true"` |
| **Comprimiendo ZIP** | Proceso en curso, fase `'comprimiendo'` | `disabled={true}`, `class="btn btn-secondary btn--loading"` | `Comprimiendo ZIP...` | `aria-busy="true"` |

---

## 3. Mensajes de Notificación Post-Operación

### 3.1. Caso de Éxito
Al terminar la descarga del archivo ZIP con éxito:
- Se muestra un componente `<Alerta tipo="exito">` en la parte superior del listado:
  > **Texto**: `«Copia de seguridad y N presupuestos descargados con éxito en presupuestospro-copia-AAAA-MM-DD.zip.»`
- Se auto-descarta tras 6 segundos o mediante botón de cierre manual.

### 3.2. Caso de Error
Si ocurre un error inesperado durante la compilación o compresión:
- Se restaura el botón a su estado interactivo original.
- Se muestra un componente `<Alerta tipo="error">`:
  > **Texto**: `«No se pudo completar la exportación del archivo ZIP. Por favor, inténtalo de nuevo.»`
- Los datos de la aplicación y la navegación permanecen intactos.

---

## 4. Accesibilidad y Compatibilidad Móvil

1. **Accesibilidad**:
   - `aria-label`: `"Exportar todos los presupuestos emitidos y copia de datos en formato ZIP"`.
   - `aria-busy`: Refleja el estado de carga dinámico durante la generación.
2. **Diseño Responsive**:
   - En pantallas móviles (< 640px), `.header-actions` se ajusta mediante flexbox con `flex-wrap: wrap` manteniendo accesibles ambos botones.
