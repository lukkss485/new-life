import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion, MotionConfig, type Variants } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/")({
  component: Page,
});

const features = [
  { title: "Objetivos", description: "Transforme ideias e sonhos em objetivos claros." },
  { title: "Hábitos", description: "Construa pequenas ações que fazem diferença." },
  { title: "Estudos", description: "Organize seu aprendizado e acompanhe sua evolução." },
  { title: "Projetos", description: "Tenha seus projetos sempre próximos do que importa." },
  { title: "Relacionamentos", description: "Não deixe as pessoas importantes ficarem de lado." },
  { title: "Memórias", description: "Registre momentos que você não quer esquecer." },
];

// Um item sobe e some do fade ao entrar. Easing customizado (curva "expo out")
// para o movimento parecer suave e não mecânico.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Aplicado no elemento pai: cada filho direto com variants entra em
// sequência, sem precisar calcular delay manualmente em cada um.
const stagger = (staggerChildren = 0.09): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren } },
});

function Page() {
  return (
    // reducedMotion="user" respeita a preferência do sistema operacional:
    // quem tem "reduzir movimento" ativado vê o conteúdo aparecer sem
    // deslocamento, só com opacidade — sem eu precisar tratar isso na mão.
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen overflow-hidden bg-transparent text-foreground">
        
        {/* Hero */}
        <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
          {/* Grid de fundo */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, color-mix(in srgb, var(--primary-foreground) 100%, transparent) 1px, transparent 2px),
                linear-gradient(to bottom, color-mix(in srgb, var(--primary-foreground) 100%, transparent) 1px, transparent 2px)
              `,
              boxShadow: "inset 0px -500px 1000px -100px var(--background)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 90% 85% at 50% 35%, black 45%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 35%, black 45%, transparent 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">   
            <motion.div
              className="mx-auto w-full max-w-5xl text-center"
              variants={stagger()}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="flex justify-center">
                <Badge
                  variant="outline"
                  className="mb-8 gap-2 rounded-full border-foreground/10 bg-foreground/[0.04] px-4 py-2 text-sm font-normal text-foreground/60 backdrop-blur-xl"
                >
                  <Sparkles className="size-4" />
                  Seu sistema pessoal
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-8xl"
              >
                Sua vida.
                <br />
                <span className="text-foreground/40">Do seu jeito.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-8 max-w-2xl text-base leading-7 text-foreground/50 sm:text-lg"
              >
                O Nt life reúne tudo o que importa para você em um único
                lugar. Organize seus objetivos, hábitos, estudos, projetos e
                momentos importantes sem transformar sua vida em uma lista de
                tarefas.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex justify-center">
                <Button
                  render={(props) => <Link to="/register" {...props} />}
                  size="lg"
                  className="h-12"
                >
                  Conhecer o Nt life
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>

              {/* Preview */}
              <motion.div variants={fadeUp} className="relative mx-auto mt-24 max-w-5xl">
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-sm text-foreground/40">Bom dia</p>
                        <h2 className="mt-1 text-2xl font-semibold">Sua vida, hoje.</h2>
                      </div>

                      <Badge
                        variant="outline"
                        className="hidden rounded-xl border-foreground/10 bg-foreground/[0.04] px-4 py-2 font-normal text-foreground/50 sm:flex"
                      >
                        Segunda, 22 de agosto
                      </Badge>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {[
                        ["Hoje", "3 objetivos"],
                        ["Hábitos", "4 de 5"],
                        ["Foco", "82%"],
                      ].map(([title, value]) => (
                        <Card key={title} className="rounded-2xl border-foreground/5 bg-foreground/[0.025] shadow-none">
                          <CardContent className="p-5 text-left">
                            <p className="text-sm text-foreground/40">{title}</p>
                            <p className="mt-2 text-xl font-semibold">{value}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Filosofia */}
        <section id="filosofia" className="relative px-6 py-32">
          <motion.div
            className="mx-auto max-w-5xl"
            variants={stagger()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="text-sm font-medium text-foreground/40">
              A ideia
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl"
            >
              Não é sobre controlar sua vida.
              <br />
              <span className="text-foreground/40">É sobre entendê-la.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-8 max-w-2xl text-lg leading-8 text-foreground/50">
              O Nt life foi pensado para transformar informações espalhadas
              em uma visão clara daquilo que realmente importa para você.
            </motion.p>
          </motion.div>
        </section>

        <Separator className="bg-foreground/5" />

        {/* Recursos */}
        <section id="recursos" className="relative px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="max-w-2xl"
              variants={stagger()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.p variants={fadeUp} className="text-sm font-medium text-foreground/40">
                Tudo conectado
              </motion.p>

              <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
                Um lugar para
                <br />
                <span className="text-foreground/40">toda a sua vida.</span>
              </motion.h2>
            </motion.div>

            <motion.div
              className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {features.map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <Card className="group rounded-3xl border-foreground/10 bg-foreground/[0.025] shadow-none transition duration-300 hover:-translate-y-1 hover:bg-foreground/[0.045]">
                    <CardContent className="p-7">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Check className="size-5" />
                      </div>

                      <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                      <p className="mt-3 leading-7 text-foreground/40">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Separator className="bg-foreground/5" />

        {/* CTA */}
        <section id="sobre" className="relative px-6 py-40">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            variants={stagger()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              <Badge
                variant="outline"
                className="rounded-full border-foreground/10 bg-foreground/[0.04] px-4 py-2 text-foreground/50"
              >
                Nt life
              </Badge>
            </motion.div>

            <motion.h2 variants={fadeUp} className="mt-8 text-4xl font-semibold tracking-tight sm:text-6xl">
              Pronto para começar
              <br />
              <span className="text-foreground/40">sua próxima fase?</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl leading-7 text-foreground/40">
              Crie seu espaço. Organize sua vida. Descubra o que você
              consegue construir quando tudo está conectado.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex justify-center">
              <Button
                render={(props) => <Link to="/register" {...props} />}
                size="lg"
                className="h-12 rounded-2xl px-7 font-semibold"
              >
                Conhecer o Nt life
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}