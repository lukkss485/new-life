import { useRef } from 'react'
import type { ComponentType } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { BookOpen, FolderKanban, Flame, Home, Image, Target, Users } from 'lucide-react'

import { GlassElement } from '#/components/GlassElement/GlassElement'

/**
 * A Dock é um dos poucos lugares do app onde o liquid glass faz sentido de
 * verdade: ela fica fixa na tela e o conteúdo da página passa por baixo
 * dela ao rolar. Cards estáticos da dashboard NÃO usam GlassElement — usam
 * <Card> normal, porque nada se move atrás deles. Ver /areas/life-os.md
 * (regra de design combinada).
 */

// Ajuste os caminhos (`to`) para bater com as rotas reais do seu projeto
const items = [
  { label: 'Início', to: '/dashboard', icon: Home },
  { label: 'Objetivos', to: '/objetivos', icon: Target },
  { label: 'Hábitos', to: '/habitos', icon: Flame },
  { label: 'Estudos', to: '/estudos', icon: BookOpen },
  { label: 'Projetos', to: '/projetos', icon: FolderKanban },
  { label: 'Relacionamentos', to: '/relacionamentos', icon: Users },
  { label: 'Memórias', to: '/memorias', icon: Image },
] as const

export function Dock() {
  const mouseX = useMotionValue(Infinity)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      {/* w-fit aqui é o que realmente resolve: o GlassElement, por padrão,
          seta width:100% via style inline (que vence qualquer classe que a
          gente passe pra ele). Encapsulando num w-fit, o 100% dele passa a
          valer 100% DESTE div — que por sua vez encolhe pro tamanho real
          do conteúdo (os ícones), então tudo cai pro tamanho certo. */}
      <div className="pointer-events-auto w-fit">
        <GlassElement
          depth={8}
          blur={0}
          radius="4rem"
          debug={false}
          strength={60}
          chromaticAberration={1}
          glassOpacity={25}
          angle={60}
          autoSize  
          style={{ width: 'fit-content', height: 'fit-content' }}
          className="border border-foreground/10 bg-foreground/[0.04] px-3 py-2 shadow-lg shadow-black/10 dark:shadow-black/40 backdrop-blur-xl"
        >
          <div
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="flex items-end gap-2"
          >
            {items.map((item) => (
              <DockIcon key={item.to} mouseX={mouseX} active={pathname === item.to} {...item} />
            ))}
          </div>
        </GlassElement>
      </div>
    </div>
  )
}

interface DockIconProps {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  mouseX: MotionValue<number>
  active: boolean
}

function DockIcon({ label, to, icon: Icon, mouseX, active }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Distância entre o mouse e o centro do ícone — quanto mais perto, maior
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return Infinity
    return val - (bounds.x + bounds.width / 2)
  })

  const sizeRaw = useTransform(distance, [-140, 0, 140], [40, 60, 40])
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 200, damping: 14 })

  return (
    <Link to={to} aria-label={label} className="group relative flex flex-col items-center">
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-2xl transition-colors ${
          active
            ? 'bg-accent text-primary-accent-foreground'
            : 'bg-primary/70   text-accent/70 hover:bg-foreground/15'
        }`}
      >
        <Icon className="size-5" />
      </motion.div>

      <span className="pointer-events-none absolute -top-8 scale-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
        {label}
      </span>

      {active && <span className="absolute -bottom-1.5 size-1 rounded-full bg-primary" />}
    </Link>
  )
}