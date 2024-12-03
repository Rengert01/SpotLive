import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  BACKEND_API_PORT: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_URL: z.string().optional(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DB_LOGGING: z.enum(['true', 'false']).default('true'),
  SESSION_SECRET: z.string(),
  CORS_WHITELIST: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `❌ Invalid environment variables: ${JSON.stringify(parsedEnv.error.format(), null, 4)}`
  );
}

parsedEnv.data = {
  ...parsedEnv.data,
<<<<<<< HEAD
  POSTGRES_URL:
    parsedEnv.data.POSTGRES_URL ??
    `postgresql://${parsedEnv.data.POSTGRES_USER}:${parsedEnv.data.POSTGRES_PASSWORD}@${parsedEnv.data.POSTGRES_HOST}:${parsedEnv.data.POSTGRES_PORT}/${parsedEnv.data.POSTGRES_DB}`,
=======
  POSTGRES_URL: `postgresql://${parsedEnv.data.POSTGRES_USER}:${parsedEnv.data.POSTGRES_PASSWORD}@${parsedEnv.data.POSTGRES_HOST}:${parsedEnv.data.POSTGRES_PORT}/${parsedEnv.data.POSTGRES_DB}`,
>>>>>>> 9f0b866 (Revert "fixed merge conflicts")
};

console.log('✅ Environment variables are valid');

export default parsedEnv.data;
