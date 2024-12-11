import { db } from '@/db';
import { users } from '@/models/user';
import { musics } from '@/models/music';

import bcrypt from 'bcryptjs';

export const seed = async () => {
  const password = 'aA!123456789';

  const passwordHash = await bcrypt.hash(password, 10);

  const testUser: typeof users.$inferInsert = {
    email: 'test@email.com',
    password: passwordHash,
    username: 'test',
  };

  const insertedUser = await db.insert(users).values(testUser).returning();

  if (insertedUser.length === 0) {
    throw new Error('Failed to insert user');
  }

  const testMusic: typeof musics.$inferInsert = {
    title: 'Test Song',
    path: 'test.mp3',
    artistId: insertedUser[0].id,
    cover: 'test.jpg',
    duration: '100',
  };

  const insertedMusic = await db.insert(musics).values(testMusic).returning();

  if (insertedMusic.length === 0) {
    throw new Error('Failed to insert music');
  }
};

seed()
  .then(() => {
    console.log('Seed success');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
