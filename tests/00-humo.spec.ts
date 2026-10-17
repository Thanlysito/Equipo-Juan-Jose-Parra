import { test, expect } from '@playwright/test';

// Prueba de humo: ¿está viva la tienda y funciona mi entorno? Si esta falla, nada más tiene sentido.
// Ejecútenla primero:  npx playwright test 00-humo
test('humo: la tienda carga', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('QA Tienda Escolar');
});
