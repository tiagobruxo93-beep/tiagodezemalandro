import Index from "./pages/Index";
import AdPage from "./pages/AdPage";
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
