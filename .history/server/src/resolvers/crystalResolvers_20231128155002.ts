import { Crystal } from "../entity/Crystal";

export const crystalResolvers = {
  Query: {
    getAllCrystals: async ({ id }) => {
      return await Crystal.find();
    },
    getCrystal: async ({ id }) => {
      return await Crystal.findOne(id);
    },
  },
  Mutation: {
    createCrystal: async ({ input }) => {
      const crystal = Crystal.create(input);
      return await Crystal.save(crystal);
    },
    updateCrystal: async ({ id, input }) => {
      let crystal = await Crystal.findOne(id);
      if (!crystal) {
        throw new Error("no crystal exists with id " + id);
      }
      Crystal.merge(crystal, input);
      return await Crystal.save(crystal);
    },
  },
};
