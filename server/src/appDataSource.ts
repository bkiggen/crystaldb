import { DataSource } from "typeorm";
console.log("CDB_DB_USERNAME", process.env.CDB_DB_USERNAME);
export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.CDB_DB_USERNAME,
  password: process.env.CDB_DB_PASSWORD,
  database: process.env.CDB_DB_NAME,
  synchronize: true,
  logging: false,
  // logging: true,
  // logger: "advanced-console",
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  entities: ["src/entity/**/*.ts"],
});
