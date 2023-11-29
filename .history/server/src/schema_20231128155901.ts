// schema.js

import { buildSchema } from "graphql";

export const schema = buildSchema(`
enum Rarity {
  LOW
  MEDIUM
  HIGH
}

enum FindAge {
  NEW
  OLD
  DEAD
}

type Color {
  id: Int!
  name: String!
}

type Crystal {
  id: Int!
  name: String!
  color: Color!
  category: String!
  rarity: Rarity!
  description: String!
  image: String!
  findAge: FindAge!
  createdAt: String!
}

type Query {
  getAllCrystals: [Crystal!]!
  getCrystal(id: Int!): Crystal
}

input CreateCrystalInput {
  name: String!
  colorId: Int!
  category: String!
  rarity: Rarity!
  description: String!
  image: String!
  findAge: FindAge!
}

type Mutation {
  createCrystal(input: CreateCrystalInput!): Crystal!
  updateCrystal(id: Int!, input: CreateCrystalInput!): Crystal
}

`);
