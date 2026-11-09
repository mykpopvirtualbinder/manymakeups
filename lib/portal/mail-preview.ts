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
const ORDER_SUBJECT = "Ejemplo · Pedido P-2026-0005";

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
  const text = [
    "Este mensaje es un ejemplo del correo que recibiría la clienta. No es un mensaje real y no sale del ordenador. El asunto real sería Pedido P-2026-0005.",
    "Tu pedido P-2026-0005 está confirmado. El importe de 159,85 € queda cobrado.",
    "Queda reservado 77,35 €, sin cobrar todavía. Ese importe se cobra cuando haya stock.",
    "- 1 x Color uniforme, 50 cm · 200 g · 9 capas, color 04\n- 1 x Color uniforme, 50 cm · 60 g · 1 capa, color 613 (reservado, se cobra cuando haya stock)",
    "Ya ha salido. Mensajería: Correos. Código de seguimiento: PQ123456789ES.",
    "https://www.manymakeups.com/tienda/pedido/muestra-0005",
  ].join("\n\n");
  const html = text
    .split("\n\n")
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br>")}</p>`)
    .join("");
  return {
    ...orderPreviewSummary(),
    text,
    html,
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
