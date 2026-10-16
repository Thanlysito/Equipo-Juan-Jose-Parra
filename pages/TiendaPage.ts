import { expect, type Locator, type Page } from '@playwright/test';

/**
 * PARTE 5 · PAGE OBJECT DE LA TIENDA.
 *
 * Las pruebas cuentan la HISTORIA ("agrego una mochila y aplico DESC10"); el "cómo" (los localizadores)
 * vive aquí, en un solo lugar. Si la tienda cambia su HTML, se corrige esta clase una vez.
 *
 * Regla de oro: esta clase ofrece ACCIONES (agregar, aplicarCodigo...) y entrega LOCALIZADORES (cantidad, total...).
 * Las aserciones de negocio (expect) se quedan en las pruebas.
 */
export type DatosEnvio = { nombre?: string; correo?: string; direccion?: string };

/** Datos válidos de ejemplo para completar una compra. */
export const DATOS_VALIDOS: Required<DatosEnvio> = {
  nombre: 'Ana Gómez',
  correo: 'ana@correo.com',
  direccion: 'Calle 10 # 20-30',
};

export class TiendaPage {
  /** El panel del carrito (la tarjeta que tiene el encabezado "Carrito"). */
  readonly carrito: Locator;
  /** El contador "N artículo(s)" del encabezado. */
  readonly contador: Locator;
  /** El mensaje que aparece debajo del código de descuento. */
  readonly mensajeDescuento: Locator;
  /** El texto "Tu carrito está vacío." */
  readonly carritoVacio: Locator;
  /** El botón "Ir a pagar". */
  readonly botonPagar: Locator;
  /** El encabezado "¡Pedido confirmado!". */
  readonly pedidoConfirmado: Locator;

  constructor(readonly page: Page) {
    this.carrito = page.locator('.rounded-lg').filter({ has: page.getByRole('heading', { name: 'Carrito' }) });
    this.contador = page.getByRole('banner').getByText(/artículo\(s\)/);
    this.mensajeDescuento = this.carrito.locator('p.text-xs');
    this.carritoVacio = this.carrito.getByText('Tu carrito está vacío.');
    this.botonPagar = this.carrito.getByRole('button', { name: 'Ir a pagar' });
    this.pedidoConfirmado = page.getByRole('heading', { name: '¡Pedido confirmado!' });
  }

  // ---------- Catálogo ----------
  /** Abre la tienda. */
  async abrir(): Promise<void> {
    await this.page.goto('/');
  }

  /** La tarjeta de un producto del catálogo. */
  tarjeta(producto: string): Locator {
    return this.page
      .locator('.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: producto, level: 3 }) });
  }

  /** Escribe la cantidad en la tarjeta del producto y presiona "Agregar". */
  async agregar(producto: string, cantidad = 1): Promise<void> {
    const tarjeta = this.tarjeta(producto);
    await tarjeta.getByRole('spinbutton').fill(String(cantidad));
    await tarjeta.getByRole('button', { name: 'Agregar' }).click();
  }

  // ---------- Carrito ----------
  /** La línea del carrito de un producto. */
  linea(producto: string): Locator {
    return this.carrito.getByRole('listitem').filter({ hasText: producto });
  }

  /** El número de unidades que muestra el carrito para un producto. */
  cantidad(producto: string): Locator {
    return this.linea(producto).locator('span');
  }

  /** Presiona "+" en la línea del producto. */
  async aumentar(producto: string): Promise<void> {
    await this.carrito.getByRole('button', { name: `Aumentar cantidad de ${producto}` }).click();
  }

  /** Presiona "−" en la línea del producto. */
  async disminuir(producto: string): Promise<void> {
    await this.carrito.getByRole('button', { name: `Disminuir cantidad de ${producto}` }).click();
  }

  /** Presiona "✕" (Eliminar) en la línea del producto. */
  async eliminar(producto: string): Promise<void> {
    await this.carrito.getByRole('button', { name: `Eliminar ${producto}` }).click();
  }

  /** Escribe el código y presiona "Aplicar". */
  async aplicarCodigo(codigo: string): Promise<void> {
    await this.carrito.getByPlaceholder('Código de descuento').fill(codigo);
    await this.carrito.getByRole('button', { name: 'Aplicar' }).click();
  }

  /** Valor de una fila del resumen: 'Subtotal', 'Descuento', 'IVA' o 'Total'. */
  total(fila: 'Subtotal' | 'Descuento' | 'IVA' | 'Total'): Locator {
    const selector = {
      Subtotal: 'dt:text-is("Subtotal") + dd',
      Descuento: 'dt:text("Descuento") + dd', // la etiqueta incluye el porcentaje
      IVA: 'dt:text-is("IVA (19%)") + dd',
      Total: 'dt:text-is("Total") + dd',
    }[fila];
    return this.carrito.locator(selector);
  }

  /** Presiona "Ir a pagar". */
  async irAPagar(): Promise<void> {
    await this.botonPagar.click();
  }

  // ---------- Checkout y confirmación ----------
  /**
   * Un campo del formulario de envío, por el texto de su etiqueta.
   * getByLabel no funciona aquí: los <label> no tienen `for` ni envuelven al <input>, así que no están asociados.
   */
  campo(etiqueta: 'Nombre completo' | 'Correo electrónico' | 'Dirección de entrega'): Locator {
    return this.page.locator(`label:text-is("${etiqueta}") + input`);
  }

  /** Llena el formulario con los datos que reciba. */
  async llenarDatos(datos: DatosEnvio): Promise<void> {
    if (datos.nombre !== undefined) await this.campo('Nombre completo').fill(datos.nombre);
    if (datos.correo !== undefined) await this.campo('Correo electrónico').fill(datos.correo);
    if (datos.direccion !== undefined) await this.campo('Dirección de entrega').fill(datos.direccion);
  }

  /** Presiona "Confirmar pedido". */
  async confirmar(): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirmar pedido' }).click();
  }

  /** Lee el número de pedido de la pantalla de confirmación (ej. "1001"). */
  async numeroDePedido(): Promise<string> {
    const texto = await this.page.getByText(/Número de pedido:/).innerText();
    const coincidencia = texto.match(/#(\d+)/);
    if (!coincidencia) throw new Error(`No se encontró un número de pedido en: "${texto}"`);
    return coincidencia[1];
  }

  /** Presiona "Volver a la tienda". */
  async volverALaTienda(): Promise<void> {
    await this.page.getByRole('button', { name: 'Volver a la tienda' }).click();
  }

  /** Atajo: compra completa de un producto con datos válidos, hasta ver "¡Pedido confirmado!". */
  async comprar(producto: string, datos: DatosEnvio = DATOS_VALIDOS): Promise<void> {
    await this.agregar(producto);
    await this.irAPagar();
    await this.llenarDatos(datos);
    await this.confirmar();
    // Espera de sincronización (no es la aserción de la prueba): el atajo termina cuando el pedido quedó confirmado.
    await expect(this.pedidoConfirmado).toBeVisible();
  }
}

/** Formatea un valor como lo hace la tienda (pesos colombianos, sin decimales). */
export function cop(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}
