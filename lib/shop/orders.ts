import { getProduct, productName } from "./catalog";
import { getColor } from "./colors";
import { mailOrder } from "./mail";
import { captureHold, createHold, createReserveCheckout, paymentMode, readHold, refundHold, releaseHold, stripeClient } from "./payments";
import { isExemptProvince } from "./places";
import { baseFromGross, quoteOrder } from "./quote";
import { freshId, getOrder, listOrders, mutateShop, nextNumber, saveCustomer } from "./store";
import type { Customer, LineStock, Order, OrderStatus } from "./types";
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
    stock: "pending" as const,
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
    archivedAt: "",
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

function lineStock(stock: LineStock | undefined): LineStock {
  if (stock === "yes" || stock === "no" || stock === "reserved") return stock;
  return "pending";
}

export function confirmedCharge(order: Order) {
  const kept = order.lines.filter((line) => lineStock(line.stock) === "yes");
  const dropped = order.lines.filter((line) => lineStock(line.stock) === "no");
  const reserved = order.lines.filter((line) => lineStock(line.stock) === "reserved");
  const pending = order.lines.some((line) => lineStock(line.stock) === "pending");
  const droppedCents = dropped.reduce((sum, line) => sum + line.lineChargeCents, 0);
  const reservedCents = reserved.reduce((sum, line) => sum + line.lineChargeCents, 0);
  const goodsGrossCents = kept.reduce((sum, line) => sum + line.unitGrossCents * line.qty, 0);
  const goodsChargeCents = kept.reduce((sum, line) => sum + line.lineChargeCents, 0);
  const shippingGrossCents = kept.length ? order.shippingGrossCents : 0;
  const shippingChargeCents = kept.length ? order.shippingChargeCents : 0;
  const ivaCents = order.exempt
    ? 0
    : goodsGrossCents -
      baseFromGross(goodsGrossCents) +
      (shippingGrossCents - baseFromGross(shippingGrossCents));
  const totalCents = goodsChargeCents + shippingChargeCents;
  const quote = kept.length
    ? {
        goodsGrossCents,
        goodsChargeCents,
        shippingGrossCents,
        shippingChargeCents,
        ivaCents,
        totalCents,
      }
    : null;
  return { kept, reserved, pending, droppedCents, reservedCents, quote, captureCents: quote ? totalCents : 0 };
}

export async function setLineStock(id: string, index: number, stock: Exclude<LineStock, "pending">) {
  const order = await getOrder(id);
  if (!order || (order.status !== "authorized" && order.status !== "pending_payment")) {
    throw new ShopError("Este pedido ya no se puede modificar.");
  }
  if (!order.lines[index]) throw new ShopError("Ese artículo no está en el pedido.");
  const saved = await patchOrder(id, (current) => {
    if (current.status !== "authorized" && current.status !== "pending_payment") return;
    const line = current.lines[index];
    if (!line) return;
    line.stock = stock;
  });
  if (!saved) throw new ShopError("No he podido anotar el stock.");
  return saved;
}

async function markConfirmed(
  id: string,
  origin: string | undefined,
  notify: boolean,
  settlement?: {
    goodsGrossCents: number;
    goodsChargeCents: number;
    shippingGrossCents: number;
    shippingChargeCents: number;
    ivaCents: number;
    totalCents: number;
  },
) {
  let changed = false;
  const order = await patchOrder(id, (current) => {
    const open = current.status === "authorized" || current.status === "pending_payment";
    if (!open && current.status !== "confirmed") return;
    if (settlement) {
      current.goodsGrossCents = settlement.goodsGrossCents;
      current.goodsChargeCents = settlement.goodsChargeCents;
      current.shippingGrossCents = settlement.shippingGrossCents;
      current.shippingChargeCents = settlement.shippingChargeCents;
      current.ivaCents = settlement.ivaCents;
      current.totalCents = settlement.totalCents;
    }
    if (!open) return;
    current.status = "confirmed";
    current.confirmedAt = stamp();
    changed = true;
  });
  if (changed && notify && order) await mailOrder(order, "confirmed", mailOrigin(origin));
  return order;
}

