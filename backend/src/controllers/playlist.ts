import { Request, Response } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { playlists, sessions } from '@/db/schema';
import { db } from '@/db';

const getList = async (req: Request, res: Response): Promise<void> => {
    const playlists = await db.query.playlists.findMany();
    
    res.status(200).json({ playlists });
}

const getPlaylistInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'Playlist Id is required' });
    return;
  }

  const playlist = await db.query.playlists.findFirst({
    where: eq(playlists.id, Number(id)),
    with: {
      user: {
        columns: {
          email: true,
          username: true,
          image: true,
        },
      },
    },
  });

  if (!playlist) {
    res.status(404).json({ message: 'Playlist not found' });
    return;
  }

  res.status(200).json({ playlist });
};

const uploadPlaylistBodySchema = z.object({
  title: z.string(),
  public: z.enum(['true', 'false']),
});

const uploadPlaylist = async (req: Request, res: Response): Promise<void> => {
  const params = uploadPlaylistBodySchema.safeParse(req.body);

  if (params.error) {
    res.status(400).json({ message: params.error.errors });
    return;
  }

  const { title, public: isPublic } = params.data;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.session_id, req.sessionID),
    with: {
      user: true,
    },
  });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  await db
    .insert(playlists)
    .values({
      title: title,
      public: isPublic === 'true',
      userId: session.user.id,
    })
    .returning();

  res.status(200).json({ message: 'Playlist uploaded successfully' });
};

const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
    await db.delete(playlists).where(eq(playlists.id, Number(req.params.id)));
    res.status(200).json({ message: 'Playlist deleted' });
};

export default { uploadPlaylist, getPlaylistInfo, getList, deletePlaylist };
