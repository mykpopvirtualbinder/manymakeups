import type { Locale } from "@/lib/i18n/config";
import type { PolicyDoc } from "./policy-types";

const returns: Record<Locale, PolicyDoc> = {
  es: {
    title: "Política de Cambios y Devoluciones",
    description: "15 días hábiles para cambiar o devolver extensiones precintadas, y vídeo de unboxing si hay un defecto.",
    sections: [
      {
        heading: "1. Plazo de devolución (Derecho de desistimiento)",
        blocks: [
          {
            type: "p",
            text: "Para garantizar la máxima satisfacción con su compra, ampliamos el plazo legal establecido. El cliente dispone de 15 días hábiles, contados a partir de la recepción del pedido, para solicitar un cambio o realizar una devolución. Este periodo es superior a los 14 días naturales que estipula el artículo 102 de la Ley General para la Defensa de los Consumidores y Usuarios.",
          },
        ],
      },
      {
        heading: "2. Estado del producto y requisitos de higiene",
        blocks: [
          {
            type: "p",
            text: "Por estrictas razones de sanidad e higiene, las extensiones capilares se envían dentro de una funda de plástico protectora y unidas a un soporte de cartón mediante un precinto de seguridad.",
          },
          {
            type: "p",
            text: "Para que la devolución o cambio sea aceptado, el producto debe retornar en su estado original. No se admitirán devoluciones de extensiones cuyo precinto de seguridad haya sido abierto, roto o manipulado. Asimismo, no se aceptará ningún artículo que haya sido cortado, teñido, usado o alterado de cualquier forma.",
          },
          {
            type: "p",
            text: "Consejo: puede extraer las extensiones de la funda de plástico exterior para comprobar visualmente el color, el largo y la textura del cabello. Sin embargo, bajo ningún concepto debe romper o retirar el precinto que las une al cartón si desea conservar su derecho a devolución.",
          },
        ],
      },
      {
        heading: "3. Condiciones económicas del reembolso",
        blocks: [
          {
            type: "p",
            text: "El reembolso comprenderá el importe íntegro abonado por el producto, deduciendo los gastos de envío originales (2,90 €), que no son reembolsables.",
          },
          {
            type: "p",
            text: "Importante sobre los envíos gratuitos: si su pedido original se benefició de la promoción de envío gratis (compras superiores a 100 €) y, tras la devolución parcial o total, el importe de los artículos que el cliente conserva es inferior a dicho umbral, la gratuidad perderá su validez. En este caso, se descontarán 2,90 € del total a reembolsar en concepto de los gastos de expedición generados.",
          },
          {
            type: "p",
            text: "El reintegro se procesará siempre utilizando el mismo método de pago (tarjeta bancaria) con el que se realizó la compra o la reserva inicial.",
          },
        ],
      },
      {
        heading: "4. Procedimiento para tramitar un cambio o devolución",
        blocks: [
          { type: "p", text: "Para iniciar el proceso, siga estos pasos:" },
          {
            type: "ul",
            items: [
              "Escriba un correo electrónico a info@manymakeups.com indicando su nombre, apellidos, el número de pedido y el motivo de la devolución o cambio.",
              "Rogamos no enviar ningún paquete hasta recibir nuestra respuesta confirmando la autorización y las instrucciones para el envío.",
              "Una vez autorizado, el cliente deberá remitir el paquete mediante un servicio certificado (con número de seguimiento). Nuestra empresa no se hará cargo de pérdidas o extravíos de paquetes enviados mediante correo ordinario.",
              "No se aceptarán, en ningún caso, devoluciones enviadas a portes debidos o contrarreembolso.",
            ],
          },
          { type: "p", text: "Dirección para devoluciones:" },
          { type: "address" },
        ],
      },
      {
        heading: "5. Envíos desde Canarias, Ceuta y Melilla (Aduanas)",
        blocks: [
          {
            type: "p",
            text: "Para las devoluciones que provengan de Canarias, Ceuta o Melilla, el cliente es el único responsable de realizar correctamente la declaración aduanera de retorno. La empresa no asumirá los gastos de posibles aranceles, impuestos especiales (IGIC o IPSI) ni tasas de tramitación aduanera. Tampoco nos responsabilizaremos de los retrasos en el reembolso ocasionados por retenciones o inspecciones en las aduanas.",
          },
        ],
      },
      {
        heading: "6. Reclamaciones por defecto o error (Vídeo unboxing)",
        blocks: [
          {
            type: "link",
            before:
              "Le recordamos que, tal y como se estipula en nuestros",
            href: "/condiciones-de-venta",
            label: "Términos y Condiciones Generales de Venta",
            after:
              ", si el motivo de la reclamación es un defecto de fábrica, daños en el transporte o errores en la mercancía recibida, será requisito indispensable aportar el vídeo de unboxing continuo (sin cortes) abriendo el paquete original. Sin esta prueba visual, no se admitirán reclamaciones por tara o error.",
          },
        ],
      },
    ],
  },
  en: {
    title: "Changes and returns policy",
    description: "15 business days to exchange or return sealed extensions, and an unboxing video if something is wrong.",
    sections: [
      {
        heading: "1. Return window (right of withdrawal)",
        blocks: [
          {
            type: "p",
            text: "You have 15 business days from the day you receive the order to ask for an exchange or a return. That is longer than the 14 calendar days in article 102 of the Spanish General Law for the Defence of Consumers and Users.",
          },
        ],
      },
      {
        heading: "2. Condition of the hair and hygiene",
        blocks: [
          {
            type: "p",
            text: "For hygiene, the extensions are sent inside a protective plastic sleeve and fixed to a cardboard mount with a security seal.",
          },
          {
            type: "p",
            text: "A return or exchange is accepted only if the product comes back in its original condition. We do not accept extensions whose seal has been opened, broken or tampered with, or any piece that has been cut, dyed, worn or altered.",
          },
          {
            type: "p",
            text: "You may take the extensions out of the outer plastic sleeve to look at the colour, length and texture. Do not break or remove the seal that holds them to the card if you want to keep the right to return them.",
          },
        ],
      },
      {
        heading: "3. What is refunded",
        blocks: [
          {
            type: "p",
            text: "The refund covers the full price paid for the product, minus the original shipping charge (€2.90), which is not refundable.",
          },
          {
            type: "p",
            text: "Free shipping: if the original order qualified for free shipping (over €100) and, after a partial or full return, the goods you keep come to less than that threshold, free shipping no longer applies. In that case €2.90 is deducted from the refund to cover the shipping that was incurred.",
          },
          {
            type: "p",
            text: "The refund always goes back to the same card used for the purchase or the original hold.",
          },
        ],
      },
      {
        heading: "4. How to start a change or a return",
        blocks: [
          { type: "p", text: "Follow these steps:" },
          {
            type: "ul",
            items: [
              "Email info@manymakeups.com with your name, surnames, order number and the reason for the return or exchange.",
              "Do not send the parcel until we reply with authorisation and shipping instructions.",
              "Once authorised, send it by a tracked service. We are not responsible for parcels sent by ordinary post that are lost.",
              "We do not accept returns sent cash on delivery or with postage due.",
            ],
          },
          { type: "p", text: "Return address:" },
          { type: "address" },
        ],
      },
      {
        heading: "5. Returns from the Canary Islands, Ceuta and Melilla",
        blocks: [
          {
            type: "p",
            text: "If you return a parcel from the Canary Islands, Ceuta or Melilla, you are solely responsible for the return customs declaration. We do not pay duties, special taxes (IGIC or IPSI) or customs handling fees, and we are not responsible for refund delays caused by customs holds or inspections.",
          },
        ],
      },
      {
        heading: "6. Faults and mistakes (unboxing video)",
        blocks: [
          {
            type: "link",
            before: "As set out in our",
            href: "/condiciones-de-venta",
            label: "General Terms and Conditions of Sale",
            after:
              ", a claim for a manufacturing fault, damage in transit or the wrong goods requires a continuous unboxing video, with no cuts, of the original parcel being opened. Without that recording we cannot accept a claim for a fault or a mistake.",
          },
        ],
      },
    ],
  },
  fr: {
    title: "Politique d'échanges et de retours",
    description: "15 jours ouvrés pour échanger ou retourner des extensions scellées, et une vidéo d'ouverture en cas de défaut.",
    sections: [
      {
        heading: "1. Délai de retour (droit de rétractation)",
        blocks: [
          {
            type: "p",
            text: "Vous disposez de 15 jours ouvrés à compter de la réception pour demander un échange ou un retour. Ce délai est plus long que les 14 jours calendaires de l'article 102 de la loi générale espagnole de défense des consommateurs et des usagers.",
          },
        ],
      },
      {
        heading: "2. État du produit et hygiène",
        blocks: [
          {
            type: "p",
            text: "Pour des raisons d'hygiène, les extensions sont envoyées dans une pochette plastique et fixées à un support en carton par un scellé de sécurité.",
          },
          {
            type: "p",
            text: "Le retour ou l'échange n'est accepté que si le produit revient dans son état d'origine. Sont refusées les extensions dont le scellé a été ouvert, rompu ou manipulé, ainsi que tout article coupé, teint, porté ou modifié.",
          },
          {
            type: "p",
            text: "Vous pouvez sortir les extensions de la pochette extérieure pour regarder la couleur, la longueur et la texture. Ne cassez pas et ne retirez pas le scellé qui les tient au carton si vous voulez conserver le droit de retour.",
          },
        ],
      },
      {
        heading: "3. Montant remboursé",
        blocks: [
          {
            type: "p",
            text: "Le remboursement couvre le prix intégral payé pour le produit, moins les frais d'envoi d'origine (2,90 €), qui ne sont pas remboursables.",
          },
          {
            type: "p",
            text: "Livraison offerte : si la commande d'origine en a bénéficié (plus de 100 €) et que, après un retour total ou partiel, les articles conservés passent sous ce seuil, la gratuité tombe. Dans ce cas, 2,90 € sont déduits du remboursement au titre des frais d'expédition.",
          },
          {
            type: "p",
            text: "Le remboursement revient toujours sur la carte utilisée pour l'achat ou pour la réservation initiale.",
          },
        ],
      },
      {
        heading: "4. Comment lancer un échange ou un retour",
        blocks: [
          { type: "p", text: "Suivez ces étapes :" },
          {
            type: "ul",
            items: [
              "Écrivez à info@manymakeups.com avec votre nom, vos prénoms, le numéro de commande et le motif.",
              "N'envoyez rien avant notre réponse, qui confirme l'autorisation et les instructions d'envoi.",
              "Une fois autorisé, expédiez le colis en suivi. Nous ne répondons pas des colis envoyés en courrier ordinaire et perdus.",
              "Les retours en contre-remboursement ou en port dû ne sont pas acceptés.",
            ],
          },
          { type: "p", text: "Adresse de retour :" },
          { type: "address" },
        ],
      },
      {
        heading: "5. Retours depuis les Canaries, Ceuta et Melilla",
        blocks: [
          {
            type: "p",
            text: "Pour un retour depuis les Canaries, Ceuta ou Melilla, le client est seul responsable de la déclaration en douane de retour. L'atelier ne prend pas en charge les droits, taxes spéciales (IGIC ou IPSI) ni les frais de dédouanement, et ne répond pas des retards de remboursement causés par une retenue ou un contrôle en douane.",
          },
        ],
      },
      {
        heading: "6. Défaut ou erreur (vidéo d'ouverture)",
        blocks: [
          {
            type: "link",
            before: "Comme le prévoient nos",
            href: "/condiciones-de-venta",
            label: "Conditions générales de vente",
            after:
              ", une réclamation pour défaut de fabrication, dommage au transport ou erreur de marchandise exige une vidéo continue, sans coupure, de l'ouverture du colis d'origine. Sans cette preuve, la réclamation n'est pas admise.",
          },
        ],
      },
    ],
  },
};

export function returnsPolicy(locale: Locale) {
  return returns[locale];
}
