import { Request, Response } from 'express';
import { Music } from '@/models/music';
import path from 'path';
import fs from 'fs';

const getMusicInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if(!id) {
    res.status(400).json({ message: "Music Id is required" });
    return
  }

  const music = await Music.findOne({
    where: { id: id }
  });

  if (!music) {
    res.status(404).json({ message: "Music not found" });
    return;
  }

  res.status(200).json({ music });
}

const streamMusic = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if(!id) {
    res.status(400).json({ message: "Music Id is required" });
    return;
  }

  const music = await Music.findOne({
    where: { id: id }
  });

  if (!music) {
    res.status(404).json({ message: "Music not found" });
    return;
  }

  // Stream music here
  const filePath = path.join(__dirname, `../uploads/music/${music.path}`);

  if(!fs.existsSync(filePath)) {
    res.status(404).json({ message: "Music file not found" });
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = (end - start) + 1;
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
}  

export default {
  getMusicInfo,
  streamMusic,
};