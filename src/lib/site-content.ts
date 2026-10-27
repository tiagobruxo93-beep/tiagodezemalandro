import { SUPABASE_URL, supabase } from "@/integrations/supabase/client";
import * as tus from "tus-js-client";
import { IMAGE_LIBRARY } from "@/lib/ads";

export const CONTENT_IMAGES = IMAGE_LIBRARY;

export type FrenteKey = "coletivo" | "individual" | "consulta";
export type SecaoKey =
  | "trabalhos"
  | "como-funciona"
  | "corrente"
  | "videos"
  | "sobre"
  | "galeria"
  | "duvidas";

export type AbaConfig = {
  label: string;
  hint: string;
  text: string;
  active: boolean;
};

export const FRENTES: FrenteKey[] = ["coletivo", "individual", "consulta"];

export const SECOES_META: Record<SecaoKey, { label: string; descricao: string }> = {
  trabalhos: { label: "Trabalhos", descricao: "Abas e cards dos anúncios" },
  "como-funciona": { label: "Como funciona", descricao: "Os passos do trabalho coletivo" },
  corrente: { label: "Corrente de fé", descricao: "Faixa com chamada e foto" },
  videos: { label: "Vídeos", descricao: "Seção de vídeos (se houver vídeo)" },
  sobre: { label: "Sobre mim", descricao: "Apresentação, foto e números" },
  galeria: { label: "Galeria", descricao: "Fotos do terreiro" },
  duvidas: { label: "Dúvidas", descricao: "Perguntas frequentes" },
};

export type StepItem = { title: string; text: string };
export type StatItem = { value: string; label: string };
export type PhotoItem = { url: string; alt: string };
export type VideoItem = {
  title: string;
  text: string;
  url: string;
  cover: string;
  link: string;
};
export type FaqItem = { q: string; a: string };

