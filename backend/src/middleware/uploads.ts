const multer = require('multer');
import path from 'path';

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Set the destination path for image uploads
    cb(null, path.join(__dirname, '../uploads/images'));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Create a unique file name with a timestamp and random number
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Define the fileFilter to allow only images (JPEG, PNG)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: boolean) => void
) => {
  // Check the file type
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only JPEG and PNG images are allowed!'), false); // Reject file
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: '5000000',
  },
  fileFilter: fileFilter,
}).single('image');
