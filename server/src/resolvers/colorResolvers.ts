import { Color } from "../entity/Color";

export const colorResolvers = {
  Query: {
    getAllColors: async () => {
      return await Color.find();
    },
    getColor: async ({ id }) => {
      return await Color.findOne(id);
    },
  },
  Mutation: {
    createColor: async ({ input }) => {
      const color = Color.create(input);
      return await Color.save(color);
    },
    updateColor: async ({ id, input }) => {
      let color = await Color.findOne(id);
      if (!color) {
        throw new Error("No color exists with id " + id);
      }
      Color.merge(color, input);
      return await Color.save(color);
    },
    deleteColor: async ({ id }) => {
      const color = await Color.findOne(id);
      if (!color) {
        throw new Error("No color exists with id " + id);
      }
      await Color.remove(color);
      return true;
    },
  },
};
