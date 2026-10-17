import { test, expect } from '@playwright/test';

/**
 * BLOQUE DESCUENTOS E IMPUESTOS · US-09 a US-12.
 * Mismas reglas que en 02-carrito.spec.ts: borren el test.fixme(...) cuando implementen la prueba.
 * Valores útiles (producto: Mochila escolar, $ 65.000): DESC10 → descuento $ 6.500 · DESC20 → $ 13.000.
 */

test.describe('US-09 · Aplicar un código de descuento', () => {
  test('CA1: DESC10 descuenta el 10% del subtotal', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 1.
    // Agreguen 1 mochila, escriban DESC10 en "Código de descuento", presionen "Aplicar" y comprueben la fila
    // "Descuento" del carrito: debe mostrar $ 6.500.
  });

  test('CA3: los códigos "desc10" y "Desc10" se reconocen igual que DESC10', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2 · CAZABUGS · PRUEBAS DIRIGIDAS POR DATOS.
    // No escriban tres pruebas casi iguales. Definan una lista de variantes
    //   const VARIANTES = ['desc10', 'Desc10', ' DESC10 '];
    // y generen UNA prueba por variante con un  for (const codigo of VARIANTES) { test(`...${codigo}...`, ...) }
    // Así el reporte dice EXACTAMENTE qué variantes fallan.
  });
});

test.describe('US-10 · Recibir aviso si el código no es válido', () => {
  test('CA1: un código inexistente muestra el aviso y el total no cambia', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 1.
    // Con 1 mochila ($ 77.350 de total), apliquen ABC123: el mensaje debe ser exactamente
    // "Código de descuento no válido." y el total debe seguir en $ 77.350.
  });

  test('CA2: un código inválido NO borra un descuento válido ya aplicado', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 2 · CAZABUGS.
    // Apliquen DESC10 (comprueben que quedó aplicado), luego apliquen ABC123. El descuento de $ 6.500 debe mantenerse.
  });
});

test.describe('US-11 · Ver el IVA correcto', () => {
  test('CA2: con descuento, el IVA se calcula sobre el valor descontado', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 3 · CAZABUGS · EL ORÁCULO.
    // Una prueba solo sirve si sabe QUÉ debe pasar sin mirar lo que hace la app.
    // Calculen el valor esperado EN LA PRUEBA, a partir del requisito (IVA = 19% de subtotal − descuento):
    //   const descuento = 65000 * 0.10;  const ivaEsperado = (65000 - descuento) * 0.19;
    // y comparen contra la fila "IVA (19%)" del carrito. Formateen el número como la tienda:
    //   new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
    // Nunca copien el número que muestra la tienda: así la prueba daría por bueno un bug.
  });
});

test.describe('US-12 · Ver el total a pagar correcto', () => {
  test('CA2: con descuento, el total es subtotal − descuento + IVA (IVA sobre lo descontado)', async ({ page }) => {
    test.fixme(true, 'Pendiente de automatizar');
    // Nivel 3 · CAZABUGS. Mismo oráculo que US-11, ahora sobre la fila "Total".
    // Pregunta para el reporte: este bug y el de US-11 CA2, ¿son el mismo? ¿Cuántos bugs hay en Jira?
  });
});
