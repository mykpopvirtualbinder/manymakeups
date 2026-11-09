import { CatalogBrowser } from "@/app/components/shop/CatalogBrowser";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { ShopJsonLd } from "@/app/components/shop/ShopJsonLd";
import { getLocale, localePath, pageMeta } from "@/lib/i18n";
import { shopIntro } from "@/lib/shop/intro";
import { productSeoTitle, products } from "@/lib/shop/catalog";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const copy = shopIntro[await getLocale()];
  return pageMeta({ path: "/tienda", title: copy.seoTitle, description: copy.seoDescription });
}

export default async function ShopPage() {
  const locale = await getLocale();
  const copy = shopIntro[locale];
  const shopPath = localePath(locale, "/tienda");
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site.url}${shopPath}#page`,
        url: `${site.url}${shopPath}`,
        name: copy.seoTitle,
        description: copy.seoDescription,
        inLanguage: locale,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/tienda#shop` },
        breadcrumb: { "@id": `${site.url}${shopPath}#crumbs` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${site.url}${shopPath}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: copy.crumbHome, item: `${site.url}${localePath(locale, "/")}` },
          { "@type": "ListItem", position: 2, name: copy.crumbShop, item: `${site.url}${shopPath}` },
        ],
      },
      {
        "@type": "ItemList",
        name: copy.seoTitle,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${site.url}${localePath(locale, `/tienda/${product.slug}`)}`,
          name: productSeoTitle(product, locale),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
  return (
    <ShopFrame
      kicker={copy.kicker}
      title={copy.title}
      lead={copy.lead}
      crumb={[
        { href: localePath(locale, "/"), label: copy.crumbHome },
        { href: shopPath, label: copy.crumbShop },
      ]}
    >
      <ShopJsonLd data={graph} />
      <div className="max-w-3xl space-y-8">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            {section.heading ? <h2 className="font-serif text-2xl leading-tight text-ink md:text-3xl">{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-base leading-relaxed text-ash">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-12">
        <CatalogBrowser products={products} />
      </div>
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-3xl text-ink">{copy.faqsTitle}</h2>
        <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {copy.faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer font-serif text-xl text-ink">{item.q}</summary>
              <p className="mt-3 text-base leading-relaxed text-ash">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </ShopFrame>
  );
}
