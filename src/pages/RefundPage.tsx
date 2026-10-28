import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";
import { useSiteSettings } from "@/hooks/use-site-data";

const RefundPage = () => {
  const { content } = useSiteSettings();
  const j = content.juridico;
  const dias = j.reembolsoDias || "7";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Reembolso e cancelamento — Pai Tiago de Zé Malandro";
  }, []);

  return (
    <LegalLayout
      eyebrow="Compra consciente"
      titulo="Reembolso e cancelamento"
      resumo="Regras claras para cancelar ou pedir devolução, de acordo com o Código de Defesa do Consumidor."
    >
      <LegalSection titulo={`1. Direito de arrependimento (${dias} dias)`}>
        <p>
          Em compras feitas pela internet, você pode desistir em até <strong className="text-foreground">{dias} dias corridos</strong>{" "}
          a contar da contratação (art. 49 do Código de Defesa do Consumidor), com
          devolução integral do valor pago, desde que o trabalho ainda não tenha sido
          realizado.
        </p>
      </LegalSection>

      <LegalSection titulo="2. Como pedir">
        <p>
          Fale com o atendimento pelo WhatsApp ou pelo e-mail{" "}
          {j.email || "divulgado no site"}, informando o nome usado na compra, a data e o
          comprovante enviado pela plataforma de pagamento. Respondemos em até 2 dias úteis.
        </p>
      </LegalSection>

      <LegalSection titulo="3. Prazo de devolução">
        <p>
          O estorno é solicitado à plataforma de pagamento (Cakto) imediatamente após a
          confirmação. O prazo para o valor aparecer depende do meio usado: Pix costuma
          levar até 2 dias úteis; cartão de crédito pode levar até duas faturas; boleto é
          devolvido por transferência.
        </p>
      </LegalSection>

      <LegalSection titulo="4. Trabalho já realizado">
        <p>
          Se o trabalho já foi firmado na data combinada, não há devolução do valor, pois
          o serviço foi prestado. Se houver remarcação por nossa parte, você escolhe entre
          participar da nova data ou receber o valor de volta.
        </p>
      </LegalSection>

      <LegalSection titulo="5. Consultas e atendimentos individuais">
        <p>
          Consultas podem ser canceladas com pelo menos 24 horas de antecedência, com
          devolução integral. Cancelamentos com menos de 24 horas podem ser remarcados uma
          vez, sem custo.
        </p>
      </LegalSection>

      <LegalSection titulo="6. Casos de força maior">
        <p>
          Em situações de força maior (doença, luto, impedimento do terreiro), o trabalho é
          remarcado e você é avisado com antecedência. Se preferir não participar da nova
          data, devolvemos o valor integral.
        </p>
      </LegalSection>

      <LegalSection titulo="7. Pagamentos não identificados">
        <p>
          Se você pagou e não recebeu as instruções em até 24 horas, fale com o atendimento
          com o comprovante. Localizamos o pedido e enviamos o formulário novamente.
        </p>
      </LegalSection>

      <LegalSection titulo="8. Dúvidas">
        <p>
          Antes de comprar, você pode tirar qualquer dúvida pelo WhatsApp. Também vale ler
          os{" "}
          <Link to="/termos" className="text-secondary underline-offset-4 hover:underline">
            Termos de uso
          </Link>{" "}
          e a{" "}
          <Link to="/privacidade" className="text-secondary underline-offset-4 hover:underline">
            Política de privacidade
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default RefundPage;
