import { formatMoney, type Quote } from "@/lib/shop/quote";

export function QuoteList({ quote }: { quote: Quote }) {
  return (
    <dl className="space-y-2 text-sm text-ink">
      {quote.exempt ? (
        <>
          <Row label="Catálogo con IVA" value={formatMoney(quote.goodsGrossCents)} />
          <Row
            label="IVA descontado"
            value={`− ${formatMoney(quote.goodsGrossCents - quote.goodsChargeCents + quote.shippingGrossCents - quote.shippingChargeCents)}`}
          />
        </>
      ) : (
        <Row label="Productos, IVA incluido" value={formatMoney(quote.goodsChargeCents)} />
      )}
      <Row
        label={quote.exempt ? "Envío sin IVA" : "Envío"}
        value={quote.freeShipping ? "Gratis" : formatMoney(quote.shippingChargeCents)}
      />
      {quote.exempt ? (
        <Row label="IVA" value="Exento" />
      ) : (
        <Row label="Del total, IVA 21 %" value={formatMoney(quote.ivaCents)} />
      )}
      <div className="flex items-baseline justify-between gap-6 border-t border-ink/10 pt-3 font-serif text-3xl">
        <dt>Total</dt>
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
