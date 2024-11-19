import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { z } from 'zod';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
          return done(null, false, { message: result.error.errors[0].message });
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user) {
          return done(null, false, { message: 'Email not found.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: omitted, ...userWithoutPassword } = user;

        if (!validPassword) {
          return done(null, false, { message: 'Password is incorrect.' });
        }

        return done(null, userWithoutPassword);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

const signIn = async (req: Request, res: Response): Promise<void> => {
  passport.authenticate('local')(req, res, () => {
    res.cookie('email', req.body.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Sign in' });
  });
};

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        new RegExp(/[A-Z]/),
        'Password must contain at least one uppercase letter'
      )
      .regex(
        new RegExp(/[a-z]/),
        'Password must contain at least one lowercase letter'
      )
      .regex(new RegExp(/[0-9]/), 'Password must contain at least one number')
      .regex(
        new RegExp(/[^a-zA-Z0-9]/),
        'Password must contain at least one special character'
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
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ message: result.error });
      return;
    }

    const { email, password } = result.data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (user) {
      res.status(400).json({ message: 'Email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const signOut = async (req: Request, res: Response): Promise<void> => {
  req.logOut(function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  res.status(200).json({ message: 'Sign out' });
};

const getSession = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ user: req.user });
};

export default {
  signIn,
  signUp,
  signOut,
  getSession,
};
