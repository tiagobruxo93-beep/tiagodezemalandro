import { SUPABASE_URL, supabase } from "@/integrations/supabase/client";
import { IMAGE_LIBRARY } from "@/lib/ads";
import type { Json } from "@/integrations/supabase/types";

export const CONTENT_IMAGES = IMAGE_LIBRARY;

export type FrenteKey = "coletivo" | "individual" | "consulta";
export type SecaoKey =
  | "trabalhos"
  | "como-funciona"
  | "corrente"
  | "videos"
  | "sobre"
  | "galeria"
  | "eventos"
  | "apoie"
  | "duvidas";

export type ModoFoto = "sobreposicao" | "normal";

export type FundoItem = {
  src: string;
  opacidade: number;
  modo: ModoFoto;
};

export type BeneficioEvento = { titulo: string; texto: string };

export type ApoieSecao = {
  ativo: boolean;
  eyebrow: string;
  titulo: string;
  destaque: string;
  frase: string;
  texto: string;
  botao: string;
  link: string;
  imagem: string;
  opacidade: number;
  tamanhoQr: number;
};

export type EventosSecao = {
  ativo: boolean;
  eyebrow: string;
  titulo: string;
  destaque: string;
  texto: string;
  beneficios: BeneficioEvento[];
  botao: string;
  mensagem: string;
  imagem: string;
  opacidade: number;
};

export type FundoChave =
  | "trabalhos"
  | "comoFunciona"
  | "videos"
  | "duvidas"
  | "galeria"
  | "cards";

export const FUNDO_CHAVES: FundoChave[] = [
  "trabalhos",
  "comoFunciona",
  "videos",
  "duvidas",
  "galeria",
  "cards",
];

