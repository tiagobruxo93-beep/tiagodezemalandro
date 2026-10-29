import { lazy } from "react";
import Index from "./pages/Index";

// A home vai no pacote inicial; o resto carrega só quando a pessoa abre a página.
// Isso reduz bastante o download no celular (painel e páginas legais são pesados).
const AdPage = lazy(() => import("./pages/AdPage"));
const VideosPage = lazy(() => import("./pages/VideosPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const RefundPage = lazy(() => import("./pages/RefundPage"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Index />,
  },
  {
    path: "/anuncio/:slug",
    name: "anuncio",
    element: <AdPage />,
  },
  {
    path: "/painel-do-pai-tiago-93k",
    name: "painel",
    element: <Admin />,
  },
  {
    path: "/videos",
    name: "videos",
    element: <VideosPage />,
  },
  {
    path: "/privacidade",
    name: "privacidade",
    element: <PrivacyPage />,
  },
  {
    path: "/termos",
    name: "termos",
    element: <TermsPage />,
  },
  {
    path: "/reembolso",
    name: "reembolso",
    element: <RefundPage />,
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
