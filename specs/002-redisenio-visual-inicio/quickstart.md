# Quickstart: Guía de Verificación Funcional

**Feature**: `002-redisenio-visual-inicio` | **Fecha**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

Esta guía describe el procedimiento paso a paso para que cualquier persona no técnica pueda validar visual y funcionalmente la nueva página de inicio, la navegación compartida, el rediseño visual sobrio y la plantilla de PDF.

---

## 1. Preparación del entorno

1. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
2. Abrir el navegador en la URL indicada (habitualmente `http://localhost:5173/`).

---

## 2. Escenario 1: Punto de entrada en la Página de Inicio

1. **Acción**: Acceder directamente a la raíz de la aplicación (`http://localhost:5173/` o `http://localhost:5173/#/`).
2. **Resultado esperado**:
   - Se muestra la **Página de Inicio** con un saludo profesional y panel de actividad.
   - En la parte superior está visible la cabecera con el logo y los enlaces de navegación a: **Inicio**, **Presupuestos**, **Clientes**, **Catálogo** y **Perfil**.
   - El enlace «Inicio» aparece resaltado como sección activa.
   - Se visualizan las tarjetas métricas con el recuento total de presupuestos y el desglose de los 5 estados (Borrador, Enviado, Aceptado, Rechazado, Caducado).
   - Se aprecian los accesos directos a las cuatro secciones principales y el botón para crear un nuevo presupuesto.

---

## 3. Escenario 2: Navegación compartida sin botón «Atrás»

1. **Acción**: Desde la página de inicio, hacer clic en el enlace «Clientes».
   - **Resultado esperado**: La vista cambia a la gestión de clientes y la opción «Clientes» queda resaltada en la barra de navegación.
2. **Acción**: Sin pulsar el botón «Atrás» del navegador, hacer clic en «Catálogo».
   - **Resultado esperado**: La pantalla muestra el catálogo de servicios de forma inmediata.
3. **Acción**: Hacer clic en «Presupuestos».
   - **Resultado esperado**: Se abre el historial de presupuestos.
4. **Acción**: Hacer clic en «Perfil».
   - **Resultado esperado**: Se cargan los ajustes del perfil profesional.
5. **Acción**: Hacer clic en «Inicio» o en el logotipo.
   - **Resultado esperado**: Se retorna a la página de inicio en un solo clic.

---

## 4. Escenario 3: Verificación del sistema visual sobrio y badges

1. **Acción**: Observar la tipografía, colores de fondo y bordes en cualquiera de las pantallas.
   - **Resultado esperado**:
     - Tipografía sans-serif uniforme, clara y sin estridencias.
     - Fondo neutro y limpio (`#f8fafc`), tarjetas con superficie blanca y bordes sutiles.
     - Botones principales en azul marino corporativo sobrio.
2. **Acción**: Consultar las insignias de estado (*badges*) en el resumen de inicio o en la tabla de presupuestos.
   - **Resultado esperado**:
     - *Borrador*: Insignia gris pizarra neutro.
     - *Enviado*: Insignia azul petróleo suave.
     - *Aceptado*: Insignia verde bosque contenido.
     - *Rechazado*: Insignia teja sobria.
     - *Caducado*: Insignia ámbar apagado.
     - Los textos son perfectamente legibles y cumplen con alto contraste.

---

## 5. Escenario 4: Descarga y validación del PDF

1. **Acción**: Ir a un presupuesto existente (o crear uno rápido con cliente y líneas) y pulsar en «Descargar PDF» o «Vista previa».
2. **Resultado esperado**:
   - El documento presenta una maquetación nítida con cabecera limpia, emisor y cliente alineados en columnas, tabla de conceptos con líneas finas y cuadro de totales destacado con el importe en euros (`€`).
   - El diseño refleja la misma sobriedad profesional que la interfaz web.

---

## 6. Verificación automatizada de pruebas

Ejecutar la suite de pruebas unitarias y de contratos para constatar que no existen regresiones:
```bash
npm test
```
**Resultado esperado**: Todos los tests de cálculo monetario, NIF/CIF, numeración y contrato del PDF finalizan en verde (100% de éxito).
