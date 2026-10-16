import { test, expect } from '@playwright/test';

/**
 * PRUEBAS HEREDADAS (Parte 4) · ya diagnosticadas y fuera de cuarentena.
 *
 * H1 → DEFECTO DE LA PRUEBA. Esperaba 6 productos; la tienda muestra 8, que es lo que exige US-01 · CA1
 *      (el ejemplo resuelto 01-catalogo también afirma 8). Dato viejo: se corrigió el valor esperado.
 * H2 → BUG DEL PRODUCTO. El valor esperado ($ 19.760) es correcto según el requisito:
 *      2 × 65.000 = 130.000 − 20% = 104.000 → IVA 19% = 19.760. La tienda muestra $ 24.700 (19% de 130.000).
 *      Se reproduce a mano, falla siempre igual. Mismo defecto que US-11 · CA2 → fallo esperado con TDM-64.
 * H3 → PRUEBA INESTABLE. Con  --repeat-each=30  falló 5 de 30 veces sin cambiar nada. Causa: esperaba solo a
 *      'domcontentloaded' y hacía clic antes de que React conectara los eventos del botón (el clic se perdía).
 *      Se corrigió esperando la condición correcta (la página cargada) y ubicando el botón por su tarjeta,
 *      no por posición (.first()). Después: 40 de 40 en verde. Sin pausas fijas.
 */

test('H1 · el catálogo tiene 8 productos', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(8);
});

test('H2 · el IVA de 2 mochilas con DESC20 es $ 19.760', async ({ page }) => {
  test.fail(true, 'TDM-64 · el IVA se calcula sobre el subtotal sin restar el descuento');
  await page.goto('/');
  const tarjeta = page
    .locator('.rounded-lg')
    .filter({ has: page.getByRole('heading', { name: 'Mochila escolar', level: 3 }) });
  await tarjeta.getByRole('spinbutton').fill('2');
  await tarjeta.getByRole('button', { name: 'Agregar' }).click();
  await page.getByPlaceholder('Código de descuento').fill('DESC20');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('dt:text-is("IVA (19%)") + dd')).toHaveText('$ 19.760');
});

test('H3 · agregar un cuaderno justo después de cargar', async ({ page }) => {
  // Antes: page.goto('/', { waitUntil: 'domcontentloaded' }) → el clic llegaba antes de que la página respondiera.
  await page.goto('/'); // espera el evento 'load' (una condición, no un tiempo)
  const tarjeta = page
    .locator('.rounded-lg')
    .filter({ has: page.getByRole('heading', { name: 'Cuaderno universitario', level: 3 }) });
  await tarjeta.getByRole('button', { name: 'Agregar' }).click();

  const carrito = page.locator('.rounded-lg').filter({ has: page.getByRole('heading', { name: 'Carrito' }) });
  await expect(carrito.getByRole('listitem').filter({ hasText: 'Cuaderno universitario' })).toBeVisible();
});
