import { Outlet } from "react-router-dom";
import { SiteTracking } from "@/components/site/site-tracking";

/** Casca comum a todas as rotas: rastreamento de campanhas + página. */
export function SiteShell() {
  return (
    <>
      <SiteTracking />
      <Outlet />
    </>
  );
}
