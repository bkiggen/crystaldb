import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";

export const crystalResolvers = {
  Query: {
    getAllCrystals: async () => {
      return await Crystal.find({ relations: ["color"] });
    },
    getCrystal: async ({ id }) => {
      return await Crystal.findOne(id);
    },
  },
  Mutation: {
    createCrystal: async ({ input }) => {
      const color = await Color.findOne({ where: { id: input.colorId } });
      if (!color) {
        throw new Error("Color not found with id: " + input.colorId);
      }

      const { colorId, ...crystalInput } = input;

      const crystal = Crystal.create(crystalInput);

      crystal.color = color;

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
