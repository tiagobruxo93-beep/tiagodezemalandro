/**
 * Gera o código Pix (BR Code / EMV) para o QR code.
 * É esse formato que faz o banco abrir a tela de pagamento quando a pessoa
 * aponta a câmera — um link comum abriria o navegador, não o banco.
 */

export type DadosPix = {
  chave: string;
  nome: string;
  cidade: string;
  valor: string;
  descricao: string;
};

function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function textoLimpo(valor: string, max: number) {
  return semAcento(valor)
    .replace(/[^A-Za-z0-9 .,\-*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function campo(id: string, valor: string) {
  const tamanho = String(valor.length).padStart(2, "0");
  return `${id}${tamanho}${valor}`;
}

/** CRC16/CCITT-FALSE, exigido pelo padrão do Banco Central. */
function crc16(texto: string) {
  let crc = 0xffff;

  for (let indice = 0; indice < texto.length; indice += 1) {
    crc ^= texto.charCodeAt(indice) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function valorNumerico(valor: string) {
  const limpo = (valor || "").replace(/[^\d.,]/g, "").trim();
  if (!limpo) return "";

  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;

  const numero = Number(normalizado);
  if (!Number.isFinite(numero) || numero <= 0) return "";

  return numero.toFixed(2);
}

export function pixConfigurado(pix: DadosPix | undefined | null) {
  return Boolean(pix && pix.chave.trim() && pix.nome.trim() && pix.cidade.trim());
}

export function montarPix(pix: DadosPix) {
  const chave = pix.chave.trim();
  const nome = textoLimpo(pix.nome, 25).toUpperCase() || "RECEBEDOR";
  const cidade = textoLimpo(pix.cidade, 15).toUpperCase() || "SAO PAULO";
  const valor = valorNumerico(pix.valor);
  const descricao = textoLimpo(pix.descricao, 40);
  const txid = textoLimpo(pix.descricao, 25).toUpperCase().replace(/[^A-Z0-9]/g, "") || "***";

  const conta =
    campo("00", "br.gov.bcb.pix") +
    campo("01", chave) +
    (descricao ? campo("02", descricao) : "");

  const adicional = campo("05", txid.slice(0, 25) || "***");

  const payload =
    campo("00", "01") +
    campo("01", "11") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    (valor ? campo("54", valor) : "") +
    campo("58", "BR") +
    campo("59", nome) +
    campo("60", cidade) +
    campo("62", adicional) +
    "6304";

  return payload + crc16(payload);
}
