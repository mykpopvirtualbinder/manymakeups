import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";
import { site } from "@/lib/site";
import { EXEMPT_INVOICE_NOTE, formatAmount } from "./quote";
import type { Order } from "./types";

const INK = rgb(0.1, 0.086, 0.075);
const ASH = rgb(0.43, 0.39, 0.36);

function money(cents: number) {
  return `${formatAmount(cents)} EUR`;
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderInvoice(order: Order, kind: "invoice" | "credit" = "invoice") {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595.28, 841.89]);
  let y = 790;
  const left = 48;
  const width = 500;

  const ensure = (need: number) => {
    if (y - need > 56) return;
    page = pdf.addPage([595.28, 841.89]);
    y = 790;
  };

  const text = (value: string, options?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number }) => {
    const size = options?.size ?? 10;
    const face = options?.bold ? bold : font;
    const lines = wrap(value, face, size, width);
    ensure(lines.length * (size + 4) + (options?.gap ?? 0));
    for (const line of lines) {
      page.drawText(line, { x: left, y, size, font: face, color: options?.color ?? INK });
      y -= size + 4;
    }
    y -= options?.gap ?? 0;
  };

  const rule = () => {
    ensure(16);
    page.drawLine({ start: { x: left, y }, end: { x: left + width, y }, thickness: 0.4, color: ASH });
    y -= 16;
  };

  const title = kind === "credit" ? "FACTURA RECTIFICATIVA" : "FACTURA";
  text(site.legalName, { size: 18, bold: true, gap: 4 });
  text(`${site.legalPerson} · NIF ${site.nif}`);
  text(`${site.streetAddress}, ${site.postalCode} ${site.city}, ${site.region}`);
  text(`${site.email} · ${site.phoneDisplay}`, { gap: 10 });
  text(title, { size: 16, bold: true, gap: 2 });
  if (kind === "credit") {
    text(`Número ${order.creditNumber}`);
    text(`Fecha ${formatDate(order.creditIssuedAt)}`);
    text(`Rectifica la factura ${order.invoiceNumber} de ${formatDate(order.invoiceIssuedAt)}`, { gap: 8 });
    text("Se anula íntegramente la factura original por cancelación o devolución del pedido.", { gap: 8 });
  } else {
    text(`Número ${order.invoiceNumber}`);
    text(`Fecha ${formatDate(order.invoiceIssuedAt)}`, { gap: 4 });
    if (order.exempt) text("Documento para el envío y la aduana.", { gap: 8 });
    else y -= 6;
  }
  text(`Pedido ${order.number}`, { gap: 8 });
  text("Cliente", { bold: true, gap: 2 });
  text(`${order.firstName} ${order.lastName}`);
  if (order.dni) text(`DNI/NIE ${order.dni}`);
  text(`${order.address.street}, ${order.address.extra}`);
  text(`${order.address.postalCode} ${order.address.city}, ${order.address.province}`);
  text(`${order.email} · ${order.phone}`, { gap: 10 });
  rule();

  const sign = kind === "credit" ? -1 : 1;
  for (const line of order.lines) {
    text(`${line.qty} x ${line.name}`, { bold: true });
    text(`Color ${line.color}`, { color: ASH });
    text(money(sign * line.lineChargeCents), { gap: 6 });
  }
  text(order.shippingChargeCents ? `Envío: ${money(sign * order.shippingChargeCents)}` : "Envío: gratis", { gap: 8 });
  rule();
  if (order.exempt) {
    text("Base imponible: " + money(sign * order.totalCents));
    text("IVA: 0,00 EUR", { gap: 6 });
    text(EXEMPT_INVOICE_NOTE, { gap: 8 });
  } else {
    const base = sign * (order.totalCents - order.ivaCents);
    text(`Base imponible: ${money(base)}`);
    text(`IVA 21 %: ${money(sign * order.ivaCents)}`, { gap: 6 });
  }
  text(`Total: ${money(sign * order.totalCents)}`, { size: 13, bold: true, gap: 12 });
  if (kind === "invoice" && order.exempt) {
    text(EXEMPT_CHECKOUT(), { color: ASH, gap: 8 });
  }
  text("Forma de pago: tarjeta. El cargo se confirma cuando el estudio verifica la disponibilidad.", { color: ASH });

  const pages = pdf.getPages();
  pages.forEach((item: PDFPage, index) => {
    item.drawText(`${index + 1} / ${pages.length}`, {
      x: 500,
      y: 32,
      size: 9,
      font,
      color: ASH,
    });
  });

  return pdf.save();
}

function formatDate(value: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function EXEMPT_CHECKOUT() {
  return "Los impuestos locales (IGIC/IPSI) y los gastos aduaneros, si los hubiera, corren a cargo del comprador en la entrega.";
}
