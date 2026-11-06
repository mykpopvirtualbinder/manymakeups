import { LegalDoc } from "@/app/components/LegalDoc";
import { PolicyBody } from "@/app/components/shop/PolicyBody";
import { getLocale, getMessages, pageMeta } from "@/lib/i18n";
import { policyDate } from "@/lib/shop/policy-types";
import { returnsPolicy } from "@/lib/shop/policy-returns";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const doc = returnsPolicy(locale);
  return pageMeta({ path: "/devoluciones", title: doc.title, description: doc.description });
}

export default async function DevolucionesPage() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const doc = returnsPolicy(locale);
  const date = policyDate[locale];
  return (
    <LegalDoc kicker={t.legal.kicker} title={doc.title} updated={date.date} updatedLabel={date.label}>
      <PolicyBody doc={doc} locale={locale} />
    </LegalDoc>
  );
}
