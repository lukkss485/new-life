import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  CheckCircle,
  CheckCircle2,
  Compass,
  Heart,
  HeartPlus,
  Layers,
  Layers3,
  Sparkles,
  Target,
  UserPlus,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
});

const principles = [
  {
    icon: Layers,
    number: "01",
    title: "Tudo conectado",
    description:
      "Sua vida não acontece em partes isoladas. Objetivos, hábitos, estudos, pessoas e projetos influenciam uns aos outros.",
  },
  {
    icon: Target,
    number: "02",
    title: "Clareza antes de produtividade",
    description:
      "O objetivo não é preencher sua agenda. É entender o que realmente importa e transformar isso em ação.",
  },
  {
    icon: HeartPlus,
    number: "03",
    title: "Feito para pessoas",
    description:
      "Sua vida é mais do que tarefas. Relações, memórias, saúde, pensamentos e experiências também fazem parte dela.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Evolui com você",
    description:
      "O Next Life não deve obrigar você a se encaixar nele. O sistema deve acompanhar a pessoa que você está se tornando.",
  },
];

const lifeAreas = [
  "Objetivos",
  "Hábitos",
  "Estudos",
  "Projetos",
  "Saúde",
  "Relacionamentos",
  "Memórias",
  "Ideias",
];

function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute left-1/2 top-[-20rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-15rem] top-[35%] h-[35rem] w-[35rem] rounded-full bg-primary/5 blur-[120px]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-xl">
              <Sparkles size={16} />
              A ideia por trás do Next Life
            </div>

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl md:text-8xl">
              Sua vida é maior
              <br />
              <span className="text-muted-foreground/50">
                do que uma lista.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              O Next Life nasceu para transformar as diferentes partes
              da sua vida em algo que você consegue enxergar,
              compreender e construir.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-3.5 font-semibold text-background transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                Começar minha jornada
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#visao"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/40 px-6 py-3.5 font-medium text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground"
              >
                Descobrir a ideia
                <ArrowDown size={17} />
              </a>
            </div>
          </motion.div>

          {/* Floating visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto mt-24 max-w-5xl"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-primary/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/60 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-border/40 bg-muted/20 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Seu sistema
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Tudo começa com uma visão.
                    </h2>
                  </div>

                  <div className="hidden size-10 items-center justify-center rounded-xl border border-border/50 bg-background sm:flex">
                    <Compass size={20} />
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-4">
                  {lifeAreas.slice(0, 4).map((area, index) => (
                    <motion.div
                      key={area}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.08,
                      }}
                      className="rounded-2xl border border-border/40 bg-background/50 p-5"
                    >
                      <div className="mb-6 size-2 rounded-full bg-foreground/50" />

                      <p className="text-sm font-medium">
                        {area}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Parte da sua vida
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section
        id="visao"
        className="border-y border-border/40 px-6 py-32 sm:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Nossa visão
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Menos fragmentação.
                <br />
                <span className="text-muted-foreground/50">
                  Mais entendimento.
                </span>
              </h2>
            </div>

            <div className="space-y-7 text-lg leading-8 text-muted-foreground">
              <p>
                Hoje, sua vida provavelmente está espalhada por vários
                lugares. Uma aplicação para tarefas. Outra para hábitos.
                Outra para estudos. Notas em algum lugar. Fotos em outro.
              </p>

              <p>
                O problema não é ter ferramentas. O problema é que elas
                raramente entendem como uma parte da sua vida afeta a
                outra.
              </p>

              <p className="text-foreground">
                O Next Life nasceu para ser esse ponto de conexão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Big statement */}
      <section className="px-6 py-40">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl"
        >
          <p className="text-center text-3xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Não queremos criar mais uma ferramenta para você{" "}
            <span className="text-muted-foreground/50">
              administrar.
            </span>
          </p>

          <p className="mx-auto mt-10 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
            Queremos criar um espaço que ajude você a entender onde está,
            onde quer chegar e o que precisa fazer para chegar lá.
          </p>
        </motion.div>
      </section>

      {/* Principles */}
      <section
        id="principios"
        className="px-6 py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Princípios
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Construído para
              <br />
              <span className="text-muted-foreground/50">
                acompanhar você.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <motion.article
                  key={principle.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -4 }}
                  className="group rounded-[2rem] border border-border/50 bg-muted/10 p-7 transition-colors hover:bg-muted/20 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
                      <Icon size={21} />
                    </div>

                    <span className="text-xs font-medium text-muted-foreground/50">
                      {principle.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                    {principle.title}
                  </h3>

                  <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
                    {principle.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Life system */}
      <section className="border-y border-border/40 px-6 py-32 sm:py-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
                <Brain size={23} />
              </div>

              <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl">
                Um sistema que
                <br />
                <span className="text-muted-foreground/50">
                  entende o contexto.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                A proposta do Next Life é criar uma base central onde
                diferentes áreas da sua vida possam coexistir e se
                conectar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {lifeAreas.map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-border/10 bg-background/40 p-4 backdrop-blur-xl"
                >
                  <CheckCircle
                    size={17}
                    className="shrink-0 text-muted-foreground"
                  />

                  <span className="text-sm font-medium">
                    {area}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* People */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-foreground text-background">
            <UserPlus size={25} />
          </div>

          <h2 className="mt-8 text-4xl font-semibold tracking-tight sm:text-6xl">
            Feito para a pessoa
            <br />
            <span className="text-muted-foreground/50">
              por trás dos dados.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Porque você não é um conjunto de números, gráficos e
            checkboxes. Esses dados existem para ajudar você — não para
            definir quem você é.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-40 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-border/60 bg-muted/20 px-6 py-20 text-center shadow-2xl sm:px-12"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-foreground text-background">
              <Sparkles size={21} />
            </div>

            <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-6xl">
              O próximo capítulo
              <br />
              <span className="text-muted-foreground/50">
                começa com você.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground">
              Crie seu espaço no Next Life e comece a construir uma visão
              mais clara daquilo que você quer para sua vida.
            </p>

            <Link
              to="/register"
              className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-foreground px-7 py-4 font-semibold text-background transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              Começar agora
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}