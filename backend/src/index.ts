import express, { Express, Request, Response, NextFunction } from 'express';
import env from 'env';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import corsOptions from '@/config/cors';
import authRoutes from '@/routes/auth';
import isAuthenticated from '@/middleware/auth';
import { User } from '@/models/user';
import profileRouter from '@/routes/profile';
import musicRoutes from '@/routes/music';
import { testConnection } from '@/config/sequelize';

const app: Express = express();
const port = env.BACKEND_API_PORT ?? 3001;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.session());

//Middleware to ensure the latest session data is fetched
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string = req.cookies?.email; // Retrieve email from cookies

    if (email) {
      // Fetch the user by email
      const user = await User.findOne({
        where: { email },
      });

      if (user) {
        // Assign the user object to `req.user` if found
        req.user = user;
      } else {
        req.user = undefined; // Explicitly set `req.user` to null if no user is found
      }
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error fetching session data:', err);
    next(); // Ensure the request flow continues even if there's an error
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRouter);

// Static images folder
app.use('/uploads/image', express.static('src/uploads/image'));

// Everything below this line will require authentication
app.use(isAuthenticated);

app.use('/api/music', musicRoutes);

app.listen(port, async () => {
  await testConnection();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
