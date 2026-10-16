import { test, expect } from '@playwright/test';
import { TiendaPage, DATOS_VALIDOS } from '../pages/TiendaPage';

/**
 * BLOQUE CHECKOUT · US-13 a US-15 (migrado al Page Object).
 *
 * Hallazgo: page.getByLabel('Nombre completo') NO encuentra el campo porque los <label> del formulario no están
 * asociados a su <input> (no tienen atributo `for`/`id` ni envuelven al campo). Además de romper getByLabel,
 * es un problema de accesibilidad: un lector de pantalla no anuncia el nombre del campo (relacionado con US-20).
 * Por eso TiendaPage.campo() usa  label:text-is("…") + input.
 */

const CORREOS_VALIDOS = [
  'juan@correo.com',
  'ana_gomez@gmail.com',
  'ana.gomez@gmail.com',
  'ana-gomez@gmail.com',
  'ana+tienda@gmail.com',
  'ana@universidad.edu.co',
];
const CORREOS_MAL_FORMADOS = ['ana.gmail.com', 'ana@', '@gmail.com', 'ana gomez@gmail.com', 'ana@@gmail.com', 'ana@gmail'];

// Filas con bug conocido: la expresión regular del correo solo acepta letras, números y "_" antes de la arroba
// y un único segmento de dominio (TDM-57).
const CORREOS_CON_BUG: Record<string, string> = {
  'ana.gomez@gmail.com': 'TDM-57',
  'ana-gomez@gmail.com': 'TDM-57',
  'ana+tienda@gmail.com': 'TDM-57',
  'ana@universidad.edu.co': 'TDM-57',
};

test.describe('US-13 · Ir a pagar desde el carrito', () => {
  test('CA3: con total cero o negativo no se puede ir a pagar', async ({ page }) => {
    // Bug distinto a TDM-48: aunque se corrija el "−", la tienda no valida el total antes de cobrar.
    // Pendiente crear su issue en Jira y reemplazar la clave.
    test.fail(true, 'TDM-POR-CREAR · "Ir a pagar" sigue habilitado con total $ 0 (solo valida que haya líneas)');
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Mochila escolar');

    await tienda.disminuir('Mochila escolar');
    await expect(tienda.cantidad('Mochila escolar')).toHaveText('0'); // el total queda en $ 0

    await expect(tienda.botonPagar).toBeDisabled();
  });
});

test.describe('US-14 · Completar mis datos de envío', () => {
  test('CA1: con el formulario vacío hay un error por cada campo obligatorio', async ({ page }) => {
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Esfero azul');
    await tienda.irAPagar();

    await tienda.confirmar();

    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible();
    await expect(page.getByText('El correo es obligatorio.')).toBeVisible();
    await expect(page.getByText('La dirección es obligatoria.')).toBeVisible();
    await expect(tienda.pedidoConfirmado).toBeHidden();
  });

  test('CA2: un nombre y una dirección de solo espacios se rechazan como vacíos', async ({ page }) => {
    const tienda = new TiendaPage(page);
    await tienda.abrir();
    await tienda.agregar('Esfero azul');
    await tienda.irAPagar();

    await tienda.llenarDatos({ nombre: '   ', correo: DATOS_VALIDOS.correo, direccion: '   ' });
    await tienda.confirmar();

    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible();
    await expect(page.getByText('La dirección es obligatoria.')).toBeVisible();
    await expect(tienda.pedidoConfirmado).toBeHidden();
  });
});

test.describe('US-15 · Ingresar un correo electrónico válido', () => {
  for (const correo of CORREOS_VALIDOS) {
    test(`CA1-CA3: el correo válido "${correo}" se acepta`, async ({ page }) => {
      const bug = CORREOS_CON_BUG[correo] ?? '';
      test.fail(bug !== '', `${bug} · la validación rechaza un correo con formato válido`);
      const tienda = new TiendaPage(page);
      await tienda.abrir();
      await tienda.agregar('Esfero azul');
      await tienda.irAPagar();

      await tienda.llenarDatos({ ...DATOS_VALIDOS, correo });
      await tienda.confirmar();

      await expect(tienda.pedidoConfirmado).toBeVisible();
    });
  }

  for (const correo of CORREOS_MAL_FORMADOS) {
    test(`CA4: el correo mal formado "${correo}" se rechaza con un mensaje claro`, async ({ page }) => {
      const tienda = new TiendaPage(page);
      await tienda.abrir();
      await tienda.agregar('Esfero azul');
      await tienda.irAPagar();

      await tienda.llenarDatos({ ...DATOS_VALIDOS, correo });
      await tienda.confirmar();

      await expect(page.getByText('El correo no tiene un formato válido.')).toBeVisible();
      await expect(tienda.pedidoConfirmado).toBeHidden();
    });
  }
});
