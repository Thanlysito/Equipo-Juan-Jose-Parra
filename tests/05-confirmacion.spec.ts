import { test, expect } from '@playwright/test';
import { TiendaPage } from '../pages/TiendaPage';

/**
 * BLOQUE CONFIRMACIÓN · US-16 a US-19 (migrado al Page Object: comprar() se escribe una sola vez).
 * Bugs en Jira (TDM): TDM-58 (datos del pedido anterior visibles) y TDM-59 (número de pedido tras recargar).
 */

test.describe('US-16 · Que mis datos no queden a la vista de otra persona', () => {
  test('CA1: tras confirmar y empezar otra compra, el formulario aparece vacío', async ({ page }) => {
    test.fail(true, 'TDM-58 · al confirmar se vacía el carrito pero no los datos de envío');
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.comprar('Esfero azul');

    await tienda.volverALaTienda();
    await tienda.agregar('Cuaderno universitario');
    await tienda.irAPagar();

    await expect(tienda.campo('Nombre completo')).toHaveValue('');
    await expect(tienda.campo('Correo electrónico')).toHaveValue('');
    await expect(tienda.campo('Dirección de entrega')).toHaveValue('');
  });
});

test.describe('US-17 · Confirmar mi pedido', () => {
  test('CA1: con datos válidos veo "¡Pedido confirmado!" y un número de pedido', async ({ page }) => {
    const tienda = new TiendaPage(page);
    await tienda.abrir();

    await tienda.comprar('Mochila escolar');

    await expect(tienda.pedidoConfirmado).toBeVisible();
    await expect(page.getByText(/Número de pedido:/)).toHaveText(/#\d+/);
  });

  test('CA2: un segundo pedido (sin recargar) tiene otro número', async ({ page }) => {
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.comprar('Esfero azul');
    const primero = await tienda.numeroDePedido();

    await tienda.volverALaTienda();
    await tienda.comprar('Esfero azul');
    const segundo = await tienda.numeroDePedido();

    expect(segundo).not.toBe(primero);
  });

  test('CA3: un pedido hecho después de recargar la página no repite un número anterior', async ({ page }) => {
    // Predicción antes de ejecutar: falla, porque el contador de pedidos vive solo en memoria.
    test.fail(true, 'TDM-59 · el contador de pedidos no se persiste: tras recargar vuelve a #1001');
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.comprar('Esfero azul');
    const primero = await tienda.numeroDePedido();

    await page.reload();
    await tienda.comprar('Esfero azul');
    const segundo = await tienda.numeroDePedido();

    expect(segundo).not.toBe(primero);
  });
});

test.describe('US-19 · Empezar una compra nueva con el carrito limpio', () => {
  test('CA1: tras confirmar, el carrito está vacío y el contador marca 0', async ({ page }) => {
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.comprar('Calculadora científica');

    await tienda.volverALaTienda();

    await expect(tienda.carritoVacio).toBeVisible();
    await expect(tienda.contador).toHaveText(/\b0 artículo\(s\)/);
  });
});
