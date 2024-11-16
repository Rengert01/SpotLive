// types/express.d.ts

import express from "express";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Single file
      files?: Express.Multer.File[]; // Multiple files
    }
  }
}