export const FUNDO_ROTULOS: Record<FundoChave, string> = {
  trabalhos: "Meus trabalhos",
  comoFunciona: "Como funciona",
  videos: "Vídeos",
  duvidas: "Dúvidas",
  galeria: "Fotos do terreiro",
  cards: "Cards sem arte",
};

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
  eventos: { label: "Eventos (VIP)", descricao: "Contato profissional e presença em eventos" },
  apoie: { label: "Apoie o terreiro", descricao: "QR code e convite para colaborar" },
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
  videos: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    text: string;
    heroUrl: string;
    alturaPlayer: number;
    items: VideoItem[];
  };
  eventos: EventosSecao;
  apoie: ApoieSecao;
  faq: { eyebrow: string; title: string; highlight: string; intro: string; items: FaqItem[] };
  abas: { ordem: FrenteKey[]; inicial: FrenteKey; itens: Record<FrenteKey, AbaConfig> };
  secoes: { ordem: SecaoKey[] };
  fundos: {
    itens: Record<FundoChave, FundoItem>;
  };
  juridico: {
    responsavel: string;
    documento: string;
    cidade: string;
    email: string;
    atualizado: string;
    reembolsoDias: string;
  };
  manutencao: { ativo: boolean; mensagem: string };
  rodape: { note: string };
  contato: {
    whatsapp: string;
    whatsappNumero: string;
    instagram: string;
    paymentNote: string;
  };
  popup: {
    ativo: boolean;
    adSlug: string;
    eyebrow: string;
    titulo: string;
    texto: string;
    botao: string;
    atraso: number;
    frequencia: "sessao" | "dia" | "sempre";
  };
  marketing: {
    metaPixel: string;
    ga4: string;
    exigirConsentimento: boolean;
    autoConfig: boolean;
    automaticMatching: boolean;
    eventoPageView: boolean;
    eventoContato: boolean;
    eventoCheckout: boolean;
    rotasBloqueadas: string;
  };
  protecao: {
    bloquearBotaoDireito: boolean;
    bloquearCopia: boolean;
    bloquearArrastarImagem: boolean;
    bloquearInspecao: boolean;
    noindex: boolean;
  };
  seguranca: {
    sessaoMinutos: number;
    tentativasLogin: number;
    exigirSenhaForte: boolean;
  };
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
    heroUrl: "",
    alturaPlayer: 460,
    items: [],
  },
  eventos: {
    ativo: true,
    eyebrow: "Contato profissional",
    titulo: "Leve o Pai Tiago",
    destaque: "ao seu evento.",
    texto:
      "Atendimento exclusivo para festas, casas, lojas e eventos privados. O Pai Tiago vai até você com a firmeza, o axé e a presença VIP que o seu evento merece — hora marcada, discrição e ritual preparado no local.",
    beneficios: [
      {
        titulo: "Presença VIP",
        texto: "Recepção reservada, com o ritual preparado no local do evento.",
      },
      {
        titulo: "Ritual sob medida",
        texto: "A firmeza é montada para o seu evento, com os materiais certos.",
      },
      {
        titulo: "Discrição total",
        texto: "Atendimento reservado, sem exposição de quem contrata.",
      },
    ],
    botao: "Quero a presença VIP",
    mensagem: "Olá, Pai Tiago! Quero levar a sua presença VIP para o meu evento.",
    imagem: "/images/fundo-evento.jpg",
    opacidade: 70,
  },
  apoie: {
    ativo: true,
    eyebrow: "Ajude o terreiro",
    titulo: "Cada gesto",
    destaque: "acende uma vela a mais.",
    frase:
      "A sua contribuição mantém as velas acesas, a corrente firme e a porta aberta para quem chega precisando.",
    texto:
      "Não é sobre quanto, é sobre junto. Com qualquer valor você ajuda a manter as oferendas, as giras e os trabalhos coletivos acontecendo — e recebe de volta em axé.",
    botao: "Quero ajudar o terreiro",
    link: "",
    imagem: "/images/fundo-ajude.jpg",
    opacidade: 65,
    tamanhoQr: 208,
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
    ordem: [
      "trabalhos",
      "como-funciona",
      "corrente",
      "videos",
      "sobre",
      "galeria",
      "eventos",
      "apoie",
      "duvidas",
    ],
  },
  fundos: {
    itens: {
      trabalhos: {
        src: "/images/fundo-escolha-trabalho.jpg",
        opacidade: 65,
        modo: "sobreposicao",
      },
      comoFunciona: {
        src: "/images/fundo-como-funciona.jpg",
        opacidade: 65,
        modo: "sobreposicao",
      },
      videos: { src: "/images/fundo-videos.jpg", opacidade: 65, modo: "sobreposicao" },
      duvidas: { src: "/images/fundo-duvidas.jpg", opacidade: 65, modo: "sobreposicao" },
      galeria: { src: "/images/fundo-galeria.jpg", opacidade: 65, modo: "sobreposicao" },
      cards: { src: "/images/fundo-cards.jpg", opacidade: 70, modo: "normal" },
    },
  },
  juridico: {
    responsavel: "Pai Tiago de Zé Malandro",
    documento: "",
    cidade: "",
    email: "",
    atualizado: "",
    reembolsoDias: "7",
  },
  manutencao: {
    ativo: false,
    mensagem: "O site está em manutenção por alguns instantes. Fale comigo no WhatsApp que eu te atendo.",
  },
  rodape: { note: "Tradição, sigilo e axé em cada firmeza." },
  contato: {
    whatsapp: "5511999999999",
    whatsappNumero: "",
    instagram: "https://www.instagram.com/tiagodezemalandro/",
    paymentNote: "Pagamento processado com segurança pela Cakto",
  },
  popup: {
    ativo: true,
    adSlug: "",
    eyebrow: "Trabalho individual",
    titulo: "",
    texto: "",
    botao: "Quero esse trabalho",
    atraso: 2,
    frequencia: "sessao",
  },
  marketing: {
    metaPixel: "",
    ga4: "",
    exigirConsentimento: true,
    autoConfig: false,
    automaticMatching: false,
    eventoPageView: true,
    eventoContato: true,
    eventoCheckout: true,
    rotasBloqueadas: "/painel\n/admin\n/dashboard\n/login\n/entrar\n/auth\n/conta\n/settings\n/configuracoes",
  },
  protecao: {
    bloquearBotaoDireito: false,
    bloquearCopia: false,
    bloquearArrastarImagem: true,
    bloquearInspecao: true,
    noindex: false,
  },
  seguranca: { sessaoMinutos: 60, tentativasLogin: 5, exigirSenhaForte: true },
};

function texto(valor: unknown, padrao: string) {
  return typeof valor === "string" && valor.trim() !== "" ? valor : padrao;
}

function numero(valor: unknown, padrao: number, minimo: number, maximo: number) {
  const convertido = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isFinite(convertido)) return padrao;
  return Math.min(maximo, Math.max(minimo, Math.round(convertido)));
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

