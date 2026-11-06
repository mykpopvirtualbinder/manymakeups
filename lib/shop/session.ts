import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getCustomer } from "./store";

export const SHOP_COOKIE = "mm_tienda";
const MAX_AGE = 60 * 60 * 24 * 30;

export type ShopSession = {
  sub: string;
  email: string;
  name: string;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") throw new Error("Falta AUTH_SECRET");
    return new TextEncoder().encode("manymakeups-dev-secret-not-for-prod");
  }
  return new TextEncoder().encode(secret);
}

export async function signShopSession(payload: ShopSession) {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function readShopToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email, name: payload.name } satisfies ShopSession;
  } catch {
    return null;
  }
}

export async function getShopSession() {
  const token = (await cookies()).get(SHOP_COOKIE)?.value;
  if (!token) return null;
  return readShopToken(token);
}

export async function setShopCookie(session: ShopSession) {
  const token = await signShopSession(session);
  (await cookies()).set(SHOP_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearShopCookie() {
  (await cookies()).delete(SHOP_COOKIE);
}

export async function getShopCustomer() {
  const session = await getShopSession();
  if (!session) return null;
  return getCustomer(session.sub);
}
