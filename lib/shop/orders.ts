import { getProduct, productName } from "./catalog";
import { getColor } from "./colors";
import { mailOrder } from "./mail";
import { captureHold, createHold, paymentMode, readHold, refundHold, releaseHold } from "./payments";
import { isExemptProvince } from "./places";
import { baseFromGross, quoteOrder } from "./quote";
import { freshId, getOrder, listOrders, mutateShop, nextNumber, saveCustomer } from "./store";
import type { Customer, Order, OrderStatus } from "./types";
import { addressIssue, clip, dniIssue, normalizeDni } from "./validate";
import { site } from "@/lib/site";

export class ShopError extends Error {}

export type CheckoutLine = { productId: string; color: string; qty: number };

export type CheckoutInput = {
  lines: CheckoutLine[];
  street: string;
  extra: string;
  postalCode: string;
  city: string;
  province: string;
  dni: string;
  wantsInvoice: boolean;
};

function stamp() {
  return new Date().toISOString();
}

function mailOrigin(origin?: string) {
  if (origin) return origin;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  return site.url;
}

async function patchOrder(id: string, change: (order: Order, dbSeq: { invoiceSeq: number }) => void) {
  return mutateShop((db) => {
    const order = db.orders.find((item) => item.id === id);
    if (!order) return null;
    change(order, db);
    return order;
  });
}

function rememberAddress(customer: Customer, order: Order) {
  customer.street = order.address.street;
  customer.extra = order.address.extra;
  customer.postalCode = order.address.postalCode;
  customer.city = order.address.city;
  customer.province = order.address.province;
  if (order.dni) customer.dni = order.dni;
  return saveCustomer(customer);
}

