
import { createFileRoute } from '@tanstack/react-router'
import { motion, type Variants } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  FolderKanban,
  Image,
  ListTodo,
  Plus,
  Target,
  Users,
} from 'lucide-react'

import { Card, CardContent } from '#/components/ui/card'
import { Progress } from '#/components/ui/progress'

import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { useTodos, type UpdateTodoInput } from '#/lib/queries/todos'
import { TaskDialog } from '#/components/task-dialog'

export const Route = createFileRoute('/(private)/dashboard')({
  component: DashboardPage,
})

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const getGreeting = (hour: number) => {
  if (hour < 5) return 'Boa madrugada'
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'

  return 'Boa noite'
}

const formatTime = (value: string | null) => {
  if (!value) return null

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const formatDate = (value: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value)
}

const isSameDay = (date: string | null, reference: Date) => {
  if (!date) return false

  const value = new Date(date)

  return (
    value.getFullYear() === reference.getFullYear() &&
    value.getMonth() === reference.getMonth() &&
    value.getDate() === reference.getDate()
  )
}

const lifeAreas = [
  {
    title: 'Objetivos',
    description: 'Defina o que você quer alcançar.',
    icon: Target,
  },
  {
    title: 'Hábitos',
    description: 'Construa uma rotina consistente.',
    icon: ListTodo,
  },
  {
    title: 'Estudos',
    description: 'Organize seu aprendizado.',
    icon: BookOpen,
  },
  {
    title: 'Projetos',
    description: 'Acompanhe o que você está construindo.',
    icon: FolderKanban,
  },
  {
    title: 'Relacionamentos',
    description: 'Mantenha perto quem importa.',
    icon: Users,
  },
  {
    title: 'Memórias',
    description: 'Guarde momentos importantes.',
    icon: Image,
  },
]

