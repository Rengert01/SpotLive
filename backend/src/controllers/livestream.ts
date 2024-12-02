import { Server as HttpServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import corsOptions from '@/config/cors';
import { db } from '@/db';
import { livestream } from '@/models/livestream';
// import session from 'express-session';
import { eq } from 'drizzle-orm';

// type sessionMiddleware = typeof session;

const initializeSocketIO = (
  server: HttpServer
  // sessionMiddleware: sessionMiddleware
) => {
  const io = new SocketIOServer(server, {
    cors: corsOptions,
  });

  // Use the session middleware for socket.io
  // io.engine.use(sessionMiddleware);

  const livestreamNamespace = io.of('/api/livestream');

  livestreamNamespace.on('connection', (socket: Socket) => {
    console.log(socket.id + ' connected to the livestream namespace');

    // console.log('Socket Request: ', socket.request);

    socket.on('disconnect', () => {
      console.log(socket.id + ' disconnected from the livestream namespace');
    });

    socket.on(
      'start-livestream',
      async (title: string, userId: string, ack) => {
        if (!title) {
          socket.emit('error', 'Missing required livestream title');
          return;
        }

        if (!userId) {
          socket.emit('error', 'Missing required user to start livestream');
          return;
        }

        const live = await db
          .insert(livestream)
          .values({
            userId: Number(userId),
            title: title,
            createdAt: new Date(),
            createdBy: socket.id,
          })
          .returning();

        if (!live.length) {
          socket.emit('error', 'Could not start livestream');
          return;
        }

        socket.join(live[0].id.toString());
        socket.to(live[0].id.toString()).emit('start-livestream', live[0].id);

        console.log(`Livestream ${live[0].id} started by ${socket.id}`);

        ack({
          success: true,
          id: live[0].id,
          title: live[0].title,
        });
      }
    );

    socket.on('end-livestream', async (livestreamId: string) => {
      if (!livestreamId) {
        socket.emit('error', 'Missing Livestream ID');
        return;
      }

      const endedLivestream = await db
        .delete(livestream)
        .where(eq(livestream.id, Number(livestreamId)))
        .returning();

      if (!endedLivestream.length) {
        socket.emit('error', 'Invalid Livestream ID');
        return;
      }

      socket.to(livestreamId).emit('end-livestream');
      socket.leave(livestreamId);
      console.log(`User left livestream ${livestreamId}`);
    });

    socket.on('join-livestream', async (livestreamId: string) => {
      if (!livestreamId) {
        socket.emit('error', 'Missing Livestream ID');
        return;
      }

      const live = await db.query.livestream.findFirst({
        where: eq(livestream.id, Number(livestreamId)),
      });

      if (!live) {
        socket.emit('error', 'Livestream not found');
        return;
      }

      socket.join(livestreamId);
      socket.emit('livestream-data', live.id, live.title);
      console.log(`User joined livestream ${livestreamId}`);
    });

    socket.on('leave-livestream', (livestreamId: string) => {
      if (!livestreamId) {
        socket.emit('error', 'Missing Livestream ID');
        return;
      }

      socket.leave(livestreamId);
      console.log(`User left livestream ${livestreamId}`);
    });

    socket.on('audio-data', (livestreamId: string, audioData: ArrayBuffer) => {
      if (!audioData) {
        socket.emit('error', 'Missing audio data');
        return;
      }

      if (!livestreamId) {
        socket.emit('error', 'Missing Livestream ID');
        return;
      }

      socket.to(livestreamId).emit('audio-data', audioData);
    });
  });

  // livestreamNamespace.on('disconnect', async (socket: Socket) => {
  //   await db.delete(livestream).where(eq(livestream.createdBy, socket.id));
  // });
};

export default {
  initializeSocketIO,
};
