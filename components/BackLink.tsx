"use client";

import { useRouter } from "next/navigation";

export default function BackLink({
  fallbackHref,
  children,
  className,
}: {
  fallbackHref: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <a
      href={fallbackHref}
      onClick={(e) => {
        e.preventDefault();
        // Si llegamos navegando dentro del propio sitio, "atrás" respeta
        // los filtros/página/scroll con los que se venía. document.referrer
        // no sirve para detectar esto: no cambia con la navegación cliente
        // de Next (Link/router.push), solo con cargas de página completas.
        // history.length sí crece con cada navegación dentro de la SPA, así
        // que es la señal confiable para ese caso; el referrer solo cubre el
        // caso restante de una carga completa previa dentro del sitio.
        const sameOriginReferrer =
          document.referrer && new URL(document.referrer).origin === window.location.origin;
        const navigatedWithinSite = window.history.length > 1;

        if (sameOriginReferrer || navigatedWithinSite) {
          router.back();
        } else {
          // Enlace compartido / pestaña nueva: no hay a dónde volver.
          router.push(fallbackHref);
        }
      }}
      className={className}
    >
      {children}
    </a>
  );
}