function DashboardPage() {
  const { data: session } = authClient.useSession()

  const {
    todos,
    isLoading: isLoadingTodos,
    error: todosError,
    updateTodo,
  } = useTodos()

  const now = new Date()

  const userName = session?.user?.name?.trim() || 'você'
  const greeting = getGreeting(now.getHours())
  const date = formatDate(now)

  const todayTodos = todos
    .filter((todo) => isSameDay(todo.date, now))
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1

      return (
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
      )
    })

  const completedToday = todayTodos.filter(
    (todo) => todo.completed,
  ).length

  const pendingToday = todayTodos.filter(
    (todo) => !todo.completed,
  ).length

  const todayProgress =
    todayTodos.length > 0
      ? Math.round((completedToday / todayTodos.length) * 100)
      : 0

  const nextTodo =
    todayTodos.find((todo) => !todo.completed) ?? todayTodos[0] ?? null

  const handleToggleTodo = async (
    id: number,
    completed: boolean,
  ) => {
    await updateTodo({
      id,
      data: {
        completed: !completed,
      },
    })
  }

  return (
    <main className="min-h-screen bg-background pb-32 overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-12"
        >
          {/* Hero */}
          <motion.section
            variants={fadeUp}
            className="relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />

                    <span className="capitalize">
                      {date}
                    </span>
                  </div>

                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    {greeting}, {userName}.
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Um novo dia para cuidar do que importa.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Hoje
                    </p>

                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {completedToday}/{todayTodos.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Pendentes
                    </p>

                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {pendingToday}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-primary/[0.035] blur-3xl" />
          </motion.section>

          {/* Seu dia */}
          <motion.section variants={fadeUp}>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Agora
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Seu dia
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <TaskDialog />

                <button
                  type="button"
                  className="group hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
                >
                  Ver tudo

                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <Card className="overflow-hidden rounded-3xl border-foreground/10 bg-foreground/[0.025] shadow-none">
              <CardContent className="p-6 sm:p-7">
                {nextTodo ? (
                  <>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                          <Clock3 className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-primary">
                              {nextTodo.completed
                                ? 'CONCLUÍDA'
                                : 'PRÓXIMA'}
                            </span>

                            {formatTime(nextTodo.date) && (
                              <>
                                <span className="size-1 rounded-full bg-muted-foreground/30" />

                                <span className="text-xs text-muted-foreground">
                                  {formatTime(nextTodo.date)}
                                </span>
                              </>
                            )}
                          </div>

                          <h3
                            className={cn(
                              'mt-2 truncate text-lg font-semibold',
                              nextTodo.completed &&
                              'text-muted-foreground line-through',
                            )}
                          >
                            {nextTodo.title}
                          </h3>

                          {nextTodo.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {nextTodo.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleTodo(
                            nextTodo.id,
                            nextTodo.completed,
                          )
                        }
                        className={cn(
                          'group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                          nextTodo.completed
                            ? 'border-primary/20 bg-primary/10 text-primary'
                            : 'border-foreground/10 hover:bg-foreground/[0.04]',
                        )}
                      >
                        {nextTodo.completed ? (
                          <>
                            <Check className="size-4" />
                            Concluída
                          </>
                        ) : (
                          <>
                            Concluir
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-6">
                      <Progress
                        value={todayProgress}
                        className="h-1.5"
                      />

                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progresso de hoje</span>
                        <span>{todayProgress}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Check className="size-5" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold">
                      Seu dia está livre
                    </h3>

                    <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                      Você ainda não tem tarefas para hoje.
                      Aproveite para adicionar algo importante.
                    </p>

                    <div className="mt-5">
                      <TaskDialog />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Resumo */}
          <motion.section variants={fadeUp}>
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Resumo
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Como está seu dia
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="rounded-2xl border-foreground/10 bg-transparent shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ListTodo className="size-4" />
                    </div>

                    <span className="text-sm text-muted-foreground">
                      Tarefas hoje
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {todayTodos.length}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    tarefas registradas
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-foreground/10 bg-transparent shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Check className="size-4" />
                    </div>

                    <span className="text-sm text-muted-foreground">
                      Concluídas
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {completedToday}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    concluídas hoje
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-foreground/10 bg-transparent shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Clock3 className="size-4" />
                    </div>

                    <span className="text-sm text-muted-foreground">
                      Pendentes
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {pendingToday}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    ainda para hoje
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Tarefas de hoje */}
          <motion.section variants={fadeUp}>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Tarefas
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Para hoje
                </h2>
              </div>

              <TaskDialog />
            </div>

            <Card className="rounded-3xl border-foreground/10 bg-foreground/[0.02] shadow-none">
              <CardContent className="p-4 sm:p-5">
                {isLoadingTodos ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl px-2 py-3"
                      >
                        <div className="size-5 animate-pulse rounded-full bg-foreground/10" />

                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-32 animate-pulse rounded bg-foreground/10" />

                          <div className="h-2.5 w-16 animate-pulse rounded bg-foreground/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : todosError ? (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    Não foi possível carregar suas tarefas.
                  </div>
                ) : todayTodos.length > 0 ? (
                  <div className="space-y-1">
                    {todayTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="group flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-foreground/[0.03]"
                      >
                        <button
                          type="button"
                          aria-label={
                            todo.completed
                              ? 'Marcar como pendente'
                              : 'Marcar como concluída'
                          }
                          onClick={() =>
                            handleToggleTodo(
                              todo.id,
                              todo.completed,
                            )
                          }
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
                            todo.completed
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-foreground/15 hover:border-primary/50',
                          )}
                        >
                          {todo.completed && (
                            <Check className="size-3" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              'truncate text-sm font-medium',
                              todo.completed &&
                              'text-muted-foreground line-through',
                            )}
                          >
                            {todo.title}
                          </p>

                          <div className="mt-0.5 flex min-w-0 items-center gap-2">
                            {formatTime(todo.date) && (
                              <span className="shrink-0 text-xs text-muted-foreground">
                                {formatTime(todo.date)}
                              </span>
                            )}

                            {todo.description && (
                              <>
                                <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />

                                <span className="truncate text-xs text-muted-foreground">
                                  {todo.description}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/20 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ListTodo className="size-5" />
                    </div>

                    <p className="mt-4 text-sm font-medium">
                      Nenhuma tarefa para hoje
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                      Adicione sua primeira tarefa e comece a organizar seu
                      dia.
                    </p>

                    <div className="mt-5">
                      <TaskDialog />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Áreas da vida */}
          <motion.section variants={fadeUp}>
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Sistema
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Áreas da vida
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lifeAreas.map((area) => {
                const Icon = area.icon

                return (
                  <Card
                    key={area.title}
                    className="group rounded-3xl border-foreground/10 bg-foreground/[0.02] shadow-none transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/[0.04]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>

                        <ArrowUpRight className="size-4 text-muted-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                      </div>

                      <h3 className="mt-5 font-semibold tracking-tight">
                        {area.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {area.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.section>

          {/* Insight */}
          <motion.section variants={fadeUp}>
            <Card className="overflow-hidden rounded-3xl border-foreground/10 bg-foreground/[0.025] shadow-none">
              <CardContent className="relative p-6 sm:p-8">
                <div className="absolute -right-20 -top-20 size-48 rounded-full bg-primary/[0.06] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-2">
                    <ListTodo className="size-4 text-primary" />

                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                      Seu dia
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {todayTodos.length === 0
                      ? 'Seu dia ainda está aberto.'
                      : pendingToday === 0
                        ? 'Tudo resolvido por hoje.'
                        : `${pendingToday} ${pendingToday === 1
                          ? 'tarefa espera'
                          : 'tarefas esperam'
                        } por você.`}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {todayTodos.length === 0
                      ? 'Adicione algumas tarefas para transformar suas prioridades em ações concretas.'
                      : pendingToday === 0
                        ? 'Você concluiu todas as tarefas registradas para hoje.'
                        : 'Concentre-se na próxima tarefa e avance no seu ritmo.'}
                  </p>

                  <div className="mt-6">
                    <TaskDialog />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </div>
    </main>
  )
}
