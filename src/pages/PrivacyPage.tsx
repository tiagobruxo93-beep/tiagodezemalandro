import { useEffect } from "react";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";
import { useSiteSettings } from "@/hooks/use-site-data";

const PrivacyPage = () => {
  const { content } = useSiteSettings();
  const j = content.juridico;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Privacidade e cookies — Pai Tiago de Zé Malandro";
  }, []);

  return (
    <LegalLayout
      eyebrow="Transparência"
      titulo="Privacidade e cookies"
      resumo="O que o site guarda no seu navegador, como os acessos são contados e quais são os seus direitos como titular de dados (LGPD)."
    >
      <LegalSection titulo="Cookies e medição de audiência">
        <p>
          O site guarda no seu navegador as preferências de navegação e um código
          anônimo para contar acessos.{" "}
          <strong className="text-foreground">Somente com o seu consentimento</strong>{" "}
          carregamos ferramentas de medição do Meta (Facebook/Instagram) e do Google,
          que registram a página visitada, o clique no WhatsApp e o início de um
          checkout. Essas ferramentas podem gravar cookies de publicidade para mostrar
          anúncios a quem já visitou o site.
        </p>
        <p>
          Nada é carregado antes do seu aceite no aviso de cookies, e você pode recusar
          e continuar navegando normalmente. Para mudar a escolha depois, limpe os dados
          do site nas configurações do navegador: o aviso aparece novamente.
        </p>
      </LegalSection>

      <LegalSection titulo="O que fica no seu navegador">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Preferências:</strong> a marcação de que
            você já viu o aviso de cookies.
          </li>
          <li>
            <strong className="text-foreground">Código anônimo de visitante:</strong> um
            número aleatório para contar acessos únicos — sem nome, e-mail, telefone ou
            endereço IP.
          </li>
          <li>
            <strong className="text-foreground">Cópia do conteúdo:</strong> textos e fotos
            guardados localmente para o site abrir mais rápido e continuar visível se a
            conexão oscilar.
          </li>
        </ul>
      </LegalSection>

      <LegalSection titulo="Contagem de acessos">
        <p>
          Registramos data, hora, página aberta e o código anônimo (armazenado de forma
          embaralhada). Esses números ficam visíveis apenas para o responsável e servem
          para entender quantas pessoas visitam o site.
        </p>
      </LegalSection>

      <LegalSection titulo="Compras e mensagens">
        <p>
          Ao clicar em “Quero participar”, você é levado ao checkout da Cakto ou ao
          WhatsApp. Os dados informados ali (nome, pedido, pagamento) são tratados por
          essas plataformas e pelo atendimento do terreiro, com sigilo. O site não
          armazena dados de cartão.
        </p>
      </LegalSection>

      <LegalSection titulo="Registro de acesso (IP e localização aproximada)">
        <p>
          Para segurança do site e para entender de onde vêm as visitas, registramos o
          endereço IP de quem acessa, o navegador e o aparelho, além da{" "}
          <strong className="text-foreground">localização aproximada por IP</strong>{" "}
          (cidade, estado e país — nunca o seu endereço exato). O navegador não permite
          ler o endereço MAC do aparelho; usamos um identificador técnico aproximado
          (navegador, tela, fuso e plataforma).
        </p>
        <p>
          Esses registros são usados exclusivamente para segurança, prevenção de fraude
          e medição de audiência, ficam visíveis apenas para o responsável e podem
          resultar no bloqueio de um IP que esteja causando dano ao site. Você pode
          pedir a exclusão dos seus registros pelo canal de contato abaixo.
        </p>
      </LegalSection>

      <LegalSection titulo="Base legal e finalidade">
        <p>
          Tratamos apenas dados necessários para: (i) executar o trabalho contratado,
          (ii) atender você pelo WhatsApp, (iii) medir acessos de forma anônima,
          (iv) medir a eficácia das campanhas com o seu consentimento (art. 7º, I, da
          LGPD), (v) proteger o site e seus visitantes, com base no legítimo interesse
          (art. 7º, IX) e (vi) cumprir obrigações legais. Não vendemos e não cedemos
          dados pessoais a terceiros para marketing.
        </p>
      </LegalSection>

      <LegalSection titulo="Seus direitos (LGPD)">
        <p>
          Nos termos da Lei 13.709/2018, você pode pedir a qualquer momento: confirmação
          de tratamento, acesso, correção, anonimização, eliminação de dados, informação
          sobre compartilhamento, portabilidade e revogação do consentimento. Basta falar
          com o responsável pelo WhatsApp ou pelo e-mail indicado no topo desta página.
          Respondemos em até 15 dias.
        </p>
      </LegalSection>

      <LegalSection titulo="Segurança e retenção">
        <p>
          O site usa conexão criptografada (HTTPS), acesso administrativo restrito a uma
          única conta e armazenamento com regras de acesso. Dados de pedidos são mantidos
          pelo prazo necessário ao atendimento e às obrigações fiscais; a contagem anônima
          de acessos é limpa automaticamente.
        </p>
      </LegalSection>

      <LegalSection titulo="Como apagar">
        <p>
          Você pode limpar tudo nas configurações do navegador (“limpar dados do site”)
          ou usar o botão “Limpar dados e recarregar” da tela de erro do site. Para apagar
          dados de atendimento, fale com o responsável.
        </p>
      </LegalSection>

      <LegalSection titulo="Responsável pelo tratamento">
        <p>
          {j.responsavel}
          {j.documento ? ` — documento ${j.documento}` : ""}
          {j.cidade ? ` — ${j.cidade}` : ""}. Canal de contato:{" "}
          {j.email ? (
            <a className="text-secondary underline-offset-4 hover:underline" href={`mailto:${j.email}`}>
              {j.email}
            </a>
          ) : (
            "WhatsApp do terreiro (link no rodapé)"
          )}
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default PrivacyPage;