export interface SiteContent {
  hero: { eyebrow: string; title: string; highlight: string; subtitle: string; image: string };
  steps: { eyebrow: string; title: string; text: string; items: StepItem[] };
  corrente: {
    eyebrow: string;
    title: string;
    highlight: string;
    text: string;
    button: string;
    image: string;
  };
  trabalhos: { eyebrow: string; title: string; text: string };
  sobre: {
    eyebrow: string;
    title: string;
    text: string;
    quote: string;
    button: string;
    image: string;
    stats: StatItem[];
  };
  galeria: { title: string; text: string; photos: PhotoItem[] };
  videos: { enabled: boolean; eyebrow: string; title: string; text: string; items: VideoItem[] };
  faq: { eyebrow: string; title: string; highlight: string; intro: string; items: FaqItem[] };
  abas: { ordem: FrenteKey[]; inicial: FrenteKey; itens: Record<FrenteKey, AbaConfig> };
  secoes: { ordem: SecaoKey[] };
  manutencao: { ativo: boolean; mensagem: string };
  rodape: { note: string };
  contato: { whatsapp: string; instagram: string; paymentNote: string };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Trabalhos coletivos · Umbanda",
    title: "A força de muitos,",
    highlight: "a firmeza do Seu Zé.",
    subtitle:
      "Coloque seu nome na corrente de fé do terreiro. Trabalhos realizados com responsabilidade, tradição e o axé de Zé Malandro.",
    image: "/images/hero-altar-art.jpg",
  },
  steps: {
    eyebrow: "Como funciona",
    title: "O que é um trabalho coletivo",
    text: "No trabalho coletivo, os pedidos de várias pessoas são firmados juntos, na mesma gira. A união de fé de todos fortalece cada nome colocado aos pés do Seu Zé — e torna o trabalho acessível para quem precisa.",
    items: [
      { title: "Escolha o trabalho", text: "Veja nas abas qual trabalho combina com o que você precisa neste momento." },
      { title: "Pagamento seguro", text: "O botão de encaminhamento leva direto ao checkout, com Pix, cartão ou boleto." },
      { title: "Envie seu nome", text: "Após a compra, você informa seu nome completo e o seu pedido no WhatsApp." },
      { title: "Firmeza no terreiro", text: "Seu nome é firmado junto com os demais na data do trabalho coletivo." },
    ],
  },
  corrente: {
    eyebrow: "A corrente de fé",
    title: "Seu nome merece estar",
    highlight: "nessa corrente.",
    text: "Escolha seu trabalho e garanta sua vaga na próxima gira coletiva. O pedido é recebido com sigilo e firmado com o mesmo cuidado de um atendimento individual.",
    button: "Escolher meu trabalho",
    image: "/images/galeria-nomes.jpg",
  },
  trabalhos: {
    eyebrow: "Escolha o seu",
    title: "Meus trabalhos",
    text: "Cada anúncio tem sua própria aba, com ficha completa e botão de encaminhamento direto para o pagamento seguro ou para o WhatsApp.",
  },
  sobre: {
    eyebrow: "Sobre mim",
    title: "Pai Tiago de Zé Malandro",
    text: "Sou Pai Tiago, filho de Umbanda e zelador espiritual. Há anos caminho ao lado de Seu Zé Malandro, entidade que me ensinou que a fé, a palavra e o respeito abrem qualquer porta.\nCriei os trabalhos coletivos para que todos tenham acesso à força do terreiro, independente de onde estejam. Cada nome é recebido com carinho e firmado com a mesma seriedade de um trabalho individual.\nAqui não tem promessa vazia: tem tradição, compromisso e muito axé.",
    quote: "A fé, a palavra e o respeito abrem qualquer porta.",
    button: "Conversar com o Pai Tiago",
    image: "/images/pai-tiago.jpg",
    stats: [
      { value: "1.000", label: "Nomes firmados" },
      { value: "13", label: "Trabalhos ativos" },
      { value: "Toda", label: "Semana, gira" },
    ],
  },
  galeria: {
    title: "Do terreiro para você",
    text: "Registros das firmas, dos nomes e das oferendas preparadas em cada gira.",
    photos: [
      { url: "/images/galeria-terreiro.jpg", alt: "Gira de trabalho coletivo no terreiro" },
      { url: "/images/galeria-nomes.jpg", alt: "Nomes sendo escritos para a corrente" },
      { url: "/images/trabalho-caminhos.jpg", alt: "Firmeza de abertura de caminhos" },
      { url: "/images/trabalho-demanda.jpg", alt: "Firmeza de quebra de demanda" },
    ],
  },
  videos: {
    enabled: true,
    eyebrow: "Explicações",
    title: "Assista e entenda cada trabalho",
    text: "Vídeos explicando como os trabalhos são preparados e realizados no terreiro.",
    items: [],
  },
  faq: {
    eyebrow: "Dúvidas",
    title: "Perguntas",
    highlight: "frequentes",
    intro: "Se a sua dúvida não estiver aqui, me chame no WhatsApp. Atendimento direto, com sigilo.",
    items: [
      { q: "Preciso estar presente no terreiro?", a: "Não. Você envia seu nome completo e o seu pedido pelo WhatsApp, e o trabalho é firmado no terreiro na data da gira. A presença física não é necessária." },
      { q: "Quando o trabalho é realizado?", a: "Os trabalhos coletivos são realizados nas giras semanais da casa. A data exata é avisada no WhatsApp logo após a confirmação do pagamento." },
      { q: "Como faço o pagamento?", a: "Cada anúncio tem um botão de encaminhamento que abre o checkout seguro, com Pix, cartão ou boleto. Trabalhos individuais e consultas são combinados direto no WhatsApp." },
      { q: "Posso participar de mais de um trabalho?", a: "Sim. O ideal é respeitar o intervalo que eu orientar entre um trabalho e outro, para que a firmeza faça efeito." },
      { q: "O resultado é garantido?", a: "Nenhum trabalho espiritual sério promete resultado. O que eu garanto é compromisso, tradição e a firmeza feita com respeito." },
    ],
  },
  abas: {
    ordem: ["coletivo", "individual", "consulta"],
    inicial: "coletivo",
    itens: {
      coletivo: {
        label: "Coletivos",
        hint: "Firmezas em corrente",
        text: "Pedidos firmados juntos, na mesma gira. A corrente de fé deixa o trabalho acessível.",
        active: true,
      },
      individual: {
        label: "Individuais",
        hint: "Atendimento exclusivo",
        text: "Feitos só para você, com a atenção do Pai Tiago e sigilo total.",
        active: true,
      },
      consulta: {
        label: "Consultas",
        hint: "Leituras e orientações",
        text: "Leituras de cartas, búzios e caminhos para clarear o próximo passo.",
        active: true,
      },
    },
  },
  secoes: {
    ordem: ["trabalhos", "como-funciona", "corrente", "videos", "sobre", "galeria", "duvidas"],
  },
  manutencao: {
    ativo: false,
    mensagem: "O site está em manutenção por alguns instantes. Fale comigo no WhatsApp que eu te atendo.",
  },
  rodape: { note: "Tradição, sigilo e axé em cada firmeza." },
  contato: {
    whatsapp: "5511999999999",
    instagram: "https://www.instagram.com/tiagodezemalandro/",
    paymentNote: "Pagamento processado com segurança pela Cakto",
  },
};

