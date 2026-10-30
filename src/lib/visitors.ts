import { supabase } from "@/integrations/supabase/client";

export interface Visitante {
  id: string;
  session_id: string;
  impressao: string | null;
  ip: string | null;
  user_agent: string | null;
  navegador: string | null;
  sistema: string | null;
  dispositivo: string | null;
  idioma: string | null;
  plataforma: string | null;
  tela: string | null;
  fuso: string | null;
  referencia: string | null;
  campanha: string | null;
  pais: string | null;
  regiao: string | null;
  cidade: string | null;
  latitude: number | null;
  longitude: number | null;
  provedor: string | null;
  visitas: number;
  criado_em: string;
  visto_em: string;
}

export async function fetchVisitantes(limite = 300): Promise<Visitante[]> {
  const { data, error } = await supabase
    .from("spiritual_visitors")
    .select("*")
    .order("visto_em", { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return (data ?? []) as Visitante[];
}

export async function fetchIpsBloqueados(): Promise<string[]> {
  const { data, error } = await supabase
    .from("spiritual_blocked_ips")
    .select("ip")
    .order("criado_em", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);
  return (data ?? []).map((linha) => String(linha.ip));
}

export async function bloquearIp(ip: string, motivo = "Bloqueado pelo painel") {
  const limpo = ip.trim();
  if (!limpo) throw new Error("IP inválido.");

  const { error } = await supabase
    .from("spiritual_blocked_ips")
    .upsert({ ip: limpo, motivo }, { onConflict: "ip" });

  if (error) throw new Error(error.message);
}

export async function desbloquearIp(ip: string) {
  const { error } = await supabase.from("spiritual_blocked_ips").delete().eq("ip", ip.trim());
  if (error) throw new Error(error.message);
}

export async function excluirVisitantes(ids: string[]) {
  if (ids.length === 0) return;

  const { error } = await supabase.from("spiritual_visitors").delete().in("id", ids);
  if (error) throw new Error(error.message);
}

export async function limparVisitantes() {
  const { error } = await supabase
    .from("spiritual_visitors")
    .delete()
    .not("id", "is", null);

  if (error) throw new Error(error.message);
}

function celula(valor: unknown) {
  return `"${String(valor ?? "").replace(/"/g, '""')}"`;
}


export interface GrupoIp {
  chave: string;
  ip: string | null;
  visitas: number;
  sessoes: number;
  primeira: string;
  ultima: string;
  cidade: string | null;
  regiao: string | null;
  pais: string | null;
  provedor: string | null;
  latitude: number | null;
  longitude: number | null;
  impressao: string | null;
  referencia: string | null;
  campanha: string | null;
  dispositivos: string[];
  navegadores: string[];
  sistemas: string[];
  telas: string[];
  registros: Visitante[];
}

/** Junta os acessos do mesmo IP, para o painel mostrar uma linha por pessoa/rede. */
export function agruparPorIp(itens: Visitante[]): GrupoIp[] {
  const mapa = new Map<string, Visitante[]>();

  itens.forEach((item) => {
    const chave = item.ip?.trim() || `sessao:${item.session_id}`;
    const lista = mapa.get(chave);
    if (lista) lista.push(item);
    else mapa.set(chave, [item]);
  });

  const grupos: GrupoIp[] = [];

  mapa.forEach((registros, chave) => {
    const ordenados = [...registros].sort(
      (a, b) => new Date(b.visto_em).getTime() - new Date(a.visto_em).getTime(),
    );
    const recente = ordenados[0];
    const primeira = ordenados.reduce(
      (menor, item) => (item.criado_em < menor ? item.criado_em : menor),
      recente.criado_em,
    );

    const distintos = (campo: keyof Visitante) =>
      Array.from(
        new Set(
          ordenados
            .map((item) => item[campo])
            .filter((valor): valor is string => typeof valor === "string" && valor !== ""),
        ),
      );

    grupos.push({
      chave,
      ip: recente.ip && recente.ip.trim() !== "" ? recente.ip : null,
      visitas: ordenados.reduce((total, item) => total + Number(item.visitas ?? 1), 0),
      sessoes: ordenados.length,
      primeira,
      ultima: recente.visto_em,
      cidade: recente.cidade,
      regiao: recente.regiao,
      pais: recente.pais,
      provedor: recente.provedor,
      latitude: recente.latitude,
      longitude: recente.longitude,
      impressao: recente.impressao,
      referencia: recente.referencia,
      campanha: recente.campanha,
      dispositivos: distintos("dispositivo"),
      navegadores: distintos("navegador"),
      sistemas: distintos("sistema"),
      telas: distintos("tela"),
      registros: ordenados,
    });
  });

  return grupos.sort((a, b) => new Date(b.ultima).getTime() - new Date(a.ultima).getTime());
}

export function visitantesParaCsv(itens: Visitante[], bloqueados: Set<string>) {
  const cabecalho = [
    "IP",
    "Situação",
    "Cidade",
    "Estado",
    "País",
    "Provedor",
    "Dispositivo",
    "Sistema",
    "Navegador",
    "Tela",
    "Idioma",
    "Fuso",
    "ID do aparelho",
    "Visitas",
    "Origem",
    "Campanha",
    "Primeiro acesso",
    "Último acesso",
  ];

  const linhas = itens.map((v) =>
    [
      v.ip,
      v.ip && bloqueados.has(v.ip) ? "Bloqueado" : "Liberado",
      v.cidade,
      v.regiao,
      v.pais,
      v.provedor,
      v.dispositivo,
      v.sistema,
      v.navegador,
      v.tela,
      v.idioma,
      v.fuso,
      v.impressao,
      v.visitas,
      v.referencia,
      v.campanha,
      v.criado_em,
      v.visto_em,
    ]
      .map(celula)
      .join(";"),
  );

  return [cabecalho.map(celula).join(";"), ...linhas].join("\n");
}

export function baixarArquivo(nome: string, conteudo: string, tipo = "text/csv;charset=utf-8") {
  const blob = new Blob([`\ufeff${conteudo}`], { type: tipo });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nome;
  link.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