export async function placeOrder(customer: Customer, input: CheckoutInput, origin: string) {
  const mode = paymentMode();
  if (mode === "unavailable") {
    throw new ShopError("El pago no está disponible hasta conectar la pasarela.");
  }

  const address = {
    street: clip(input.street, 120),
    extra: clip(input.extra, 80),
    postalCode: input.postalCode.trim(),
    city: clip(input.city, 80),
    province: input.province,
  };
  const invalidAddress = addressIssue(address);
  if (invalidAddress) throw new ShopError(invalidAddress);

  const exempt = isExemptProvince(address.province);
  const wantsInvoice = exempt || Boolean(input.wantsInvoice);
  const invalidDni = dniIssue(input.dni || "", wantsInvoice);
  if (invalidDni) throw new ShopError(invalidDni);
  const dni = (input.dni || "").trim() ? normalizeDni(input.dni) : "";

  if (!Array.isArray(input.lines) || input.lines.length < 1 || input.lines.length > 20) {
    throw new ShopError("La cesta está vacía.");
  }

  const merged = new Map<string, CheckoutLine>();
  for (const raw of input.lines) {
    const qty = Number(raw?.qty);
    const product = getProduct(String(raw?.productId || ""));
    const color = getColor(String(raw?.color || ""));
    if (!Number.isInteger(qty) || qty < 1 || qty > 5) throw new ShopError("La cantidad no es válida.");
    if (!product) throw new ShopError("Hay un modelo que ya no está en la tienda.");
    if (!color) throw new ShopError("Elige un color de la carta.");
    const key = `${product.id}:${color.code}`;
    const nextQty = (merged.get(key)?.qty ?? 0) + qty;
    if (nextQty > 5) throw new ShopError("Como máximo, 5 unidades del mismo modelo y color.");
    merged.set(key, { productId: product.id, color: color.code, qty: nextQty });
  }

  const drafts = [...merged.values()].map((line) => {
    const product = getProduct(line.productId);
    if (!product) throw new ShopError("Hay un modelo que ya no está en la tienda.");
    return {
      productId: product.id,
      name: productName(product),
      color: line.color,
      qty: line.qty,
      unitGrossCents: product.priceCents,
      gross: product.priceCents * line.qty,
    };
  });
  const goodsGross = drafts.reduce((sum, line) => sum + line.gross, 0);
  const quote = quoteOrder(goodsGross, exempt);
  const charges = drafts.map((line) => (exempt ? baseFromGross(line.gross) : line.gross));
  const drift = quote.goodsChargeCents - charges.reduce((sum, charge) => sum + charge, 0);
  charges[charges.length - 1] += drift;
  const lines = drafts.map((line, index) => ({
    productId: line.productId,
    name: line.name,
    color: line.color,
    qty: line.qty,
    unitGrossCents: line.unitGrossCents,
    unitChargeCents: Math.max(0, Math.round(charges[index] / line.qty)),
    lineChargeCents: charges[index],
  }));

  const pendingHolds: string[] = [];
  await mutateShop((db) => {
    for (const order of db.orders) {
      if (order.customerId === customer.id && order.status === "pending_payment") {
        order.status = "cancelled";
        order.cancelledAt = stamp();
        if (order.stripePaymentIntentId) pendingHolds.push(order.stripePaymentIntentId);
      }
    }
  });
  if (mode === "stripe") {
    for (const paymentIntentId of pendingHolds) {
      try {
        await releaseHold(paymentIntentId);
      } catch {
        /* La reserva anterior ya no estaba activa. */
      }
    }
  }

  const createdAt = stamp();
  const order: Order = {
    id: freshId(),
    number: "",
    customerId: customer.id,
    email: customer.email,
    phone: customer.phone,
    firstName: customer.firstName,
    lastName: customer.lastName,
    dni,
    address,
    lines,
    exempt,
    wantsInvoice,
    goodsGrossCents: quote.goodsGrossCents,
    goodsChargeCents: quote.goodsChargeCents,
    shippingGrossCents: quote.shippingGrossCents,
    shippingChargeCents: quote.shippingChargeCents,
    ivaCents: quote.ivaCents,
    totalCents: quote.totalCents,
    status: mode === "local" ? "authorized" : "pending_payment",
    paymentMode: mode === "local" ? "local" : "stripe",
    stripePaymentIntentId: "",
    invoiceNumber: "",
    invoiceIssuedAt: "",
    creditNumber: "",
    creditIssuedAt: "",
    tracking: "",
    carrier: "",
    createdAt,
    authorizedAt: mode === "local" ? createdAt : "",
    confirmedAt: "",
    shippedAt: "",
    cancelledAt: "",
    refundedAt: "",
  };

  await mutateShop((db) => {
    db.orderSeq += 1;
    order.number = nextNumber(db.orderSeq, "P");
  });

  let clientSecret: string | null = null;
  if (mode === "stripe") {
    const intent = await createHold({
      amount: order.totalCents,
      email: order.email,
      orderId: order.id,
      number: order.number,
    });
    if (!intent.client_secret) throw new ShopError("No he podido preparar la reserva del pago.");
    order.stripePaymentIntentId = intent.id;
    clientSecret = intent.client_secret;
  }

  await mutateShop((db) => {
    db.orders.push(order);
  });
  await rememberAddress(customer, order);
  if (order.status === "authorized") await mailOrder(order, "authorized", origin);
  return { order, clientSecret };
}

export async function syncOrder(orderId: string, origin?: string) {
  const order = await getOrder(orderId);
  if (!order || order.paymentMode !== "stripe" || !order.stripePaymentIntentId) return order;
  if (order.status !== "pending_payment") return order;
  const intent = await readHold(order.stripePaymentIntentId);
  if (intent.status === "requires_capture") return markAuthorized(order.id, origin);
  if (intent.status === "canceled") return markCancelled(order.id, origin, false);
  if (intent.status === "succeeded") return markConfirmed(order.id, origin, false);
  return order;
}

async function markAuthorized(id: string, origin?: string) {
  let changed = false;
  const order = await patchOrder(id, (current) => {
    if (current.status !== "pending_payment") return;
    current.status = "authorized";
    current.authorizedAt = stamp();
    changed = true;
  });
  if (changed && order) await mailOrder(order, "authorized", mailOrigin(origin));
  return order;
}

async function markCancelled(id: string, origin: string | undefined, notify: boolean) {
  let changed = false;
  const order = await patchOrder(id, (current) => {
    if (current.status !== "pending_payment" && current.status !== "authorized") return;
    current.status = "cancelled";
    current.cancelledAt = stamp();
    changed = true;
  });
  if (changed && notify && order) await mailOrder(order, "cancelled", mailOrigin(origin));
  return order;
}

