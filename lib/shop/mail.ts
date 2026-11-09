import { site } from "@/lib/site";
import { formatMoney } from "./quote";
import type { Order } from "./types";

function lineNote(stock: Order["lines"][number]["stock"]) {
  if (stock === "no") return " (sin stock, no se cobra)";
  if (stock === "reserved") return " (reservado, se cobra cuando haya stock)";
  return "";
}

function lines(order: Order) {
  return order.lines
    .map((line) => `- ${line.qty} x ${line.name}, color ${line.color}${lineNote(line.stock)}`)
    .join("\n");
}

function reservedNote(order: Order) {
  const reserved = order.lines.filter((line) => line.stock === "reserved");
  if (!reserved.length) return "";
  const amount = formatMoney(reserved.reduce((sum, line) => sum + line.lineChargeCents, 0));
  return `\n\nQueda reservado ${amount}, sin cobrar todavía. Ese importe se cobra cuando haya stock.`;
}

export async function sendShopMail(to: string, subject: string, text: string) {
  const key = (process.env.RESEND_API_KEY || "").trim();
  if (!key) return false;
  const from = process.env.MAIL_FROM || `Many Makeups <${site.email}>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: site.email,
      subject,
      text,
    }),
  });
  return response.ok;
}

export async function mailOrder(order: Order, kind: "authorized" | "confirmed" | "cancelled" | "shipped" | "refunded", origin: string) {
  const href = `${origin}/tienda/pedido/${order.id}`;
  const studio = `${origin}/privado/tienda/${order.id}`;
  const total = formatMoney(order.totalCents);
  const who = `${order.firstName} ${order.lastName}`;
  const customerText = {
    authorized:
      order.paymentMode === "local"
        ? `He anotado tu pedido ${order.number} por ${total}. Estamos probando la tienda en local, así que no se ha tocado ninguna tarjeta.\n\n${lines(order)}\n\nPuedes verlo aquí: ${href}`
        : `He reservado ${total} de tu pedido ${order.number}. Todavía no está cobrado. En cuanto compruebe que el modelo y el color están disponibles, confirmo el cargo. Si no lo están, anulo la reserva y no se te cobra nada.\n\n${lines(order)}\n\nPuedes verlo aquí: ${href}`,
    confirmed:
      order.totalCents > 0
        ? `Ya está confirmado tu pedido ${order.number}. El importe de ${total} queda cobrado y preparo el envío.${reservedNote(order)}\n\n${lines(order)}\n\n${href}`
        : `He dejado tu pedido ${order.number} reservado, sin cobrar de momento.${reservedNote(order)}\n\n${lines(order)}\n\n${href}`,
    cancelled: `He anulado tu pedido ${order.number}. No se ha cobrado nada: si viste una retención en la tarjeta, el banco la libera solo.\n\n${href}`,
    shipped: `Tu pedido ${order.number} está confirmado. ${order.totalCents > 0 ? `El importe de ${total} queda cobrado.` : "De momento no se ha cobrado nada."}${reservedNote(order)}\n\n${lines(order)}\n\nYa ha salido.${order.carrier ? ` Mensajería: ${order.carrier}.` : ""} Código de seguimiento: ${order.tracking}.\n\n${href}`,
    refunded: `He devuelto el importe de tu pedido ${order.number} (${total}). El abono llega a la misma tarjeta.\n\n${href}`,
  }[kind];
  const tracking = order.tracking ? `\nSeguimiento: ${order.carrier ? `${order.carrier} ` : ""}${order.tracking}` : "";
  const studioText = `Pedido ${order.number} de ${who} (${order.email}, ${order.phone}). Estado: ${kind}. Total ${total}.${order.exempt ? " Sin IVA (Canarias, Ceuta o Melilla)." : ""}\n\n${lines(order)}\n\n${order.address.street}, ${order.address.extra}\n${order.address.postalCode} ${order.address.city}, ${order.address.province}${tracking}\n\n${studio}`;
  const [customerSent] = await Promise.all([
    sendShopMail(order.email, `Pedido ${order.number}`, customerText),
    sendShopMail(site.email, `Tienda · ${order.number} · ${kind}`, studioText),
  ]);
  return customerSent;
}
