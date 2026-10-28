import Index from "./pages/Index";
import AdPage from "./pages/AdPage";
import VideosPage from "./pages/VideosPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

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
