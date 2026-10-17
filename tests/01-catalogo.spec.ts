import { test, expect } from '@playwright/test';

/**
 * EJEMPLO RESUELTO · US-01 Ver el catálogo de productos.
 * Léanlo, ejecútenlo (npx playwright test 01-catalogo) y entiendan cada línea ANTES de escribir las suyas.
 *
 * Toda prueba automatizada tiene la misma forma, la de sus criterios de aceptación:
 *   ARRANGE (Dado)  → dejar el sistema en la situación inicial
 *   ACT     (Cuando) → hacer la acción
 *   ASSERT  (Entonces) → comprobar el resultado
 */
test.describe('US-01 · Ver el catálogo de productos', () => {
  test('CA1: el catálogo muestra 8 productos', async ({ page }) => {
    // ARRANGE + ACT: abrir la tienda (baseURL está en playwright.config.ts)
    await page.goto('/');

    // ASSERT: cada producto es un encabezado de nivel 3. toHaveCount() reintenta hasta 5 s: no hace falta esperar a mano.
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(8);
  });

  test('CA2: la mochila escolar muestra su precio y su stock', async ({ page }) => {
    await page.goto('/');

    // Ubicar la TARJETA de un producto: el contenedor que tiene como encabezado el nombre del producto.
    // Así las comprobaciones siguientes quedan limitadas a ESA tarjeta y no a toda la página.
    const tarjeta = page
      .locator('.rounded-lg')
      .filter({ has: page.getByRole('heading', { name: 'Mochila escolar', level: 3 }) });

    await expect(tarjeta).toContainText('$ 65.000');
    await expect(tarjeta).toContainText('Stock: 6');
  });

  test('CA3: los precios usan punto de miles y no tienen decimales', async ({ page }) => {
    await page.goto('/');

    // Leer el texto de todos los precios y comprobar cada uno con una expresión regular.
    const precios = await page.locator('.rounded-lg p.font-semibold').allInnerTexts();
    expect(precios).toHaveLength(8);
    for (const precio of precios) {
      expect(precio).toMatch(/^\$\s\d{1,3}(\.\d{3})*$/);
    }
  });
});
