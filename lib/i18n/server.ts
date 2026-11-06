import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";
import { stripLocale } from "./path";

export async function getLocale(): Promise<Locale> {
  const carried = (await headers()).get("x-mm-locale");
  if (carried && isLocale(carried)) return carried;
  const value = (await cookies()).get("NEXT_LOCALE")?.value ?? defaultLocale;
  return isLocale(value) ? value : defaultLocale;
}

export async function getRequestPathname() {
  const carried = (await headers()).get("x-mm-path");
  if (carried) return stripLocale(carried);
  const value = (await cookies()).get("x-pathname")?.value ?? "/";
  return stripLocale(value);
}
