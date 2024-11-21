import { users } from '@/models/user';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const sessions = pgTable('session', {
  id: serial().primaryKey(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade'}),
  created_at: timestamp().defaultNow().notNull(),
  expires_at: timestamp().notNull(),
  session_id: varchar().notNull(),
  data: varchar({ length: 1000 }),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));