export async function confirmOrder(id: string, origin: string) {
  const order = await getOrder(id);
  if (!order || (order.status !== "authorized" && order.status !== "pending_payment")) {
    throw new ShopError("Este pedido no está pendiente de confirmar.");
  }
  if (order.status === "pending_payment") {
    throw new ShopError("La clienta todavía no ha reservado la tarjeta. Cuando termine el pago, podrás finalizar y cobrar.");
  }
  const charge = confirmedCharge(order);
  if (charge.pending) throw new ShopError("Confirma, reserva o anula cada artículo antes de finalizar.");
  if (charge.captureCents < 1) {
    if (charge.reservedCents < 1) throw new ShopError("Ningún artículo está confirmado. Anula el pedido para no cobrar.");
    if (order.paymentMode === "stripe" && order.stripePaymentIntentId) {
      try {
        await releaseHold(order.stripePaymentIntentId);
      } catch {
        throw new ShopError("El banco no ha dejado anular la reserva.");
      }
    }
    const parked = await markConfirmed(id, origin, true, {
      goodsGrossCents: 0,
      goodsChargeCents: 0,
      shippingGrossCents: order.shippingGrossCents,
      shippingChargeCents: order.shippingChargeCents,
      ivaCents: 0,
      totalCents: 0,
    });
    if (!parked || parked.status !== "confirmed") throw new ShopError("No he podido dejar el pedido reservado.");
    return parked;
  }
  if (!charge.quote) throw new ShopError("Ningún artículo está confirmado. Anula el pedido para no cobrar.");
  if (order.paymentMode === "stripe") {
    try {
      await captureHold(
        order.stripePaymentIntentId,
        charge.captureCents < order.totalCents ? charge.captureCents : undefined,
      );
    } catch {
      throw new ShopError("El banco no ha dejado cobrar la reserva. Si han pasado unos 7 días, la retención caduca y hay que repetir el pedido.");
    }
  }
  const confirmed = await markConfirmed(
    id,
    origin,
    true,
    charge.quote.totalCents <= order.totalCents
      ? {
          goodsGrossCents: charge.quote.goodsGrossCents,
          goodsChargeCents: charge.quote.goodsChargeCents,
          shippingGrossCents: charge.quote.shippingGrossCents,
          shippingChargeCents: charge.quote.shippingChargeCents,
          ivaCents: charge.quote.ivaCents,
          totalCents: charge.quote.totalCents,
        }
      : undefined,
  );
  if (!confirmed || confirmed.status !== "confirmed") throw new ShopError("No he podido confirmar el pedido.");
  return confirmed;
}

function applyReservedPayment(order: Order, index: number, paymentIntentId = "") {
  const item = order.lines[index];
  if (!item || item.stock !== "reserved") return false;
  const firstShipment = order.goodsChargeCents === 0 && order.totalCents === 0;
  item.stock = "yes";
  item.reservePayUrl = "";
  if (paymentIntentId) item.reservePaymentIntentId = paymentIntentId;
  const gross = item.unitGrossCents * item.qty;
  order.goodsGrossCents += gross;
  order.goodsChargeCents += item.lineChargeCents;
  order.totalCents += item.lineChargeCents;
  if (!order.exempt) order.ivaCents += gross - baseFromGross(gross);
  if (firstShipment && order.shippingChargeCents > 0) {
    order.totalCents += order.shippingChargeCents;
    if (!order.exempt) order.ivaCents += order.shippingGrossCents - baseFromGross(order.shippingGrossCents);
  }
  return true;
}

