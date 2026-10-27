import { fetchAds, fetchSiteSettings } from "@/lib/ads";
import { fetchSiteContent } from "@/lib/site-content";
import { registrarAtividade } from "@/lib/activity";

/**
 * Gera uma cópia de segurança dos dados do site (anúncios, textos e configurações).
 * Serve para guardar fora do site e poder restaurar o conteúdo manualmente.
 */
export async function exportarDados() {
  const [anuncios, configuracoes, conteudo] = await Promise.all([
    fetchAds(),
    fetchSiteSettings(),
    fetchSiteContent(),
  ]);

  const pacote = {
    gerado_em: new Date().toISOString(),
    anuncios,
    conteudo,
    configuracoes: {
      paymentNote: configuracoes.paymentNote,
      footerNote: configuracoes.footerNote,
      whatsappNumber: configuracoes.whatsappNumber,
    },
  };

  const blob = new Blob([JSON.stringify(pacote, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `copia-de-seguranca-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  await registrarAtividade("backup_baixado", { anuncios: anuncios.length });
}
