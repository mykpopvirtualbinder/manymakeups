import type { Locale } from "@/lib/i18n/config";
import type { PolicyDoc } from "./policy-types";

const purchase: Record<Locale, PolicyDoc> = {
  es: {
    title: "Política de Compra y Envíos",
    description: "Preparación, cobro bajo reserva, impuestos y tarifas de envío de las extensiones.",
    sections: [
      {
        heading: "1. Proceso de preparación y cobro (Pago bajo reserva)",
        blocks: [
          {
            type: "p",
            text: "Para garantizar la máxima transparencia y evitar inconvenientes de stock, el proceso de preparación de su pedido comenzará únicamente tras verificar la disponibilidad exacta del modelo y color seleccionados.",
          },
          {
            type: "p",
            text: "Al tramitar su compra, su entidad bancaria solo realizará una preautorización (retención del importe) en su tarjeta. El cobro definitivo solo se ejecutará cuando le confirmemos que la mercancía está asegurada y lista para su envío. En caso de no disponer de la unidad solicitada, la retención se anulará de forma automática e inmediata, sin suponer ningún cargo o coste para usted.",
          },
        ],
      },
      {
        heading: "2. Impuestos y gestión aduanera",
        blocks: [
          {
            type: "p",
            text: "Todos los precios mostrados en nuestro catálogo incluyen el 21 % de IVA, aplicable por defecto a los pedidos con destino a la Península y Baleares.",
          },
          {
            type: "p",
            text: "Para las compras con destino a Canarias, Ceuta y Melilla, el sistema descontará este IVA automáticamente al introducir su dirección de entrega. No obstante, el cliente acepta y asume que deberá abonar los impuestos locales correspondientes (IGIC o IPSI), así como los posibles gastos derivados de la gestión aduanera, directamente a la empresa de transportes en el momento de la recepción del paquete.",
          },
        ],
      },
      {
        heading: "3. Tarifas y cobertura de envío",
        blocks: [
          {
            type: "p",
            text: "Ofrecemos cobertura de envío a todo el territorio nacional (Península, Baleares, Canarias, Ceuta y Melilla) con las siguientes tarifas planas:",
          },
          {
            type: "ul",
            items: [
              "Envío gratuito: para todos los pedidos cuyo importe sea superior a 100 €.",
              "Envío estándar (2,90 €): para pedidos con un importe inferior a 100 €.",
            ],
          },
        ],
      },
      {
        heading: "4. Plazos de entrega",
        blocks: [
          {
            type: "link",
            before:
              "Nuestros envíos se gestionan a través de la red de Correos. Una vez que el paquete sale de nuestro estudio y es depositado en la oficina postal, los plazos de tránsito y entrega estimados se regirán por lo estipulado en nuestra",
            href: "/envios",
            label: "política de Envíos",
            after: ".",
          },
        ],
      },
    ],
  },
  en: {
    title: "Purchase and shipping policy",
    description: "How extension orders are prepared, reserved on the card, taxed and shipped.",
    sections: [
      {
        heading: "1. Preparation and payment (reserved payment)",
        blocks: [
          {
            type: "p",
            text: "To keep the process clear and avoid stock surprises, preparation of your order starts only after we have checked that the exact model and colour you chose are available.",
          },
          {
            type: "p",
            text: "When you place the order, your bank only pre-authorises the amount on your card. The charge is taken only once we confirm that the goods are secured and ready to ship. If the piece is not available, the hold is cancelled automatically and at once, with no charge to you.",
          },
        ],
      },
      {
        heading: "2. Tax and customs",
        blocks: [
          {
            type: "p",
            text: "Every price in the catalogue includes 21% VAT, which applies by default to orders for mainland Spain and the Balearic Islands.",
          },
          {
            type: "p",
            text: "For orders to the Canary Islands, Ceuta and Melilla, that VAT is removed automatically when you enter the delivery address. You accept that local taxes (IGIC or IPSI) and any customs handling charges are payable by you to the carrier when the parcel is delivered.",
          },
        ],
      },
      {
        heading: "3. Shipping rates and coverage",
        blocks: [
          {
            type: "p",
            text: "We ship throughout Spain (mainland, Balearic Islands, Canary Islands, Ceuta and Melilla) at these flat rates:",
          },
          {
            type: "ul",
            items: [
              "Free shipping: orders over €100.",
              "Standard shipping (€2.90): orders under €100.",
            ],
          },
        ],
      },
      {
        heading: "4. Delivery times",
        blocks: [
          {
            type: "link",
            before:
              "Parcels travel with Correos. Once the parcel has left the studio and been handed in at the post office, transit and delivery times are those set out in our",
            href: "/envios",
            label: "shipping policy",
            after: ".",
          },
        ],
      },
    ],
  },
  fr: {
    title: "Politique d'achat et de livraison",
    description: "Préparation, paiement sous réserve, taxes et frais de livraison des extensions.",
    sections: [
      {
        heading: "1. Préparation et encaissement (paiement sous réserve)",
        blocks: [
          {
            type: "p",
            text: "Pour rester transparents et éviter les ruptures, la préparation de la commande ne commence qu'après vérification de la disponibilité exacte du modèle et de la couleur choisis.",
          },
          {
            type: "p",
            text: "Au moment de l'achat, votre banque effectue seulement une préautorisation (retenue du montant) sur votre carte. Le débit n'a lieu que lorsque nous confirmons que la marchandise est assurée et prête à partir. Si la pièce n'est pas disponible, la retenue est annulée automatiquement et immédiatement, sans aucun frais pour vous.",
          },
        ],
      },
      {
        heading: "2. Taxes et douane",
        blocks: [
          {
            type: "p",
            text: "Tous les prix du catalogue incluent 21 % de TVA, applicable par défaut aux commandes à destination de la péninsule et des Baléares.",
          },
          {
            type: "p",
            text: "Pour les Canaries, Ceuta et Melilla, cette TVA est retirée automatiquement lorsque vous indiquez l'adresse de livraison. Vous acceptez de régler les taxes locales (IGIC ou IPSI) et les éventuels frais de dédouanement directement au transporteur à la réception du colis.",
          },
        ],
      },
      {
        heading: "3. Tarifs et couverture",
        blocks: [
          {
            type: "p",
            text: "Nous livrons dans toute l'Espagne (péninsule, Baléares, Canaries, Ceuta et Melilla) aux tarifs forfaitaires suivants :",
          },
          {
            type: "ul",
            items: [
              "Livraison offerte : commandes de plus de 100 €.",
              "Livraison standard (2,90 €) : commandes inférieures à 100 €.",
            ],
          },
        ],
      },
      {
        heading: "4. Délais de livraison",
        blocks: [
          {
            type: "link",
            before:
              "Les envois passent par Correos. Une fois le colis sorti de l'atelier et déposé au bureau de poste, les délais de transit et de livraison sont ceux de notre",
            href: "/envios",
            label: "politique de livraison",
            after: ".",
          },
        ],
      },
    ],
  },
};

export function purchasePolicy(locale: Locale) {
  return purchase[locale];
}
