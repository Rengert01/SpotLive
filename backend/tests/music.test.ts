import { Request, Response } from 'express';
import { Music } from '@/models/music';
import path from 'path';
import fs from 'fs';
import musicController from '@/controllers/music';

jest.mock('@/models/music');
jest.mock('fs');

describe('streamMusic', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let writeHeadMock: jest.Mock;
  let pipeMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    writeHeadMock = jest.fn();
    pipeMock = jest.fn();

    req = {
      params: {},
      headers: {}
    };
    res = {
      status: statusMock,
      writeHead: writeHeadMock,
      pipe: pipeMock
    };
  });

  it('should return 400 if id is not provided', async () => {
    await musicController.streamMusic(req as Request, res as Response);
    
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Music Id is required" });
  });

  it('should return 404 if music is not found', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue(null);
    req.params = { id: '1' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Music not found" });
  });

  it('should return 404 if music file is not found', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue({ path: 'test.mp3' });
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    req.params = { id: '1' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Music file not found" });
  });

  it('should stream music file successfully without range', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue({ path: 'test.mp3' });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ size: 1000 });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });
    req.params = { id: '1' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(writeHeadMock).toHaveBeenCalledWith(200, {
      'Content-Length': 1000,
      'Content-Type': 'audio/mpeg',
    });
    expect(pipeMock).toHaveBeenCalledWith(res);
  });

  it('should stream music file successfully with range', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue({ path: 'test.mp3' });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ size: 1000 });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });
    req.params = { id: '1' };
    req.headers = req.headers || {};
    req.headers.range = 'bytes=0-499';

    await musicController.streamMusic(req as Request, res as Response);

    expect(writeHeadMock).toHaveBeenCalledWith(206, {
      'Content-Range': 'bytes 0-499/1000',
      'Accept-Ranges': 'bytes',
      'Content-Length': 500,
      'Content-Type': 'audio/mpeg',
    });
    expect(pipeMock).toHaveBeenCalledWith(res);
  });
});