import type { Locale } from "@/lib/i18n/config";

export const shopIntro: Record<
  Locale,
  {
    kicker: string;
    title: string;
    description: string;
    sections: { heading?: string; paragraphs: string[] }[];
    chartAlt: string;
    priceNote: string;
    layersLabel: string;
    filters: {
      allLengths: string;
      all: string;
      uniforme: string;
      californianas: string;
      luxury: string;
      wavy: string;
      empty: string;
    };
  }
> = {
  es: {
    kicker: "Tienda",
    title: "Extensiones.",
    description: "Extensiones de clip 100 % naturales. Envío a toda España. Gratis por encima de 100 € y 2,90 € por debajo.",
    sections: [
      {
        heading: "Descubre nuestra colección de Extensiones de Clip 100 % Naturales",
        paragraphs: [
          "Consigue la melena espectacular que siempre has deseado en apenas 5 minutos. Nuestras extensiones de clip están diseñadas para que puedas ponértelas y quitártelas tú misma en casa de forma rápida, cómoda y sin necesidad de experiencia previa.",
        ],
      },
      {
        heading: "Calidad REMY: belleza sin enredos",
        paragraphs: [
          "Todas las extensiones de este catálogo están elaboradas con cabello 100 % natural bajo el sistema REMY, el estándar más exigente del sector. Esta técnica conserva la cutícula intacta y respeta la dirección natural de cada cabello desde la raíz hasta la punta. ¿El resultado? Una melena sedosa, libre de enredos indeseados y con una durabilidad extraordinariamente superior a la de las extensiones convencionales.",
        ],
      },
      {
        heading: "Diseño y sujeción impecables",
        paragraphs: [
          "Para garantizar un volumen perfecto y uniforme, cada pieza está confeccionada con doble costura. Además, incorporan clips metálicos de alta calidad con un revestimiento posterior de silicona, diseñados para adherirse a tu cabello con total firmeza y seguridad, sin resbalar ni dañar tu raíz.",
        ],
      },
      {
        heading: "Línea Premium Luxury",
        paragraphs: [
          "Para quienes buscan la excelencia absoluta a un precio ajustado, disponemos de nuestra gama Premium Luxury. Esta selección exclusiva destaca por ofrecer una calidad de cabello aún superior y, sobre todo, una mayor densidad y grosor en las puntas, logrando un acabado de máximo volumen e impacto.",
        ],
      },
      {
        heading: "Libertad total de peinado",
        paragraphs: [
          "Al tratarse de auténtico pelo natural, puedes tratar tus extensiones exactamente igual que a tu propio cabello. Tienes total libertad para moldearlas con calor: usar planchas para alisarlas, crear ondas, rizar, usar difusor o aplicar productos de fijación.",
          "Nota sobre el color: admiten tintes sin problema, pero para proteger la calidad del pelo, recomendamos teñir siempre hacia tonos más oscuros. Evita someterlas a procesos de decoloración (aclarar el tono original).",
          "Explora nuestro catálogo y descubre una amplia variedad de colores y gramajes pensados para integrarse al 100 % con tus necesidades y conseguir un resultado totalmente invisible y natural.",
        ],
      },
    ],
    chartAlt: "Carta de colores de las extensiones",
    priceNote: "IVA incluido en península y Baleares. En Canarias, Ceuta y Melilla se descuenta al pagar.",
    layersLabel: "Capas",
    filters: {
      allLengths: "Todos los largos",
      all: "Todos",
      uniforme: "Color uniforme",
      californianas: "Californianas",
      luxury: "Luxury",
      wavy: "Onduladas",
      empty: "No hay modelos con ese filtro.",
    },
  },
  en: {
    kicker: "Shop",
    title: "Extensions.",
    description: "100% natural clip-in extensions. Delivery throughout Spain. Free over €100, otherwise €2.90.",
    sections: [
      {
        heading: "Our 100% natural clip-in extensions",
        paragraphs: [
          "The hair you have been wanting, in about five minutes. The clips are made so you can put them in and take them out at home, quickly and comfortably, with no previous experience.",
        ],
      },
      {
        heading: "REMY quality: hair that does not tangle",
        paragraphs: [
          "Every extension in this catalogue is 100% natural hair made to the REMY standard, the most demanding in the trade. The cuticle stays intact and each hair keeps its natural direction from root to tip. The result is silky hair, free of unwanted tangles, and far more durable than conventional extensions.",
        ],
      },
      {
        heading: "Cut and hold",
        paragraphs: [
          "Each piece is double-stitched so the volume stays even. The metal clips have a silicone backing that grips your own hair firmly, without slipping or damaging the root.",
        ],
      },
      {
        heading: "Premium Luxury",
        paragraphs: [
          "For the fullest finish at a considered price, the Premium Luxury range uses an even finer quality of hair and, above all, more density and thickness through the ends.",
        ],
      },
      {
        heading: "Style them as you would your own hair",
        paragraphs: [
          "Because it is real hair, you can treat the extensions as you treat your own: straighten, wave, curl, use a diffuser or a styling product.",
          "Colour: they can be tinted, but only darker than the original shade, so the hair stays in good condition. Do not bleach them.",
          "Look through the catalogue for the colour and weight that disappear into your own hair.",
        ],
      },
    ],
    chartAlt: "Extension colour chart",
    priceNote: "VAT included for mainland Spain and the Balearic Islands. It is removed at checkout for the Canary Islands, Ceuta and Melilla.",
    layersLabel: "Layers",
    filters: {
      allLengths: "All lengths",
      all: "All",
      uniforme: "Uniform colour",
      californianas: "Californian",
      luxury: "Luxury",
      wavy: "Wavy",
      empty: "No styles match that filter.",
    },
  },
  fr: {
    kicker: "Boutique",
    title: "Extensions.",
    description: "Extensions à clips 100 % naturelles. Livraison dans toute l'Espagne. Offerte au-dessus de 100 €, sinon 2,90 €.",
    sections: [
      {
        heading: "Notre collection d'extensions à clips 100 % naturelles",
        paragraphs: [
          "La chevelure que vous attendiez, en cinq minutes environ. Les clips sont faits pour se poser et se retirer à la maison, vite et confortablement, sans expérience préalable.",
        ],
      },
      {
        heading: "Qualité REMY : des cheveux qui ne s'emmêlent pas",
        paragraphs: [
          "Toutes les extensions de ce catalogue sont en cheveux 100 % naturels, fabriquées selon le standard REMY, le plus exigeant du métier. La cuticule reste intacte et chaque cheveu garde son sens naturel, de la racine à la pointe. Le résultat : une chevelure soyeuse, sans nœuds, et bien plus durable que les extensions ordinaires.",
        ],
      },
      {
        heading: "Coupe et fixation",
        paragraphs: [
          "Chaque pièce est cousue en double pour un volume régulier. Les clips métalliques ont un revers en silicone qui tient vos cheveux fermement, sans glisser ni abîmer la racine.",
        ],
      },
      {
        heading: "Ligne Premium Luxury",
        paragraphs: [
          "Pour un rendu plus plein à un prix tenu, la gamme Premium Luxury offre une qualité de cheveu encore supérieure et, surtout, plus de densité et d'épaisseur dans les pointes.",
        ],
      },
      {
        heading: "À coiffer comme vos propres cheveux",
        paragraphs: [
          "Comme il s'agit de vrais cheveux, vous pouvez les traiter comme les vôtres : lisser, onduler, boucler, utiliser un diffuseur ou un produit de coiffage.",
          "Couleur : elles supportent une coloration, mais seulement vers un ton plus foncé, pour préserver le cheveu. Ne les décolorez pas.",
          "Parcourez le catalogue : couleurs et grammages pensés pour se fondre dans vos cheveux.",
        ],
      },
    ],
    chartAlt: "Nuancier des extensions",
    priceNote: "TVA incluse pour la péninsule et les Baléares. Elle est retirée au paiement pour les Canaries, Ceuta et Melilla.",
    layersLabel: "Couches",
    filters: {
      allLengths: "Toutes les longueurs",
      all: "Tout",
      uniforme: "Couleur uniforme",
      californianas: "Californiennes",
      luxury: "Luxury",
      wavy: "Ondulées",
      empty: "Aucun modèle ne correspond à ce filtre.",
    },
  },
};
