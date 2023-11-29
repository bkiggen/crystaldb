// schema.js

import { buildSchema } from "graphql";

export const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
    createdAt: String
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
