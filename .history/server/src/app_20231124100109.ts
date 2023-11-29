import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { createConnection, getRepository } from "typeorm";
import { Message } from "./entity/Message";

// GraphQL Schema
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
    getLatestMessage: Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// GraphQL Resolvers
const root = {
  getMessage: async ({ id }) => {
    const messageRepository = getRepository(Message);
    return await messageRepository.findOne(id);
  },
  getLatestMessage: async () => {
    const messageRepository = getRepository(Message);
    return await messageRepository.findOne({ order: { id: "DESC" } });
  },
  createMessage: async ({ input }) => {
    const messageRepository = getRepository(Message);
    const message = messageRepository.create(input);
    return await messageRepository.save(message);
  },
  updateMessage: async ({ id, input }) => {
    const messageRepository = getRepository(Message);
    let message = await messageRepository.findOne(id);
    if (!message) {
      throw new Error("no message exists with id " + id);
    }
    messageRepository.merge(message, input);
    return await messageRepository.save(message);
  },
};

// Initialize Express
const app = express();

// Initialize TypeORM and start the Express server
createConnection()
  .then(() => {
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
  })
  .catch((error) => console.log(error));
