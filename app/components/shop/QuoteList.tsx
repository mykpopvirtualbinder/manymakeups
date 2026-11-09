"use client";

import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney, type Quote } from "@/lib/shop/quote";

const copy: Record<Locale, { goods: string; catalogue: string; vatOff: string; shipping: string; shippingExempt: string; free: string; vat: string; exempt: string; vatShare: string; total: string }> = {
  es: { goods: "Productos, IVA incluido", catalogue: "Catálogo con IVA", vatOff: "IVA descontado", shipping: "Envío", shippingExempt: "Envío sin IVA", free: "Gratis", vat: "IVA", exempt: "Exento", vatShare: "Del total, IVA 21 %", total: "Total" },
  en: { goods: "Products, VAT included", catalogue: "Catalogue with VAT", vatOff: "VAT deducted", shipping: "Delivery", shippingExempt: "Delivery without VAT", free: "Free", vat: "VAT", exempt: "Exempt", vatShare: "Of the total, VAT 21%", total: "Total" },
  fr: { goods: "Produits, TVA incluse", catalogue: "Catalogue TTC", vatOff: "TVA déduite", shipping: "Livraison", shippingExempt: "Livraison hors TVA", free: "Offerte", vat: "TVA", exempt: "Exonérée", vatShare: "Dont TVA 21 %", total: "Total" },
};

export function QuoteList({ quote }: { quote: Quote }) {
  const { locale } = useI18n();
  const labels = copy[locale];
  return (
    <dl className="space-y-2 text-sm text-ink">
      {quote.exempt ? (
        <>
          <Row label={labels.catalogue} value={formatMoney(quote.goodsGrossCents)} />
          <Row
            label={labels.vatOff}
            value={`− ${formatMoney(quote.goodsGrossCents - quote.goodsChargeCents + quote.shippingGrossCents - quote.shippingChargeCents)}`}
          />
        </>
      ) : (
        <Row label={labels.goods} value={formatMoney(quote.goodsChargeCents)} />
      )}
      <Row
        label={quote.exempt ? labels.shippingExempt : labels.shipping}
        value={quote.freeShipping ? labels.free : formatMoney(quote.shippingChargeCents)}
      />
      {quote.exempt ? (
        <Row label={labels.vat} value={labels.exempt} />
      ) : (
        <Row label={labels.vatShare} value={formatMoney(quote.ivaCents)} />
      )}
      <div className="flex items-baseline justify-between gap-6 border-t border-ink/10 pt-3 font-serif text-3xl">
        <dt>{labels.total}</dt>
        <dd>{formatMoney(quote.totalCents)}</dd>
      </div>
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-ash">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
