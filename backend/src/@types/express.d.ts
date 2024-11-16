// types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Single file
      files?: Express.Multer.File[]; // Multiple files
    }
  }
}
