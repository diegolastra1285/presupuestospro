/**
 * Estado inicial de la aplicación PresupuestoPro y datos semilla de desarrollo.
 */

export function crearEstadoVacio() {
  return {
    versionEsquema: 1,
    perfil: null,
    clientes: [],
    catalogo: [],
    presupuestos: [],
    contadores: {},
    tema: 'claro'
  };
}

export function crearDatosSemilla() {
  return {
    versionEsquema: 1,
    perfil: {
      nombre: 'DevStudio Freelance',
      nif: '12345678Z',
      email: 'contacto@devstudio.es',
      telefono: '+34 600 000 000',
      direccion: 'Calle Gran Vía 28, 4º B\n28013 Madrid',
      logo: null,
      nuevoAutonomo: false,
      datosPago: 'Transferencia bancaria: ES12 3456 7890 1234 5678 9012',
      condicionesPorDefecto: 'Forma de pago: 50% al aceptar y 50% a la entrega.\nValidez de la oferta sujeta al plazo indicado.',
      diasValidezPorDefecto: 30
    },
    clientes: [
      {
        id: 'cliente-acme-ref',
        nombre: 'Acme Digital Corp',
        nif: 'B98765432',
        tipo: 'empresa',
        email: 'facturacion@acmedigital.com',
        direccion: 'Paseo de la Castellana 100, 28046 Madrid'
      },
      {
        id: 'cliente-particular-ref',
        nombre: 'Juan Pérez García',
        nif: '12345678Z',
        tipo: 'particular',
        email: 'juan.perez@example.com',
        direccion: 'Calle Mayor 12, 28013 Madrid'
      }
    ],
    catalogo: [
      {
        id: 'cat-1',
        descripcion: 'Auditoría de arquitectura web y rendimiento',
        precioCentimos: 45000,
        mercadoMinCentimos: 30000,
        mercadoMaxCentimos: 60000
      },
      {
        id: 'cat-2',
        descripcion: 'Implementación frontend (horas)',
        precioCentimos: 4000,
        mercadoMinCentimos: 3500,
        mercadoMaxCentimos: 6000
      },
      {
        id: 'cat-3',
        descripcion: 'Configuración de pipeline CI/CD y despliegue',
        precioCentimos: 15000,
        mercadoMinCentimos: null,
        mercadoMaxCentimos: null
      }
    ],
    presupuestos: [],
    contadores: {},
    tema: 'claro'
  };
}
