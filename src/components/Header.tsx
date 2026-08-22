"use client";

import { Link } from "@tanstack/react-router";
import { Separator } from "./ui/separator";
import ThemeToggle from "./ThemeToggle";
import { GlassElement } from "./GlassElement/GlassElement";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      {/* container que define a largura máxima; o GlassElement mede ESTE
          elemento pai (via ResizeObserver) quando width="100%" (SizeValue string = fluido) */}
      <div className="mx-auto max-w-6xl">
        <GlassElement
          width="100%" // string -> modo fluido: o wrapper interno vira 100% do pai e mede via ResizeObserver
          height={64} // number -> altura fixa (equivalente ao antigo h-16), sem precisar de wrapper de medição
          radius={60/2} // number -> vira o borderRadius do filtro de deslocamento E do CSS (rounded-2xl)
          depth={8}
          shaders // liga o modo real de distorção SVG (styles.box); sem isso cai no fallback CSS puro
          className="px-5"
          blur={0}
          debug={false}
        >
          <nav className="flex h-full items-center justify-between">
            {/* Logo */}
            {/* <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
                N
              </div>

              <span className="text-lg font-semibold tracking-tight text-white">
                Next Life
              </span>
            </Link> */}

            {/* Navegação (div, não <nav>, pra não aninhar landmarks) */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                to="/about"
                className="text-sm text-white/60 transition hover:text-white"
              >
                sobre
              </Link>
              <Separator orientation="vertical" />
              <a
                href="#recursos"
                className="text-sm text-white/60 transition hover:text-white"
              >
                Recursos
              </a>

              <a
                href="#como-funciona"
                className="text-sm text-white/60 transition hover:text-white"
              >
                Como funciona
              </a>

              <a
                href="#sobre"
                className="text-sm text-white/60 transition hover:text-white"
              >
                Sobre
              </a>
            </div>

            {/* Ações */}
            {/* <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white sm:block"
              >
                Entrar
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
              >
                Começar agora
              </Link>
            </div> */}
            <ThemeToggle />
          </nav>
        </GlassElement>
      </div>
    </header>
  );
}