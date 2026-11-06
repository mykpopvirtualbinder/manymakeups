import type { Locale } from "@/lib/i18n/config";
import type { PolicyDoc } from "./policy-types";

const shipping: Record<Locale, PolicyDoc> = {
  es: {
    title: "Política de Envíos",
    description: "Carta Certificada de Correos a toda España. Gratis por encima de 100 € y 2,90 € hasta ese importe.",
    sections: [
      {
        heading: "1. Ámbito territorial y método de envío",
        blocks: [
          {
            type: "p",
            text: "Realizamos envíos a todo el territorio nacional, lo que incluye la Península, Islas Baleares, Islas Canarias, Ceuta y Melilla. Actualmente no realizamos envíos internacionales ni disponemos de opción de recogida en local. Todos los pedidos se expiden desde nuestro estudio ubicado en C/ Santa Teresa 2, 12520 Nules (Castellón).",
          },
          {
            type: "p",
            text: "Todos los envíos se gestionan exclusivamente a través de Correos mediante el servicio de Carta Certificada, garantizando así un número de seguimiento para cualquier destino nacional.",
          },
        ],
      },
      {
        heading: "2. Tarifas de envío",
        blocks: [
          { type: "p", text: "Nuestros gastos de envío son de tarifa plana para toda España:" },
          {
            type: "ul",
            items: [
              "Envío gratuito: para pedidos de productos con un importe superior a 100 €.",
              "Envío estándar (2,90 €): para pedidos de 100 € o menos.",
            ],
          },
          {
            type: "p",
            text: "El umbral para el envío gratuito se calcula sobre el importe final que abona el cliente por las extensiones (una vez descontado el IVA si el destino es Canarias, Ceuta o Melilla). En los envíos a la Península y Baleares, la tarifa de 2,90 € ya incluye el IVA.",
          },
          {
            type: "p",
            text: "Nota sobre devoluciones: los gastos de envío originales (2,90 €) no son reembolsables. Si el cliente devuelve total o parcialmente un pedido que se benefició de envío gratuito (superaba los 100 €), dicha gratuidad perderá su validez y se descontarán 2,90 € del importe final a reembolsar.",
          },
        ],
      },
      {
        heading: "3. Particularidades para Canarias, Ceuta y Melilla",
        blocks: [
          {
            type: "p",
            text: "Para poder tramitar los envíos a estos destinos, es estrictamente obligatorio que el cliente facilite su DNI o NIE durante el proceso de compra.",
          },
          {
            type: "p",
            text: "Estas operaciones se facturan sin IVA, incluyendo en la factura la mención legal: «Operación exenta de IVA en virtud del artículo 21 de la Ley 37/1992, del Impuesto sobre el Valor Añadido».",
          },
          {
            type: "p",
            text: "El cliente asume que los posibles impuestos locales (IGIC o IPSI), así como los gastos derivados de la tramitación aduanera, correrán a su cargo y deberán ser abonados en el momento de la entrega. La empresa no se hace responsable de posibles aranceles, impuestos especiales ni de los retrasos ocasionados por retenciones aduaneras.",
          },
        ],
      },
      {
        heading: "4. Tiempos de preparación y expedición",
        blocks: [
          {
            type: "p",
            text: "Trabajamos bajo un sistema de preautorización de pagos para garantizar el stock. Al realizar su compra, el importe queda únicamente reservado en su tarjeta. Nuestro equipo comprueba la disponibilidad exacta del modelo y color elegidos; solo si hay disponibilidad confirmamos el cobro y preparamos el paquete. Si no hay stock, la reserva se anula sin coste alguno.",
          },
          {
            type: "p",
            text: "Debido a este proceso de verificación, los pedidos no se expiden el mismo día de la compra. Recibirá un correo electrónico cuando el pago sea confirmado, y un segundo correo con su código de seguimiento una vez el paquete salga de nuestras instalaciones. La preparación y entrega a Correos se realiza exclusivamente en días laborables (los fines de semana y festivos no computan).",
          },
        ],
      },
      {
        heading: "5. Plazos de entrega estimados (Correos)",
        blocks: [
          {
            type: "p",
            text: "Nuestros paquetes viajan como Carta Certificada (peso inferior a 500 g). Los plazos de entrega comienzan a contar desde el momento en que el paquete es depositado en las oficinas de Correos:",
          },
          {
            type: "ul",
            items: [
              "Península y Baleares: de 1 a 4 días hábiles. Correos entrega el 93 % de estos envíos en un plazo de 3 días o menos.",
              "Canarias, Ceuta y Melilla: de 3 a 7 días hábiles en total. A los tiempos de tránsito habituales se le deben sumar entre 1 y 3 días por gestiones aduaneras. Si la aduana retiene el paquete para una inspección aleatoria, o el destinatario se demora en el pago del IGIC o el IPSI, el plazo de entrega se pausa y puede extenderse.",
            ],
          },
          {
            type: "p",
            text: "Exenciones de responsabilidad: los plazos indicados pueden verse alterados por causas ajenas a la empresa, tales como huelgas, condiciones meteorológicas adversas, incidencias logísticas de Correos o épocas de alta demanda (Navidad, Black Friday, rebajas). Asimismo, no nos responsabilizamos de retrasos derivados de direcciones introducidas incorrectamente o de la pérdida del aviso de llegada en el buzón.",
          },
        ],
      },
      {
        heading: "6. Seguimiento del pedido",
        blocks: [
          {
            type: "p",
            text: "Una vez expedido el paquete, recibirá un código de seguimiento que podrá introducir en la página web oficial de Correos o consultar telefónicamente en el servicio de atención al cliente de la entidad postal (902 197 197).",
          },
        ],
      },
      {
        heading: "7. Modificaciones y cancelaciones",
        blocks: [
          {
            type: "p",
            text: "Si desea cancelar o modificar los datos de entrega de un pedido, debe notificárnoslo urgentemente escribiendo a info@manymakeups.com o llamando al 645 800 760.",
          },
          {
            type: "p",
            text: "Estas modificaciones solo serán posibles si el paquete aún no ha salido de nuestro estudio. Una vez entregado a Correos, será imposible cancelar el envío o modificar la dirección de destino.",
          },
          {
            type: "p",
            text: "Si cancela el pedido antes de que confirmemos el stock, la preautorización se anulará sin ningún cargo. Si el pago ya se había confirmado pero el paquete aún no ha sido expedido, procederemos a reembolsar el importe íntegro mediante el mismo método de pago original.",
          },
        ],
      },
    ],
  },
  en: {
    title: "Shipping policy",
    description: "Correos Carta Certificada throughout Spain. Free over €100, otherwise €2.90.",
    sections: [
      {
        heading: "1. Where we ship, and how",
        blocks: [
          {
            type: "p",
            text: "We ship throughout Spain: the mainland, the Balearic Islands, the Canary Islands, Ceuta and Melilla. We do not ship abroad and there is no collection from the studio. Every order leaves our studio at C/ Santa Teresa 2, 12520 Nules (Castellón).",
          },
          {
            type: "p",
            text: "Every parcel goes exclusively with Correos as Carta Certificada, so there is a tracking number for any address in Spain.",
          },
        ],
      },
      {
        heading: "2. Shipping rates",
        blocks: [
          { type: "p", text: "Shipping is a flat rate for the whole of Spain:" },
          {
            type: "ul",
            items: [
              "Free shipping: product orders over €100.",
              "Standard shipping (€2.90): orders of €100 or less.",
            ],
          },
          {
            type: "p",
            text: "The free-shipping threshold is calculated on the amount you actually pay for the extensions, after VAT is removed when the destination is the Canary Islands, Ceuta or Melilla. For the mainland and the Balearic Islands, the €2.90 rate already includes VAT.",
          },
          {
            type: "p",
            text: "Returns: the original shipping charge (€2.90) is not refunded. If you return all or part of an order that qualified for free shipping (it was over €100), that free shipping no longer applies and €2.90 is deducted from the refund.",
          },
        ],
      },
      {
        heading: "3. The Canary Islands, Ceuta and Melilla",
        blocks: [
          {
            type: "p",
            text: "To send to these destinations you must give your DNI or NIE during checkout.",
          },
          {
            type: "p",
            text: "These orders are invoiced without VAT. The invoice includes this wording: «Operación exenta de IVA en virtud del artículo 21 de la Ley 37/1992, del Impuesto sobre el Valor Añadido».",
          },
          {
            type: "p",
            text: "Local taxes (IGIC or IPSI) and customs handling charges are payable by you on delivery. We are not responsible for duties, special taxes or delays caused by customs holds.",
          },
        ],
      },
      {
        heading: "4. Preparation time",
        blocks: [
          {
            type: "p",
            text: "Payment is pre-authorised so we can confirm stock. The amount is only reserved on your card. We check the exact model and colour; we charge and pack the order only if it is available. If it is not, the hold is released at no cost.",
          },
          {
            type: "p",
            text: "Because of that check, orders do not leave on the day you buy. You receive an email when the payment is confirmed, and a second email with the tracking number when the parcel leaves the studio. We hand parcels to Correos on business days only. Weekends and public holidays do not count.",
          },
        ],
      },
      {
        heading: "5. Estimated delivery (Correos)",
        blocks: [
          {
            type: "p",
            text: "Parcels travel as Carta Certificada (under 500 g). The clock starts when the parcel is handed in at a Correos office:",
          },
          {
            type: "ul",
            items: [
              "Mainland and Balearic Islands: 1 to 4 business days. Correos delivers 93% of these shipments in 3 days or less.",
              "Canary Islands, Ceuta and Melilla: 3 to 7 business days in total. Add 1 to 3 days to the usual transit time for customs. If customs holds the parcel for a random inspection, or the recipient is slow to pay IGIC or IPSI, the delivery time pauses and can run longer.",
            ],
          },
          {
            type: "p",
            text: "We are not liable when those times change for reasons outside the studio: strikes, severe weather, Correos incidents, or peak periods (Christmas, Black Friday, sales). We are also not liable for delays caused by an incorrect address or a lost delivery notice.",
          },
        ],
      },
      {
        heading: "6. Tracking",
        blocks: [
          {
            type: "p",
            text: "Once the parcel has been dispatched you receive a tracking number for the Correos website, or you can call Correos customer service on 902 197 197.",
          },
        ],
      },
      {
        heading: "7. Changes and cancellations",
        blocks: [
          {
            type: "p",
            text: "To cancel an order or change the delivery details, write to info@manymakeups.com or call 645 800 760 as soon as you can.",
          },
          {
            type: "p",
            text: "We can only change it if the parcel has not yet left the studio. Once it is with Correos, the shipment cannot be cancelled and the address cannot be changed.",
          },
          {
            type: "p",
            text: "If you cancel before we confirm stock, the pre-authorisation is released with no charge. If the payment was already captured but the parcel has not left, we refund the full amount to the same payment method.",
          },
        ],
      },
    ],
  },
  fr: {
    title: "Politique de livraison",
    description: "Carta Certificada de Correos dans toute l'Espagne. Offerte au-dessus de 100 €, sinon 2,90 €.",
    sections: [
      {
        heading: "1. Zone et mode d'envoi",
        blocks: [
          {
            type: "p",
            text: "Nous livrons dans toute l'Espagne : péninsule, îles Baléares, îles Canaries, Ceuta et Melilla. Nous n'expédions pas à l'étranger et il n'y a pas de retrait à l'atelier. Toutes les commandes partent de notre atelier, C/ Santa Teresa 2, 12520 Nules (Castellón).",
          },
          {
            type: "p",
            text: "Tous les envois passent exclusivement par Correos, en Carta Certificada, avec un numéro de suivi pour n'importe quelle adresse en Espagne.",
          },
        ],
      },
      {
        heading: "2. Tarifs",
        blocks: [
          { type: "p", text: "Les frais de livraison sont forfaitaires pour toute l'Espagne :" },
          {
            type: "ul",
            items: [
              "Livraison offerte : commandes de produits supérieures à 100 €.",
              "Livraison standard (2,90 €) : commandes de 100 € ou moins.",
            ],
          },
          {
            type: "p",
            text: "Le seuil de la livraison offerte se calcule sur le montant réellement payé pour les extensions, une fois la TVA retirée si la destination est les Canaries, Ceuta ou Melilla. Vers la péninsule et les Baléares, les 2,90 € incluent déjà la TVA.",
          },
          {
            type: "p",
            text: "Retours : les frais d'envoi d'origine (2,90 €) ne sont pas remboursés. Si le client retourne tout ou partie d'une commande qui avait bénéficié de la livraison offerte (elle dépassait 100 €), cette gratuité tombe et 2,90 € sont déduits du remboursement.",
          },
        ],
      },
      {
        heading: "3. Canaries, Ceuta et Melilla",
        blocks: [
          {
            type: "p",
            text: "Pour ces destinations, le DNI ou le NIE est obligatoire au moment de la commande.",
          },
          {
            type: "p",
            text: "Ces opérations sont facturées sans TVA, avec la mention : «Operación exenta de IVA en virtud del artículo 21 de la Ley 37/1992, del Impuesto sobre el Valor Añadido».",
          },
          {
            type: "p",
            text: "Les taxes locales (IGIC ou IPSI) et les frais de dédouanement sont à la charge du client et se règlent à la livraison. L'atelier n'est pas responsable des droits, taxes spéciales ni des retards dus à une retenue en douane.",
          },
        ],
      },
      {
        heading: "4. Délai de préparation",
        blocks: [
          {
            type: "p",
            text: "Le paiement est préautorisé pour confirmer le stock. Le montant est seulement réservé sur la carte. Nous vérifions le modèle et la couleur ; nous encaissons et préparons le colis seulement s'il est disponible. Sinon, la retenue est annulée sans frais.",
          },
          {
            type: "p",
            text: "À cause de cette vérification, les commandes ne partent pas le jour de l'achat. Vous recevez un e-mail quand le paiement est confirmé, puis un second e-mail avec le suivi quand le colis quitte l'atelier. La remise à Correos se fait uniquement les jours ouvrés. Les week-ends et jours fériés ne comptent pas.",
          },
        ],
      },
      {
        heading: "5. Délais estimés (Correos)",
        blocks: [
          {
            type: "p",
            text: "Les colis voyagent en Carta Certificada (moins de 500 g). Le délai court à partir du dépôt au bureau de Correos :",
          },
          {
            type: "ul",
            items: [
              "Péninsule et Baléares : 1 à 4 jours ouvrés. Correos livre 93 % de ces envois en 3 jours ou moins.",
              "Canaries, Ceuta et Melilla : 3 à 7 jours ouvrés au total. Il faut ajouter 1 à 3 jours de douane au transit habituel. Si la douane retient le colis pour un contrôle, ou si le destinataire tarde à payer l'IGIC ou l'IPSI, le délai est suspendu et peut s'allonger.",
            ],
          },
          {
            type: "p",
            text: "Ces délais peuvent changer pour des causes étrangères à l'atelier : grèves, météo, incidents Correos ou périodes de forte demande (Noël, Black Friday, soldes). Nous ne répondons pas non plus des retards dus à une adresse incorrecte ou à un avis de passage perdu.",
          },
        ],
      },
      {
        heading: "6. Suivi",
        blocks: [
          {
            type: "p",
            text: "Une fois le colis expédié, vous recevez un numéro de suivi à saisir sur le site de Correos, ou à demander au 902 197 197.",
          },
        ],
      },
      {
        heading: "7. Modifications et annulations",
        blocks: [
          {
            type: "p",
            text: "Pour annuler une commande ou modifier l'adresse, écrivez vite à info@manymakeups.com ou appelez le 645 800 760.",
          },
          {
            type: "p",
            text: "C'est possible seulement tant que le colis n'a pas quitté l'atelier. Une fois remis à Correos, l'envoi ne peut plus être annulé ni l'adresse changée.",
          },
          {
            type: "p",
            text: "Si vous annulez avant la confirmation du stock, la préautorisation est levée sans débit. Si le paiement était déjà encaissé mais le colis pas encore parti, nous remboursons l'intégralité sur le même moyen de paiement.",
          },
        ],
      },
    ],
  },
};

export function shippingPolicy(locale: Locale) {
  return shipping[locale];
}
