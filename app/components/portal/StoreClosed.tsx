import { PortalFrame, PortalNotice } from "./PortalFrame";
import { StudioAside } from "./StudioAside";

export function StoreClosed() {
  return (
    <PortalFrame pinned kicker="Estudio" title="Área privada." studio aside={<StudioAside />}>
      <PortalNotice>
        La clave ha entrado. Las clientas no cargan porque el almacén de Vercel está cerrado hasta el 22
        de noviembre, y ahí está todo el estudio. En Vercel, Storage, Upgrade to Pro lo abre hoy. Hasta
        entonces esta zona no puede leer ni guardar fichas.
      </PortalNotice>
    </PortalFrame>
  );
}
