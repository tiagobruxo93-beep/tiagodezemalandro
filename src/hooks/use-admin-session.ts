import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminAccess } from "@/lib/admin-ads";

export type AdminState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  checking: boolean;
};

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let mounted = true;

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
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
    let active = true;
    setChecking(true);
    checkAdminAccess()
      .then((value) => {
        if (active) setIsAdmin(value);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [session]);

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
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return { session, isAdmin, loading, checking, signOut };
}
