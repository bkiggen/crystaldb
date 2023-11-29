import "reflect-metadata";
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { appDataSource } from "./appDataSource";
import { crystalResolvers } from "./resolvers/crystalResolvers";
import { colorResolvers } from "./resolvers/colorResolvers";
import { schema } from "./schema";

// GraphQL Resolvers
const root = {
  ...crystalResolvers.Query,
  ...crystalResolvers.Mutation,
  ...colorResolvers.Query,
  ...colorResolvers.Mutation,
};

// Initialize Express
const app = express();
app.use(cors());

const main = async () => {
  try {
    await appDataSource.initialize();
    console.log("Data Source has been initialized!");

    // GraphQL endpoint
    app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
      })
    );

    // Start server
    app.listen(4000, () => {
      console.log("Running a GraphQL API server at localhost:4000/graphql");
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};

main();
