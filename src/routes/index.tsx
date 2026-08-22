import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-transparent">

    

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex  items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Seu sistema operacional pessoal
          </div>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-8xl">
            Sua vida.
            <br />
            <span className="text-white/40">Do seu jeito.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
            O Next Life reúne tudo o que importa para você em um único lugar.
            Organize seus objetivos, hábitos, estudos, projetos e momentos
            importantes sem transformar sua vida em uma lista de tarefas.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* <Link
              to="/register"
              className="group flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
            >
              Começar minha jornada
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link> */}

            <a
              href="#recursos"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-medium text-white/70 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
            >
              Conhecer o Next Life
            </a>
          </div>

          {/* Preview */}
          <div className="relative mx-auto mt-24 max-w-5xl">
            <div className="absolute inset-0 rounded-[2rem] bg-white/[0.03] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0c] p-2 shadow-2xl">
              <div className="rounded-[1.5rem] border border-white/5 bg-[#111111] p-6">
                {/* Fake dashboard */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm text-white/40">
                      Bom dia
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                      Sua vida, hoje.
                    </h2>
                  </div>

                  <div className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/50 sm:block">
                    Segunda, 22 de agosto
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Hoje", "3 objetivos"],
                    ["Hábitos", "4 de 5"],
                    ["Foco", "82%"],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-left"
                    >
                      <p className="text-sm text-white/40">
                        {title}
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofia */}
      <section
        id="filosofia"
        className="relative px-6 py-32"
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-white/40">
            A ideia
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Não é sobre controlar sua vida.
            <br />
            <span className="text-white/40">
              É sobre entendê-la.
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50">
            O Next Life foi pensado para transformar informações espalhadas
            em uma visão clara daquilo que realmente importa para você.
          </p>
        </div>
      </section>

      {/* Recursos */}
      <section
        id="recursos"
        className="relative border-y border-white/5 px-6 py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-white/40">
              Tudo conectado
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Um lugar para
              <br />
              <span className="text-white/40">
                toda a sua vida.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Objetivos",
                description:
                  "Transforme ideias e sonhos em objetivos claros.",
              },
              {
                title: "Hábitos",
                description:
                  "Construa pequenas ações que fazem diferença.",
              },
              {
                title: "Estudos",
                description:
                  "Organize seu aprendizado e acompanhe sua evolução.",
              },
              {
                title: "Projetos",
                description:
                  "Tenha seus projetos sempre próximos do que importa.",
              },
              {
                title: "Relacionamentos",
                description:
                  "Não deixe as pessoas importantes ficarem de lado.",
              },
              {
                title: "Memórias",
                description:
                  "Registre momentos que você não quer esquecer.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.045]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                  <Check className="h-5 w-5" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-white/40">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="sobre"
        className="relative px-6 py-40"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Pronto para começar
            <br />
            <span className="text-white/40">
              sua próxima fase?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-white/40">
            Crie seu espaço. Organize sua vida. Descubra o que você
            consegue construir quando tudo está conectado.
          </p>

          {/* <Link
            to="/register"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-black transition hover:scale-[1.02]"
          >
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </Link> */}
        </div>
      </section>

      
    </main>
  );
}