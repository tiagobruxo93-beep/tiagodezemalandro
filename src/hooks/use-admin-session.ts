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

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return { session, isAdmin, loading, checking, signOut };
}
