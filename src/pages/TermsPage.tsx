import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";
import { useSiteSettings } from "@/hooks/use-site-data";

const TermsPage = () => {
  const { content } = useSiteSettings();
  const j = content.juridico;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Termos de uso — Pai Tiago de Zé Malandro";
  }, []);

  return (
    <LegalLayout
      eyebrow="Regras da casa"
      titulo="Termos de uso"
      resumo="Ao contratar um trabalho ou consulta por este site, você concorda com as condições abaixo. Leia com calma antes de finalizar."
    >
      <LegalSection titulo="1. Quem presta o serviço">
        <p>
          Os atendimentos são realizados por {j.responsavel}
          {j.cidade ? `, em ${j.cidade}` : ""}, por meio deste site, do WhatsApp e das
          plataformas de pagamento indicadas. O contato oficial é {j.email || "o WhatsApp divulgado no site"}.
        </p>
      </LegalSection>

      <LegalSection titulo="2. Natureza do serviço">
        <p>
          Os trabalhos e consultas são de natureza espiritual e religiosa (Umbanda). Não
          constituem tratamento médico, psicológico, jurídico ou financeiro e não
          substituem acompanhamento profissional. Nenhum trabalho sério promete resultado
          garantido: o que oferecemos é a firmeza feita com respeito, tradição e sigilo.
        </p>
      </LegalSection>

      <LegalSection titulo="3. Idade mínima">
        <p>
          O atendimento é destinado a pessoas maiores de 18 anos. Menores só podem
          contratar com autorização e acompanhamento de responsável legal.
        </p>
      </LegalSection>

      <LegalSection titulo="4. Como funciona a contratação">
        <p>
          Você escolhe o trabalho na aba correspondente e é encaminhado ao checkout seguro
          (Pix, cartão ou boleto) ou ao WhatsApp, nos trabalhos individuais e consultas.
          Depois da confirmação, enviamos as instruções para enviar seu nome completo e o
          seu pedido.
        </p>
      </LegalSection>

      <LegalSection titulo="5. Datas e prazos">
        <p>
          Os trabalhos coletivos são realizados nas datas informadas no atendimento. Em
          caso de alteração de data por motivo de força maior, você será avisado e o
          trabalho será remarcado, sem custo adicional.
        </p>
      </LegalSection>

      <LegalSection titulo="6. Sigilo">
        <p>
          Nomes, pedidos e conversas são tratados com sigilo. Fotos e vídeos dos trabalhos
          podem ser publicados para divulgação, sempre sem expor dados sensíveis ou o
          pedido de quem contratou.
        </p>
      </LegalSection>

      <LegalSection titulo="7. Conteúdo do site">
        <p>
          Textos, imagens, artes e vídeos deste site pertencem ao responsável e não podem
          ser copiados ou usados comercialmente sem autorização.
        </p>
      </LegalSection>

      <LegalSection titulo="8. Conduta">
        <p>
          Não toleramos ameaças, preconceito, assédio ou uso do atendimento para prejudicar
          terceiros. Nesses casos, o atendimento pode ser encerrado, sem devolução de
          valores já aplicados em trabalhos realizados.
        </p>
      </LegalSection>

      <LegalSection titulo="9. Pagamentos e reembolsos">
        <p>
          As condições de cancelamento e devolução estão na página{" "}
          <Link to="/reembolso" className="text-secondary underline-offset-4 hover:underline">
            Reembolso e cancelamento
          </Link>
          , seguindo o Código de Defesa do Consumidor.
        </p>
      </LegalSection>

      <LegalSection titulo="10. Privacidade">
        <p>
          O tratamento de dados está descrito na página{" "}
          <Link to="/privacidade" className="text-secondary underline-offset-4 hover:underline">
            Privacidade e cookies
          </Link>
          , incluindo os seus direitos como titular (LGPD).
        </p>
      </LegalSection>

      <LegalSection titulo="11. Alterações">
        <p>
          Estes termos podem ser atualizados para refletir mudanças no atendimento ou na
          lei. A versão em vigor é sempre a publicada nesta página.
        </p>
      </LegalSection>

      <LegalSection titulo="12. Foro">
        <p>
          Fica eleito o foro do domicílio do consumidor para dirimir eventuais dúvidas,
          conforme a legislação brasileira.
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default TermsPage;