function texto(valor: unknown, padrao: string) {
  return typeof valor === "string" && valor.trim() !== "" ? valor : padrao;
}

function lista<T>(valor: unknown, padrao: T[]): T[] {
  return Array.isArray(valor) && valor.length > 0 ? (valor as T[]) : padrao;
}

function mergeAbas(salvo: Record<string, unknown>, base: SiteContent["abas"]): SiteContent["abas"] {
  const itens = { ...base.itens } as SiteContent["abas"]["itens"];
  const brutos =
    salvo.itens && typeof salvo.itens === "object"
      ? (salvo.itens as Record<string, Record<string, unknown>>)
      : {};

  FRENTES.forEach((frente) => {
    const atual = brutos[frente] ?? {};
    const padrao = base.itens[frente];
    itens[frente] = {
      label: texto(atual.label, padrao.label),
      hint: texto(atual.hint, padrao.hint),
      text: texto(atual.text, padrao.text),
      active: typeof atual.active === "boolean" ? atual.active : padrao.active,
    };
  });

  const ordem: FrenteKey[] = [];
  if (Array.isArray(salvo.ordem)) {
    (salvo.ordem as string[]).forEach((chave) => {
      if (FRENTES.includes(chave as FrenteKey) && !ordem.includes(chave as FrenteKey)) {
        ordem.push(chave as FrenteKey);
      }
    });
  }
  FRENTES.forEach((frente) => {
    if (!ordem.includes(frente)) ordem.push(frente);
  });

  const inicial = FRENTES.includes(salvo.inicial as FrenteKey)
    ? (salvo.inicial as FrenteKey)
    : base.inicial;

  return { ordem, inicial, itens };
}

function mergeSecoes(salvo: unknown, base: SecaoKey[]): SecaoKey[] {
  const conhecidas = Object.keys(SECOES_META) as SecaoKey[];
  const ordem: SecaoKey[] = [];

  if (Array.isArray(salvo)) {
    (salvo as string[]).forEach((chave) => {
      if (conhecidas.includes(chave as SecaoKey) && !ordem.includes(chave as SecaoKey)) {
        ordem.push(chave as SecaoKey);
      }
    });
  }

  conhecidas.forEach((chave) => {
    if (!ordem.includes(chave)) ordem.push(chave);
  });

  return ordem.length ? ordem : base;
}

