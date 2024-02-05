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

  type Crystal {
    id: Int!
    name: String!
    color: Color
    category: String
    rarity: Rarity
    description: String
    image: String
    findAge: FindAge
    createdAt: String!
  }

  type Color {
    id: Int!
    name: String!
    hex: String
  }

  type Cycle {
    id: Int!
    month: Int!
    year: Int!
    cycle: Int!
    cycleRangeStart: Int!
    cycleRangeEnd: Int!
    users: [Int!]!
    crystals: [Crystal]! 
    shippedOn: String
    updatedAt: String
    createdAt: String!  
  }

  type Query {
    getAllCrystals: [Crystal!]!
    getCrystal(id: Int!): Crystal
    getAllColors: [Color!]!
    getColor(id: Int!): Color
    getAllCycles: [Cycle!]!
    getCycle(id: Int!): Cycle
  }

  input CreateCrystalInput {
    name: String!
    colorId: Int
    category: String
    rarity: Rarity
    description: String
    image: String
    findAge: FindAge
  }

  input CreateColorInput {
    name: String!
    hex: String
  }

  input CreateCycleInput {
    crystals: [Int!]!
    month: Int!
    year: Int!
    cycle: Int
    cycleRangeStart: Int
    cycleRangeEnd: Int
  }

  type Mutation {
    createCrystal(input: CreateCrystalInput!): Crystal!
    updateCrystal(id: Int!, input: CreateCrystalInput!): Crystal
    deleteCrystal(id: Int!): Boolean
    createColor(input: CreateColorInput!): Color!
    updateColor(id: Int!, input: CreateColorInput!): Color
    deleteColor(id: Int!): Boolean
    createCycle(input: CreateCycleInput!): Cycle!
    updateCycle(id: Int!, input: CreateCycleInput!): Cycle
    deleteCycle(id: Int!): Boolean
  }
`);
