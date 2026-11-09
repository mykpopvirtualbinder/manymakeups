import { go } from "@/lib/portal/http";
import { settleReservedCheckout } from "@/lib/shop/orders";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order") || "";
  const index = Number(url.searchParams.get("line"));
  const sessionId = url.searchParams.get("session_id") || "";
  if (orderId && sessionId && Number.isInteger(index) && index >= 0) {
    try {
      await settleReservedCheckout(orderId, index, sessionId);
    } catch {
      /* La clienta vuelve al pedido aunque el apunte falle; se puede reintentar. */
    }
  }
  return go(request, `/tienda/pedido/${orderId || ""}`);
}
