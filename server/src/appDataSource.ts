import { DataSource } from "typeorm";
// import { Crystal } from "./entity/Crystal";
// import { Color } from "./entity/Color";

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "crystalboy",
  password: "password",
  database: "crystaldb",
  synchronize: true,
  logging: false,
  // logging: true,
  // logger: "advanced-console",
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  entities: ["src/entity/**/*.ts"],
});
