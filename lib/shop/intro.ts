import type { Locale } from "@/lib/i18n/config";

export const shopIntro: Record<
  Locale,
  {
    kicker: string;
    title: string;
    description: string;
    lead: string;
    seoTitle: string;
    seoDescription: string;
    faqsTitle: string;
    faqs: { q: string; a: string }[];
    home: { kicker: string; title: string; body: string; cta: string };
    crumbHome: string;
    crumbShop: string;
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
    lead: "Extensiones de clip de cabello 100 % natural, sistema REMY. Las preparo en el atelier y las envío a toda España.",
    seoTitle: "Extensiones de clip de cabello natural",
    seoDescription:
      "Proveedor de extensiones de clip 100 % naturales, sistema REMY, con envío a toda España. Many Makeups, el atelier de Ana Zarza en Nules, las prepara y las envía. Gratis desde 100 €.",
    faqsTitle: "Preguntas sobre las extensiones",
    faqs: [
      {
        q: "¿Sois proveedor de extensiones de cabello?",
        a: "Sí. Many Makeups prepara y envía extensiones de clip de cabello 100 % natural, sistema REMY, a toda España. Es la tienda del atelier, aparte del maquillaje y el peinado para bodas y eventos.",
      },
      {
        q: "¿Las extensiones son de pelo natural?",
        a: "Sí. Todo el catálogo es cabello natural con la cutícula en la misma dirección, el sistema REMY, con doble costura y clips metálicos con silicona.",
      },
      {
        q: "¿Enviáis las extensiones a toda España?",
        a: "Sí. El envío es gratis por encima de 100 € y cuesta 2,90 € por debajo. En Canarias, Ceuta y Melilla el IVA se descuenta al pagar.",
      },
      {
        q: "¿Las extensiones sustituyen al maquillaje de eventos?",
        a: "No. El oficio del atelier sigue siendo el maquillaje y el peinado para bodas y eventos. Las extensiones son una línea más, para quien quiere el pelo además del estilismo.",
      },
    ],
    home: {
      kicker: "También",
      title: "Extensiones de clip.",
      body: "El atelier sigue siendo el maquillaje y el peinado para bodas y eventos. Además, preparo extensiones de clip de cabello 100 % natural y las envío a toda España.",
      cta: "Ver las extensiones",
    },
    crumbHome: "Inicio",
    crumbShop: "Extensiones",
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
    lead: "100% natural REMY clip-in hair extensions. I prepare them at the atelier and ship them throughout Spain.",
    seoTitle: "Natural clip-in hair extensions",
    seoDescription:
      "Supplier of 100% natural REMY clip-in extensions, delivered throughout Spain. Many Makeups, Ana Zarza’s atelier in Nules, prepares and ships them. Free delivery over €100.",
    faqsTitle: "Questions about the extensions",
    faqs: [
      {
        q: "Do you supply hair extensions?",
        a: "Yes. Many Makeups prepares and ships 100% natural REMY clip-in extensions throughout Spain. It is the atelier’s shop, separate from makeup and hair for weddings and events.",
      },
      {
        q: "Is the hair natural?",
        a: "Yes. The whole catalogue is natural hair with the cuticle in one direction, the REMY system, double-stitched, with metal clips backed in silicone.",
      },
      {
        q: "Do you deliver throughout Spain?",
        a: "Yes. Delivery is free over €100 and €2.90 below that. VAT is removed at checkout for the Canary Islands, Ceuta and Melilla.",
      },
      {
        q: "Do the extensions replace event makeup?",
        a: "No. The atelier’s work remains makeup and hair for weddings and events. The extensions are an extra line, for anyone who wants the hair as well as the styling.",
      },
    ],
    home: {
      kicker: "Also",
      title: "Clip-in extensions.",
      body: "The atelier remains makeup and hair for weddings and events. Alongside that, I prepare 100% natural clip-in extensions and ship them throughout Spain.",
      cta: "See the extensions",
    },
    crumbHome: "Home",
    crumbShop: "Extensions",
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
    lead: "Extensions à clips en cheveux 100 % naturels, système REMY. Je les prépare à l’atelier et je les envoie dans toute l’Espagne.",
    seoTitle: "Extensions à clips en cheveux naturels",
    seoDescription:
      "Fournisseur d’extensions à clips 100 % naturelles, système REMY, livrées dans toute l’Espagne. Many Makeups, l’atelier d’Ana Zarza à Nules, les prépare et les expédie. Offertes dès 100 €.",
    faqsTitle: "Questions sur les extensions",
    faqs: [
      {
        q: "Fournissez-vous des extensions de cheveux ?",
        a: "Oui. Many Makeups prépare et envoie des extensions à clips en cheveux 100 % naturels, système REMY, dans toute l’Espagne. C’est la boutique de l’atelier, à part du maquillage et de la coiffure pour les mariages et les événements.",
      },
      {
        q: "Les cheveux sont-ils naturels ?",
        a: "Oui. Tout le catalogue est en cheveux naturels, cuticule dans le même sens, système REMY, double couture et clips métalliques avec silicone.",
      },
      {
        q: "Livrez-vous dans toute l’Espagne ?",
        a: "Oui. La livraison est offerte au-dessus de 100 € et coûte 2,90 € en dessous. La TVA est retirée au paiement pour les Canaries, Ceuta et Melilla.",
      },
      {
        q: "Les extensions remplacent-elles le maquillage d’événement ?",
        a: "Non. Le métier de l’atelier reste le maquillage et la coiffure pour les mariages et les événements. Les extensions sont une ligne de plus, pour qui veut les cheveux en plus du stylisme.",
      },
    ],
    home: {
      kicker: "Aussi",
      title: "Extensions à clips.",
      body: "L’atelier reste le maquillage et la coiffure pour les mariages et les événements. En plus, je prépare des extensions à clips en cheveux 100 % naturels et je les envoie dans toute l’Espagne.",
      cta: "Voir les extensions",
    },
    crumbHome: "Accueil",
    crumbShop: "Extensions",
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
