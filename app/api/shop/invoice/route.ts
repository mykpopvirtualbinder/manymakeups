import { requireShopStaff } from "@/lib/shop/access";
import { renderInvoice } from "@/lib/shop/invoice";
import { getShopSession } from "@/lib/shop/session";
import { getOrder } from "@/lib/shop/store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const order = await getOrder(url.searchParams.get("id") || "");
  if (!order) return new Response("No encontrada", { status: 404 });
  const admin = await requireShopStaff();
  const customer = await getShopSession();
  if (!admin && customer?.sub !== order.customerId) return new Response("No autorizada", { status: 401 });

  const credit = url.searchParams.get("tipo") === "rectificativa";
  if (credit && !order.creditNumber) return new Response("Sin rectificativa", { status: 404 });
  if (!credit && !order.invoiceNumber) return new Response("Sin factura", { status: 404 });

  const pdf = await renderInvoice(order, credit ? "credit" : "invoice");
  const filename = credit ? order.creditNumber : order.invoiceNumber;
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}.pdf"`,
    },
  });
}
