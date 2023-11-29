import { Crystal } from "../entity/Crystal";

export const crystalResolvers = {
  Query: {
    getAllCrystals: async () => {
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
        throw new Error("No crystal exists with id " + id);
      }
      Crystal.merge(crystal, input);
      return await Crystal.save(crystal);
    },
    deleteCrystal: async ({ id }) => {
      const crystal = await Crystal.findOne(id);
      if (!crystal) {
        throw new Error("No crystal exists with id " + id);
      }
      await Crystal.remove(crystal);
      return true;
    },
  },
};
