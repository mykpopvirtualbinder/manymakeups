export type CartLine = {
  productId: string;
  color: string;
  qty: number;
};

const KEY = "mm-shop-cart";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]") as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === "string" &&
        typeof line.color === "string" &&
        Number.isInteger(line.qty) &&
        line.qty > 0,
    );
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("mm-cart"));
}

export function addToCart(line: CartLine) {
  const lines = readCart();
  const found = lines.find((item) => item.productId === line.productId && item.color === line.color);
  if (found) found.qty = Math.min(5, found.qty + line.qty);
  else lines.push({ ...line, qty: Math.min(5, line.qty) });
  writeCart(lines);
}
