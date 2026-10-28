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
  recuperacao: boolean;
  concluirRecuperacao: () => void;
};

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
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

    checkAdminAccess()
      .then((value) => {
        if (!active) return;

        if (!value) {
          // Conta sem permissão: encerra a sessão na hora.
          setBloqueado(true);
          setIsAdmin(false);
          void supabase.auth.signOut();
          return;
        }

        setIsAdmin(true);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [session, recuperacao]);

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
  }, [session, recuperacao]);

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

  return {
    session,
    isAdmin,
    loading,
    checking,
    bloqueado,
    recuperacao,
    concluirRecuperacao,
    signOut,
  };
}
