import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TO = "lab@omyocreatorlab.com";
const FROM = "Omyo Creator Lab <lab@omyocreatorlab.com>";
const PAPER = "#fcf7f1";
const INK = "#3a342c";
const SIGN = "https://omyocreatorlab.com/brand/sign.png?v=2";
const FONT = "Outfit,'Avenir Next',Avenir,'Century Gothic','Trebuchet MS',sans-serif";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  const secret = (process.env.OMYO_CONTACT_SECRET || "").trim();
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { name?: unknown; email?: unknown; message?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const key = (process.env.OMYO_RESEND_API_KEY || "").trim();
  if (!key) return NextResponse.json({ ok: false }, { status: 503 });

  const name = String(body.name ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
  const email = String(body.email ?? "").replace(/\s+/g, " ").trim().slice(0, 160);
  const message = String(body.message ?? "").trim().slice(0, 4000);
  const lang = body.lang === "en" ? "en" : "es";
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `Omyo Creator Lab · ${name}`,
      text: [`Nombre: ${name}`, `Correo: ${email}`, "", message].join("\n"),
    }),
  });

  if (!response.ok) return NextResponse.json({ ok: false }, { status: 502 });

  const note = lang === "en"
    ? {
        subject: "The form has been sent · Omyo Creator Lab",
        hello: `Hello ${name},`,
        line: "The form has been sent. We will contact you as soon as possible.",
      }
    : {
        subject: "El formulario ha sido enviado · Omyo Creator Lab",
        hello: `Hola ${name},`,
        line: "El formulario ha sido enviado. Te contactaremos lo antes posible.",
      };
  const type = `font-family:${FONT};font-size:16px;line-height:1.65;color:${INK};text-align:justify;hyphens:auto;`;
  const face = `@font-face{font-family:Outfit;font-style:normal;font-weight:400;src:url('https://www.manymakeups.com/brand/fonts/outfit-400.woff2') format('woff2');}`;
  const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${face} body,table,td,p{${type}}</style></head><body style="margin:0;padding:0;background:${PAPER};${type}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" align="left" style="background:${PAPER};${type}"><tr><td align="left" style="padding:28px 24px 40px;background:${PAPER};${type}"><font face="Outfit, Avenir Next, Century Gothic, Trebuchet MS, sans-serif"><p style="margin:0 0 16px;${type}">${escapeHtml(note.hello)}</p><p style="margin:0;${type}">${escapeHtml(note.line)}</p><img src="${SIGN}" alt="Staff Omyo Creator Lab" width="475" height="238" style="display:block;width:475px;max-width:100%;height:auto;border:0;margin:28px 0 0;background:${PAPER};" /></font></td></tr></table></body></html>`;
  const confirm = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      reply_to: TO,
      subject: note.subject,
      text: `${note.hello}\n\n${note.line}\n\nOmyo Creator Lab\n${TO}`,
      html,
    }),
  });
  if (!confirm.ok) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: true });
}
