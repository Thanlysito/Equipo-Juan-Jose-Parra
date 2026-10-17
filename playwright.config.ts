import { defineConfig, devices } from '@playwright/test';

// La tienda que vamos a probar. Se puede cambiar sin tocar el código:
//   BASE_URL=http://localhost:3000 npx playwright test
const BASE_URL = process.env.BASE_URL ?? 'https://qa-tienda-pruebas.vercel.app';

export default defineConfig({
  testDir: './tests',

  // Tiempo máximo por prueba y por aserción (las aserciones reintentan hasta este límite).
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Las pruebas son independientes entre sí, así que pueden correr en paralelo.
  fullyParallel: true,

  // En CI: no se permite dejar un test.only por error, y se reintenta una vez.
  // Un reintento NO arregla una prueba inestable: solo la deja en evidencia (sale como "flaky").
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  // Resultado en la terminal + reporte HTML (npm run report)
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    // Evidencia automática cuando una prueba falla: captura y "trace" (línea de tiempo navegable).
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
