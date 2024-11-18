import { Request, Response } from 'express';
import { Music, MusicAttributes } from '@/models/music';
import path from 'path';
import fs from 'fs';
import { Op, WhereOptions } from 'sequelize';
import { z } from 'zod';
import { User } from '@/models/user';
import getAudioDurationInSeconds from 'get-audio-duration';

const getMusicInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'Music Id is required' });
    return;
  }

  const music = await Music.findOne({
    where: { id: id },
  });

  if (!music) {
    res.status(404).json({ message: 'Music not found' });
    return;
  }

  res.status(200).json({ music });
};

const streamSchema = z.object({
  id: z.string().uuid(),
});

const streamMusic = async (req: Request, res: Response): Promise<void> => {
  const params = streamSchema.safeParse(req.params);

  if (params.error) {
    res.status(400).json({ message: 'Invalid music Id' });
    return;
  }
  const { id } = params.data;

  if (!id) {
    res.status(400).json({ message: 'Music Id is required' });
    return;
  }

  const music = await Music.findOne({
    where: { id: id },
  });

  if (!music) {
    res.status(404).json({ message: 'Music not found' });
    return;
  }

  // Stream music here
  const filePath = path.join(__dirname, `../uploads/music/${music.path}`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'Music file not found' });
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
    };

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};

const filtersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'title']).optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
  private: z.enum(['true', 'false']).optional(),
  personal: z.enum(['true', 'false']).optional(),
});

const getMusicList = async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    order = 'ASC',
    private: isPrivate = 'false',
    personal: isPersonal = 'false',
  } = filtersSchema.parse(req.query);

  const offset = (Number(page) - 1) * Number(limit);
  const whereClause: WhereOptions<MusicAttributes> = {
    title: {
      [Op.iLike]: `%${search}%`,
    },
  };

  if (isPrivate === 'true') {
    whereClause.public = false;
  } else {
    whereClause.public = true;
  }

  if (isPersonal === 'true') {
    const email = req.cookies.email;

    if (!email) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    whereClause.artistId = user.id;
  }

  console.log('Where clause:', whereClause);

  const musicList = await Music.findAll({
    order: [[sortBy, order]],
    limit: Number(limit),
    offset,
    where: whereClause,
    include: {
      model: User,
      attributes: ['id', 'username'],
      as: 'artist',
    },
  });

  res.status(200).json({ musicList });
};

const uploadMusicBodySchema = z.object({
  name: z.string(),
  public: z.enum(['true', 'false']),
});

const uploadMusic = async (req: Request, res: Response): Promise<void> => {
  const params = uploadMusicBodySchema.safeParse(req.body);

  if (params.error) {
    res.status(400).json({ message: params.error.errors });
    return;
  }

  const { name, public: isPublic } = params.data;

  const email = req.cookies.email;

  if (!email) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.music || !files.image) {
    res.status(400).json({ message: 'Music and image files are required' });
    return;
  }

  const musicFile = files.music[0];

  const duration = await getAudioDurationInSeconds(musicFile.path);

  const imageFile = files.image[0];

  const music = await Music.create({
    title: name,
    public: isPublic === 'true',
    artistId: user.id,
    cover: imageFile.filename,
    path: musicFile.filename,
    duration: duration,
  });

  if (!music) {
    res.status(500).json({ message: 'Failed to upload music' });
    return;
  }

  res.status(200).json({ message: 'Music uploaded successfully' });
};

export default {
  getMusicInfo,
  streamMusic,
  getMusicList,
  uploadMusic,
};
