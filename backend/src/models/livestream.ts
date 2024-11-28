import { users } from '@/models/user';
import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const livestream = pgTable('livestream', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const livestreamRelations = relations(livestream, ({ one }) => ({
  user: one(users, {
    fields: [livestream.userId],
    references: [users.id],
  }),
}));
