import { User } from "@/models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import path from "path";

import { z } from "zod";
const multer = require("multer");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Extend the Express Request type to include the `email` field
interface ExtendedRequest extends Request {
  email?: string;
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
          return done(null, false, { message: result.error.errors[0].message });
        }

        const user = await User.findOne({
          where: { email: email },
        });

        if (!user) {
          return done(null, false, { message: "Email not found." });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return done(null, false, { message: "Password is incorrect." });
        }

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Set the destination path for image uploads
    cb(null, path.join(__dirname, "../images"));
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
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only JPEG and PNG images are allowed!"), false); // Reject file
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: "5000000",
  },
  fileFilter: fileFilter,
}).single("image");

const signIn = async (req: Request, res: Response): Promise<void> => {
  passport.authenticate("local")(req, res, () => {
    res.status(200).json({ message: "Sign in" });
  });
};

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        new RegExp(/[A-Z]/),
        "Password must contain at least one uppercase letter"
      )
      .regex(
        new RegExp(/[a-z]/),
        "Password must contain at least one lowercase letter"
      )
      .regex(new RegExp(/[0-9]/), "Password must contain at least one number")
      .regex(
        new RegExp(/[^a-zA-Z0-9]/),
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    image: z.string(),
    gender: z.string(),
    username: z.string(),
    phone: z.string(),
    country: z.string(),
    state: z.string(),
    date_of_birth: z.string(),
    city: z.string(),
    street: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ message: result.error });
      return;
    }

    const { email, password } = result.data;

    const user = await User.findOne({
      where: { email: email },
    });

    if (user) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signOut = async (req: Request, res: Response): Promise<void> => {
  req.logOut(function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  res.status(200).json({ message: "Sign out" });
};

const getSession = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ user: req.user });
};

const deleteAccount = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const email = req.body.email;
  try {
    const rowsDeleted = await User.destroy({
      where: {
        email: email,
      },
      force: true,
    });

    if (rowsDeleted === 0) {
      // If no rows were deleted, send a 404 response
      res.status(404).json({ message: "User not found" });
    } else {
      // If deletion was successful, send a 200 response
      res.status(200).json({ message: "Account deleted successfully" });
    }
  } catch (error) {
    // Handle any other errors that may have occurred
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account" });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      gender,
      username,
      phone,
      country,
      state,
      street,
      date_of_birth,
      city,
      new_password,
      email,
    } = req.body;

    // Check if there's a new image, or default to the existing image in the database
    const newImage = req?.file?.path ? `/images/${req.file.filename}` : null;

    // Find the user in the database by email
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prepare the updated fields, only including provided values
    const updatedFields: Partial<typeof user> = {
      ...(gender && { gender }),
      ...(username && { username }),
      ...(phone && { phone }),
      ...(country && { country }),
      ...(state && { state }),
      ...(street && { street }),
      ...(date_of_birth && { date_of_birth }),
      ...(city && { city }),
    };

    // If a new password is provided, hash it and add it to the update object
    if (new_password) {
      updatedFields.password = await bcrypt.hash(new_password, 10);
    }

    // Set the image if a new one is uploaded; otherwise, keep the existing image
    updatedFields.image = newImage || user.image;

    // Update the user with the specified fields
    await user.update(updatedFields);

    res.status(201).json({
      message: "User details updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  signIn,
  signUp,
  signOut,
  deleteAccount,
  getSession,
  upload,
  updateProfile,
};
