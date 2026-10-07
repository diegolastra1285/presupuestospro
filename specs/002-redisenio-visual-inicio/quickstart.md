# Quickstart: Validación Visual (002)

Esta guía detalla los pasos para validar funcionalmente el rediseño sin interferir en los datos locales de producción o entrar en detalles de código interno.

## Prerrequisitos
1. Entorno de desarrollo local configurado con `Node.js`.
2. Dependencias instaladas: `npm install`.
3. Servidor de desarrollo Vite en ejecución: `npm run dev`.

## Escenarios de Validación E2E

### 1. Panel de Inicio (Dashboard) y Navegación
- **Acción**: Accede a `http://localhost:5173/#/` en un navegador limpio.
- **Validación**:
  - Se debe observar el "Cuadro de Mando" con el recuento cuantitativo en ceros (si es base limpia).
  - Hacer clic en el icono "Clientes" de la barra superior.
  - La URL cambiará a `#/clientes` sin recargar la página completa. El botón "Clientes" se marcará como activo.

### 2. Editor Dos Columnas (Desktop)
- **Acción**: Redimensionar la ventana a un ancho superior a `1024px`. Navegar a la creación de un `Nuevo Presupuesto`.
- **Validación**:
  - La pantalla se dividirá limpiamente: Formulario a la izquierda, visor PDF renderizado a la derecha.
  - Escribir en cualquier campo numérico provocará el refresco visual inmediato (en milisegundos) del desglose fiscal y de la vista del documento PDF sin colapso.

### 3. Responsividad Móvil y Touch Targets
- **Acción**: Activar el DevTools Device Toolbar (o redimensionar a `360px` de ancho).
- **Validación**:
  - La tabla del listado de presupuestos transiciona automáticamente a una disposición de "tarjetas" apiladas.
  - No debe aparecer barra de desplazamiento (*scroll*) horizontal en absoluto.
  - Inspeccionar botones y campos del formulario: Todos deben poseer un tamaño físico mínimo (largo y ancho) de `44px`.

### 4. Coherencia Documental
- **Acción**: Finalizar el presupuesto y generar el archivo `.pdf`.
- **Validación**:
  - La estética (tipografía, peso de la cabecera, colores corporativos) del PDF coincide armónicamente con los estilos sobrios experimentados en la pantalla web.
