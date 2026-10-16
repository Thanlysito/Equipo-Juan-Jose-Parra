import { test, expect, type Page } from '@playwright/test';

/**
 * BLOQUE CARRITO · US-04 a US-07.
 * Estas pruebas están escritas "a mano" (sin Page Object) a propósito: muestran el código repetido que la
 * Parte 5 elimina. Compárenlas con 04-checkout y 05-confirmacion, que ya usan TiendaPage.
 * Bugs del producto en Jira (proyecto TDM): TDM-46 (stock del "+"/acumulado) y TDM-48 (el "−" baja de 1).
 */

// Localizadores del "Mapa de la tienda"
const tarjetaDe = (page: Page, producto: string) =>
  page.locator('.rounded-lg').filter({ has: page.getByRole('heading', { name: producto, level: 3 }) });
const carritoDe = (page: Page) =>
  page.locator('.rounded-lg').filter({ has: page.getByRole('heading', { name: 'Carrito' }) });

test.describe('US-04 · Agregar productos sin superar el stock', () => {
  // ─────────────── EJEMPLO GUIADO (resuelto) ───────────────
  test('CA1: se pueden agregar 15 cuadernos (stock 15)', async ({ page }) => {
    // ARRANGE: abrir la tienda
    await page.goto('/');

    // ACT: ubicar la tarjeta del cuaderno, escribir 15 en su cantidad y presionar "Agregar"
    const tarjeta = page
      .locator('.rounded-lg')
      .filter({ has: page.getByRole('heading', { name: 'Cuaderno universitario', level: 3 }) });
    await tarjeta.getByRole('spinbutton').fill('15');
    await tarjeta.getByRole('button', { name: 'Agregar' }).click();

    // ASSERT: en el carrito (la tarjeta con el encabezado "Carrito") aparece el cuaderno con cantidad 15
    const carrito = page
      .locator('.rounded-lg')
      .filter({ has: page.getByRole('heading', { name: 'Carrito' }) });
    const linea = carrito.getByRole('listitem').filter({ hasText: 'Cuaderno universitario' });
    await expect(linea.locator('span')).toHaveText('15');
  });

  test('CA2: no deja agregar 7 mochilas de una vez (stock 6) y avisa', async ({ page }) => {
    // ARRANGE
    await page.goto('/');
    const tarjeta = tarjetaDe(page, 'Mochila escolar');
    let aviso = '';
    page.once('dialog', async (dialogo) => {
      aviso = dialogo.message();
      await dialogo.accept();
    });

    // ACT
    await tarjeta.getByRole('spinbutton').fill('7');
    await tarjeta.getByRole('button', { name: 'Agregar' }).click();

    // ASSERT: hubo aviso con el stock y no se agregó nada
    await expect.poll(() => aviso).toContain('Solo hay 6 unidades');
    await expect(carritoDe(page).getByText('Tu carrito está vacío.')).toBeVisible();
  });

  test('CA3: 4 + 4 mochilas supera el stock (6) y debe rechazarse', async ({ page }) => {
    test.fail(true, 'TDM-46 · la validación de stock no suma lo que ya hay en el carrito (4 + 4 = 8 > 6)');
    // ARRANGE
    await page.goto('/');
    const tarjeta = tarjetaDe(page, 'Mochila escolar');
    page.on('dialog', (dialogo) => dialogo.accept()); // si la tienda avisa, se atiende el aviso
    const cantidad = carritoDe(page).getByRole('listitem').filter({ hasText: 'Mochila escolar' }).locator('span');

    // ACT
    await tarjeta.getByRole('spinbutton').fill('4');
    await tarjeta.getByRole('button', { name: 'Agregar' }).click();
    await expect(cantidad).toHaveText('4'); // el primer agregado sí es válido
    await tarjeta.getByRole('spinbutton').fill('4');
    await tarjeta.getByRole('button', { name: 'Agregar' }).click();

    // ASSERT: según el criterio, el stock no se supera: la cantidad se queda en 4
    await expect(cantidad).toHaveText('4');
  });
});

test.describe('US-05 · Aumentar la cantidad desde el carrito', () => {
  test('CA2: "+" no pasa del stock (6 mochilas)', async ({ page }) => {
    test.fail(true, 'TDM-46 · el botón "+" del carrito no compara la cantidad con el stock');
    // ARRANGE: el carrito ya tiene las 6 mochilas del stock
    await page.goto('/');
    const tarjeta = tarjetaDe(page, 'Mochila escolar');
    await tarjeta.getByRole('spinbutton').fill('6');
    await tarjeta.getByRole('button', { name: 'Agregar' }).click();
    const carrito = carritoDe(page);
    const cantidad = carrito.getByRole('listitem').filter({ hasText: 'Mochila escolar' }).locator('span');
    await expect(cantidad).toHaveText('6');
    page.on('dialog', (dialogo) => dialogo.accept());

    // ACT
    await carrito.getByRole('button', { name: 'Aumentar cantidad de Mochila escolar' }).click();

    // ASSERT
    await expect(cantidad).toHaveText('6');
  });
});

test.describe('US-06 · Disminuir la cantidad desde el carrito', () => {
  test('CA2: con cantidad 1, "−" la deja en 1 (opción elegida: no baja de 1)', async ({ page }) => {
    test.fail(true, 'TDM-48 · el botón "−" resta sin límite inferior: la cantidad llega a 0 y a negativos');
    // ARRANGE
    await page.goto('/');
    const tarjeta = tarjetaDe(page, 'Mochila escolar');
    await tarjeta.getByRole('button', { name: 'Agregar' }).click(); // cantidad por defecto: 1
    const carrito = carritoDe(page);
    const cantidad = carrito.getByRole('listitem').filter({ hasText: 'Mochila escolar' }).locator('span');
    await expect(cantidad).toHaveText('1');

    // ACT
    await carrito.getByRole('button', { name: 'Disminuir cantidad de Mochila escolar' }).click();

    // ASSERT: elegimos la salida "se queda en 1"
    await expect(cantidad).toHaveText('1');
  });
});

test.describe('US-07 · Quitar un producto del carrito', () => {
  test('CA2: quitar el único producto deja el carrito vacío y el total en $ 0', async ({ page }) => {
    // ARRANGE
    await page.goto('/');
    await tarjetaDe(page, 'Esfero azul').getByRole('button', { name: 'Agregar' }).click();
    const carrito = carritoDe(page);
    await expect(carrito.getByRole('listitem').filter({ hasText: 'Esfero azul' })).toBeVisible();

    // ACT
    await carrito.getByRole('button', { name: 'Eliminar Esfero azul' }).click();

    // ASSERT
    await expect(carrito.getByText('Tu carrito está vacío.')).toBeVisible();
    await expect(carrito.locator('dt:text-is("Total") + dd')).toHaveText('$ 0');
  });
});
