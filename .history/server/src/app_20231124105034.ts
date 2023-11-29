import "reflect-metadata";
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { DataSource } from "typeorm";
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
    getAllMessages: [Message]
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// GraphQL Resolvers
const root = {
  getAllMessages: async ({ id }) => {
    return await Message.find();
  },
  getMessage: async ({ id }) => {
    return await Message.findOne(id);
  },
  getLatestMessage: async () => {
    return await Message.findOne({ order: { id: "DESC" } });
  },
  createMessage: async ({ input }) => {
    const message = Message.create(input);
    return await Message.save(message);
  },
  updateMessage: async ({ id, input }) => {
    let message = await Message.findOne(id);
    if (!message) {
      throw new Error("no message exists with id " + id);
    }
    Message.merge(message, input);
    return await Message.save(message);
  },
};

// Initialize Express
const app = express();
app.use(cors());

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
