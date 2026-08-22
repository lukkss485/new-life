import { Github, Instagram, Twitter } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 bottom-0 w-full">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* <Link
              to="/"
              className="inline-flex items-center gap-3"
            > 
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
                N
              </div>

              <span className="text-lg font-semibold text-white">
                Next Life
              </span>
            </Link>*/}

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">
              Seu sistema operacional pessoal para organizar,
              acompanhar e construir a vida que você quer viver.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Produto
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="#recursos"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Recursos
              </a>

              <a
                href="#filosofia"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Filosofia
              </a>

              {/* <Link
                to="/register"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Começar agora
              </Link>

              <Link
                to="/login"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Entrar
              </Link> */}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Next Life
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="#sobre"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Sobre
              </a>

              <a
                href="#"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Privacidade
              </a>

              <a
                href="#"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Termos
              </a>

              <a
                href="mailto:hello@nextlife.app"
                className="text-sm text-white/40 transition hover:text-white"
              >
                Contato
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            © 2026 Next Life. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-2">
            <a
              href="#"
              aria-label="GitHub"
              className="rounded-xl p-2.5 text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-xl p-2.5 text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="rounded-xl p-2.5 text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}