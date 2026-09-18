
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

export interface Todo {
  id: number  
  userId: string
  title: string
  description: string | null
  date: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  date?: string | null
}

export interface UpdateTodoInput {
  title?: string
  description?: string | null
  date?: string | null
  completed?: boolean
}

const todosQueryKey = ['todos']

async function getTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos', {
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    throw new Error(
      data?.error || 'Não foi possível carregar as tarefas.',
    )
  }

  return response.json()
}

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    throw new Error(
      data?.error || 'Não foi possível criar a tarefa.',
    )
  }

  return response.json()
}

async function updateTodo(
  id: number,
  input: UpdateTodoInput,
): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    throw new Error(
      data?.error || 'Não foi possível atualizar a tarefa.',
    )
  }

  return response.json()
}

async function deleteTodo(id: number) {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    throw new Error(
      data?.error || 'Não foi possível excluir a tarefa.',
    )
  }

  return response.json() as Promise<{
    success: boolean
    id: number
  }>
}

export function useTodos() {
  const queryClient = useQueryClient()

  const todosQuery = useQuery({
    queryKey: todosQueryKey,
    queryFn: getTodos,
  })

  const createMutation = useMutation({
    mutationFn: createTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todosQueryKey,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: UpdateTodoInput
    }) => updateTodo(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todosQueryKey,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todosQueryKey,
      })
    },
  })

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    isFetching: todosQuery.isFetching,
    error: todosQuery.error,

    createTodo: createMutation.mutateAsync,
    updateTodo: updateMutation.mutateAsync,
    deleteTodo: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
