import { brandedClientEmail } from "@/lib/portal/mail-html";
import { MAIL_FONT } from "@/lib/portal/mail-text";
import { site } from "@/lib/site";
import { formatMoney } from "./quote";
import type { LineStock, Order } from "./types";

export const SHIPPED_SUBJECT = "Tu pedido en Many Makeups está confirmado.";

type LetterLine = { qty: number; name: string; color: string; stock?: LineStock; lineChargeCents?: number };

function lineLabel(stock: LineStock | undefined) {
  if (stock === "no") return "Sin stock, no se cobra";
  if (stock === "reserved") return "Reservado, se cobra cuando haya stock";
  return "Confirmado";
}

export function correosTrackingUrl(code: string) {
  return `https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=${encodeURIComponent(code.trim())}`;
}

export function shipmentLetter(
  input: {
    firstName: string;
    number: string;
    totalCents: number;
    carrier: string;
    tracking: string;
    address?: string;
    lines: LetterLine[];
  },
  href: string,
) {
  const name = input.firstName.trim();
  const carrier = input.carrier.trim() || "Correos";
  const correos = carrier.toLowerCase() === "correos";
  const reservedCents = input.lines
    .filter((line) => line.stock === "reserved")
    .reduce((sum, line) => sum + (line.lineChargeCents || 0), 0);
  const rows = [
    ...input.lines.map((line) => ({
      icon: "service" as const,
      label: lineLabel(line.stock),
      value: `${line.qty} × ${line.name}. Color ${line.color}. ${formatMoney(line.lineChargeCents || 0)}`,
    })),
    { icon: "amount" as const, label: "Cobrado", value: formatMoney(input.totalCents) },
    ...(reservedCents > 0 ? [{ icon: "amount" as const, label: "Reservado", value: `${formatMoney(reservedCents)}. Se cobra cuando haya stock.` }] : []),
    ...(input.address ? [{ icon: "place" as const, label: "Dirección", value: input.address }] : []),
  ];
  const tracking = correos
    ? { text: "Se ha enviado a través de Correos. Código de seguimiento:", link: { href: correosTrackingUrl(input.tracking), label: input.tracking } }
    : { text: `Se ha enviado a través de ${carrier}. Código de seguimiento: ${input.tracking}` };
  return brandedClientEmail({
    blocks: [
      { text: `Hola ${name},` },
      { text: `Sólo te escribimos para confirmarte que tu pedido ${input.number} ya se ha completado y está de camino a tu dirección.` },
      { details: { title: "Detalles del pedido", rows } },
      tracking,
      {
        text: "Recuerda que, si cuando llegue tu pedido quieres hacer cualquier reclamación, vamos a pedirte un vídeo de unboxing completo, sin cortes y abriendo el paquete desde cero.",
        quote: true,
      },
    ],
    signoff: ["Muchas gracias por tu pedido."],
    footer: { href, label: "Ver tu pedido" },
    fontFamily: `font-family:${MAIL_FONT};`,
    fontFace: "Outfit, Avenir Next, Century Gothic, Trebuchet MS, sans-serif",
  });
}

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

export async function sendShopMail(to: string, subject: string, text: string, html?: string) {
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
      ...(html ? { html } : {}),
    }),
  });
  return response.ok;
}

export async function mailOrder(order: Order, kind: "authorized" | "confirmed" | "cancelled" | "shipped" | "refunded", origin: string) {
  const href = `${origin}/tienda/pedido/${order.id}`;
  const studio = `${origin}/privado/tienda/${order.id}`;
  const total = formatMoney(order.totalCents);
  const who = `${order.firstName} ${order.lastName}`;
  const address = [order.address.street, order.address.extra].filter(Boolean).join(", ");
  const shipped =
    kind === "shipped"
      ? shipmentLetter(
          {
            ...order,
            address: `${address}. ${order.address.postalCode} ${order.address.city}`,
          },
          href,
        )
      : null;
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
    shipped: shipped?.text || "",
    refunded: `He devuelto el importe de tu pedido ${order.number} (${total}). El abono llega a la misma tarjeta.\n\n${href}`,
  }[kind];
  const tracking = order.tracking ? `\nSeguimiento: ${order.carrier ? `${order.carrier} ` : ""}${order.tracking}` : "";
  const studioText = `Pedido ${order.number} de ${who} (${order.email}, ${order.phone}). Estado: ${kind}. Total ${total}.${order.exempt ? " Sin IVA (Canarias, Ceuta o Melilla)." : ""}\n\n${lines(order)}\n\n${order.address.street}, ${order.address.extra}\n${order.address.postalCode} ${order.address.city}, ${order.address.province}${tracking}\n\n${studio}`;
  const subject = kind === "shipped" ? SHIPPED_SUBJECT : `Pedido ${order.number}`;
  const [customerSent] = await Promise.all([
    sendShopMail(order.email, subject, customerText, shipped?.html),
    sendShopMail(site.email, `Tienda · ${order.number} · ${kind}`, studioText),
  ]);
  return customerSent;
}
