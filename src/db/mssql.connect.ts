import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';

const mssqlConnection = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role],
  options: {
    encrypt: process.env.DB_SERVER === 'localhost' ? false : true,
  },
});

export default mssqlConnection;
