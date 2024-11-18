import { Request, Response } from 'express';
import { Music } from '@/models/music';
import musicController from '@/controllers/music';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { User } from '@/models/user';

jest.mock('@/models/music');
jest.mock('fs');
jest.mock('path');
jest.mock('@/models/user');

describe('musicController.streamMusic', () => {
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
      headers: {},
    };
    res = {
      status: statusMock,
      writeHead: writeHeadMock,
      pipe: pipeMock,
    };
  });

  it('should return 400 if music ID is invalid', async () => {
    req.params = { id: 'invalid-id' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid music Id' });
  });

  it('should return 404 if music is not found', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue(null);
    req.params = { id: 'e1b6135b-8b6b-4c4b-aa62-e94c21f95e8e' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Music not found' });
  });

  it('should return 404 if music file is not found', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue({ path: 'music.mp3' });
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    req.params = { id: 'e1b6135b-8b6b-4c4b-aa62-e94c21f95e8e' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Music file not found' });
  });

  it('should stream music without range header', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue({ path: 'music.mp3' });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ size: 1000 });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });
    req.params = { id: 'e1b6135b-8b6b-4c4b-aa62-e94c21f95e8e' };

    await musicController.streamMusic(req as Request, res as Response);

    expect(writeHeadMock).toHaveBeenCalledWith(200, {
      'Content-Length': 1000,
      'Content-Type': 'audio/mpeg',
    });
    expect(pipeMock).toHaveBeenCalledWith(res);
  });

  it('should stream music with range header', async () => {
    (Music.findOne as jest.Mock).mockResolvedValue({ path: 'music.mp3' });
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ size: 1000 });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });
    req.params = { id: 'e1b6135b-8b6b-4c4b-aa62-e94c21f95e8e' };
    req.headers = { range: 'bytes=0-499' };

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

// describe('musicController.uploadMusic', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let jsonMock: jest.Mock;
//   let statusMock: jest.Mock;

//   beforeEach(() => {
//     jsonMock = jest.fn();
//     statusMock = jest.fn().mockReturnValue({ json: jsonMock });

//     req = {
//       body: {},
//       cookies: {},
//       files: {},
//     };
//     res = {
//       status: statusMock,
//     };
//   });

//   it('should return 400 if request body is invalid', async () => {
//     req.body = { name: '', public: 'invalid' };

//     await musicController.uploadMusic(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(400);
//     expect(jsonMock).toHaveBeenCalledWith(
//       expect.objectContaining({ message: expect.any(Array) })
//     );
//   });

//   it('should return 401 if email cookie is missing', async () => {
//     req.body = { name: 'Test Music', public: 'true' };

//     await musicController.uploadMusic(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(401);
//     expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
//   });

//   it('should return 401 if user is not found', async () => {
//     req.body = { name: 'Test Music', public: 'true' };
//     req.cookies = { email: 'test@example.com' };
//     (User.findOne as jest.Mock).mockResolvedValue(null);

//     await musicController.uploadMusic(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(401);
//     expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
//   });

//   it('should return 400 if music or image files are missing', async () => {
//     req.body = { name: 'Test Music', public: 'true' };
//     req.cookies = { email: 'test@example.com' };
//     (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

//     await musicController.uploadMusic(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(400);
//     expect(jsonMock).toHaveBeenCalledWith({
//       message: 'Music and image files are required',
//     });
//   });

//   // it('should return 500 if music creation fails', async () => {
//   //   req.body = { name: 'Test Music', public: 'true' };
//   //   req.cookies = { email: 'test@example.com' };
//   //   req.files = {
//   //     music: [{ path: 'music.mp3', filename: 'music.mp3' }],
//   //     image: [{ filename: 'image.jpg' }],
//   //   };
//   //   (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });
//   //   (getAudioDurationInSeconds as jest.Mock).mockResolvedValue(300);
//   //   (Music.create as jest.Mock).mockResolvedValue(null);

//   //   await musicController.uploadMusic(req as Request, res as Response);

//   //   expect(statusMock).toHaveBeenCalledWith(500);
//   //   expect(jsonMock).toHaveBeenCalledWith({ message: 'Failed to upload music' });
//   // });

//   // it('should return 200 if music is uploaded successfully', async () => {
//   //   req.body = { name: 'Test Music', public: 'true' };
//   //   req.cookies = { email: 'test@example.com' };
//   //   req.files = {
//   //     music: [{ path: 'music.mp3', filename: 'music.mp3' }],
//   //     image: [{ filename: 'image.jpg' }],
//   //   };
//   //   (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });
//   //   (getAudioDurationInSeconds as jest.Mock).mockResolvedValue(300);
//   //   (Music.create as jest.Mock).mockResolvedValue({});

//   //   await musicController.uploadMusic(req as Request, res as Response);

//   //   expect(statusMock).toHaveBeenCalledWith(200);
//   //   expect(jsonMock).toHaveBeenCalledWith({ message: 'Music uploaded successfully' });
//   // });
// });
