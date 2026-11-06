import { go } from "@/lib/portal/http";
import { requireShopStaff } from "@/lib/shop/access";
import { ShopError, confirmOrder, refundOrder, releaseOrder, setLineStock, shipOrder } from "@/lib/shop/orders";

export async function POST(request: Request) {
  const admin = await requireShopStaff();
  if (!admin) return go(request, "/privado");
  const form = await request.formData();
  const id = String(form.get("orderId") || "");
  const action = String(form.get("action") || "");
  const origin = new URL(request.url).origin;
  const back = `/privado/tienda/${id}`;
  try {
    if (action === "confirm") await confirmOrder(id, origin);
    else if (action === "stock") {
      const stock = String(form.get("stock") || "");
      const index = Number(form.get("index"));
      if (stock !== "yes" && stock !== "no") return go(request, `${back}?error=${encodeURIComponent("Indica si hay stock.")}`);
      await setLineStock(id, index, stock);
    } else if (action === "release") await releaseOrder(id, origin);
    else if (action === "ship") await shipOrder(id, String(form.get("tracking") || ""), String(form.get("carrier") || ""), origin);
    else if (action === "refund") await refundOrder(id, origin);
    else return go(request, `${back}?error=${encodeURIComponent("Acción no reconocida.")}`);
    return go(request, `${back}?ok=1`);
  } catch (err) {
    const message = err instanceof ShopError ? err.message : "No he podido actualizar el pedido.";
    return go(request, `${back}?error=${encodeURIComponent(message)}`);
  }
}
