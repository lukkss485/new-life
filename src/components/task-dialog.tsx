
import { useState } from 'react'
import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'

import { useTodos } from '#/lib/queries/todos'

function getDefaultDateTime() {
  const now = new Date()

  now.setSeconds(0, 0)

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function TaskDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(getDefaultDateTime())
  const [error, setError] = useState<string | null>(null)

  const { createTodo, isCreating } = useTodos()

  function resetForm() {
    setTitle('')
    setDescription('')
    setDate(getDefaultDateTime())
    setError(null)
  }

  function handleOpenChange(value: boolean) {
    setOpen(value)

    if (!value) {
      resetForm()
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      setError('Digite um título para a tarefa.')
      return
    }

    setError(null)

    try {
      await createTodo({
        title: trimmedTitle,
        description: trimmedDescription || undefined,
        date: date
          ? new Date(date).toISOString()
          : null,
      })

      resetForm()
      setOpen(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a tarefa.',
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger >
        <Button
          type="button"
          size="sm"
          className="rounded-xl"
        >
          <Plus className="size-4" />
          Nova tarefa
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>

          <DialogDescription>
            Adicione uma tarefa para organizar o seu dia.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="task-title">
              Título
            </Label>

            <Input
              id="task-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Ex.: Estudar TypeScript"
              maxLength={200}
              autoFocus
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">
              Descrição
            </Label>

            <Textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Adicione mais detalhes (opcional)"
              maxLength={1000}
              className="min-h-24 resize-none"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-date">
              Data e horário
            </Label>

            <Input
              id="task-date"
              type="datetime-local"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              disabled={isCreating}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isCreating || !title.trim()}
            >
              {isCreating
                ? 'Criando...'
                : 'Criar tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}