async function markConfirmed(id: string, origin: string | undefined, notify: boolean) {
  let changed = false;
  const order = await patchOrder(id, (current, db) => {
    if (current.status !== "authorized" && current.status !== "pending_payment") return;
    if ((current.exempt || current.wantsInvoice) && !current.invoiceNumber) {
      db.invoiceSeq += 1;
      current.invoiceNumber = nextNumber(db.invoiceSeq, "F");
      current.invoiceIssuedAt = stamp();
    }
    current.status = "confirmed";
    current.confirmedAt = stamp();
    changed = true;
  });
  if (changed && notify && order) await mailOrder(order, "confirmed", mailOrigin(origin));
  return order;
}

export async function confirmOrder(id: string, origin: string) {
  const order = await getOrder(id);
  if (!order || order.status !== "authorized") {
    throw new ShopError("Este pedido no está pendiente de confirmar.");
  }
  if (order.paymentMode === "stripe") {
    try {
      await captureHold(order.stripePaymentIntentId);
    } catch {
      throw new ShopError("El banco no ha dejado cobrar la reserva. Si han pasado unos 7 días, la retención caduca y hay que repetir el pedido.");
    }
  }
  const confirmed = await markConfirmed(id, origin, true);
  if (!confirmed || confirmed.status !== "confirmed") throw new ShopError("No he podido confirmar el pedido.");
  return confirmed;
}

export async function releaseOrder(id: string, origin: string) {
  const order = await getOrder(id);
  if (!order || (order.status !== "authorized" && order.status !== "pending_payment")) {
    throw new ShopError("Este pedido ya no se puede liberar.");
  }
  if (order.paymentMode === "stripe" && order.stripePaymentIntentId) {
    try {
      await releaseHold(order.stripePaymentIntentId);
    } catch {
      throw new ShopError("El banco no ha dejado anular la reserva.");
    }
  }
  const cancelled = await markCancelled(id, origin, order.status === "authorized");
  if (!cancelled) throw new ShopError("No he podido anular el pedido.");
  return cancelled;
}

export async function shipOrder(id: string, tracking: string, carrier: string, origin: string) {
  const code = tracking.trim().slice(0, 80);
  const name = carrier.trim().slice(0, 40);
  if (!code) throw new ShopError("Escribe el código de seguimiento.");
  let changed = false;
  const order = await patchOrder(id, (current) => {
    if (current.status !== "confirmed") return;
    current.tracking = code;
    current.carrier = name || "Correos";
    current.status = "shipped";
    current.shippedAt = stamp();
    changed = true;
  });
  if (!changed || !order) throw new ShopError("Solo se puede enviar un pedido ya cobrado.");
  await mailOrder(order, "shipped", origin);
  return order;
}

export async function refundOrder(id: string, origin: string) {
  const existing = await getOrder(id);
  if (!existing || (existing.status !== "confirmed" && existing.status !== "shipped")) {
    throw new ShopError("Este pedido no se puede reembolsar.");
  }
  if (existing.paymentMode === "stripe" && existing.stripePaymentIntentId) {
    try {
      await refundHold(existing.stripePaymentIntentId);
    } catch {
      throw new ShopError("El banco no ha dejado devolver el cobro.");
    }
  }
  let changed = false;
  const order = await patchOrder(id, (current, db) => {
    if (current.status !== "confirmed" && current.status !== "shipped") return;
    if (current.invoiceNumber && !current.creditNumber) {
      db.invoiceSeq += 1;
      current.creditNumber = nextNumber(db.invoiceSeq, "R");
      current.creditIssuedAt = stamp();
    }
    current.status = "refunded";
    current.refundedAt = stamp();
    changed = true;
  });
  if (!changed || !order) throw new ShopError("No he podido reembolsar el pedido.");
  await mailOrder(order, "refunded", origin);
  return order;
}

export async function applyStripeEvent(paymentIntentId: string, status: string) {
  const orders = await listOrders();
  const order = orders.find((item) => item.stripePaymentIntentId === paymentIntentId);
  if (!order) return;
  if (status === "requires_capture") await markAuthorized(order.id);
  if (status === "canceled") await markCancelled(order.id, undefined, order.status === "authorized");
  if (status === "succeeded") await markConfirmed(order.id, undefined, order.status !== "confirmed");
}

export function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    pending_payment: "Pendiente de reserva",
    authorized: "Reservado, sin cobrar",
    confirmed: "Cobrado, por enviar",
    shipped: "Enviado",
    cancelled: "Anulado, sin cargo",
    refunded: "Reembolsado",
  };
  return labels[status];
}
