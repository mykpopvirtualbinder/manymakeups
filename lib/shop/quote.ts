/** Envío gratis en pedidos de productos superiores a 100 €. Por debajo, 2,90 €. */
export const FREE_SHIPPING_OVER_CENTS = 10_000;
export const SHIPPING_CENTS = 290;
const IVA = 1.21;

export const EXEMPT_INVOICE_NOTE =
  "Operación exenta de IVA en virtud del artículo 21 de la Ley 37/1992, del Impuesto sobre el Valor Añadido";

export const EXEMPT_CHECKOUT_NOTE =
  "Los envíos a Canarias, Ceuta o Melilla se facturan sin IVA, pero los posibles impuestos locales (IGIC/IPSI) y gastos aduaneros correrán a cargo del comprador en el momento de la entrega";

export type Quote = {
  exempt: boolean;
  goodsGrossCents: number;
  goodsChargeCents: number;
  shippingGrossCents: number;
  shippingChargeCents: number;
  ivaCents: number;
  totalCents: number;
  freeShipping: boolean;
};

/** Quita el 21 % de un precio con IVA incluido. */
export function baseFromGross(grossCents: number) {
  if (grossCents <= 0) return 0;
  return Math.round(grossCents / IVA);
}

export function quoteOrder(goodsGrossCents: number, exempt: boolean): Quote {
  const goodsChargeCents = exempt ? baseFromGross(goodsGrossCents) : goodsGrossCents;
  const freeShipping = goodsChargeCents > FREE_SHIPPING_OVER_CENTS;
  const shippingGrossCents = freeShipping ? 0 : SHIPPING_CENTS;
  const shippingChargeCents = exempt ? baseFromGross(shippingGrossCents) : shippingGrossCents;
  const ivaCents = exempt
    ? 0
    : goodsGrossCents -
      baseFromGross(goodsGrossCents) +
      (shippingGrossCents - baseFromGross(shippingGrossCents));
  return {
    exempt,
    goodsGrossCents,
    goodsChargeCents,
    shippingGrossCents,
    shippingChargeCents,
    ivaCents,
    totalCents: goodsChargeCents + shippingChargeCents,
    freeShipping,
  };
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function formatAmount(cents: number) {
  return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(cents / 100)
    .replace(/\u202f|\u00a0/g, " ");
}
