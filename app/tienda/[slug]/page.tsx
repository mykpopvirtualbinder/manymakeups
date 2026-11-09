import { ProductPurchase } from "@/app/components/shop/ProductPurchase";
import { ProductStory } from "@/app/components/shop/ProductStory";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { ShopJsonLd } from "@/app/components/shop/ShopJsonLd";
import { getProduct, productSeoDescription, productSeoTitle, productTitle, products } from "@/lib/shop/catalog";
import { shopIntro } from "@/lib/shop/intro";
import { formatMoney } from "@/lib/shop/quote";
import { getLocale, localePath, pageMeta } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getLocale();
  const product = getProduct((await params).slug);
  if (!product) return {};
  return pageMeta({
    path: `/tienda/${product.slug}`,
    title: productSeoTitle(product, locale),
    description: productSeoDescription(product, locale),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const copy = shopIntro[locale];
  const shopPath = localePath(locale, "/tienda");
  const productPath = localePath(locale, `/tienda/${product.slug}`);
  const seoTitle = productSeoTitle(product, locale);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: copy.crumbHome, item: `${site.url}${localePath(locale, "/")}` },
          { "@type": "ListItem", position: 2, name: copy.crumbShop, item: `${site.url}${shopPath}` },
          { "@type": "ListItem", position: 3, name: seoTitle, item: `${site.url}${productPath}` },
        ],
      },
      {
        "@type": "Product",
        name: seoTitle,
        description: productSeoDescription(product, locale),
        category: copy.crumbShop,
        material: locale === "en" ? "Natural REMY hair" : locale === "fr" ? "Cheveux naturels REMY" : "Cabello natural REMY",
        image: `${site.url}/shop/carta.jpg`,
        brand: { "@type": "Brand", name: site.name },
        offers: {
          "@type": "Offer",
          url: `${site.url}${productPath}`,
          priceCurrency: "EUR",
          price: (product.priceCents / 100).toFixed(2),
          availability: "https://schema.org/PreOrder",
          seller: { "@id": `${site.url}/tienda#shop` },
        },
      },
    ],
  };

  return (
    <ShopFrame
      kicker={copy.crumbShop}
      title={productTitle(product, locale)}
      lead={seoTitle}
      crumb={[
        { href: localePath(locale, "/"), label: copy.crumbHome },
        { href: shopPath, label: copy.crumbShop },
        { href: productPath, label: productTitle(product, locale) },
      ]}
    >
      <ShopJsonLd data={graph} />
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
