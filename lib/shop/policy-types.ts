import type { Locale } from "@/lib/i18n/config";

export const policyDate: Record<Locale, { label: string; date: string }> = {
  es: { label: "Última actualización", date: "6 de noviembre de 2026" },
  en: { label: "Last updated", date: "6 November 2026" },
  fr: { label: "Dernière mise à jour", date: "6 novembre 2026" },
};

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "link"; before: string; href: string; label: string; after?: string }
  | { type: "address" };

export type PolicySection = { heading: string; blocks: PolicyBlock[] };

export type PolicyDoc = {
  title: string;
  description: string;
  sections: PolicySection[];
};
