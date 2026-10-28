import { createRoot } from "react-dom/client";
import "./setup";
import { bootstrapGeneratedSiteAnalytics } from "./analytics.ts";
import { registrarVisita } from "./lib/visits.ts";
import App from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/error-boundary/error-fallback";
import { reportCaughtError } from "./lib/report-caught-error";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found.");
}

bootstrapGeneratedSiteAnalytics();
void registrarVisita();

// Cache de imagens, fontes e vídeos (nunca HTML/JS) — só na versão publicada.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}

createRoot(container, { onCaughtError: reportCaughtError }).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>,
);
