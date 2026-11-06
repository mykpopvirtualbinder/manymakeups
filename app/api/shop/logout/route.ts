import { go } from "@/lib/portal/http";
import { clearShopCookie } from "@/lib/shop/session";

export async function POST(request: Request) {
  await clearShopCookie();
  return go(request, "/tienda");
}
