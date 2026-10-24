import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Preciso estar presente no terreiro?",
    answer:
      "Não. Você envia seu nome completo e o seu pedido pelo WhatsApp, e o trabalho é firmado no terreiro na data da gira. A presença física não é necessária.",
  },
  {
    question: "Quando o trabalho é realizado?",
    answer:
      "Os trabalhos coletivos são realizados nas giras semanais da casa. A data exata é avisada no WhatsApp logo após a confirmação do pagamento.",
  },
  {
    question: "Como faço o pagamento?",
    answer:
      "Cada anúncio tem um botão de encaminhamento que abre o checkout seguro, com Pix, cartão ou boleto. Trabalhos individuais e consultas são combinados direto no WhatsApp.",
  },
  {
    question: "Posso participar de mais de um trabalho?",
    answer:
      "Sim. O ideal é respeitar o intervalo que eu orientar entre um trabalho e outro, para que a firmeza faça efeito. Fale comigo antes de somar dois trabalhos.",
  },
  {
    question: "O resultado é garantido?",
    answer:
      "Nenhum trabalho espiritual sério promete resultado. O que eu garanto é compromisso, tradição e a firmeza feita com respeito. O caminho é seu, e eu caminho junto.",
  },
];

export function FaqSection() {
  return (
    <section id="duvidas" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">Dúvidas</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            Perguntas
            <span className="block italic text-secondary">frequentes</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Se a sua dúvida não estiver aqui, me chame no WhatsApp. Atendimento
            direto, com sigilo.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-5 text-left font-display text-[21px] leading-snug text-foreground hover:text-secondary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-6 text-[13px] leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
