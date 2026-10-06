# Quickstart — Guía de validación de PresupuestoPro v1

Guía para comprobar, **sin mirar el código**, que la aplicación cumple la spec (constitución, principio IV). Referencias: [spec.md](./spec.md), [data-model.md](./data-model.md), [contracts/](./contracts/).

## Requisitos previos

- **Node.js LTS** (20 o superior) instalado, solo para quien desarrolla o publica. El usuario final no necesita instalar nada.
- Un navegador actual: Chrome, Edge, Firefox o Safari (ordenador y móvil).

## Puesta en marcha

```powershell
npm install          # instala las dependencias
npm test             # pruebas automáticas de cálculo, numeración, NIF, copia y PDF
npm run dev          # abre la app en http://localhost:5173
npm run build        # genera la carpeta dist/ lista para publicar
npm run preview      # sirve dist/ en local para probar la versión final (incluido el modo sin conexión)
```

Para probar en el móvil en la misma red Wi-Fi: `npm run dev -- --host` y abrir en el móvil la dirección "Network" que aparece.

**Publicar**: subir la carpeta `dist/` a Netlify o Cloudflare Pages (arrastrar y soltar, o conectar el repositorio con el comando de build `npm run build` y la carpeta de salida `dist`).

## Resultado esperado de `npm test`

Todas las pruebas en verde, incluidas como mínimo:

- Los **6 casos numéricos** de la spec (ejemplo de referencia en 3 variantes + 3 ejemplos breves) coinciden al céntimo, más el redondeo `2,5 × 33,33 = 83,33`.
- Numeración: `0041 → 0042`, cambio de año `→ PRE-2027-0001`, `9999 → 10000`, las nuevas versiones no consumen número.
- NIF/NIE/CIF: `12345678Z` y `B98765431` válidos; `12345678A` y `B98765432` (el CIF del ejemplo de la spec, cuyo dígito de control correcto es 1) dan aviso.
- Copia de seguridad: un archivo válido se acepta; un JSON ajeno o incompleto se rechaza.
- Nombre del archivo PDF: `PRE-2026-0042_Acme_Digital_Corp.pdf` y `…_v2.pdf`.

---

## Escenarios de validación manual

Datos de prueba: perfil **DevStudio Freelance**, NIF `12345678Z`; cliente **Acme Digital Corp**, CIF `B98765432`, tipo Empresa/Autónomo. Este CIF es el de la spec, pero su dígito de control no es válido, así que **es normal que muestre un aviso en ámbar**. Para no verlo, usa `B98765431`.

### 1. Cálculo en vivo (US1)

1. Crear un cliente Particular y un presupuesto para él. Añadir 1 × 100,00 € y 2 × 50,00 €.
   ✅ Sin pulsar nada: base 200,00 €, IVA 42,00 €, IRPF 0,00 €, total 242,00 €.
2. Intentar cambiar la retención. ✅ Sigue en 0 % y aparece el aviso para clientes particulares.
3. Cambiar a Acme (Empresa/Autónomo) con líneas de base 1.000,00 €. ✅ 15 %: retención 150,00 €, total 1.060,00 €. Cambiar a 7 %: ✅ 70,00 € y 1.140,00 € al instante.
4. Marcar "Nuevo autónomo" en el perfil y crear otro presupuesto para Acme. ✅ La retención propuesta es 7 %.
5. Cambiar el precio de una línea que viene del catálogo. ✅ El catálogo no cambia.

### 2. Emitir el ejemplo de referencia (US2, FR-017)

1. Presupuesto para Acme con las 3 líneas del ejemplo (450 € + 15 × 40 € + 150 €), IRPF 15 %.
   ✅ Base 1.200,00 €, IVA 252,00 €, retención 180,00 €, total **1.272,00 €**.
2. Pulsar "Generar PDF". ✅ En menos de 5 s se descarga `PRE-{año}-{NNNN}_Acme_Digital_Corp.pdf`.
3. Abrir el PDF. ✅ Contiene todo lo indicado en [documento-pdf.md §3](./contracts/documento-pdf.md) y los mismos importes que la pantalla.

### 3. Perfil y marca (US3)

1. Sin logo, generar un PDF. ✅ Aparecen el nombre y el NIF en el lugar del logo.
2. Subir un PNG de menos de 1 MB. ✅ Aparece en la vista previa y en el PDF.
3. Subir un archivo de más de 1 MB o un GIF. ✅ Se rechaza con un aviso y se mantiene el estado anterior.
4. Vaciar el nombre del perfil e intentar emitir. ✅ No se emite y se pide completar el perfil.
5. Escribir un NIF con la letra equivocada (`12345678A`). ✅ Aviso en ámbar; se puede guardar y emitir igualmente.

### 4. Catálogo (US4)

