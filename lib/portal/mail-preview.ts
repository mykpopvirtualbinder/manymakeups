import { SHIPPED_SUBJECT, shipmentLetter } from "@/lib/shop/mail";
import type { MailRecord, MailSummary } from "./mail-store";

export const PREVIEW_MAIL_ID = "preview-lectura";
export const ORDER_PREVIEW_ID = "preview-pedido";

export function mailPreviewEnabled() {
  return process.env.NODE_ENV !== "production";
}

const FROM = "Lucía Ferrer <lucia.ferrer@example.com>";
const TO = "info@manymakeups.com";
const SUBJECT = "Ejemplo · Consulta de novia para el 12 de junio";

export function previewSummary(): MailSummary {
  return {
    id: PREVIEW_MAIL_ID,
    account: "info",
    folder: "inbox",
    from: FROM,
    to: TO,
    subject: SUBJECT,
    seen: false,
    files: 0,
    createdAt: "2026-11-09T09:30:00.000Z",
    messageId: "<preview-lectura@local>",
  };
}

export function previewMessage(): MailRecord {
  const text = [
    "Este mensaje es un ejemplo para ver cómo se lee un correo. No es un mensaje real y no sale del ordenador.",
    "Hola Ana:",
    "Me caso el sábado 12 de junio de 2027 en una masía de Benicàssim. La ceremonia es a las 12:30 y necesitaríamos estar listas sobre las 10:00. Seríamos la novia, mi madre y una amiga.",
    "Quería preguntarte por maquillaje y peinado para las tres, y si hay hueco para una prueba unas semanas antes. El vestido es sencillo, con escote barco, y me gustaría un maquillaje que aguante la comida y el baile sin tener que retocarlo a cada hora.",
    "Si me dices cómo trabajas y qué fechas te quedan, te cuento el resto con calma. Mi teléfono es el 600 000 000.",
    "Un saludo,",
    "Lucía Ferrer",
  ].join("\n\n");
  const html = text
    .split("\n\n")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  return {
    ...previewSummary(),
    text,
    html,
    inReplyTo: "",
    attachments: [],
  };
}

const ORDER_FROM = "Many Makeups <info@manymakeups.com>";
const ORDER_TO = "Lucía Ferrer <lucia.ferrer@example.com>";
const ORDER_SUBJECT = SHIPPED_SUBJECT;

export function orderPreviewSummary(): MailSummary {
  return {
    id: ORDER_PREVIEW_ID,
    account: "info",
    folder: "inbox",
    from: ORDER_FROM,
    to: ORDER_TO,
    subject: ORDER_SUBJECT,
    seen: false,
    files: 0,
    createdAt: "2026-11-09T18:15:00.000Z",
    messageId: "<preview-pedido@local>",
  };
}

export function orderPreviewMessage(): MailRecord {
  const letter = shipmentLetter(
    {
      firstName: "Lucía",
      number: "P-2026-0002",
      totalCents: 7735,
      carrier: "Correos",
      tracking: "PQ123456789ES",
      address: "Calle Mayor 12, 2º. 12001 Castellón",
      lines: [
        { qty: 1, name: "Color uniforme, 50 cm · 140 g · 8 capas", color: "02", stock: "no", lineChargeCents: 12235 },
        { qty: 1, name: "Color uniforme, 50 cm · 60 g · 1 capa", color: "06", stock: "yes", lineChargeCents: 7735 },
      ],
    },
    "https://www.manymakeups.com/tienda/pedido/muestra-0002",
  );
  return {
    ...orderPreviewSummary(),
    text: letter.text,
    html: letter.html,
    inReplyTo: "",
    attachments: [],
  };
}

export function previewSummaries() {
  return [orderPreviewSummary(), previewSummary()];
}

export function previewById(id: string) {
  if (id === ORDER_PREVIEW_ID) return orderPreviewMessage();
  if (id === PREVIEW_MAIL_ID) return previewMessage();
  return null;
}
