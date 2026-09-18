
import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '#/lib/auth'
import { db } from '#/db'
import { todos } from '#/db/schema'

const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  date: z.string().datetime().nullable().optional(),
  completed: z.boolean().optional(),
})

async function requireSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  })
}

export const Route = createFileRoute('/api/todos/$id')({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const session = await requireSession(request)

        if (!session) {
          return Response.json(
            { error: 'Não autenticado.' },
            { status: 401 },
          )
        }

        const todoId = Number(params.id)

        if (!Number.isInteger(todoId)) {
          return Response.json(
            { error: 'ID inválido.' },
            { status: 400 },
          )
        }

        let body: unknown

        try {
          body = await request.json()
        } catch {
          return Response.json(
            { error: 'JSON inválido.' },
            { status: 400 },
          )
        }

        const parsed = updateTodoSchema.safeParse(body)

        if (!parsed.success) {
          return Response.json(
            {
              error: 'Dados inválidos.',
              issues: parsed.error.flatten(),
            },
            { status: 400 },
          )
        }

        const values = {
          ...(parsed.data.title !== undefined && {
            title: parsed.data.title,
          }),

          ...(parsed.data.description !== undefined && {
            description: parsed.data.description,
          }),

          ...(parsed.data.date !== undefined && {
            date: parsed.data.date
              ? new Date(parsed.data.date)
              : null,
          }),

          ...(parsed.data.completed !== undefined && {
            completed: parsed.data.completed,
          }),

          updatedAt: new Date(),
        }

        const updated = await db
          .update(todos)
          .set(values)
          .where(
            and(
              eq(todos.id, todoId),
              eq(todos.userId, session.user.id),
            ),
          )
          .returning()

        if (!updated[0]) {
          return Response.json(
            { error: 'Tarefa não encontrada.' },
            { status: 404 },
          )
        }

        return Response.json(updated[0])
      },

      DELETE: async ({ request, params }) => {
        const session = await requireSession(request)

        if (!session) {
          return Response.json(
            { error: 'Não autenticado.' },
            { status: 401 },
          )
        }

        const todoId = Number(params.id)

        if (!Number.isInteger(todoId)) {
          return Response.json(
            { error: 'ID inválido.' },
            { status: 400 },
          )
        }

        const deleted = await db
          .delete(todos)
          .where(
            and(
              eq(todos.id, todoId),
              eq(todos.userId, session.user.id),
            ),
          )
          .returning({ id: todos.id })

        if (!deleted[0]) {
          return Response.json(
            { error: 'Tarefa não encontrada.' },
            { status: 404 },
          )
        }

        return Response.json({
          success: true,
          id: deleted[0].id,
        })
      },
    },
  },
})