function mergeFundos(
  salvo: Record<string, unknown>,
  base: SiteContent["fundos"],
): SiteContent["fundos"] {
  const brutos =
    salvo.itens && typeof salvo.itens === "object"
      ? (salvo.itens as Record<string, unknown>)
      : {};
  const global =
    typeof salvo.opacidade === "number"
      ? Math.min(100, Math.max(5, Math.round(salvo.opacidade)))
      : 65;

  const itens = { ...base.itens };

  FUNDO_CHAVES.forEach((chave) => {
    const padrao = base.itens[chave];
    const atual = (brutos[chave] ?? {}) as Record<string, unknown>;
    const legado = salvo[chave];

    const src =
      typeof atual.src === "string" && atual.src.trim() !== ""
        ? atual.src
        : typeof legado === "string" && legado.trim() !== ""
          ? legado
          : padrao.src;

    const opacidade =
      typeof atual.opacidade === "number"
        ? Math.min(100, Math.max(5, Math.round(atual.opacidade)))
        : global;

    const modo =
      atual.modo === "normal" || atual.modo === "sobreposicao"
        ? (atual.modo as ModoFoto)
        : padrao.modo;

    itens[chave] = { src, opacidade, modo };
  });

  return { itens };
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
  const eventos = bloco("eventos");
  const apoie = bloco("apoie");
  const faq = bloco("faq");
  const abas = bloco("abas");
  const secoes = bloco("secoes");
  const fundos = bloco("fundos");
  const juridico = bloco("juridico");
  const manutencao = bloco("manutencao");
  const rodape = bloco("rodape");
  const contato = bloco("contato");
  const popup = bloco("popup");
  const marketing = bloco("marketing");
  const protecao = bloco("protecao");
  const seguranca = bloco("seguranca");

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
      heroUrl: typeof videos.heroUrl === "string" ? videos.heroUrl : base.videos.heroUrl,
      alturaPlayer:
        typeof videos.alturaPlayer === "number"
          ? Math.min(760, Math.max(260, Math.round(videos.alturaPlayer)))
          : base.videos.alturaPlayer,
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
    eventos: {
      ativo: typeof eventos.ativo === "boolean" ? eventos.ativo : base.eventos.ativo,
      eyebrow: texto(eventos.eyebrow, base.eventos.eyebrow),
      titulo: texto(eventos.titulo, base.eventos.titulo),
      destaque: texto(eventos.destaque, base.eventos.destaque),
      texto: texto(eventos.texto, base.eventos.texto),
      beneficios: lista<BeneficioEvento>(eventos.beneficios, base.eventos.beneficios),
      botao: texto(eventos.botao, base.eventos.botao),
      mensagem: texto(eventos.mensagem, base.eventos.mensagem),
      imagem: texto(eventos.imagem, base.eventos.imagem),
      opacidade:
        typeof eventos.opacidade === "number"
          ? Math.min(100, Math.max(10, Math.round(eventos.opacidade)))
          : base.eventos.opacidade,
    },
    apoie: {
      ativo: typeof apoie.ativo === "boolean" ? apoie.ativo : base.apoie.ativo,
      eyebrow: texto(apoie.eyebrow, base.apoie.eyebrow),
      titulo: texto(apoie.titulo, base.apoie.titulo),
      destaque: texto(apoie.destaque, base.apoie.destaque),
      frase: texto(apoie.frase, base.apoie.frase),
      texto: texto(apoie.texto, base.apoie.texto),
      botao: texto(apoie.botao, base.apoie.botao),
      link: typeof apoie.link === "string" ? apoie.link : base.apoie.link,
      imagem: texto(apoie.imagem, base.apoie.imagem),
      opacidade:
        typeof apoie.opacidade === "number"
          ? Math.min(100, Math.max(10, Math.round(apoie.opacidade)))
          : base.apoie.opacidade,
      tamanhoQr:
        typeof apoie.tamanhoQr === "number"
          ? Math.min(340, Math.max(120, Math.round(apoie.tamanhoQr)))
          : base.apoie.tamanhoQr,
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
    fundos: mergeFundos(fundos, base.fundos),
    juridico: {
      responsavel: texto(juridico.responsavel, base.juridico.responsavel),
      documento: typeof juridico.documento === "string" ? juridico.documento : base.juridico.documento,
      cidade: typeof juridico.cidade === "string" ? juridico.cidade : base.juridico.cidade,
      email: typeof juridico.email === "string" ? juridico.email : base.juridico.email,
      atualizado:
        typeof juridico.atualizado === "string" ? juridico.atualizado : base.juridico.atualizado,
      reembolsoDias: texto(juridico.reembolsoDias, base.juridico.reembolsoDias),
    },
    manutencao: {
      ativo: typeof manutencao.ativo === "boolean" ? manutencao.ativo : base.manutencao.ativo,
      mensagem: texto(manutencao.mensagem, base.manutencao.mensagem),
    },
    rodape: { note: texto(rodape.note, base.rodape.note) },
    contato: {
      whatsapp: texto(contato.whatsapp, base.contato.whatsapp),
      whatsappNumero:
        typeof contato.whatsappNumero === "string"
          ? contato.whatsappNumero
          : base.contato.whatsappNumero,
      instagram: texto(contato.instagram, base.contato.instagram),
      paymentNote: texto(contato.paymentNote, base.contato.paymentNote),
    },
    popup: {
      ativo: typeof popup.ativo === "boolean" ? popup.ativo : base.popup.ativo,
      adSlug: typeof popup.adSlug === "string" ? popup.adSlug : base.popup.adSlug,
      eyebrow: texto(popup.eyebrow, base.popup.eyebrow),
      titulo: typeof popup.titulo === "string" ? popup.titulo : base.popup.titulo,
      texto: typeof popup.texto === "string" ? popup.texto : base.popup.texto,
      botao: texto(popup.botao, base.popup.botao),
      atraso: numero(popup.atraso, base.popup.atraso, 0, 20),
      frequencia:
        popup.frequencia === "dia" || popup.frequencia === "sempre" || popup.frequencia === "sessao"
          ? popup.frequencia
          : base.popup.frequencia,
    },
    marketing: {
      metaPixel:
        typeof marketing.metaPixel === "string" ? marketing.metaPixel : base.marketing.metaPixel,
      ga4: typeof marketing.ga4 === "string" ? marketing.ga4 : base.marketing.ga4,
      exigirConsentimento:
        typeof marketing.exigirConsentimento === "boolean"
          ? marketing.exigirConsentimento
          : base.marketing.exigirConsentimento,
      autoConfig:
        typeof marketing.autoConfig === "boolean"
          ? marketing.autoConfig
          : base.marketing.autoConfig,
      automaticMatching:
        typeof marketing.automaticMatching === "boolean"
          ? marketing.automaticMatching
          : base.marketing.automaticMatching,
      eventoPageView:
        typeof marketing.eventoPageView === "boolean"
          ? marketing.eventoPageView
          : base.marketing.eventoPageView,
      eventoContato:
        typeof marketing.eventoContato === "boolean"
          ? marketing.eventoContato
          : base.marketing.eventoContato,
      eventoCheckout:
        typeof marketing.eventoCheckout === "boolean"
          ? marketing.eventoCheckout
          : base.marketing.eventoCheckout,
      rotasBloqueadas:
        typeof marketing.rotasBloqueadas === "string"
          ? marketing.rotasBloqueadas
          : base.marketing.rotasBloqueadas,
    },
    protecao: {
      bloquearBotaoDireito:
        typeof protecao.bloquearBotaoDireito === "boolean"
          ? protecao.bloquearBotaoDireito
          : base.protecao.bloquearBotaoDireito,
      bloquearCopia:
        typeof protecao.bloquearCopia === "boolean"
          ? protecao.bloquearCopia
          : base.protecao.bloquearCopia,
      bloquearArrastarImagem:
        typeof protecao.bloquearArrastarImagem === "boolean"
          ? protecao.bloquearArrastarImagem
          : base.protecao.bloquearArrastarImagem,
      bloquearInspecao:
        typeof protecao.bloquearInspecao === "boolean"
          ? protecao.bloquearInspecao
          : base.protecao.bloquearInspecao,
      noindex:
        typeof protecao.noindex === "boolean" ? protecao.noindex : base.protecao.noindex,
    },
    seguranca: {
      sessaoMinutos: numero(seguranca.sessaoMinutos, base.seguranca.sessaoMinutos, 5, 480),
      tentativasLogin: numero(seguranca.tentativasLogin, base.seguranca.tentativasLogin, 3, 10),
      exigirSenhaForte:
        typeof seguranca.exigirSenhaForte === "boolean"
          ? seguranca.exigirSenhaForte
          : base.seguranca.exigirSenhaForte,
    },
  };
}

