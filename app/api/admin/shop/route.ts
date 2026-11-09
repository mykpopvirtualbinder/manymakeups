import { go, requestOrigin } from "@/lib/portal/http";
import { requireShopStaff } from "@/lib/shop/access";
import { ShopError, chargeReserved, confirmOrder, deleteOrder, refundOrder, releaseOrder, setLineStock, setOrderArchived, shipOrder, voidOrder } from "@/lib/shop/orders";

export async function POST(request: Request) {
  const admin = await requireShopStaff();
  if (!admin) return go(request, "/privado");
  const form = await request.formData();
  const id = String(form.get("orderId") || "");
  const action = String(form.get("action") || "");
  const origin = requestOrigin(request);
  const fromList = String(form.get("from") || "") === "list";
  const listBack = String(form.get("return") || "") === "archivo" ? "/privado/tienda?archivo=1" : "/privado/tienda";
  const back = fromList ? listBack : `/privado/tienda/${id}`;
  try {
    if (action === "confirm") await confirmOrder(id, origin);
    else if (action === "stock") {
      const stock = String(form.get("stock") || "");
      const index = Number(form.get("index"));
      if (stock !== "yes" && stock !== "no" && stock !== "reserved") {
        return go(request, `${back}?error=${encodeURIComponent("Confirma, reserva o anula el artículo.")}`);
      }
      await setLineStock(id, index, stock);
    } else if (action === "charge-reserved") {
      const index = Number(form.get("index"));
      const result = await chargeReserved(id, index, requestOrigin(request));
      if (result.url) return go(request, `${back}?ok=1&cobro=${encodeURIComponent(result.url)}`);
    } else if (action === "release") await releaseOrder(id, origin);
    else if (action === "ship") {
      const sent = await shipOrder(id, String(form.get("tracking") || ""), String(form.get("carrier") || ""), origin);
      if (!sent) return go(request, withQuery(back, "error", "Pedido enviado. No he podido mandar el correo a la clienta."));
    }
    else if (action === "refund") await refundOrder(id, origin);
    else if (action === "void") await voidOrder(id, origin);
    else if (action === "delete") await deleteOrder(id, origin);
    else if (action === "archive") await setOrderArchived(id, true);
    else if (action === "unarchive") await setOrderArchived(id, false);
    else return go(request, withQuery(back, "error", "Acción no reconocida."));
    return go(request, withQuery(back, "ok", "1"));
  } catch (err) {
    const message = err instanceof ShopError ? err.message : "No he podido actualizar el pedido.";
    return go(request, withQuery(back, "error", message));
  }
}

function withQuery(path: string, key: string, value: string) {
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}${key}=${encodeURIComponent(value)}`;
}
