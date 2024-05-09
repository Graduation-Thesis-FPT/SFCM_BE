import { DataSource } from 'typeorm';

const mssqlConnection = new DataSource({
  type: 'mssql',
  host: 'sfcm.database.windows.net',
  username: 'sfcm',
  password: '100%point',
  database: 'SFCM',
  entities: [
    "src/entity/**/*.ts"
  ]
});

export default mssqlConnection;
