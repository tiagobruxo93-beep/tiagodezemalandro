import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminAccess } from "@/lib/admin-ads";

export type AdminState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  checking: boolean;
  bloqueado: boolean;
  falhaVerificacao: boolean;
  tentarNovamente: () => void;
  recuperacao: boolean;
  concluirRecuperacao: () => void;
};

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
const [falhaVerificacao, setFalhaVerificacao] = useState(false);
const [tentativa, setTentativa] = useState(0);
  const [recuperacao, setRecuperacao] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (window.location.hash.includes("type=recovery")) {
      setRecuperacao(true);
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (event === "PASSWORD_RECOVERY") {
          setRecuperacao(true);
        }
        setSession(nextSession);
        setLoading(false);
      },
    );

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }

    if (recuperacao) {
      return;
    }
    let active = true;
    setChecking(true);
    setFalhaVerificacao(false);

    const verificar = async (rodada = 0): Promise<void> => {
      const resultado = await checkAdminAccess();

      if (!active) return;

      if (resultado === "erro" && rodada < 2) {
        // Duas tentativas extras: evita deslogar por oscilação de rede.
        await new Promise((resolve) => setTimeout(resolve, 800 * (rodada + 1)));
        if (active) await verificar(rodada + 1);
        return;
      }

      if (resultado === "admin") {
        setIsAdmin(true);
        setBloqueado(false);
        setChecking(false);
        return;
      }

      if (resultado === "negado") {
        setBloqueado(true);
        setIsAdmin(false);
        setChecking(false);
        void supabase.auth.signOut();
        return;
      }

      // Não foi possível confirmar: mantém a sessão e mostra "tentar novamente".
      setFalhaVerificacao(true);
      setIsAdmin(false);
      setChecking(false);
    };

    void verificar();

    return () => {
      active = false;
    };
  }, [session, recuperacao, tentativa]);

  // Desconecta sozinho depois de 60 minutos sem uso (proteção em computador compartilhado).
  useEffect(() => {
    if (!session) return;

    const LIMITE = 60 * 60 * 1000;
    let ultimo = Date.now();

    const tocar = () => {
      ultimo = Date.now();
    };

    const eventos: (keyof WindowEventMap)[] = ["click", "keydown", "scroll", "touchstart"];
    eventos.forEach((evento) => window.addEventListener(evento, tocar, { passive: true }));

    const relogio = window.setInterval(() => {
      if (Date.now() - ultimo > LIMITE) {
        void supabase.auth.signOut();
        setIsAdmin(false);
      }
    }, 60 * 1000);

    return () => {
      eventos.forEach((evento) => window.removeEventListener(evento, tocar));
      window.clearInterval(relogio);
    };
  }, [session, recuperacao, tentativa]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const concluirRecuperacao = () => {
    setRecuperacao(false);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const tentarNovamente = () => setTentativa((valor) => valor + 1);

  return {
    session,
    isAdmin,
    loading,
    checking,
    bloqueado,
    falhaVerificacao,
    tentarNovamente,
    recuperacao,
    concluirRecuperacao,
    signOut,
  };
}