/** Fundo configurado de uma seção (sempre retorna algo válido). */
export function fundoDe(content: SiteContent, chave: FundoChave): FundoItem {
  return content.fundos?.itens?.[chave] ?? DEFAULT_CONTENT.fundos.itens[chave];
}

/** Lê o conteúdo salvo no backend (compatível com os campos antigos). */
async function carregarSiteContent(): Promise<SiteContent> {
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

// Casca, cabeçalho e rastreamento pedem o mesmo conteúdo: uma chamada só.
let emVooConteudo: Promise<SiteContent> | null = null;

export function fetchSiteContent(): Promise<SiteContent> {
  if (!emVooConteudo) {
    emVooConteudo = carregarSiteContent().finally(() => {
      emVooConteudo = null;
    });
  }
  return emVooConteudo;
}

/** Salva o conteúdo (e mantém os campos antigos em sincronia). */
export async function saveSiteContent(content: SiteContent) {
  const { error } = await supabase
    .from("spiritual_site_settings")
    .update({
      content: content as unknown as Json,
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

/** Extensões perigosas: páginas e executáveis que poderiam rodar código. */
const EXTENSOES_BLOQUEADAS = [
  "html",
  "htm",
  "xhtml",
  "svg",
  "js",
  "mjs",
  "php",
  "phtml",
  "exe",
  "bat",
  "cmd",
  "com",
  "scr",
  "msi",
  "vbs",
  "ps1",
  "sh",
  "jar",
  "apk",
];

/** Confere o arquivo antes do envio. Libera qualquer formato fora da lista de risco. */
export function conferirArquivo(file: File, maxMB: number) {
  const extensao = (file.name.split(".").pop() || "").toLowerCase();

  if (EXTENSOES_BLOQUEADAS.indexOf(extensao) !== -1) {
    throw new Error(
      `Arquivos .${extensao} são bloqueados por segurança (poderiam executar código).`,
    );
  }

  if (file.size > maxMB * 1024 * 1024) {
    const tamanho = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`Arquivo muito grande (${tamanho} MB). O limite é ${maxMB} MB.`);
  }

  return extensao || "bin";
}

/** Converte fotos do iPhone (HEIC/HEIF) para JPG, que abre em qualquer navegador. */
async function converterHeic(file: File): Promise<File> {
  const extensao = (file.name.split(".").pop() || "").toLowerCase();
  const ehHeic =
    extensao === "heic" ||
    extensao === "heif" ||
    file.type === "image/heic" ||
    file.type === "image/heif";

  if (!ehHeic) return file;

  try {
    const modulo = await import("heic2any");
    const converter = (modulo.default ?? modulo) as unknown as (opcoes: {
      blob: Blob;
      toType: string;
      quality?: number;
    }) => Promise<Blob | Blob[]>;

    const resultado = await converter({ blob: file, toType: "image/jpeg", quality: 0.86 });
    const blob = Array.isArray(resultado) ? resultado[0] : resultado;

    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    throw new Error(
      "Não consegui converter a foto do iPhone (HEIC). Em Ajustes → Câmera → Formatos, escolha \"Mais compatível\" e envie de novo — ou exporte a foto como JPG.",
    );
  }
}

/** Envia imagem ou arquivo (qualquer formato) e devolve o endereço público. */
export async function uploadSiteImage(file: File): Promise<string> {
  const arquivo = await converterHeic(file);
  const extensao = conferirArquivo(arquivo, 50);
  const caminho = `conteudo/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, {
    contentType: arquivo.type || "application/octet-stream",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(caminho);
  if (!data?.publicUrl) throw new Error("Não foi possível obter o endereço do arquivo.");

  return data.publicUrl;
}

const BUCKET_VIDEO = "videos";
export const VIDEO_MAX_MB = 2048;

function urlPublicaVideo(caminho: string) {
  const { data } = supabase.storage.from(BUCKET_VIDEO).getPublicUrl(caminho);
  if (!data?.publicUrl) throw new Error("Não foi possível obter o endereço do vídeo.");
  return data.publicUrl;
}

/** Avisa o painel de que existe atividade (evita deslogar no meio de um envio longo). */
function sinalizarAtividade() {
  window.dispatchEvent(new Event("paitiago:atividade"));
}

/**
 * Envia um vídeo do computador para o armazenamento e devolve o endereço público.
 * Usa envio direto com progresso real — o modo "em blocos" do servidor recusa
 * arquivos acima de 50 MB, então ele não é usado.
 */
export async function uploadSiteVideo(
  file: File,
  aoProgredir?: (porcentagem: number) => void,
): Promise<string> {
  const extensao = conferirArquivo(file, VIDEO_MAX_MB);
  const caminho = `conteudo/${crypto.randomUUID()}.${extensao}`;

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Sessão expirada. Entre novamente no painel e envie o vídeo.");
  }

  let ultimoSinal = 0;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/${BUCKET_VIDEO}/${caminho}`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (evento) => {
      if (aoProgredir && evento.lengthComputable && evento.total > 0) {
        aoProgredir(Math.min(99, Math.round((evento.loaded / evento.total) * 100)));
      }

      const agora = Date.now();
      if (agora - ultimoSinal > 5000) {
        ultimoSinal = agora;
        sinalizarAtividade();
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      let mensagem = "";
      try {
        const corpo = JSON.parse(xhr.responseText) as { message?: string; error?: string };
        mensagem = corpo.message || corpo.error || "";
      } catch {
        mensagem = "";
      }

      if (xhr.status === 413) {
        mensagem =
          "O servidor recusou o tamanho do arquivo. Envie um vídeo menor ou use um link do YouTube.";
      } else if (xhr.status === 401 || xhr.status === 403 || /row-level security/i.test(mensagem)) {
        mensagem =
          "Sessão expirada ou sem permissão de administrador. Entre novamente no painel e tente de novo.";
      } else if (xhr.status === 0) {
        mensagem = "A conexão foi interrompida durante o envio. Verifique a internet e tente de novo.";
      }

      reject(new Error(mensagem || `Falha no envio do vídeo (código ${xhr.status}).`));
    };

    xhr.onerror = () =>
      reject(
        new Error(
          "A conexão caiu durante o envio do vídeo. Verifique a internet e tente novamente.",
        ),
      );
    xhr.ontimeout = () =>
      reject(new Error("O envio demorou demais e foi interrompido. Tente novamente."));

    xhr.send(file);
  });

  aoProgredir?.(100);
  return urlPublicaVideo(caminho);
}

/**
 * Extrai um quadro do vídeo e usa como capa (sem precisar subir foto).
 * Retorna o endereço público da imagem ou "" se não for possível.
 */
export async function gerarCapaDoVideo(file: File): Promise<string> {
  const urlLocal = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.src = urlLocal;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    await new Promise<void>((resolve, reject) => {
      const limite = window.setTimeout(() => reject(new Error("tempo")), 8000);
      video.onloadedmetadata = () => {
        window.clearTimeout(limite);
        resolve();
      };
      video.onerror = () => {
        window.clearTimeout(limite);
        reject(new Error("video"));
      };
    });

    const alvo = Number.isFinite(video.duration) && video.duration > 2
      ? Math.min(2, video.duration * 0.15)
      : 0;

    if (alvo > 0) {
      await new Promise<void>((resolve) => {
        const limite = window.setTimeout(() => resolve(), 5000);
        video.onseeked = () => {
          window.clearTimeout(limite);
          resolve();
        };
        video.currentTime = alvo;
      });
    }

    const larguraOriginal = video.videoWidth || 720;
    const alturaOriginal = video.videoHeight || 1280;
    const largura = Math.min(1280, larguraOriginal);
    const altura = Math.round(alturaOriginal * (largura / larguraOriginal));

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;

    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("canvas");
    contexto.drawImage(video, 0, 0, largura, altura);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) throw new Error("blob");

    return await uploadSiteImage(
      new File([blob], "capa-video.jpg", { type: "image/jpeg" }),
    );
  } catch {
    return "";
  } finally {
    URL.revokeObjectURL(urlLocal);
  }
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

/** Considera vídeo quando é arquivo enviado para a pasta de vídeos ou extensão de vídeo. */
export function pareceVideo(url: string): boolean {
  const valor = (url || "").trim();
  if (!valor) return false;
  if (/\/videos\/conteudo\//i.test(valor)) return true;
  return /\.(mp4|webm|ogv|ogg|m4v|mov)$/i.test(valor);
}

export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogv|ogg|m4v)$/i.test((url || "").trim());
}
