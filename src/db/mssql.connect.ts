import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { Menu } from '../entity/menu.entity';
import { WareHouse } from '../entity/warehouse.entity';
import { Gate } from '../entity/gate.entity';
import { EquipmentType } from '../entity/equipment-type.entity';
import { Equipment } from '../entity/equipment.entity';
import { MethodEntity } from '../entity/method.entity';
import { Cell } from '../entity/cell.entity';
import { Block } from '../entity/block.entity';
import { ItemType } from '../entity/item-type.entity';
import { UnitType } from '../entity/unit.entity';

const mssqlConnection = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Role,
    Permission,
    Menu,
    WareHouse,
    Cell,
    Gate,
    EquipmentType,
    Equipment,
    MethodEntity,
    Block,
    ItemType,
    UnitType
  ],
  options: {
    encrypt: false,
  },
});

export default mssqlConnection;
