import { Sequelize } from 'sequelize';

import env from '../../env';

const sequelize = new Sequelize(
  env.POSTGRES_DB,
  env.POSTGRES_USER,
  env.POSTGRES_PASSWORD,
  {
    dialect: 'postgres',
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT),
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Connection to sequelize has been established successfully.');
  } catch (error) {
    console.log(error);
  }
}

export default sequelize;
