import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { calcularTotalesPresupuesto } from '../../domain/calculos.js';
import { asignarSiguienteNumero } from '../../domain/numeracion.js';
import { formatearMoneda, parsearImporteACentimos } from '../../utils/moneda.js';
import { obtenerFechaHoyISO, calcularFechaValidez } from '../../utils/fechas.js';
import { descargarPdf } from '../../pdf/generador.js';
import { VistaPrevia } from './VistaPrevia.jsx';
import { BarraTotales } from '../comun/BarraTotales.jsx';
import { Alerta } from '../comun/Alerta.jsx';
import { Modal } from '../comun/Modal.jsx';
import { SelectorConceptoModal } from '../catalogo/SelectorConceptoModal.jsx';
import { SelectorClienteModal } from '../clientes/SelectorClienteModal.jsx';

function parsearCantidadACentesimas(texto) {
  if (typeof texto === 'number') return Math.round(texto * 100);
  if (!texto || typeof texto !== 'string') return 0;
  const normalizado = texto.trim().replace(',', '.');
  const num = parseFloat(normalizado);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

export function EditorPresupuesto({ presupuestoId, presupuestoExistente, estado, dispatch, navegar }) {
  const perfil = estado.perfil || {};
  const hoyISO = obtenerFechaHoyISO();

  // Determinar si estamos editando un borrador nuevo o una nueva versión de uno emitido
  const esNuevaVersion = presupuestoExistente && presupuestoExistente.estado === 'emitido';
  const ultimaVersion = esNuevaVersion && presupuestoExistente.versiones?.length > 0
    ? presupuestoExistente.versiones[presupuestoExistente.versiones.length - 1]
    : null;

  // Inicializar estado del borrador
  const [clienteId, setClienteId] = useState(() => {
    if (presupuestoExistente?.borrador) return presupuestoExistente.borrador.clienteId;
    if (ultimaVersion) {
      // Buscar cliente por nombre en la agenda si coincide
      const coincidente = estado.clientes.find(c => c.nombre === ultimaVersion.cliente.nombre);
      return coincidente ? coincidente.id : null;
    }
    return null;
  });

  const clienteSeleccionado = useMemo(() => {
    return estado.clientes.find(c => c.id === clienteId) || null;
  }, [estado.clientes, clienteId]);

  // Retención IRPF inicial
  const [irpfPct, setIrpfPct] = useState(() => {
    if (presupuestoExistente?.borrador?.irpfPct !== undefined) {
      return presupuestoExistente.borrador.irpfPct;
    }
    if (ultimaVersion) return ultimaVersion.irpfPct;
    if (clienteSeleccionado?.tipo === 'particular') return 0;
    return perfil.nuevoAutonomo ? 7 : 15;
  });

  // Líneas del presupuesto
  const [lineas, setLineas] = useState(() => {
    if (presupuestoExistente?.borrador?.lineas) {
      return presupuestoExistente.borrador.lineas.map(l => ({
        ...l,
        cantidadTexto: ((l.cantidadCentesimas || 0) / 100).toLocaleString('es-ES', { maximumFractionDigits: 2 }),
        precioTexto: ((l.precioCentimos || 0) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }));
    }
    if (ultimaVersion?.lineas) {
      return ultimaVersion.lineas.map((l, idx) => ({
        id: 'lin_' + Date.now() + '_' + idx,
        descripcion: l.descripcion,
        cantidadCentesimas: l.cantidadCentesimas,
        cantidadTexto: ((l.cantidadCentesimas || 0) / 100).toLocaleString('es-ES', { maximumFractionDigits: 2 }),
        precioCentimos: l.precioCentimos,
        precioTexto: ((l.precioCentimos || 0) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        servicioId: null,
        mercadoMinCentimos: null,
        mercadoMaxCentimos: null
      }));
    }
    return [];
  });

  // Condiciones / notas
  const [condiciones, setCondiciones] = useState(() => {
    if (presupuestoExistente?.borrador?.condiciones !== undefined) {
      return presupuestoExistente.borrador.condiciones;
    }
    if (ultimaVersion?.condiciones !== undefined) return ultimaVersion.condiciones;
    return perfil.condicionesPorDefecto || '';
  });

  // Fecha de validez
  const [fechaValidez, setFechaValidez] = useState(() => {
    if (presupuestoExistente?.borrador?.fechaValidezManual) {
      return presupuestoExistente.borrador.fechaValidezManual;
    }
    if (ultimaVersion?.fechaValidez) return ultimaVersion.fechaValidez;
    return calcularFechaValidez(hoyISO, perfil.diasValidezPorDefecto || 30);
  });

  // Pestaña activa en móvil ('editar' | 'preview')
  const [tabMovil, setTabMovil] = useState('editar');

  // Control de modales
  const [modalConceptosAbierto, setModalConceptosAbierto] = useState(false);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [modalDescartarAbierto, setModalDescartarAbierto] = useState(false);

  // Errores de validación al emitir
  const [errores, setErrores] = useState({});
  const [emitiento, setEmitiendo] = useState(false);

  // Totales calculados en tiempo real
  const calculoTotales = useMemo(() => {
    return calcularTotalesPresupuesto(lineas, irpfPct);
  }, [lineas, irpfPct]);

  // Sincronización automática con estado del borrador
  const guardarBorradorEnEstado = (nuevasLineas, nuevoClienteId, nuevoIrpf, nuevasCondiciones, nuevaValidez) => {
    const pId = presupuestoId === 'nuevo' 
      ? 'pre_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
      : presupuestoId;

    const basePresupuesto = presupuestoExistente || {
      id: pId,
      estado: 'borrador',
      numero: null,
      anio: null,
      secuencial: null,
      mesEmision: null,
      versiones: [],
      creadoEn: new Date().toISOString(),
      anuladoEn: null
    };

    const borradorActualizado = {
      clienteId: nuevoClienteId !== undefined ? nuevoClienteId : clienteId,
      lineas: (nuevasLineas !== undefined ? nuevasLineas : lineas).map(l => ({
        id: l.id,
        descripcion: l.descripcion,
        cantidadCentesimas: l.cantidadCentesimas,
        precioCentimos: l.precioCentimos,
        servicioId: l.servicioId || null,
        mercadoMinCentimos: l.mercadoMinCentimos ?? null,
        mercadoMaxCentimos: l.mercadoMaxCentimos ?? null
      })),
      irpfPct: nuevoIrpf !== undefined ? nuevoIrpf : irpfPct,
      condiciones: nuevasCondiciones !== undefined ? nuevasCondiciones : condiciones,
      fechaValidezManual: nuevaValidez !== undefined ? nuevaValidez : fechaValidez
    };

    dispatch({
      tipo: 'GUARDAR_PRESUPUESTO',
      payload: {
        ...basePresupuesto,
        borrador: borradorActualizado
      }
    });

    if (presupuestoId === 'nuevo') {
      window.location.hash = `#/presupuesto/${pId}`;
    }
  };

  // Cambio de cliente: adapta automáticamente el IRPF
  const handleCambioCliente = (nuevoId) => {
    setClienteId(nuevoId);
    const cli = estado.clientes.find(c => c.id === nuevoId);
    let nuevoIrpf = irpfPct;
    if (cli?.tipo === 'particular') {
      nuevoIrpf = 0;
      setIrpfPct(0);
    } else if (cli?.tipo === 'empresa') {
      nuevoIrpf = perfil.nuevoAutonomo ? 7 : 15;
      setIrpfPct(nuevoIrpf);
    }
    if (errores.cliente) {
      setErrores(prev => ({ ...prev, cliente: null }));
    }
    guardarBorradorEnEstado(lineas, nuevoId, nuevoIrpf, condiciones, fechaValidez);
  };

  // Cambio de porcentaje de IRPF
  const handleCambioIrpf = (valor) => {
    if (clienteSeleccionado?.tipo === 'particular' && valor !== 0) {
      return; // Bloqueado a 0% para particulares
    }
    setIrpfPct(valor);
    guardarBorradorEnEstado(lineas, clienteId, valor, condiciones, fechaValidez);
  };

  // Gestión de líneas
  const handleAgregarLineaLibre = () => {
    const nueva = {
      id: 'lin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      descripcion: '',
      cantidadCentesimas: 100, // 1 unidad
      cantidadTexto: '1',
      precioCentimos: 0,
      precioTexto: '0,00',
      servicioId: null,
      mercadoMinCentimos: null,
      mercadoMaxCentimos: null
    };
    const actualizadas = [...lineas, nueva];
    setLineas(actualizadas);
    if (errores.lineas) setErrores(prev => ({ ...prev, lineas: null }));
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  const handleSeleccionarConceptoCatalogo = (concepto) => {
    const nueva = {
      id: 'lin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      descripcion: concepto.descripcion,
      cantidadCentesimas: 100,
      cantidadTexto: '1',
      precioCentimos: concepto.precioCentimos,
      precioTexto: ((concepto.precioCentimos || 0) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      servicioId: concepto.id,
      mercadoMinCentimos: concepto.mercadoMinCentimos ?? null,
      mercadoMaxCentimos: concepto.mercadoMaxCentimos ?? null
    };
    const actualizadas = [...lineas, nueva];
    setLineas(actualizadas);
    setModalConceptosAbierto(false);
    if (errores.lineas) setErrores(prev => ({ ...prev, lineas: null }));
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  const handleModificarLinea = (idx, campo, valor) => {
    const actualizadas = [...lineas];
    const linea = { ...actualizadas[idx] };

    if (campo === 'descripcion') {
      linea.descripcion = valor;
    } else if (campo === 'cantidad') {
      linea.cantidadTexto = valor;
      linea.cantidadCentesimas = parsearCantidadACentesimas(valor);
    } else if (campo === 'precio') {
      linea.precioTexto = valor;
      linea.precioCentimos = parsearImporteACentimos(valor);
    }

    actualizadas[idx] = linea;
    setLineas(actualizadas);
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  const handleAplicarPrecioMercado = (idx, centimos) => {
    const actualizadas = [...lineas];
    const linea = { ...actualizadas[idx] };
    linea.precioCentimos = centimos;
    linea.precioTexto = ((centimos || 0) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    actualizadas[idx] = linea;
    setLineas(actualizadas);
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  const handleSubirLinea = (idx) => {
    if (idx === 0) return;
    const actualizadas = [...lineas];
    const temp = actualizadas[idx - 1];
    actualizadas[idx - 1] = actualizadas[idx];
    actualizadas[idx] = temp;
    setLineas(actualizadas);
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  const handleBajarLinea = (idx) => {
    if (idx === lineas.length - 1) return;
    const actualizadas = [...lineas];
    const temp = actualizadas[idx + 1];
    actualizadas[idx + 1] = actualizadas[idx];
    actualizadas[idx] = temp;
    setLineas(actualizadas);
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  const handleEliminarLinea = (idx) => {
    const actualizadas = lineas.filter((_, i) => i !== idx);
    setLineas(actualizadas);
    guardarBorradorEnEstado(actualizadas, clienteId, irpfPct, condiciones, fechaValidez);
  };

  // Validaciones antes de emitir (FR-014, US2.5, US2.6, US3.4)
  const validarParaEmitir = () => {
    const errs = {};

    // 1. Perfil completo
    if (!perfil.nombre?.trim() || !perfil.nif?.trim()) {
      errs.perfil = 'El perfil del emisor debe tener nombre y NIF/DNI configurados.';
    }

    // 2. Cliente seleccionado
    if (!clienteId || !clienteSeleccionado) {
      errs.cliente = 'Debes seleccionar un cliente para emitir el presupuesto.';
    }

    // 3. Al menos una línea
    if (lineas.length === 0) {
      errs.lineas = 'Debes añadir al menos una línea al presupuesto.';
    } else {
      // 4. Cada línea debe tener descripción y subtotal > 0
      calculoTotales.lineas.forEach((l, idx) => {
        if (!l.descripcion?.trim()) {
          errs[`linea_desc_${idx}`] = 'La descripción es obligatoria.';
        }
        if (l.subtotalCentimos <= 0) {
          errs[`linea_subtotal_${idx}`] = 'El importe de la línea debe ser mayor que cero.';
        }
      });
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  // Acción: Generar PDF y emitir versión
  const handleGenerarPdf = async () => {
    if (!validarParaEmitir()) {
      // Scroll arriba si hay errores
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setEmitiendo(true);

    try {
      const anioActual = new Date().getFullYear();
      let numeroAsignado = presupuestoExistente?.numero;
      let anioEmision = presupuestoExistente?.anio;
      let secuencialEmision = presupuestoExistente?.secuencial;
      let mesEmision = presupuestoExistente?.mesEmision;
      let nuevosContadores = estado.contadores;
      let numeroVersion = 1;

      // Si es la primera emisión, asignar número correlativo atómico
      if (!numeroAsignado) {
        const resultadoNum = asignarSiguienteNumero(estado.contadores, anioActual);
        numeroAsignado = resultadoNum.numero;
        secuencialEmision = resultadoNum.secuencial;
        anioEmision = resultadoNum.anio;
        mesEmision = new Date().getMonth() + 1;
        nuevosContadores = resultadoNum.nuevosContadores;
        numeroVersion = 1;
      } else {
        // Nueva versión de presupuesto ya emitido
        const numVersionesAnteriores = presupuestoExistente.versiones?.length || 1;
        numeroVersion = numVersionesAnteriores + 1;
      }

      // Congelar snapshot de la versión inmutable
      const nuevaVersionSnapshot = {
        numeroVersion,
        emitidaEn: new Date().toISOString(),
        fechaValidez,
        emisor: {
          nombre: perfil.nombre,
          nif: perfil.nif,
          email: perfil.email || '',
          telefono: perfil.telefono || '',
          direccion: perfil.direccion || '',
          logo: perfil.logo || null,
          datosPago: perfil.datosPago || ''
        },
        cliente: {
          nombre: clienteSeleccionado.nombre,
          nif: clienteSeleccionado.nif || '',
          tipo: clienteSeleccionado.tipo,
          email: clienteSeleccionado.email || '',
          direccion: clienteSeleccionado.direccion || ''
        },
        lineas: calculoTotales.lineas.map(l => ({
          descripcion: l.descripcion,
          cantidadCentesimas: l.cantidadCentesimas,
          precioCentimos: l.precioCentimos,
          subtotalCentimos: l.subtotalCentimos
        })),
        irpfPct,
        condiciones,
        totales: {
          baseCentimos: calculoTotales.baseCentimos,
          ivaCentimos: calculoTotales.ivaCentimos,
          irpfPct: calculoTotales.irpfPct,
          irpfCentimos: calculoTotales.irpfCentimos,
          totalCentimos: calculoTotales.totalCentimos
        }
      };

      const versionesActualizadas = [
        ...(presupuestoExistente?.versiones || []),
        nuevaVersionSnapshot
      ];

      const pId = presupuestoExistente?.id || ('pre_' + Date.now());

      const presupuestoEmitido = {
        id: pId,
        estado: 'emitido',
        numero: numeroAsignado,
        anio: anioEmision,
        secuencial: secuencialEmision,
        mesEmision,
        versiones: versionesActualizadas,
        borrador: null,
        creadoEn: presupuestoExistente?.creadoEn || new Date().toISOString(),
        anuladoEn: null
      };

      // Guardar inmediatamente en estado y en IndexedDB con los nuevos contadores
      dispatch({
        tipo: 'GUARDAR_PRESUPUESTO',
        payload: presupuestoEmitido,
        nuevosContadores
      });

      // Descargar PDF
      await descargarPdf(numeroAsignado, nuevaVersionSnapshot, false);

      // Redirigir a vista detalle
      navegar(`#/presupuesto/${pId}`);
    } catch (err) {
      console.error('Error al generar PDF y emitir presupuesto:', err);
      alert('Se produjo un error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setEmitiendo(false);
    }
  };

  // Descartar borrador
  const handleDescartarBorrador = () => {
    if (presupuestoExistente?.estado === 'emitido') {
      // Si era una nueva versión en borrador, descartar el borrador y volver a la versión emitida vigente
      dispatch({
        tipo: 'GUARDAR_PRESUPUESTO',
        payload: {
          ...presupuestoExistente,
          borrador: null
        }
      });
      navegar(`#/presupuesto/${presupuestoExistente.id}`);
    } else {
      // Si era un borrador sin emitir nunca, eliminarlo por completo (no consume número)
      if (presupuestoExistente?.id) {
        dispatch({
          tipo: 'ELIMINAR_BORRADOR_PRESUPUESTO',
          payload: presupuestoExistente.id
        });
      }
      navegar('#/presupuestos');
    }
  };

  const totalErrores = Object.keys(errores).length;

  return (
    <div class="view-container">
      {/* Resumen de errores de validación si existen */}
      {totalErrores > 0 && (
        <Alerta tipo="danger" icono="⛔">
          <strong>Faltan {totalErrores} datos para poder generar el PDF:</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem' }}>
            {errores.perfil && <li>{errores.perfil}</li>}
            {errores.cliente && <li>{errores.cliente}</li>}
            {errores.lineas && <li>{errores.lineas}</li>}
            {Object.keys(errores).filter(k => k.startsWith('linea_')).map(k => (
              <li key={k}>{errores[k]}</li>
            ))}
          </ul>
        </Alerta>
      )}

      {/* Pestañas para versión móvil */}
      <div class="mobile-tabs">
        <button
          type="button"
          class={`tab-btn ${tabMovil === 'editar' ? 'active' : ''}`}
          onClick={() => setTabMovil('editar')}
        >
          ✏️ Editar formulario
        </button>
        <button
          type="button"
          class={`tab-btn ${tabMovil === 'preview' ? 'active' : ''}`}
          onClick={() => setTabMovil('preview')}
        >
          👁️ Vista previa del PDF
        </button>
      </div>

      <div class="split-view-container">
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div class={`editor-pane ${tabMovil === 'preview' ? 'hidden-mobile' : ''}`}>
          {/* Tarjeta: Cliente */}
          <div class="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 class="card-title">1. Cliente destinatario</h3>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                onClick={() => setModalClienteAbierto(true)}
              >
                + Nuevo cliente
              </button>
            </div>

            <div class="form-group">
              <label class="form-label">Seleccionar cliente *</label>
              <select
                value={clienteId || ''}
                onChange={(e) => handleCambioCliente(e.target.value)}
                class={errores.cliente ? 'error' : ''}
              >
                <option value="">-- Elige un cliente de la agenda --</option>
                {estado.clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.tipo === 'particular' ? 'Particular' : 'Empresa/Autónomo'})
                  </option>
                ))}
              </select>
              {errores.cliente && <span class="form-error">{errores.cliente}</span>}
            </div>

            {clienteSeleccionado && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <p><strong>NIF/CIF:</strong> {clienteSeleccionado.nif || 'No especificado'}</p>
                <p><strong>Tipo:</strong> {clienteSeleccionado.tipo === 'particular' ? 'Particular (sin retención de IRPF)' : 'Empresa / Autónomo'}</p>
                {clienteSeleccionado.direccion && <p><strong>Dirección:</strong> {clienteSeleccionado.direccion}</p>}
              </div>
            )}
          </div>

          {/* Tarjeta: Líneas de Presupuesto */}
          <div class="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 class="card-title">2. Conceptos y líneas</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  onClick={() => setModalConceptosAbierto(true)}
                >
                  🏷️ Añadir del catálogo
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  onClick={handleAgregarLineaLibre}
                >
                  + Línea libre
                </button>
              </div>
            </div>

            {errores.lineas && <span class="form-error">{errores.lineas}</span>}

            {lineas.length === 0 ? (
              <div class="empty-state" style={{ padding: '2rem 1rem' }}>
                <p class="empty-state-text">No has añadido líneas a este presupuesto.</p>
                <button type="button" class="btn btn-secondary" onClick={handleAgregarLineaLibre}>
                  Añadir primera línea libre
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lineas.map((linea, idx) => {
                  const errorDesc = errores[`linea_desc_${idx}`];
                  const errorSubtotal = errores[`linea_subtotal_${idx}`];
                  const subtotal = calculoTotales.lineas[idx]?.subtotalCentimos ?? 0;

                  return (
                    <div
                      key={linea.id || idx}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Línea {idx + 1}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm touch-target"
                            title="Subir línea"
                            onClick={() => handleSubirLinea(idx)}
                            disabled={idx === 0}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm touch-target"
                            title="Bajar línea"
                            onClick={() => handleBajarLinea(idx)}
                            disabled={idx === lineas.length - 1}
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            class="btn btn-danger btn-sm touch-target"
                            title="Eliminar línea"
                            onClick={() => handleEliminarLinea(idx)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label">Descripción del servicio o concepto *</label>
                        <input
                          type="text"
                          value={linea.descripcion}
                          placeholder="Ej: Desarrollo del módulo de facturación"
                          class={errorDesc ? 'error' : ''}
                          onInput={(e) => handleModificarLinea(idx, 'descripcion', e.target.value)}
                        />
                        {errorDesc && <span class="form-error">{errorDesc}</span>}
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Cantidad</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={linea.cantidadTexto}
                            placeholder="1"
                            onInput={(e) => handleModificarLinea(idx, 'cantidad', e.target.value)}
                          />
                        </div>

                        <div class="form-group">
                          <label class="form-label">Precio unitario (€)</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={linea.precioTexto}
                            placeholder="0,00"
                            onInput={(e) => handleModificarLinea(idx, 'precio', e.target.value)}
                          />
                        </div>

                        <div class="form-group">
                          <label class="form-label">Subtotal línea</label>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0.625rem 0.875rem',
                              backgroundColor: 'var(--color-surface-subtle)',
                              borderRadius: 'var(--radius-md)',
                              minHeight: 'var(--touch-target-min)',
                              fontWeight: '700',
                              color: subtotal <= 0 ? 'var(--color-danger)' : 'var(--color-text)'
                            }}
                          >
                            {formatearMoneda(subtotal)}
                          </div>
                        </div>
                      </div>

                      {errorSubtotal && <span class="form-error">{errorSubtotal}</span>}

                      {/* Rango de mercado si procede del catálogo */}
                      {linea.mercadoMinCentimos !== null && linea.mercadoMaxCentimos !== null && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                          <span>
                            <strong>Mercado:</strong> {formatearMoneda(linea.mercadoMinCentimos)} – {formatearMoneda(linea.mercadoMaxCentimos)}
                          </span>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                            onClick={() => handleAplicarPrecioMercado(idx, linea.mercadoMinCentimos)}
                          >
                            Aplicar mín.
                          </button>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                            onClick={() => handleAplicarPrecioMercado(idx, linea.mercadoMaxCentimos)}
                          >
                            Aplicar máx.
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tarjeta: Fiscalidad y Condiciones */}
          <div class="card">
            <h3 class="card-title">3. Condiciones fiscales y validez</h3>

            {/* Selector IRPF */}
            <div class="form-group">
              <label class="form-label">
                Retención de IRPF
              </label>
              {clienteSeleccionado?.tipo === 'particular' ? (
                <div>
                  <select value={0} disabled style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
                    <option value={0}>0 % (Particular sin retención)</option>
                  </select>
                  <p class="form-hint" style={{ color: 'var(--color-warning)', marginTop: '0.25rem' }}>
                    ⚠️ A un cliente particular no se le aplica retención de IRPF.
                  </p>
                </div>
              ) : (
                <select
                  value={irpfPct}
                  onChange={(e) => handleCambioIrpf(Number(e.target.value))}
                >
                  <option value={15}>15 % (General Empresa / Autónomo)</option>
                  <option value={7}>7 % (Nuevo autónomo en sus primeros años)</option>
                  <option value={0}>0 % (Sin retención)</option>
                </select>
              )}
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Fecha de validez</label>
                <input
                  type="date"
                  value={fechaValidez}
                  onChange={(e) => {
                    setFechaValidez(e.target.value);
                    guardarBorradorEnEstado(lineas, clienteId, irpfPct, condiciones, e.target.value);
                  }}
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Condiciones y notas</label>
              <textarea
                rows="3"
                value={condiciones}
                placeholder="Plazos, forma de pago, validez de la oferta..."
                onInput={(e) => {
                  setCondiciones(e.target.value);
                  guardarBorradorEnEstado(lineas, clienteId, irpfPct, e.target.value, fechaValidez);
                }}
              />
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: VISTA PREVIA EN VIVO */}
        <div class={`preview-pane ${tabMovil === 'editar' ? 'hidden-mobile' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
              Vista previa en tiempo real
            </h3>
            <span class="badge badge-draft">
              {esNuevaVersion ? `Nueva versión (v${(presupuestoExistente.versiones?.length || 1) + 1})` : 'Borrador'}
            </span>
          </div>

          <VistaPrevia
            presupuesto={{
              numero: presupuestoExistente?.numero,
              emitidaEn: hoyISO,
              versionActual: esNuevaVersion ? ((presupuestoExistente.versiones?.length || 1) + 1) : 1
            }}
            emisor={perfil}
            cliente={clienteSeleccionado}
            lineasCalculadas={calculoTotales.lineas}
            totales={calculoTotales}
            esBorrador={true}
            fechaValidez={fechaValidez}
            condiciones={condiciones}
            esAnulado={false}
          />
        </div>
      </div>

      {/* BARRA INFERIOR FIJA DE TOTALES Y ACCIÓN */}
      <BarraTotales
        totales={calculoTotales}
        accionSecundaria={
          <button
            type="button"
            class="btn btn-secondary touch-target"
            onClick={() => setModalDescartarAbierto(true)}
          >
            Descartar
          </button>
        }
        accionPrincipal={
          <button
            type="button"
            class="btn btn-primary touch-target"
            disabled={emitiento}
            onClick={handleGenerarPdf}
            style={{ fontWeight: '700' }}
          >
            {emitiento ? 'Generando PDF...' : '📄 Generar PDF'}
          </button>
        }
      />

      {/* MODAL SELECTOR CONCEPTO */}
      <SelectorConceptoModal
        abierto={modalConceptosAbierto}
        catalogo={estado.catalogo}
        onSeleccionar={handleSeleccionarConceptoCatalogo}
        onClose={() => setModalConceptosAbierto(false)}
      />

      {/* MODAL CREAR CLIENTE */}
      <SelectorClienteModal
        abierto={modalClienteAbierto}
        onClose={() => setModalClienteAbierto(false)}
        onClienteCreado={(nuevoCliente) => {
          dispatch({ tipo: 'GUARDAR_CLIENTE', payload: nuevoCliente });
          handleCambioCliente(nuevoCliente.id);
        }}
      />

      {/* MODAL CONFIRMAR DESCARTAR */}
      <Modal
        abierto={modalDescartarAbierto}
        titulo="¿Descartar cambios del presupuesto?"
        onClose={() => setModalDescartarAbierto(false)}
        acciones={
          <>
            <button class="btn btn-secondary" onClick={() => setModalDescartarAbierto(false)}>
              Seguir editando
            </button>
            <button class="btn btn-danger" onClick={handleDescartarBorrador}>
              Sí, descartar
            </button>
          </>
        }
      >
        <p>
          {esNuevaVersion 
            ? 'Se descartará el borrador de la nueva versión. La versión vigente actual seguirá intacta.'
            : 'Se perderán las líneas y datos de este borrador. No se consumirá ningún número de presupuesto.'}
        </p>
      </Modal>
    </div>
  );
}
