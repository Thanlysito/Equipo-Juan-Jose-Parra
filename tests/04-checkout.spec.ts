import { test, expect } from '@playwright/test';

/**
 * BLOQUE CHECKOUT · US-13 a US-15.
 *
 * IMPORTANTE: en el formulario de envío page.getByLabel('Nombre completo') NO encuentra el campo. Pruébenlo y
 * diagnostiquen por qué (inspeccionen el HTML). Mientras tanto, esto SÍ funciona:
 *     page.locator('label:text-is("Nombre completo") + input')
 * (la etiqueta va justo antes del campo). Los textos de las etiquetas son: "Nombre completo",
 * "Correo electrónico" y "Dirección de entrega".
 */

// Datos listos para la prueba dirigida por datos (US-15). Escribir cada correo a mano invita al error.
const CORREOS_VALIDOS = [
  'juan@correo.com',
  'ana_gomez@gmail.com',
  'ana.gomez@gmail.com',
  'ana-gomez@gmail.com',
  'ana+tienda@gmail.com',
  'ana@universidad.edu.co',
];
const CORREOS_MAL_FORMADOS = ['ana.gmail.com', 'ana@', '@gmail.com', 'ana gomez@gmail.com', 'ana@@gmail.com', 'ana@gmail'];

test.describe('US-13 · Ir a pagar desde el carrito', () => {
  test('CA3: con total cero o negativo no se puede ir a pagar', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2 · CAZABUGS.
    // Agreguen 1 mochila y presionen "−" para llevar la cantidad a 0. El botón "Ir a pagar" debe estar deshabilitado
    // (toBeDisabled()). Ojo: esta prueba fallará por el mismo defecto de US-06 CA2, pero es OTRO criterio y OTRO bug:
    // aunque se corrija el "−", la tienda seguiría sin validar el total antes de cobrar.
  });
});

test.describe('US-14 · Completar mis datos de envío', () => {
  test('CA1: con el formulario vacío hay un error por cada campo obligatorio', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 1.
    // Agreguen un producto, "Ir a pagar", presionen "Confirmar pedido" sin llenar nada y comprueben los tres mensajes:
    // "El nombre es obligatorio." · "El correo es obligatorio." · "La dirección es obligatoria."
  });

  test('CA2: un nombre y una dirección de solo espacios se rechazan como vacíos', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2. Llenen nombre y dirección con "   " (tres espacios) y un correo válido.
  });
});

test.describe('US-15 · Ingresar un correo electrónico válido', () => {
  test('CA1-CA3: cada correo válido se acepta', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 3 · CAZABUGS · PRUEBAS DIRIGIDAS POR DATOS.
    // Generen UNA prueba por cada correo de CORREOS_VALIDOS. Para cada una: agregar un producto, ir a pagar, llenar
    // nombre y dirección válidos + ese correo, confirmar y comprobar que aparece "¡Pedido confirmado!".
    // Cuando terminen, miren el reporte: ¿cuántas filas fallan? ¿Qué tienen en común?
    // Reto: marquen como fallo conocido SOLO las filas que fallan, no todas (pista: test.fail(condicion, 'razón')).
  });

  test('CA4: cada correo mal formado se rechaza con un mensaje claro', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2. Igual que la anterior, con CORREOS_MAL_FORMADOS. Debe verse "El correo no tiene un formato válido."
    // y NO debe aparecer "¡Pedido confirmado!".
  });
});
