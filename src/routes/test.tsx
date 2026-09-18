import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<div className="min-h-screen min-w-screen bg-white">Hello "/test"!</div>)
}
