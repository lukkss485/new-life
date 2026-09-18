
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { user } from '../../auth-schema'

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),

  title: text('title').notNull(),

  description: text('description'),

  date: timestamp('date'),

  completed: boolean('completed')
    .notNull()
    .default(false),

  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow(),
})