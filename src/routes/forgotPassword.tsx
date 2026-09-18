import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '../lib/auth-client'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'

export const Route = createFileRoute('/forgotPassword')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    await authClient.forgetPassword(
      {
        email,
        redirectTo: '/reset-password', // Rota para onde o usuário será redirecionado pelo link do e-mail
      },
      {
        onSuccess: () => {
          setSuccess(true)
          setLoading(false)
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Ocorreu um erro ao enviar o e-mail de recuperação.')
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Recuperar senha</CardTitle>
          <CardDescription>
            Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleForgotPassword}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-500">
                E-mail de recuperação enviado! Verifique sua caixa de entrada.
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={success}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!success && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar instruções'}
              </Button>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Lembrou sua senha?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 