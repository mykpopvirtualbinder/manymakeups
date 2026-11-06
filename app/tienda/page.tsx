import { CatalogBrowser } from "@/app/components/shop/CatalogBrowser";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { getLocale, pageMeta } from "@/lib/i18n";
import { shopIntro } from "@/lib/shop/intro";
import { products } from "@/lib/shop/catalog";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const copy = shopIntro[await getLocale()];
  return pageMeta({ path: "/tienda", title: copy.title.replace(/\.$/, ""), description: copy.description });
}

export default async function ShopPage() {
  const copy = shopIntro[await getLocale()];
  return (
    <ShopFrame kicker={copy.kicker} title={copy.title}>
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
    </ShopFrame>
  );
}