1. Crear un servicio con rango 300–600 €, añadirlo a un presupuesto. ✅ Se ve "Mercado: 300,00 € – 600,00 €"; "Aplicar mín." y "Aplicar máx." cambian el precio con un clic.
2. Intentar guardar un rango 600–300. ✅ No se guarda y aparece un aviso.
3. Borrar el servicio y abrir un presupuesto que lo usaba. ✅ La línea sigue intacta.

### 5. Clientes (US5)

1. Crear un cliente desde el editor. ✅ Queda en la agenda y seleccionado.
2. Cambiar el cliente de un borrador de Empresa a Particular. ✅ La retención pasa a 0 % con aviso.
3. Editar en la agenda el nombre de Acme. ✅ Los presupuestos ya emitidos para Acme conservan el nombre anterior.
4. Asignar un cliente a 2 borradores e intentar borrarlo. ✅ Se pide confirmación indicando "2 borradores"; tras confirmar, esos borradores quedan sin cliente y al emitir se resalta el campo cliente.

### 6. Validaciones al emitir y documentos largos (US2.5–2.7, Edge Cases)

1. Pulsar "Generar PDF" sin cliente y sin líneas. ✅ No se descarga nada, no se asigna número y se resaltan los campos.
2. Añadir una línea con cantidad 0. ✅ Se marca en rojo y bloquea la emisión hasta corregirla.
3. Usar una descripción de 500 caracteres y 40 líneas. ✅ El texto continúa dentro de su celda, la tabla sigue en varias páginas con su cabecera repetida, las páginas van numeradas y el bloque de totales aparece completo.
4. Introducir cantidad `2,5` y precio `33,33`. ✅ Importe 83,33 €.

### 7. Numeración, versiones e historial (US6)

1. Emitir tres presupuestos seguidos. ✅ Números consecutivos sin huecos.
2. Crear un borrador y descartarlo; emitir otro. ✅ El descartado no consumió número.
3. Pulsar "Editar" en un emitido, hacer cambios y **descartar**. ✅ No hay versión nueva; la v1 sigue igual.
4. Pulsar "Editar", cambiar una línea y "Generar PDF". ✅ Mismo número, archivo `…_v2.pdf`, el PDF muestra "(v2)" y la v1 sigue descargable.
5. Intentar borrar un emitido. ✅ Solo existe la opción "Anular".
6. Filtrar por el mes actual. ✅ Solo aparecen los emitidos ese mes, con su recuento.
7. Cerrar el navegador y volver a abrir. ✅ Todo sigue igual, con los mismos importes.

> El cambio de año (PRE-2027-0001) y el paso de 9999 a 10000 se comprueban con las pruebas automáticas, ya que requieren manipular la fecha o el contador.

### 8. Tema claro/oscuro (US7)

1. Cambiar a oscuro. ✅ Toda la interfaz cambia; al recargar, se mantiene.
2. Generar un PDF en tema oscuro. ✅ El PDF tiene fondo blanco, igual que en tema claro.

### 9. Anulación (US6.4, US6.9)

1. Anular un emitido (con confirmación). ✅ Aparece como ANULADO y conserva su número.
2. Abrirlo. ✅ No hay opciones de editar, versionar ni deshacer.
3. Volver a descargar su PDF. ✅ Muestra la marca de agua "ANULADO" en todas las páginas.

### 10. Copia de seguridad (US8)

1. "Exportar copia". ✅ Se descarga `presupuestopro-copia-AAAA-MM-DD.json`.
2. Borrar los datos del sitio (ajustes del navegador) y recargar. ✅ La app aparece vacía.
3. "Importar copia" con el archivo y confirmar. ✅ Vuelven el perfil, el logo, el catálogo, los clientes y los presupuestos; el siguiente presupuesto emitido continúa la numeración.
4. Importar un archivo `.json` cualquiera o una imagen. ✅ Mensaje de error comprensible y ningún dato cambia.

### 11. Móvil, sin conexión y privacidad (FR-010, FR-024, D10)

1. En un móvil (o con el modo móvil del navegador, < 900 px): ✅ el editor muestra las pestañas "Editar / Vista previa" y la barra fija con el TOTAL; los campos numéricos abren el teclado decimal; no hay desplazamiento horizontal.
2. Con `npm run preview` o la versión publicada, abrir la app, generar un PDF y después activar el modo avión y recargar. ✅ La app abre y permite crear y descargar un presupuesto sin conexión.
3. En las herramientas del navegador, pestaña Red, durante todo el uso. ✅ No se envía ninguna petición con datos a servidores externos.
4. En el móvil, "Añadir a pantalla de inicio". ✅ Se abre como una app con su icono y nombre.

### 12. Rapidez (SC-001, SC-004)

1. Con el perfil, el catálogo y el cliente configurados, cronometrar la creación y descarga de un presupuesto de 3 líneas. ✅ Menos de 2 minutos.
2. Escribir en una línea con 40 líneas en el presupuesto. ✅ La vista previa se actualiza sin retraso perceptible.
