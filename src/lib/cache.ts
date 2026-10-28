/**
 * Cópia local leve: mantém o site funcionando mesmo se o backend demorar ou cair.
 */
const PREFIXO = "paitiago:v2:";

export function lerCache<T>(chave: string): T | null {
  try {
    const bruto = window.localStorage.getItem(PREFIXO + chave);
    if (!bruto) return null;
    return JSON.parse(bruto) as T;
  } catch {
    return null;
  }
}

export function gravarCache(chave: string, valor: unknown) {
  try {
    window.localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
    // Cache é só uma reserva: se falhar, o site segue normalmente.
  }
}
