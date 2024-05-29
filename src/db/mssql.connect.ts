import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
// import path from 'path';
import { Permission } from '../entity/permission.entity';
import { Menu } from '../entity/menu.entity';
import { WareHouse } from '../entity/warehouse.entity';
import { Block } from '../entity/block.entity';

const mssqlConnection = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role, Permission, Menu, WareHouse, Block],
  // entities: [path.join(__dirname, '../entity/*.entity.ts')],
  options: {
    encrypt: process.env.DB_SERVER === 'localhost' ? false : true,
  },
});

export default mssqlConnection;
