// types/express.d.ts

export declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Single file
      files?: Express.Multer.File[]; // Multiple files
    }

    interface User {
      id: string;
      email: string;
      password: string;
      image?: string;
      gender?: string;
      username?: string;
      phone?: string;
      country?: string;
      state?: string;
      street?: string;
      date_of_birth?: string;
      city?: string;
      completionPercentage?: number;
      checklist?: object;
    }
  }
}
