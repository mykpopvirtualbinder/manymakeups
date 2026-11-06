import { LegalDoc } from "@/app/components/LegalDoc";
import { site } from "@/lib/site";
import { getLocale, getMessages, pageMeta } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale());
  return pageMeta({
    path: "/condiciones-de-venta",
    title: "Términos y Condiciones Generales de Venta",
    description: "Términos de venta de las extensiones de Many Makeups by Ana Zarza. Reserva del pago, factura, aduanas y reclamaciones.",
  });
}

export default async function CondicionesPage() {
  const t = getMessages(await getLocale());
  return (
    <LegalDoc
      kicker={t.legal.kicker}
      title="Términos y Condiciones Generales de Venta"
      updated="6 de noviembre de 2026"
      updatedLabel="Última actualización"
    >
      <section>
        <h2>1. Identidad del vendedor</h2>
        <p>
          Las presentes condiciones regulan la compraventa de productos a través de este sitio web, cuya titularidad corresponde a {site.legalPerson}, con NIF {site.nif} y operando bajo el nombre comercial {site.legalName}.
        </p>
        <p>
          Dirección del estudio: {site.streetAddress}, {site.postalCode} {site.city}, {site.region} (España).
        </p>
        <p>
          Correo electrónico: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p>
          Teléfono de contacto: <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
        </p>
      </section>
      <section>
        <h2>2. Objeto del contrato y precios</h2>
        <p>
          El objeto de estas condiciones es regular la adquisición de extensiones de cabello en nuestra tienda online. Los precios mostrados reflejan el Precio de Venta al Público (PVP) e incluyen el 21 % de IVA aplicable a los envíos con destino a la Península y Baleares.
        </p>
        <p>
          El contrato de compraventa no se formaliza en el momento de realizar el pago en la web, sino que se entenderá perfeccionado únicamente cuando el vendedor confirme de forma expresa la disponibilidad del producto y proceda al cobro definitivo de la reserva.
        </p>
      </section>
      <section>
        <h2>3. Registro de usuario y tratamiento de datos</h2>
        <p>
          Para formalizar un pedido es imprescindible crear una cuenta de usuario proporcionando datos veraces y completos: nombre, apellidos, correo electrónico, teléfono de contacto y dirección postal detallada (calle, número, piso/puerta, código postal, localidad y provincia). Estos datos serán los utilizados para gestionar la entrega.
        </p>
        <p>
          Pedidos con destino a Canarias, Ceuta y Melilla: es estrictamente obligatorio facilitar el DNI o NIE durante el registro para la correcta emisión de la factura y la gestión de los trámites aduaneros.
        </p>
        <p>
          Resto de envíos: la aportación del DNI o NIE solo será obligatoria si el cliente solicita explícitamente la emisión de una factura.
        </p>
      </section>
      <section>
        <h2>4. Proceso de pago y disponibilidad de stock</h2>
        <p>
          Debido a la naturaleza de los productos, no disponemos de stock físico permanente en el estudio. Por ello, operamos mediante un sistema de pago bajo reserva.
        </p>
        <p>
          Al finalizar la compra, su entidad bancaria realizará una preautorización (retención del importe en su tarjeta), pero el cobro no se hará efectivo de forma inmediata. A continuación, verificaremos la disponibilidad del modelo y color seleccionados:
        </p>
        <ul>
          <li>Si hay stock disponible: confirmaremos el pedido y se procesará el cargo definitivo en su tarjeta.</li>
          <li>Si no hay stock: cancelaremos la preautorización inmediatamente y no se realizará ningún cargo.</li>
        </ul>
        <p>
          Esta retención bancaria tiene una vigencia máxima aproximada de 7 días. Si este plazo caduca antes de poder confirmar la disponibilidad, el pedido quedará anulado automáticamente; si el cliente sigue interesado, deberá cursar un nuevo pedido. No se aceptan pagos mediante contrarreembolso ni PayPal.
        </p>
      </section>
      <section>
        <h2>5. Impuestos, aduanas y facturación</h2>
        <p>La fiscalidad de los pedidos varía en función del territorio de entrega:</p>
        <ul>
          <li>Península y Baleares: el precio de los productos y los gastos de envío incluyen el 21 % de IVA.</li>
          <li>
            Canarias, Ceuta y Melilla: estas operaciones se consideran exportaciones a efectos fiscales y están exentas de IVA. Las facturas incluirán la siguiente mención legal: «Operación exenta de IVA en virtud del artículo 21 de la Ley 37/1992, del Impuesto sobre el Valor Añadido». Los posibles impuestos locales (IGIC o IPSI) y los gastos de gestión aduanera no están incluidos en el precio y correrán exclusivamente a cargo del comprador en el momento de la entrega.
          </li>
        </ul>
        <p>
          La factura se generará únicamente cuando se confirme la disponibilidad y se procese el cobro definitivo. Si el pedido se anula durante la fase de reserva, no se emitirá factura. En caso de tramitarse el reembolso de un pedido ya facturado, se emitirá la correspondiente factura rectificativa.
        </p>
      </section>
      <section>
        <h2>6. Envíos, desistimiento y devoluciones</h2>
        <p>
          Las condiciones de entrega se rigen por lo estipulado en nuestra política de <a href="/envios">Envíos</a>.
        </p>
        <p>
          Respecto al derecho de desistimiento y los cambios, el cliente dispone de un plazo de 15 días hábiles desde la recepción del pedido. Por estrictas razones de higiene, solo se aceptarán devoluciones de extensiones que conserven su precinto intacto y que no hayan sido usadas, cortadas, teñidas ni manipuladas de ninguna forma. Para más detalles, consulte nuestra política de <a href="/devoluciones">Devoluciones</a>.
        </p>
      </section>
      <section>
        <h2>7. Atención al cliente y reclamaciones (requisito de vídeo unboxing)</h2>
        <p>
          Para resolver cualquier duda o incidencia, el cliente puede contactarnos a través de <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>
          <strong className="font-normal text-ink">Importante: política de protección ante incidencias.</strong> Para poder tramitar cualquier reclamación relativa a defectos, daños durante el transporte, artículos faltantes o errores en el producto recibido, será requisito indispensable aportar un vídeo continuo y sin cortes de la apertura del paquete (vídeo de unboxing).
        </p>
        <p>En dicho vídeo debe apreciarse claramente:</p>
        <ul>
          <li>El paquete (caja o sobre) totalmente cerrado y precintado en su estado original antes de abrirse, mostrando la etiqueta de envío.</li>
          <li>El momento exacto de la apertura.</li>
          <li>El estado en el que se extraen las extensiones y/o el defecto reclamado.</li>
        </ul>
        <p>
          Sin esta prueba visual de cómo el producto sale del embalaje original, no se admitirán reclamaciones por tara, defecto o falta de mercancía.
        </p>
        <p>
          Para lo que no sea imperativo por normativa de consumidores, las partes se someten expresamente a la jurisdicción de los juzgados y tribunales de Castellón.
        </p>
      </section>
    </LegalDoc>
  );
}
