/**
 * Blindagem de endereços e utilidades de segurança do site.
 */

/** Só permite caminhos internos ou endereços http/https. */
export function safeUrl(value: string | null | undefined, fallback = ""): string {
  const bruto = (value ?? "").trim();

  if (bruto === "") return fallback;

  // Caminho interno do próprio site (/images/...)
  if (bruto.startsWith("/") && !bruto.startsWith("//")) {
    return bruto;
  }

  try {
    const url = new URL(bruto, window.location.origin);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return fallback;
  }

  // Qualquer outro protocolo (javascript:, data:, vbscript:) é descartado.
  return fallback;
}

/** Somente números, para montar links de WhatsApp. */
export function onlyDigits(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").slice(0, 20);
}

/** Atributos obrigatórios em qualquer link para fora do site. */
export const SAFE_LINK = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
