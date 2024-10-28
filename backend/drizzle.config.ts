import { type Config } from "drizzle-kit";

import env from "@/env";

export default {
  schema: "./src/models/**/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  out: `./src/migrations/${env.NODE_ENV}`,
} satisfies Config;
