const crystalResolvers = {
  Query: {
    getCrystal: async (_, { id }, { dataSources }) => {
      return await dataSources.crystalAPI.getCrystal(id);
    },
    getLatestCrystal: async (_, __, { dataSources }) => {
      return await dataSources.crystalAPI.getLatestCrystal();
    },
    getAllCrystals: async (_, __, { dataSources }) => {
      return await dataSources.crystalAPI.getAllCrystals();
    },
  },
  Mutation: {
    createCrystal: async (_, { input }, { dataSources }) => {
      const crystal = await dataSources.crystalAPI.createCrystal(input);
      return crystal;
    },
    updateCrystal: async (_, { id, input }, { dataSources }) => {
      const crystal = await dataSources.crystalAPI.updateCrystal(id, input);
      return crystal;
    },
  },
};
