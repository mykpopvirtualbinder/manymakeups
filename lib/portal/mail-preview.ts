import type { MailRecord, MailSummary } from "./mail-store";

export const PREVIEW_MAIL_ID = "preview-lectura";

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
