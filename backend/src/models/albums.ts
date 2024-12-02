import { users } from '@/models/user';
import { relations } from 'drizzle-orm';
import { musics } from '@/models/music';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const albums = pgTable('albums', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  cover: varchar().notNull(),
  public: boolean().default(false),
  artistId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
});

export const albumRelations = relations(albums, ({ one, many }) => ({
  musicToAlbums: many(musicToAlbums),
  artist: one(users, {
    fields: [albums.artistId],
    references: [users.id],
  }),
}));

export const musicToAlbums = pgTable(
  'music_to_albums',
  {
    musicId: integer('music_id')
      .notNull()
      .references(() => musics.id),
    albumId: integer('album_id')
      .notNull()
      .references(() => albums.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.musicId, t.albumId] }),
  })
);

export const musicToAlbumsRelations = relations(musicToAlbums, ({ one }) => ({
  music: one(musics, {
    fields: [musicToAlbums.musicId],
    references: [musics.id],
  }),
  album: one(albums, {
    fields: [musicToAlbums.albumId],
    references: [albums.id],
  }),
}));
