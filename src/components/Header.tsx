import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Home, Info, User, Settings, Grip } from "lucide-react";
import icon from "#/assets/icon.svg";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import ThemeToggle from "./ThemeToggle";
import { GlassElement } from "./GlassElement/GlassElement";

const SCROLL_THRESHOLD = 24;
const MOBILE_BREAKPOINT = 768;

function useScrolled(threshold = SCROLL_THRESHOLD) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > threshold + 8) return true;
        if (prev && y < threshold - 8) return false;
        return prev;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export default function Header({...props}: React.ComponentProps<"div">) {
  const scrolled = useScrolled();
  const isMobile = useIsMobile();

  // --- MOBILE LAYOUT ---
  if (isMobile)
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-items-between px-4 pt-4" {...props}>
          <GlassElement
            autoSize
            width="fit-content"
            height={50}
            radius={999}
            depth={6}
            blur={1}
            strength={70}
            chromaticAberration={1}
            glassOpacity={25}
            angle={60}
            debug={false}
            className="flex items-center px-3"
          >
            <ThemeToggle />
          </GlassElement>
        </header>

        {/* Dock Flutuante Inferior */}
        <header className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between px-4 pb-4" {...props}>
          {/* Barra do Dock principal em linha (Horizontal) */}
          <GlassElement
            autoSize
            height={50}
            radius={999}
            depth={6}
            blur={1}
            strength={70}
            chromaticAberration={1}
            glassOpacity={25}
            angle={60}
            debug={false}
            className="flex items-center justify-around px-3 gap-2 "
          >
            {/* Links com estado ativo e animação de pílula */}
            <DockLink to="/" icon={<Home className="size-4" />} label="Início" />
            <DockLink to="/about" icon={<Info className="size-4" />} label="Sobre" />
            <DockLink to="/login" icon={<User className="size-4" />} label="login" />
          </GlassElement>
          <GlassElement
            autoSize
            width={50}
            height={50}
            radius={999}
            depth={6}
            blur={1}
            strength={60}
            chromaticAberration={1}
            glassOpacity={25}
            angle={60}
            debug={false}
            className="flex w-full max-w-sm items-center justify-around px-2"
          >
            <Grip />
          </GlassElement>
        </header>
      </>
    );

  // --- DESKTOP LAYOUT ---
  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6" {...props}>
      <GlassElement
        autoSize
        width="100%"
        radius={999}
        depth={6}
        blur={1}
        strength={scrolled ? 70 : 100}
        chromaticAberration={0.5}
        glassOpacity={25}
        angle={60}
        debug={false}
        className="w-full px-3 transition-[padding] duration-300 sm:px-4"
      >
        <nav
          aria-label="Navegação principal"
          className={`flex items-center justify-between gap-4 transition-[min-height] duration-300 ${scrolled ? "min-h-12" : "min-h-16"
            }`}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Nt life"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5"
          >
            <img src={icon} alt="" height={32} width={32} />
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            <HeaderLink to="/">Início</HeaderLink>
            <HeaderLink to="/about">Sobre</HeaderLink>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Separator
              orientation="vertical"
              className="hidden h-6 bg-foreground/10 sm:block"
            />

            <Link
              to="/login"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-foreground/50 transition-colors hover:bg-foreground/[0.05] hover:text-foreground sm:block"
            >
              Entrar
            </Link>
            <Button
              render={<Link to="/register" />}
              size="sm"
              className="group hidden rounded-xl px-4 font-semibold shadow-sm transition-all hover:shadow-md sm:flex"
            >
              Começar
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </nav>
      </GlassElement>
    </header>
    </>
  );
}

// --- COMPONENTES AUXILIARES ---

interface DockLinkProps {
  to: "/" | "/about" | "/login";
  icon: React.ReactNode;
  label: string;
}

function DockLink({ to, icon, label }: DockLinkProps) {
  return (
    <Link to={to} activeOptions={{ exact: to === "/" }}>
      {({ isActive }) => (
        <div
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${isActive
            ? "bg-foreground text-background scale-105 shadow-md"
            : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
            }`}
        >
          {icon}
          {isActive && (
            <span className="animate-in fade-in zoom-in-95 whitespace-nowrap duration-200">
              {label}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

interface HeaderLinkProps {
  to: "/" | "/about";
  children: React.ReactNode;
  onClick?: () => void;
}

function HeaderLink({ to, children, onClick }: HeaderLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeProps={{
        className: "bg-foreground/[0.08] text-foreground",
        "aria-current": "page",
      }}
      className="rounded-lg px-3 py-2 text-sm text-foreground/50 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
    >
      {children}
    </Link>
  );
}