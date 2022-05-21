import './utils';

import { config } from 'dotenv';

import { SnakeNamingStrategy } from './snake-naming.strategy';

config({
  path: '.development.env',
});

for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n');
}

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
};
