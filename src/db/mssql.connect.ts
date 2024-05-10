import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';

const mssqlConnection = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  options: {
    encrypt: false
  }
});

export default mssqlConnection;