/** Junta o conteúdo salvo com os padrões, sem perder campos novos. */
export function mergeContent(raw: unknown): SiteContent {
  const base = DEFAULT_CONTENT;
  if (!raw || typeof raw !== "object") return base;

  const data = raw as Record<string, Record<string, unknown>>;
  const bloco = (chave: keyof SiteContent) =>
    (data[chave] && typeof data[chave] === "object" ? data[chave] : {}) as Record<string, unknown>;

  const hero = bloco("hero");
  const steps = bloco("steps");
  const corrente = bloco("corrente");
  const trabalhos = bloco("trabalhos");
  const sobre = bloco("sobre");
  const galeria = bloco("galeria");
  const videos = bloco("videos");
  const faq = bloco("faq");
  const abas = bloco("abas");
  const secoes = bloco("secoes");
  const manutencao = bloco("manutencao");
  const rodape = bloco("rodape");
  const contato = bloco("contato");

  return {
    hero: {
      eyebrow: texto(hero.eyebrow, base.hero.eyebrow),
      title: texto(hero.title, base.hero.title),
      highlight: texto(hero.highlight, base.hero.highlight),
      subtitle: texto(hero.subtitle, base.hero.subtitle),
      image: texto(hero.image, base.hero.image),
    },
    steps: {
      eyebrow: texto(steps.eyebrow, base.steps.eyebrow),
      title: texto(steps.title, base.steps.title),
      text: texto(steps.text, base.steps.text),
      items: lista<StepItem>(steps.items, base.steps.items),
    },
    corrente: {
      eyebrow: texto(corrente.eyebrow, base.corrente.eyebrow),
      title: texto(corrente.title, base.corrente.title),
      highlight: texto(corrente.highlight, base.corrente.highlight),
      text: texto(corrente.text, base.corrente.text),
      button: texto(corrente.button, base.corrente.button),
      image: texto(corrente.image, base.corrente.image),
    },
    trabalhos: {
      eyebrow: texto(trabalhos.eyebrow, base.trabalhos.eyebrow),
      title: texto(trabalhos.title, base.trabalhos.title),
      text: texto(trabalhos.text, base.trabalhos.text),
    },
    sobre: {
      eyebrow: texto(sobre.eyebrow, base.sobre.eyebrow),
      title: texto(sobre.title, base.sobre.title),
      text: texto(sobre.text, base.sobre.text),
      quote: texto(sobre.quote, base.sobre.quote),
      button: texto(sobre.button, base.sobre.button),
      image: texto(sobre.image, base.sobre.image),
      stats: lista<StatItem>(sobre.stats, base.sobre.stats),
    },
    galeria: {
      title: texto(galeria.title, base.galeria.title),
      text: texto(galeria.text, base.galeria.text),
      photos: lista<PhotoItem>(galeria.photos, base.galeria.photos),
    },
    videos: {
      enabled: typeof videos.enabled === "boolean" ? videos.enabled : base.videos.enabled,
      eyebrow: texto(videos.eyebrow, base.videos.eyebrow),
      title: texto(videos.title, base.videos.title),
      text: texto(videos.text, base.videos.text),
      items: Array.isArray(videos.items)
        ? (videos.items as VideoItem[]).map((item) => ({
            title: typeof item?.title === "string" ? item.title : "",
            text: typeof item?.text === "string" ? item.text : "",
            url: typeof item?.url === "string" ? item.url : "",
            cover: typeof item?.cover === "string" ? item.cover : "",
            link: typeof item?.link === "string" ? item.link : "",
          }))
        : base.videos.items,
    },
    faq: {
      eyebrow: texto(faq.eyebrow, base.faq.eyebrow),
      title: texto(faq.title, base.faq.title),
      highlight: texto(faq.highlight, base.faq.highlight),
      intro: texto(faq.intro, base.faq.intro),
      items: lista<FaqItem>(faq.items, base.faq.items),
    },
    abas: mergeAbas(abas, base.abas),
    secoes: { ordem: mergeSecoes(secoes.ordem, base.secoes.ordem) },
    manutencao: {
      ativo: typeof manutencao.ativo === "boolean" ? manutencao.ativo : base.manutencao.ativo,
      mensagem: texto(manutencao.mensagem, base.manutencao.mensagem),
    },
    rodape: { note: texto(rodape.note, base.rodape.note) },
    contato: {
      whatsapp: texto(contato.whatsapp, base.contato.whatsapp),
      instagram: texto(contato.instagram, base.contato.instagram),
      paymentNote: texto(contato.paymentNote, base.contato.paymentNote),
    },
  };
}

/** Lê o conteúdo salvo no backend (compatível com os campos antigos). */
export async function fetchSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("spiritual_site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const row = (data ?? {}) as Record<string, unknown>;
  const content = mergeContent(row.content);

  // Compatibilidade: se o conteúdo ainda não foi preenchido, usa os campos antigos.
  const legado = (chave: string, valor: string) => (valor ? valor : chave);
  content.hero.eyebrow = legado(String(row.hero_eyebrow ?? ""), content.hero.eyebrow);
  content.hero.title = legado(String(row.hero_title ?? ""), content.hero.title);
  content.hero.highlight = legado(String(row.hero_highlight ?? ""), content.hero.highlight);
  content.hero.subtitle = legado(String(row.hero_subtitle ?? ""), content.hero.subtitle);
  content.hero.image = legado(String(row.hero_image_url ?? ""), content.hero.image);
  content.sobre.title = legado(String(row.about_title ?? ""), content.sobre.title);
  content.sobre.text = legado(String(row.about_text ?? ""), content.sobre.text);
  content.rodape.note = legado(String(row.footer_note ?? ""), content.rodape.note);
  content.contato.whatsapp = legado(String(row.whatsapp_number ?? ""), content.contato.whatsapp);
  content.contato.paymentNote = legado(String(row.payment_note ?? ""), content.contato.paymentNote);

  return content;
}