export async function chargeReserved(id: string, index: number, origin: string) {
  const order = await getOrder(id);
  if (!order || (order.status !== "confirmed" && order.status !== "shipped")) {
    throw new ShopError("Primero cobra lo confirmado. La reserva se cobra después.");
  }
  const line = order.lines[index];
  if (!line || line.stock !== "reserved") throw new ShopError("Ese artículo no está reservado.");
  if (order.paymentMode === "local") {
    const saved = await patchOrder(id, (current) => {
      applyReservedPayment(current, index);
    });
    if (!saved || saved.lines[index]?.stock !== "yes") throw new ShopError("No he podido anotar el cobro de la reserva.");
    return { url: "" };
  }
  if (line.reservePayUrl) return { url: line.reservePayUrl };
  let url = "";
  try {
    const shippingCents = order.goodsChargeCents === 0 && order.totalCents === 0 ? order.shippingChargeCents : 0;
    url = await createReserveCheckout({
      amount: line.lineChargeCents,
      shippingCents,
      email: order.email,
      orderId: order.id,
      lineIndex: index,
      name: `${line.qty} × ${line.name}, color ${line.color}`,
      successUrl: `${origin}/api/shop/reserva?order=${order.id}&line=${index}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/tienda/pedido/${order.id}`,
    });
  } catch {
    throw new ShopError("No he podido preparar el cobro de la reserva.");
  }
  await patchOrder(id, (current) => {
    const item = current.lines[index];
    if (item && item.stock === "reserved") item.reservePayUrl = url;
  });
  return { url };
}

export async function settleReservedCheckout(orderId: string, index: number, sessionId: string) {
  const session = await stripeClient().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return false;
  if (session.metadata?.orderId !== orderId || session.metadata?.lineIndex !== String(index)) return false;
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || "";
  const saved = await patchOrder(orderId, (current) => {
    applyReservedPayment(current, index, paymentIntentId);
  });
  return Boolean(saved);
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
  return mailOrder(order, "shipped", origin);
}

export async function refundOrder(id: string, origin: string) {
  const existing = await getOrder(id);
  if (!existing || (existing.status !== "confirmed" && existing.status !== "shipped")) {
    throw new ShopError("Este pedido no se puede reembolsar.");
  }
  if (existing.paymentMode === "stripe" && existing.stripePaymentIntentId) {
    try {
      const hold = await readHold(existing.stripePaymentIntentId);
      if (hold.status === "succeeded") await refundHold(existing.stripePaymentIntentId);
      for (const line of existing.lines) {
        if (line.reservePaymentIntentId) await refundHold(line.reservePaymentIntentId);
      }
    } catch {
      throw new ShopError("El banco no ha dejado devolver el cobro.");
    }
  }
  let changed = false;
  const order = await patchOrder(id, (current) => {
    if (current.status !== "confirmed" && current.status !== "shipped") return;
    current.status = "refunded";
    current.refundedAt = stamp();
    changed = true;
  });
  if (!changed || !order) throw new ShopError("No he podido reembolsar el pedido.");
  await mailOrder(order, "refunded", origin);
  return order;
}

export async function voidOrder(id: string, origin: string) {
  const order = await getOrder(id);
  if (!order) throw new ShopError("Ese pedido ya no está.");
  if (order.status === "confirmed" || order.status === "shipped") return refundOrder(id, origin);
  if (order.status === "authorized" || order.status === "pending_payment") return releaseOrder(id, origin);
  throw new ShopError("Este pedido ya está anulado.");
}

export async function deleteOrder(id: string, origin: string) {
  const order = await getOrder(id);
  if (!order) throw new ShopError("Ese pedido ya no está.");
  if (order.status === "confirmed" || order.status === "shipped") {
    throw new ShopError("Anula el pedido antes de borrarlo, para devolver el dinero.");
  }
  if (order.status === "authorized" || order.status === "pending_payment") await releaseOrder(id, origin);
  const removed = await mutateShop((db) => {
    const index = db.orders.findIndex((item) => item.id === id);
    if (index < 0) return false;
    db.orders.splice(index, 1);
    return true;
  });
  if (!removed) throw new ShopError("No he podido borrar el pedido.");
}

export async function setOrderArchived(id: string, archived: boolean) {
  const saved = await patchOrder(id, (current) => {
    current.archivedAt = archived ? stamp() : "";
  });
  if (!saved) throw new ShopError("No he podido archivar el pedido.");
  return saved;
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
