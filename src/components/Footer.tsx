import { Github, Instagram, Twitter, ArrowUp } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="w-full bg-background p-10">

        {/* Bottom */}
        <div className="mt-8 gap-4 border-t border-border ">
          <div className="gap-4  pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © 2026 Next Life. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </a>
                ))}
              </div>

              <span className="h-4 w-px bg-border" aria-hidden="true" />

              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="hidden sm:inline">Topo</span>
              </button>
            </div>
          </div>

          
        </div>
    </footer>
  );
}