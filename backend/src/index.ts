import express, { Express } from 'express';
import env from '../env';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import cors from 'cors';
import corsOptions from '@/config/cors';
import authRoutes from '@/routes/auth';
import isAuthenticated from '@/middleware/auth';
import profileRouter from '@/routes/profile';
import musicRoutes from '@/routes/music';
import livestreamRoutes from '@/routes/livestream';

import { createServer } from 'http';

import FileStore from 'session-file-store';
const fileStoreOptions = {};

const app: Express = express();
const port = env.BACKEND_API_PORT ?? 3001;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

const sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new (FileStore(session))(fileStoreOptions),
});

app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);

// Static images folder
app.use('/uploads/image', express.static('src/uploads/image'));

// Everything below this line will require authentication
app.use(isAuthenticated);

app.use('/api/auth', profileRouter);
app.use('/api/music', musicRoutes);
app.use('/api/livestream', livestreamRoutes);

const server = createServer(app);

// livestreamController.initializeSocketIO(server, sessionMiddleware);
// livestreamController.initializeSocketIO(server);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
