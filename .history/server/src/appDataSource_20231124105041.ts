import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "crystalboy",
  password: "password",
  database: "crystaldb",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
});
