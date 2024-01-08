import { DataSource } from 'typeorm';
import TypeOrmConfig from './typeorm.config';

const TypeOrmDataSource = new DataSource(TypeOrmConfig);

export default TypeOrmDataSource;
