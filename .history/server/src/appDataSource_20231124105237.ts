import { DataSource } from "typeorm";
import { Message } from "./entity/Message";

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "crystalboy",
  password: "password",
  database: "crystaldb",
  synchronize: true,
  logging: false,
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  entities: [Message],
});
