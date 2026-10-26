const STEPS = [
  {
    number: "01",
    title: "Escolha o trabalho",
    text: "Veja nas abas qual trabalho combina com o que você precisa neste momento.",
  },
  {
    number: "02",
    title: "Pagamento seguro",
    text: "O botão de encaminhamento leva direto ao checkout, com Pix, cartão ou boleto.",
  },
  {
    number: "03",
    title: "Envie seu nome",
    text: "Após a compra, você informa seu nome completo e o seu pedido no WhatsApp.",
  },
  {
    number: "04",
    title: "Firmeza no terreiro",
    text: "Seu nome é firmado junto com os demais na data do trabalho coletivo.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-20 sm:py-28">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            O que é um trabalho coletivo
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            No trabalho coletivo, os pedidos de várias pessoas são firmados
            juntos, na mesma gira. A união de fé de todos fortalece cada nome
            colocado aos pés do Seu Zé — e torna o trabalho acessível para quem
            precisa.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-border/70 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative bg-background/95 p-7 transition-colors duration-300 hover:bg-card"
            >
              <span className="font-display text-[42px] leading-none text-secondary/90">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-[22px] leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                {step.text}
              </p>
              <span className="absolute inset-x-0 bottom-0 h-px w-0 bg-secondary/70 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CorrenteBanner({ onCta }: { onCta?: () => void }) {
  return (
    <section className="relative isolate overflow-hidden border-y border-border/60">
      <div className="absolute inset-0 -z-10 bg-candle" />

      <div className="section-shell grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="max-w-xl">
          <p className="eyebrow">A corrente de fé</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            Seu nome merece estar
            <span className="block italic text-primary">nessa corrente.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Escolha seu trabalho e garanta sua vaga na próxima gira coletiva. O
            pedido é recebido com sigilo e firmado com o mesmo cuidado de um
            atendimento individual.
          </p>
          <a
            href="#trabalhos"
            onClick={onCta}
            className="mt-8 inline-flex items-center gap-2 border-b border-secondary/50 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-secondary hover:text-foreground"
          >
            Escolher meu trabalho
          </a>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 -z-10 border border-secondary/20" />
          <div className="relative border border-secondary/30 bg-card/40 p-2 shadow-elegant">
            <img
              src="/images/galeria-nomes.jpg"
              alt="Nomes sendo escritos para a firmeza da corrente"
              loading="lazy"
              className="aspect-[4/3] w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
