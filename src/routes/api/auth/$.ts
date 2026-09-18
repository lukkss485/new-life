import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../../../lib/auth' // Ajuste o caminho relativo conforme a sua pasta lib
import { betterAuth } from "better-auth"
async function handler({ request }: { request: Request }) {
  return auth.handler(request)
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})

