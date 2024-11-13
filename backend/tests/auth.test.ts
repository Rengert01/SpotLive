import { Request, Response } from 'express';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import authController from '@/controllers/auth';
import { z } from 'zod';
import passport from 'passport';

jest.mock('@/models/user');
jest.mock('bcryptjs');
jest.mock('passport');

describe('authController.signUp', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    req = {
      body: {}
    };
    res = {
      status: statusMock
    };
  });

  it('should return 400 if request body is invalid', async () => {
    req.body = { email: 'invalid-email', password: 'short', confirmPassword: 'short' };

    await authController.signUp(req as Request, res as Response);
    
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(Object) }));
  });

  it('should return 400 if email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
    req.body = { email: 'test@example.com', password: 'Password123!', confirmPassword: 'Password123!' };

    await authController.signUp(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Email already exists.' });
  });

  it('should create a new user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (User.create as jest.Mock).mockResolvedValue({ email: 'test@example.com', password: 'hashedPassword' });
    req.body = { email: 'test@example.com', password: 'Password123!', confirmPassword: 'Password123!' };

    await authController.signUp(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'User created', user: expect.any(Object) }));
  });

  it('should return 500 if there is an internal server error', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Internal server error'));
    req.body = { email: 'test@example.com', password: 'Password123!', confirmPassword: 'Password123!' };

    await authController.signUp(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

// describe('authController.signIn', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let jsonMock: jest.Mock;
//   let statusMock: jest.Mock;

//   beforeEach(() => {
//     jsonMock = jest.fn();
//     statusMock = jest.fn().mockReturnValue({ json: jsonMock });

//     req = {
//       body: {}
//     };
//     res = {
//       status: statusMock
//     };
//   });

//   it('should return 200 and sign in successfully', async () => {
//     (passport.authenticate as jest.Mock) = jest.fn((strategy, callback) => (req: Request, res: Response, next: Function) => {
//       callback(null, { email: 'test@email.com' });
//       next();
//     });

//     await authController.signIn(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(jsonMock).toHaveBeenCalledWith({ message: 'Sign in' });
//   });

//   // it('should return 401 if authentication fails', async () => {
//   //   (passport.authenticate as jest.Mock).mockImplementation((strategy: string, callback: Function) => {
//   //     return (req: Request, res: Response, next: Function) => {
//   //       callback(null, false, { message: 'Invalid credentials' });
//   //     };
//   //   });

//   //   await authController.signIn(req as Request, res as Response);

//   //   expect(statusMock).toHaveBeenCalledWith(401);
//   //   expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' });
//   // });

//   // it('should return 500 if there is an internal server error', async () => {
//   //   (passport.authenticate as jest.Mock).mockImplementation((strategy: string, callback: Function) => {
//   //     return (req: Request, res: Response, next: Function) => {
//   //       callback(new Error('Internal server error'));
//   //     };
//   //   });

//   //   await authController.signIn(req as Request, res as Response);

//   //   expect(statusMock).toHaveBeenCalledWith(500);
//   //   expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
//   // });
// });