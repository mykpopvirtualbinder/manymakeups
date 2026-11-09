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
  const backTo = String(form.get("return") || "");
  const listBack = backTo === "archivo" ? "/privado/tienda?archivo=1" : backTo === "clientes" ? "/privado/tienda/clientes" : "/privado/tienda";
  const ids = [...new Set(form.getAll("orderId").map((value) => String(value).trim()).filter(Boolean))];
  const back = fromList ? listBack : `/privado/tienda/${ids[0] || id}`;
  if (String(form.get("bulk") || "") === "1") {
    if (!ids.length) return go(request, withQuery(back, "error", "Selecciona al menos un pedido."));
    if (action !== "void" && action !== "delete" && action !== "archive" && action !== "unarchive") {
      return go(request, withQuery(back, "error", "Acción no reconocida."));
    }
    const errors: string[] = [];
    for (const orderId of ids) {
      try {
        await runOrderAction(action, orderId, origin);
      } catch (err) {
        const message = err instanceof ShopError ? err.message : "No he podido actualizar un pedido.";
        if (!errors.includes(message)) errors.push(message);
      }
    }
    if (errors.length) return go(request, withQuery(back, "error", errors.join(" ")));
    return go(request, withQuery(back, "ok", "1"));
  }
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
    else if (action === "void" || action === "delete" || action === "archive" || action === "unarchive") await runOrderAction(action, id, origin);
    else return go(request, withQuery(back, "error", "Acción no reconocida."));
    return go(request, withQuery(back, "ok", "1"));
  } catch (err) {
    const message = err instanceof ShopError ? err.message : "No he podido actualizar el pedido.";
    return go(request, withQuery(back, "error", message));
  }
}

async function runOrderAction(action: string, orderId: string, origin: string) {
  if (action === "void") await voidOrder(orderId, origin);
  else if (action === "delete") await deleteOrder(orderId, origin);
  else if (action === "archive") await setOrderArchived(orderId, true);
  else if (action === "unarchive") await setOrderArchived(orderId, false);
}

function withQuery(path: string, key: string, value: string) {
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}${key}=${encodeURIComponent(value)}`;
}
