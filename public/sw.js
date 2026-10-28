/* Cache de mídia do site (imagens, fontes e vídeos).
   HTML e JavaScript NUNCA entram no cache: assim o site não fica preso em versão antiga. */

const CACHE = "paitiago-midia-v1";
const PREFIXO = "paitiago-midia-";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const chaves = await caches.keys();
      await Promise.all(
        chaves
          .filter((chave) => chave.startsWith(PREFIXO) && chave !== CACHE)
          .map((chave) => caches.delete(chave)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const requisicao = event.request;

  if (requisicao.method !== "GET") return;

  const url = new URL(requisicao.url);
  const mesmaOrigem = url.origin === self.location.origin;

  const ehMidia =
    requisicao.destination === "image" ||
    requisicao.destination === "font" ||
    /\.(jpg|jpeg|png|webp|gif|svg|ico|woff2?)$/i.test(url.pathname) ||
    (mesmaOrigem && url.pathname.startsWith("/videos/"));

  if (!ehMidia) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const guardado = await cache.match(requisicao);

      const daRede = fetch(requisicao)
        .then((resposta) => {
          if (resposta && resposta.status === 200) {
            cache.put(requisicao, resposta.clone()).catch(() => undefined);
          }
          return resposta;
        })
        .catch(() => guardado);

      return guardado || daRede;
    })(),
  );
});
