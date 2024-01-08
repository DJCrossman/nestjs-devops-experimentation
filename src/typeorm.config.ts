import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmLogger } from './shared/utils/typeorm.logger';

// Check typeORM documentation for more information.
export const TypeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: true,
  logger: new TypeOrmLogger(),

  useUTC: true,

  // Prevents database locking out
  connectTimeoutMS: 60000,
  maxQueryExecutionTime: 1000,
  extra: {
    max: 312,
    ssl:
      process.env.TYPEORM_SSL === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  },

  ssl: process.env.TYPEORM_SSL === 'true' ? true : undefined,

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default TypeOrmConfig;
