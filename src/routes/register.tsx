import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'motion/react'

import { authClient } from '../lib/auth-client'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { CardContent, CardFooter } from '../components/ui/card'
import { GlassElement } from '#/components/GlassElement/GlassElement'
import icon from '#/assets/icon.svg'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const SOCIAL_PROVIDERS = ['google', 'github', 'facebook', 'instagram'] as const
type SocialProvider = (typeof SOCIAL_PROVIDERS)[number]

const PROVIDER_CONFIG: Record<
  SocialProvider,
  { label: string; icon: React.ReactNode }
> = {
  google: {
    label: 'Google',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
    ),
  },
  github: {
    label: 'GitHub',
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    icon: (
      <svg className="size-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
  },
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = loading || socialLoading !== null

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length
  const strengthLabel =
    strengthScore <= 1 ? 'fraca' : strengthScore === 2 ? 'média' : 'forte'
  const strengthColor =
    strengthScore <= 1 ? 'bg-destructive' : strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500'

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    await authClient.signUp.email(
      { email, password, name },
      {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Erro ao criar conta.')
          setLoading(false)
        },
      },
    )
  }

  const handleSocialRegister = async (provider: SocialProvider) => {
    setSocialLoading(provider)
    setError(null)

    await authClient.signIn.social(
      { provider, callbackURL: '/' },
      {
        onError: (ctx) => {
          setError(
            ctx.error.message ||
              `Erro ao continuar com ${PROVIDER_CONFIG[provider].label}`,
          )
          setSocialLoading(null)
        },
      },
    )
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center">
            <Link
              to="/"
              aria-label="Nt life"
              className="group flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5"
            >
              <img src={icon} alt="" height={32} width={32} />
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Crie sua conta
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Comece a organizar sua vida de forma simples e personalizada.
          </p>
        </motion.div>

        {/* Card Glass */}
        <GlassElement
          depth={10}
          blur={10}
          radius={40}
          className="overflow-hidden rounded-4xl border-border/50 bg-card/80 shadow-2xl shadow-black/5 backdrop-blur-xl"
        >
          <CardContent className="space-y-5 p-6">
            {/* Mensagem de Erro */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  role="alert"
                  className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cadastro Social */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
              {SOCIAL_PROVIDERS.map((provider) => {
                const config = PROVIDER_CONFIG[provider]
                const isCurrentLoading = socialLoading === provider

                return (
                  <Button
                    key={provider}
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => handleSocialRegister(provider)}
                    className="h-10 w-full gap-2 rounded-xl border-border bg-background hover:bg-accent"
                  >
                    {isCurrentLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        {config.icon}
                        <span className="text-xs font-medium">{config.label}</span>
                      </>
                    )}
                  </Button>
                )
              })}
            </motion.div>

            {/* Separador */}
            <motion.div variants={itemVariants} className="relative flex items-center py-1">
              <span className="mx-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                ou com e-mail
              </span>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nome */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-medium text-foreground">
                  Nome
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Como podemos te chamar?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    disabled={busy}
                    className="h-10 rounded-xl pl-9 text-sm"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-foreground">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={busy}
                    className="h-10 rounded-xl pl-9 text-sm"
                  />
                </div>
              </motion.div>

              {/* Senha */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-foreground">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={busy}
                    className="h-10 rounded-xl pl-9 pr-9 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {/* Indicador de Força */}
                {password.length > 0 && (
                  <div className="pt-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                        style={{ width: `${(strengthScore / 3) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Senha {strengthLabel}
                    </p>
                  </div>
                )}

                {/* Requisitos */}
                <ul className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
                  <li
                    className={`flex items-center gap-1 ${
                      passwordChecks.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" /> 8+ chars
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      passwordChecks.upper ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" /> 1 Maiúscula
                  </li>
                  <li
                    className={`flex items-center gap-1 ${
                      passwordChecks.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="size-3" /> 1 Número
                  </li>
                </ul>
              </motion.div>

              {/* Botão Cadastrar */}
              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  disabled={busy}
                  className="h-10 w-full gap-2 rounded-xl text-sm font-semibold shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <>
                      <span>Criar conta</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-center p-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Entrar
              </Link>
            </p>
          </CardFooter>
        </GlassElement>
      </motion.div>
    </main>
  )
}