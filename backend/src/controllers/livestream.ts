import { Request, Response } from 'express';
import { Server } from 'socket.io';

let io: Server;

export const setSocketServer = (server: Server) => {
  io = server;
};

const startLivestream = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Livestream started' });
};

export default {
  startLivestream,
};
