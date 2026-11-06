import { site } from "@/lib/site";
import { localePath, type Locale } from "@/lib/i18n";
import type { PolicyDoc } from "@/lib/shop/policy-types";

const email = "info@manymakeups.com";
const phone = "645 800 760";

function Rich({ text }: { text: string }) {
  const parts = text.split(/(info@manymakeups\.com|645 800 760)/g);
  return parts.map((part, index) => {
    if (part === email) {
      return (
        <a key={index} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      );
    }
    if (part === phone) {
      return (
        <a key={index} href={`tel:${site.phone}`}>
          {site.phoneDisplay}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function PolicyBody({ doc, locale }: { doc: PolicyDoc; locale: Locale }) {
  const country = locale === "en" ? "Spain" : locale === "fr" ? "Espagne" : "España";
  return (
    <>
      {doc.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.blocks.map((block, index) => {
            if (block.type === "ul") {
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>
                      <Rich text={item} />
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "link") {
              return (
                <p key={index}>
                  <Rich text={block.before} />{" "}
                  <a href={localePath(locale, block.href)}>{block.label}</a>
                  {block.after ? <Rich text={block.after} /> : null}
                </p>
              );
            }
            if (block.type === "address") {
              return (
                <p key={index}>
                  {site.legalName} ({site.legalPerson})
                  <br />
                  {site.streetAddress}
                  <br />
                  {site.postalCode} {site.city}, {site.region} ({country})
                </p>
              );
            }
            return (
              <p key={index}>
                <Rich text={block.text} />
              </p>
            );
          })}
        </section>
      ))}
    </>
  );
}
