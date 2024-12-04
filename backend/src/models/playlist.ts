import { users } from '@/models/user';
import { musics } from '@/models/music';
import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';

export const playlists = pgTable('playlist', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const musicsPlaylists = pgTable(
  'music_playlist',
  {
    musicId: integer()
      .notNull()
      .references(() => musics.id, { onDelete: 'cascade' }),
    playlistId: integer()
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.musicId, t.playlistId] }),
  })
);

export const playlistRelations = relations(playlists, ({ one }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
}));

export const musicPlaylistRelations = relations(musicsPlaylists, ({ one }) => ({
  music: one(musics, {
    fields: [musicsPlaylists.musicId],
    references: [musics.id],
  }),
  playlist: one(playlists, {
    fields: [musicsPlaylists.playlistId],
    references: [playlists.id],
  }),
}));