/** Salva o conteúdo (e mantém os campos antigos em sincronia). */
export async function saveSiteContent(content: SiteContent) {
  const { error } = await supabase
    .from("spiritual_site_settings")
    .update({
      content: content as unknown as Record<string, unknown>,
      hero_eyebrow: content.hero.eyebrow,
      hero_title: content.hero.title,
      hero_highlight: content.hero.highlight,
      hero_subtitle: content.hero.subtitle,
      hero_image_url: content.hero.image,
      about_title: content.sobre.title,
      about_text: content.sobre.text,
      whatsapp_number: content.contato.whatsapp,
      payment_note: content.contato.paymentNote,
      footer_note: content.rodape.note,
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
}

const BUCKET = "images";
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_MB = 10;

/** Envia uma foto para o armazenamento e devolve o endereço público. */
export async function uploadSiteImage(file: File): Promise<string> {
  if (TIPOS.indexOf(file.type) === -1) {
    throw new Error("Formato não aceito. Use JPG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`Imagem muito grande. O limite é ${MAX_MB} MB.`);
  }

  const extensao = (file.name.split(".").pop() || "jpg").toLowerCase().replace("jpeg", "jpg");
  const caminho = `conteudo/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(caminho);
  if (!data?.publicUrl) throw new Error("Não foi possível obter o endereço da imagem.");

  return data.publicUrl;
}

const BUCKET_VIDEO = "videos";
const TIPOS_VIDEO = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/ogg",
  "video/mpeg",
  "video/x-msvideo",
];
const VIDEO_MAX_MB = 5120;
const LIMITE_BLOCOS_MB = 45;

function urlPublicaVideo(caminho: string) {
  const { data } = supabase.storage.from(BUCKET_VIDEO).getPublicUrl(caminho);
  if (!data?.publicUrl) throw new Error("Não foi possível obter o endereço do vídeo.");
  return data.publicUrl;
}

/** Sobe o arquivo em blocos, permitindo retomar e arquivos de vários GB. */
async function enviarVideoEmBlocos(
  file: File,
  caminho: string,
  aoProgredir?: (porcentagem: number) => void,
) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Entre no painel para enviar vídeos grandes.");
  }

  await new Promise<void>((resolve, reject) => {
    const envio = new tus.Upload(file, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 6000, 12000, 20000, 30000],
      chunkSize: 6 * 1024 * 1024,
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      headers: {
        authorization: `Bearer ${token}`,
        "x-upsert": "false",
      },
      metadata: {
        bucketName: BUCKET_VIDEO,
        objectName: caminho,
        contentType: file.type || "video/mp4",
        cacheControl: "3600",
      },
      onError: (erro) => reject(new Error(erro.message)),
      onProgress: (enviado, total) => {
        if (aoProgredir && total > 0) {
          aoProgredir(Math.min(100, Math.round((enviado / total) * 100)));
        }
      },
      onSuccess: () => resolve(),
    });

    envio.start();
  });
}

/**
 * Envia um vídeo do computador para o armazenamento e devolve o endereço público.
 * Arquivos grandes sobem em blocos (com retomada automática).
 */
export async function uploadSiteVideo(
  file: File,
  aoProgredir?: (porcentagem: number) => void,
): Promise<string> {
  const extensaoArquivo = (file.name.split(".").pop() || "").toLowerCase();
  const tipoOk =
    TIPOS_VIDEO.indexOf(file.type) !== -1 ||
    ["mp4", "webm", "mov", "m4v", "ogv", "ogg", "mpeg", "avi"].indexOf(extensaoArquivo) !== -1;

  if (!tipoOk) {
    throw new Error("Formato não aceito. Use MP4, WEBM, MOV, MPEG ou AVI.");
  }

  if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
    throw new Error(
      `Vídeo muito grande (${Math.round(file.size / 1024 / 1024)} MB). O limite é ${VIDEO_MAX_MB} MB.`,
    );
  }

  const extensao = extensaoArquivo || "mp4";
  const caminho = `conteudo/${crypto.randomUUID()}.${extensao}`;
  const grande = file.size > LIMITE_BLOCOS_MB * 1024 * 1024;

  if (grande) {
    try {
      await enviarVideoEmBlocos(file, caminho, aoProgredir);
      return urlPublicaVideo(caminho);
    } catch {
      // Se o envio em blocos não for aceito pelo servidor, tenta o envio direto.
    }
  }

  const { error } = await supabase.storage.from(BUCKET_VIDEO).upload(caminho, file, {
    contentType: file.type || "video/mp4",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  return urlPublicaVideo(caminho);
}

/** Endereço pronto para incorporar (YouTube/Vimeo) ou vazio. */
export function videoEmbedUrl(url: string): string {
  const valor = (url || "").trim();
  if (!valor) return "";

  const youtube = valor.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}?autoplay=1&rel=0`;

  const vimeo = valor.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;

  if (/\.(mp4|webm|ogv|ogg|m4v)$/i.test(valor)) return valor;

  return "";
}

export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogv|ogg|m4v)$/i.test((url || "").trim());
}
