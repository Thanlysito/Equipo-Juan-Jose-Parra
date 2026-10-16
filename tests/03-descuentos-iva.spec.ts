import { test, expect } from '@playwright/test';
import { TiendaPage, cop } from '../pages/TiendaPage';

/**
 * BLOQUE DESCUENTOS E IMPUESTOS · US-09 a US-12 (migrado al Page Object).
 * Producto de referencia: Mochila escolar, $ 65.000. DESC10 → $ 6.500 · DESC20 → $ 13.000.
 * Bugs en Jira (TDM): TDM-52 (mayúsculas/minúsculas), TDM-53 (inválido borra el descuento),
 * TDM-64 (IVA sobre el subtotal sin descontar) y TDM-54 (el total hereda ese IVA).
 */

const PRECIO_MOCHILA = 65_000;
const IVA = 0.19;

test.describe('US-09 · Aplicar un código de descuento', () => {
  test('CA1: DESC10 descuenta el 10% del subtotal', async ({ page }) => {
    // ARRANGE
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Mochila escolar');

    // ACT
    await tienda.aplicarCodigo('DESC10');

    // ASSERT (la fila se muestra como "− $ 6.500")
    await expect(tienda.total('Descuento')).toHaveText(`− ${cop(PRECIO_MOCHILA * 0.1)}`);
  });

  // PRUEBA DIRIGIDA POR DATOS: una prueba por variante; solo las filas con bug conocido se marcan como fallo esperado.
  const VARIANTES = [
    { codigo: 'desc10', bug: 'TDM-52' },
    { codigo: 'Desc10', bug: 'TDM-52' },
    { codigo: ' DESC10 ', bug: '' }, // espacios alrededor: la tienda los recorta, así que se reconoce
  ];
  for (const { codigo, bug } of VARIANTES) {
    test(`CA3: el código "${codigo}" se reconoce igual que DESC10`, async ({ page }) => {
      test.fail(bug !== '', `${bug} · el código se compara distinguiendo mayúsculas y minúsculas`);
      const tienda = new TiendaPage(page);
      await tienda.abrir();
      await tienda.agregar('Mochila escolar');

      await tienda.aplicarCodigo(codigo);

      await expect(tienda.mensajeDescuento).toHaveText('Código aplicado: 10% de descuento.');
      await expect(tienda.total('Descuento')).toHaveText(`− ${cop(PRECIO_MOCHILA * 0.1)}`);
    });
  }
});

test.describe('US-10 · Recibir aviso si el código no es válido', () => {
  test('CA1: un código inexistente muestra el aviso y el total no cambia', async ({ page }) => {
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Mochila escolar');
    const totalSinDescuento = cop(PRECIO_MOCHILA * (1 + IVA)); // $ 77.350
    await expect(tienda.total('Total')).toHaveText(totalSinDescuento);

    await tienda.aplicarCodigo('ABC123');

    await expect(tienda.mensajeDescuento).toHaveText('Código de descuento no válido.');
    await expect(tienda.total('Total')).toHaveText(totalSinDescuento);
  });

  test('CA2: un código inválido NO borra un descuento válido ya aplicado', async ({ page }) => {
    test.fail(true, 'TDM-53 · al aplicar un código inválido el descuento vuelve a 0%');
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Mochila escolar');
    await tienda.aplicarCodigo('DESC10');
    await expect(tienda.total('Descuento')).toHaveText(`− ${cop(6_500)}`); // quedó aplicado

    await tienda.aplicarCodigo('ABC123');

    await expect(tienda.total('Descuento')).toHaveText(`− ${cop(6_500)}`);
  });
});

test.describe('US-11 · Ver el IVA correcto', () => {
  test('CA2: con descuento, el IVA se calcula sobre el valor descontado', async ({ page }) => {
    test.fail(true, 'TDM-64 · el IVA se calcula sobre el subtotal sin restar el descuento');
    // ORÁCULO: el valor esperado sale del requisito, no de lo que muestra la tienda.
    const descuento = PRECIO_MOCHILA * 0.1;
    const ivaEsperado = (PRECIO_MOCHILA - descuento) * IVA; // 11.115

    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Mochila escolar');
    await tienda.aplicarCodigo('DESC10');

    await expect(tienda.total('IVA')).toHaveText(cop(ivaEsperado));
  });
});

test.describe('US-12 · Ver el total a pagar correcto', () => {
  test('CA2: con descuento, el total es subtotal − descuento + IVA (IVA sobre lo descontado)', async ({ page }) => {
    test.fail(true, 'TDM-54 · el total arrastra el IVA mal calculado (misma causa que TDM-64)');
    const descuento = PRECIO_MOCHILA * 0.1;
    const base = PRECIO_MOCHILA - descuento;
    const totalEsperado = base + base * IVA; // 69.615

    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Mochila escolar');
    await tienda.aplicarCodigo('DESC10');

    await expect(tienda.total('Total')).toHaveText(cop(totalEsperado));
  });
});
