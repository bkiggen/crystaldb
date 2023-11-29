// schema.js

import { buildSchema } from "graphql";

export const schema = buildSchema(`
  input CrystalInput {
    content: String
    author: String
  }

  type Crystal {
    id: ID!
    content: String
    author: String
    createdAt: String
  }

  type Query {
    getCrystal(id: ID!): Crystal
    getLatestCrystal: Crystal
    getAllCrystals: [Crystal]
  }

  type Mutation {
    createCrystal(input: CrystalInput): Crystal
    updateCrystal(id: ID!, input: CrystalInput): Crystal
  }
`);
