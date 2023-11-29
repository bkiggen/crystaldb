import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import crypto from "crypto";

// Define TypeScript interfaces for the message and the database
interface MessageInput {
  content: string;
  author: string;
}

interface Message {
  id: string;
  content: string;
  author: string;
}

// Define a schema using GraphQL schema language
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
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// Message class
class MessageClass {
  id: string;
  content: string;
  author: string;

  constructor(id: string, { content, author }: MessageInput) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// Maps id to Message
const fakeDatabase: Record<string, MessageInput> = {};

const root = {
  getMessage: ({ id }: { id: string }): Message => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    return new MessageClass(id, fakeDatabase[id]);
  },
  createMessage: ({ input }: { input: MessageInput }): Message => {
    const id = crypto.randomBytes(10).toString("hex");

    fakeDatabase[id] = input;
    return new MessageClass(id, input);
  },
  updateMessage: ({
    id,
    input,
  }: {
    id: string;
    input: MessageInput;
  }): Message => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    fakeDatabase[id] = input;
    return new MessageClass(id, input);
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});
