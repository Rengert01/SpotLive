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
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_LOGGING: z.enum(['true', 'false']).default('true'),
  SESSION_SECRET: z.string(),
  CORS_WHITELIST: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if(!parsedEnv.success) {
  throw new Error(`❌ Invalid environment variables: ${JSON.stringify(parsedEnv.error.format(), null, 4)}`);
}

export default parsedEnv.data;