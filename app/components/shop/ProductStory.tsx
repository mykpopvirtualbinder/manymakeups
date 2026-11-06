import type { Product } from "@/lib/shop/catalog";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";
import { kitLines } from "@/lib/shop/pieces";

function story(locale: Locale, product: Product) {
  const several = product.layers > 1;
  const pieces =
    locale === "en"
      ? product.layers === 1
        ? "1 piece"
        : `${product.layers} pieces`
      : locale === "fr"
        ? product.layers === 1
          ? "1 pièce"
          : `${product.layers} pièces`
        : product.layers === 1
          ? "1 Pieza"
          : `${product.layers} Piezas`;
  const finish = [
    product.kind === "californianas" ? (locale === "en" ? "Californian" : locale === "fr" ? "Californiennes" : "Californianas") : "",
    product.luxury ? "Luxury" : "",
    product.wavy ? (locale === "en" ? "wavy" : locale === "fr" ? "ondulées" : "Onduladas") : "",
  ]
    .filter(Boolean)
    .join(" ");
  const base =
    locale === "en"
      ? several
        ? "Natural clip-in extension set"
        : "Natural clip-in extension"
      : locale === "fr"
        ? several
          ? "Set d'extensions à clips en cheveux naturels"
          : "Extension à clips en cheveux naturels"
        : several
          ? "Set de Extensiones de Clip de Pelo Natural"
          : "Extensión de Clip de Pelo Natural";
  const title = `${base}${finish ? ` ${finish}` : ""} (${pieces})`;
  const straight = product.wavy ? (locale === "en" ? "Wavy" : locale === "fr" ? "Ondulée" : "Ondulada") : locale === "en" ? "Straight" : locale === "fr" ? "Lisse" : "Lisa";
  const finishLine =
    product.kind === "californianas"
      ? locale === "en"
        ? "Finish: Californian."
        : locale === "fr"
          ? "Fini : californien."
          : "Acabado: californianas."
      : locale === "en"
        ? "Finish: one even colour."
        : locale === "fr"
          ? "Fini : couleur uniforme."
          : "Acabado: color uniforme.";

  if (locale === "en") {
    return {
      title,
      intro: several
        ? "Extra length and volume in about five minutes. The set is made so you can put it in and take it out at home, with no salon visit and no previous experience."
        : "Extra length and volume in about five minutes. It is made so you can put it in and take it out at home, with no salon visit and no previous experience.",
      featuresTitle: "Main features",
      features: [
        "Material: 100% natural human hair, premium REMY (it does not tangle).",
        `Length: ${product.lengthCm} centimetres.`,
        `Total weight: ${product.grams} grams.`,
        `Texture: ${straight}.`,
        finishLine,
        `Construction: double-stitched for strength and density.`,
        "Clips: quality metal clips with a silicone band on the back, so they grip without slipping and protect your own hair.",
      ],
      kitTitle: `What is in the kit (${product.layers} ${product.layers === 1 ? "layer" : "layers"})`,
      kitLead: several ? "The pieces are different widths so they follow the shape of your head:" : "",
      styleTitle: "Styling and colour",
      style: [
        "It is real hair, so you can style it as you style your own: straighten, wave, curl, use a diffuser or a styling product.",
        "Can you colour it? Yes, but only darker than the original shade. Do not bleach it.",
      ],
      remyTitle: "Why REMY matters",
      remy: `${several ? "This set is" : "This piece is"} made to the REMY standard, the highest in extension making. Each hair keeps its natural cuticle direction from root to tip, so it stays silky, does not tangle, and lasts longer than hair that is not made this way.`,
    };
  }
  if (locale === "fr") {
    return {
      title,
      intro: several
        ? "Du volume et de la longueur en cinq minutes environ. Le set se pose et se retire à la maison, sans salon et sans expérience."
        : "Du volume et de la longueur en cinq minutes environ. Elle se pose et se retire à la maison, sans salon et sans expérience.",
      featuresTitle: "Caractéristiques",
      features: [
        "Matière : cheveux humains 100 % naturels, qualité REMY premium (sans nœuds).",
        `Longueur : ${product.lengthCm} centimètres.`,
        `Poids total : ${product.grams} grammes.`,
        `Texture : ${straight}.`,
        finishLine,
        "Structure : double couture, pour la tenue et la densité.",
        "Fixation : clips métalliques avec une bande de silicone au dos, pour tenir sans glisser et sans abîmer vos cheveux.",
      ],
      kitTitle: `Contenu du kit (${product.layers} ${product.layers === 1 ? "couche" : "couches"})`,
      kitLead: several ? "Les pièces ont des largeurs différentes pour suivre le contour de la tête :" : "",
      styleTitle: "Coiffage et couleur",
      style: [
        "Ce sont de vrais cheveux : lissez, ondulez, bouclez, utilisez un diffuseur ou un produit de coiffage, comme avec les vôtres.",
        "Peut-on les colorer ? Oui, mais seulement vers un ton plus foncé. Ne les décolorez pas.",
      ],
      remyTitle: "L'avantage REMY",
      remy: `${several ? "Ce set est fabriqué" : "Cette extension est fabriquée"} selon le standard REMY, le plus haut dans la fabrication d'extensions. Chaque cheveu garde le sens naturel de sa cuticule, de la racine à la pointe : il reste soyeux, ne s'emmêle pas et dure plus longtemps.`,
    };
  }
  return {
    title,
    intro: several
      ? "Consigue un extra de volumen y longitud en apenas 5 minutos con este completo set de extensiones de clip. Están diseñadas para que puedas ponértelas y quitártelas tú misma en casa de forma rápida y sencilla, sin necesidad de ir a la peluquería ni tener experiencia previa."
      : "Consigue un extra de volumen y longitud en apenas 5 minutos con esta extensión de clip. Está diseñada para que puedas ponértela y quitártela tú misma en casa de forma rápida y sencilla, sin necesidad de ir a la peluquería ni tener experiencia previa.",
    featuresTitle: "Características principales",
    features: [
      "Material: 100% cabello natural humano, calidad Premium REMY (sin enredos).",
      `Largo: ${product.lengthCm} centímetros.`,
      `Peso total: ${product.grams} gramos.`,
      `Textura: ${straight}.`,
      finishLine,
      `Estructura: ${several ? "confeccionadas" : "confeccionada"} con doble costura para una mayor resistencia y densidad.`,
      "Sistema de sujeción: clips metálicos de alta calidad que incorporan una banda de silicona en la parte trasera. Esto asegura un agarre firme sin resbalar y protege tu propio cabello.",
    ],
    kitTitle: `Contenido del kit (${product.layers} ${product.layers === 1 ? "capa" : "capas"} en total)`,
    kitLead: several ? "El set se divide en diferentes medidas para adaptarse a la perfección al contorno de tu cabeza:" : "",
    styleTitle: "Peinado, moldeado y color",
    style: [
      "Al tratarse de auténtico pelo natural, tienes total libertad para peinarlo como harías con el tuyo propio. Puedes usar planchas para alisarlo, crear ondas, rizarlo, aplicar calor con difusor o usar productos de fijación como gominas.",
      "¿Se pueden teñir? Sí, pero recomendamos aplicar siempre tonos más oscuros que el original. Se debe evitar siempre la decoloración (intentar pasar de un tono oscuro a uno más claro) para no dañar la calidad del pelo.",
    ],
    remyTitle: "La ventaja de la calidad REMY",
    remy: `${several ? "Este set está elaborado" : "Esta extensión está elaborada"} bajo el sistema REMY, el estándar más alto en la fabricación de extensiones. Esto significa que se respeta escrupulosamente la dirección natural de la cutícula de cada pelo, desde la raíz hasta la punta. Al ser un cabello unidireccional, se evita por completo la formación de enredos indeseados, garantizando un aspecto sedoso y multiplicando la durabilidad de las extensiones frente a las que no utilizan este método.`,
  };
}

export async function ProductStory({ product }: { product: Product }) {
  const locale = await getLocale();
  const copy = story(locale, product);
  const lines = kitLines(product.layerSizes, locale);
  return (
    <div className="mt-8 space-y-6 text-sm leading-relaxed text-ash">
      <h2 className="font-serif text-2xl leading-tight text-ink">{copy.title}</h2>
      <p>{copy.intro}</p>
      <div>
        <h3 className="text-ink">{copy.featuresTitle}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {copy.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-ink">{copy.kitTitle}</h3>
        {copy.kitLead ? <p className="mt-2">{copy.kitLead}</p> : null}
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-ink">{copy.styleTitle}</h3>
        {copy.style.map((paragraph) => (
          <p key={paragraph} className="mt-2">
            {paragraph}
          </p>
        ))}
      </div>
      <div>
        <h3 className="text-ink">{copy.remyTitle}</h3>
        <p className="mt-2">{copy.remy}</p>
      </div>
    </div>
  );
}
