import { test, expect } from '@playwright/test';

/**
 * BLOQUE CARRITO · US-04 a US-07.
 *
 * Cómo se trabaja este archivo:
 *  - La primera prueba ya está resuelta (EJEMPLO GUIADO).
 *  - Las demás están "pendientes": traen un test.fixme(...) que las salta. Para activar una, escriban su cuerpo
 *    y BORREN esa línea. Las pistas están en los comentarios.
 *  - "Nivel" va de 1 (fácil) a 3 (reto). "CAZABUGS" = el criterio probablemente destapa un bug de la tienda.
 *  - Los localizadores de la tienda están en el "Mapa de la tienda" de la guía del laboratorio.
 */

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

  // ─────────────── PENDIENTES ───────────────
  test('CA2: no deja agregar 7 mochilas de una vez (stock 6) y avisa', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar'); // ← borren esta línea cuando la implementen
    // Nivel 2.
    // Pista: la tienda avisa con un alert() del navegador, que BLOQUEA la página hasta que se atiende.
    //   Registren el manejador ANTES del clic:
    //     page.once('dialog', async (dialogo) => { /* guardar dialogo.message() */ await dialogo.accept(); });
    // Verifiquen (1) que el texto del aviso menciona "Solo hay 6 unidades" y (2) que el carrito sigue vacío.
  });

  test('CA3: 4 + 4 mochilas supera el stock (6) y debe rechazarse', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2 · CAZABUGS.
    // Agreguen 4 mochilas y luego otras 4. Afirmen lo que el CRITERIO exige (el stock no se supera: la cantidad
    // en el carrito se queda en 4), no lo que la tienda hace hoy.
    // Si la prueba sale roja: ¿bug del producto, defecto de la prueba o prueba inestable? (Parte 3 de la guía)
  });
});

test.describe('US-05 · Aumentar la cantidad desde el carrito', () => {
  test('CA2: "+" no pasa del stock (6 mochilas)', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2 · CAZABUGS.
    // Agreguen las 6 mochilas del stock y presionen "+" en el carrito
    // (botón con nombre accesible "Aumentar cantidad de Mochila escolar"). La cantidad debe seguir en 6.
  });
});

test.describe('US-06 · Disminuir la cantidad desde el carrito', () => {
  test('CA2: con cantidad 1, "−" no la deja en 0 ni en negativo', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2 · CAZABUGS.
    // Agreguen 1 mochila y presionen "−" (botón "Disminuir cantidad de Mochila escolar").
    // El criterio acepta dos salidas correctas: que se quede en 1 o que el producto se elimine.
    // Elijan una, afírmenla y escriban en el nombre de la prueba cuál eligieron.
  });
});

test.describe('US-07 · Quitar un producto del carrito', () => {
  test('CA2: quitar el único producto deja el carrito vacío y el total en $ 0', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 1.
    // Agreguen un esfero, quítenlo con el botón "Eliminar Esfero azul" y comprueben el mensaje "Tu carrito está vacío."
    // y que la fila "Total" del carrito muestre $ 0.
  });
});
