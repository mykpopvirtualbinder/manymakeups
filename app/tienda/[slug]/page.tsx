import { ProductPurchase } from "@/app/components/shop/ProductPurchase";
import { ProductStory } from "@/app/components/shop/ProductStory";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { getProduct, productName, productSummary, productTitle, products } from "@/lib/shop/catalog";
import { shopIntro } from "@/lib/shop/intro";
import { formatMoney } from "@/lib/shop/quote";
import { getLocale } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getLocale();
  const product = getProduct((await params).slug);
  if (!product) return {};
  const copy = shopIntro[locale];
  return {
    title: productName(product, locale),
    description: `${productName(product, locale)}. ${formatMoney(product.priceCents)}. ${copy.priceNote}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const copy = shopIntro[locale];

  return (
    <ShopFrame kicker={copy.title.replace(/\.$/, "")} title={productTitle(product, locale)} lead={productSummary(product, locale)}>
      <ProductPurchase
        productId={product.id}
        lengthCm={product.lengthCm}
        grams={product.grams}
        layers={product.layers}
        chartAlt={copy.chartAlt}
        price={
          <>
            <p className="font-serif text-4xl">{formatMoney(product.priceCents)}</p>
            <p className="mt-2 text-sm text-ash">{copy.priceNote}</p>
          </>
        }
        story={<ProductStory product={product} />}
      />
    </ShopFrame>
  );
}
