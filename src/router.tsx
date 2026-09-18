import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

export const getRouter = createRouter

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}