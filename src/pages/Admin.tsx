import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock, LogOut } from "lucide-react";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/hooks/use-admin-session";

const Admin = () => {
  const { session, isAdmin, loading, checking, signOut } = useAdminSession();

  useEffect(() => {
    document.title = "Painel — Pai Tiago de Zé Malandro";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);

  if (loading || (session && checking)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-secondary" />
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Abrindo o painel
        </p>
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
        <span className="flex h-12 w-12 items-center justify-center border border-secondary/40 text-secondary">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-foreground">Acesso restrito</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Este e-mail está cadastrado, mas ainda não tem permissão de
          administrador. Peça ao responsável da casa para liberar o acesso.
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
          {session.user.email}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button variant="hairline" size="lg" onClick={() => void signOut()}>
            <LogOut />
            Sair e usar outro e-mail
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/">Voltar ao site</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      email={session.user.email ?? "administrador"}
      onSignOut={() => void signOut()}
    />
  );
};

export default Admin;
