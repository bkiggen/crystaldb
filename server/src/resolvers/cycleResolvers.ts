import { Cycle } from "../entity/Cycle";
import { Crystal } from "../entity/Crystal";
import { In } from "typeorm";

export const cycleResolvers = {
  Query: {
    getAllCycles: async () => {
      const cycles = await Cycle.find({ relations: ["crystals"] });
      return cycles;
    },
    getCycle: async ({ id }) => {
      return await Cycle.findOne(id);
    },
  },
  Mutation: {
    createCycle: async ({ input }) => {
      const { crystalIds, ...cycleData } = input;

      const cycle = Cycle.create(cycleData);

      const crystals = await Crystal.find({ where: { id: In(crystalIds) } });

      cycle.crystals = crystals;

      await cycle.save();

      return cycle;
    },
    updateCycle: async ({ id, input }) => {
      let cycle = await Cycle.findOne(id);
      if (!cycle) {
        throw new Error("No cycle exists with id " + id);
      }
      Cycle.merge(cycle, input);
      return await cycle.save();
    },
    deleteCycle: async ({ id }) => {
      const cycle = await Cycle.findOne(id);
      if (!cycle) {
        throw new Error("No cycle exists with id " + id);
      }
      await cycle.remove();
      return true;
    },
  },
};
