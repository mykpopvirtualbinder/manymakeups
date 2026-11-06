import { findProvince } from "./places";

const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function clip(value: string, max: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

export function dniIssue(value: string, required: boolean) {
  const raw = value.toUpperCase().replace(/[\s.-]/g, "");
  if (!raw) return required ? "El DNI o NIE es obligatorio." : null;
  let digits = "";
  if (/^[XYZ]\d{7}[A-Z]$/.test(raw)) {
    digits = `${"XYZ".indexOf(raw[0])}${raw.slice(1, 8)}`;
  } else if (/^\d{8}[A-Z]$/.test(raw)) {
    digits = raw.slice(0, 8);
  } else {
    return "El DNI o NIE no tiene un formato válido.";
  }
  if (DNI_LETTERS[Number(digits) % 23] !== raw.at(-1)) {
    return "La letra del DNI o NIE no coincide.";
  }
  return null;
}

export function normalizeDni(value: string) {
  return value.toUpperCase().replace(/[\s.-]/g, "");
}

export function phoneIssue(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("34") && digits.length === 11 ? digits.slice(2) : digits;
  if (!/^[6-9]\d{8}$/.test(local)) return "Introduce un teléfono español de 9 dígitos.";
  return null;
}

export function addressIssue(input: {
  street: string;
  extra: string;
  postalCode: string;
  city: string;
  province: string;
}) {
  if (input.street.trim().length < 3) return "Escribe la calle y el número.";
  if (!input.extra.trim()) return "Indica el piso, la puerta o si es una casa.";
  if (input.city.trim().length < 2) return "Escribe la población.";
  if (!/^\d{5}$/.test(input.postalCode.trim())) return "El código postal tiene 5 dígitos.";
  const province = findProvince(input.province);
  if (!province) return "Elige una provincia.";
  if (!province.prefixes.some((prefix) => input.postalCode.trim().startsWith(prefix))) {
    return "El código postal no corresponde a la provincia.";
  }
  return null;
}

export function personIssue(firstName: string, lastName: string) {
  if (firstName.trim().length < 2) return "Escribe tu nombre.";
  if (lastName.trim().length < 2) return "Escribe tus apellidos.";
  return null;
}

export function safeNext(value: unknown, fallback = "/tienda/cuenta") {
  const path = typeof value === "string" ? value : "";
  if (!path.startsWith("/tienda") || path.startsWith("//") || path.includes("\\")) return fallback;
  return path;
}
