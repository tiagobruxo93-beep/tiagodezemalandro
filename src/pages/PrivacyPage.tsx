import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { useSiteSettings } from "@/hooks/use-site-data";

const PrivacyPage = () => {
  const { settings, content } = useSiteSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Privacidade e cookies — Pai Tiago de Zé Malandro";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} content={content} />

      <main className="pt-[74px]">
        <section className="border-b border-border/60">
          <div className="section-shell py-14 sm:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao site
            </Link>

            <p className="eyebrow mt-6">Transparência</p>
            <h1 className="mt-4 max-w-3xl font-display text-[40px] leading-[1.02] text-foreground sm:text-[54px]">
              Privacidade e cookies
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explico aqui, de forma simples, o que o site guarda no seu navegador e
              o que ele não faz com os seus dados.
            </p>
          </div>
        </section>

        <section className="section-shell max-w-3xl py-12">
          <div className="space-y-10 text-[14px] leading-relaxed text-muted-foreground">
            <div>
              <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">Cookies de rastreamento</h2>
              <p className="mt-2">
                O site <strong className="text-foreground">não usa cookies de rastreamento</strong>,
                nem pixels de redes sociais, nem publicidade. Você não é seguido por
                aqui.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">O que fica no seu navegador</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-foreground">Preferências:</strong> a marcação
                  de que você já viu o aviso de cookies.
                </li>
                <li>
                  <strong className="text-foreground">Código anônimo de visitante:</strong>{" "}
                  um número aleatório criado no seu navegador para contar acessos
                  únicos. Ele não contém nome, e-mail, telefone nem endereço IP.
                </li>
                <li>
                  <strong className="text-foreground">Cópia do conteúdo:</strong> textos
                  e fotos ficam guardados localmente para o site abrir mais rápido e
                  continuar visível se a conexão oscilar.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">Contagem de acessos</h2>
              <p className="mt-2">
                Registramos apenas data, hora, página aberta e o código anônimo. Esses
                números aparecem só para o responsável da casa e servem para entender
                quantas pessoas visitam o site.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">Compras e mensagens</h2>
              <p className="mt-2">
                Ao clicar em “Quero participar”, você é levado ao checkout da Cakto ou
                ao WhatsApp. Os dados informados ali (nome, pagamento, pedido) são
                tratados por essas plataformas e pelo atendimento do terreiro, com
                sigilo. O site não armazena dados de cartão.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">Como apagar</h2>
              <p className="mt-2">
                Você pode limpar tudo a qualquer momento nas configurações do seu
                navegador (“limpar dados do site”). Se preferir, use o botão
                “Limpar dados e recarregar” que aparece na tela de erro do site.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-[26px] leading-tight text-foreground">Contato</h2>
              <p className="mt-2">
                Dúvidas sobre privacidade? Fale com o Pai Tiago no WhatsApp — o mesmo
                canal usado para os atendimentos.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} content={content} />
      <WhatsAppFab settings={settings} />
    </div>
  );
};

export default PrivacyPage;
