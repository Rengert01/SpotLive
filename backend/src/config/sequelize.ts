import { Sequelize } from 'sequelize';

import env from 'env';

const sequelize = new Sequelize(env.POSTGRES_DB, env.POSTGRES_USER, env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: env.POSTGRES_HOST,
  port: parseInt(env.POSTGRES_PORT),
});

export default sequelize;