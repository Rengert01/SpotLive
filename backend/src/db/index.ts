import env from '../../env';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

const db = drizzle(env.POSTGRES_URL!, { schema });

export { db };
