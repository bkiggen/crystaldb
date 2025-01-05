import { Crystal, Inventory } from "../src/entity/Crystal";
import { Shipment } from "../src/entity/Shipment";
import {
  getPreviousShipmentCrystalIds,
  addFilters,
  suggestCrystals,
  smartCheckCrystalList,
} from "../src/services/crystalService";

// Mock TypeORM entities and methods
jest.mock("../src/entity/Crystal", () => ({
  Crystal: {
    createQueryBuilder: jest.fn(),
  },
  Inventory: {
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW",
    OUT: "OUT",
  },
}));

jest.mock("../src/entity/Shipment", () => ({
  Shipment: {
    findOne: jest.fn(),
  },
}));

// Mock the entire crystalService module to control internal function behavior
jest.mock("../src/services/crystalService", () => {
  const originalModule = jest.requireActual("../src/services/crystalService");
  return {
    ...originalModule,
    getPreviousShipmentCrystalIds: jest.fn(
      originalModule.getPreviousShipmentCrystalIds
    ),
    suggestCrystals: jest.fn(originalModule.suggestCrystals),
    smartCheckCrystalList: jest.fn(originalModule.smartCheckCrystalList),
  };
});

describe("Crystal Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPreviousShipmentCrystalIds", () => {
    it("should return unique crystal IDs from previous shipments", async () => {
      // Reset the mock to use the actual implementation
      (getPreviousShipmentCrystalIds as jest.Mock).mockRestore();

      // Mock Shipment.findOne to return shipments with crystals
      (Shipment.findOne as jest.Mock)
        .mockResolvedValueOnce({
          crystals: [{ id: 1 }, { id: 2 }],
        })
        .mockResolvedValueOnce({
          crystals: [
            { id: 3 },
            { id: 2 }, // Duplicate to test uniqueness
          ],
        });

      const result = await getPreviousShipmentCrystalIds(
        2, // month
        2024, // year
        [2, 1], // cyclesArray
        100 // subscriptionId
      );

      expect(result).toEqual([1, 2, 3]);
      expect(Shipment.findOne).toHaveBeenCalledTimes(2);
    });

    it("should handle month rollover correctly", async () => {
      // Reset the mock to use the actual implementation
      (getPreviousShipmentCrystalIds as jest.Mock).mockRestore();

      // Mock Shipment.findOne to return shipments with crystals
      (Shipment.findOne as jest.Mock).mockResolvedValueOnce({
        crystals: [{ id: 4 }],
      });

      const result = await getPreviousShipmentCrystalIds(
        0, // January
        2024, // year
        [2], // cyclesArray
        100 // subscriptionId
      );

      expect(result).toEqual([4]);

      // Check that the month and year were adjusted correctly
      const findOneCalls = (Shipment.findOne as jest.Mock).mock.calls;
      expect(findOneCalls[0][0]).toMatchObject({
        month: 11, // December of previous year
        year: 2023,
        cycle: 1,
      });
    });
  });

  describe("addFilters", () => {
    it("should add filters to the query", () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
      };

      const filters = {
        location: "1,2,3",
        category: "4,5,6",
        colorId: "7,8,9",
        someOtherFilter: "10,11,12",
      };

      const result = addFilters(mockQuery as any, filters);

      expect(mockQuery.andWhere).toHaveBeenCalledWith(
        "location.id NOT IN (:...locationIds)",
        { locationIds: ["1", "2", "3"] }
      );
      expect(mockQuery.andWhere).toHaveBeenCalledWith(
        "category.id NOT IN (:...categoryIds)",
        { categoryIds: ["4", "5", "6"] }
      );
      expect(mockQuery.andWhere).toHaveBeenCalledWith(
        "color.id NOT IN (:...colorIds)",
        { colorIds: ["7", "8", "9"] }
      );
      expect(mockQuery.andWhere).toHaveBeenCalledWith(
        "crystal.someOtherFilter NOT IN (:...someOtherFilter)",
        { someOtherFilter: ["10", "11", "12"] }
      );
    });

    it("should ignore empty filter values", () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
      };

      const filters = {
        location: "",
        category: "   ",
        colorId: null,
      };

      const result = addFilters(mockQuery as any, filters);

      expect(mockQuery.andWhere).not.toHaveBeenCalled();
    });
  });

  describe("suggestCrystals", () => {
    it("should suggest crystals based on filters and exclusions", async () => {
      // Reset the mock to use the actual implementation
      (suggestCrystals as jest.Mock).mockRestore();

      // Mock Crystal.createQueryBuilder
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            name: "Crystal A",
            inventory: Inventory.HIGH,
          },
          {
            id: 2,
            name: "Crystal B",
            inventory: Inventory.MEDIUM,
          },
        ]),
      };
      (Crystal.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder
      );

      // Partially mock getPreviousShipmentCrystalIds to return specific values
      (getPreviousShipmentCrystalIds as jest.Mock).mockResolvedValue([3, 4]);

      const result = await suggestCrystals({
        selectedCrystalIds: [],
        excludedCrystalIds: [],
        subscriptionId: 100,
        month: 2,
        year: 2024,
        cyclesArray: [1, 2],
        inventory: Inventory.HIGH,
        category: 1,
        location: 2,
        colorId: 3,
      });

      expect(result).toHaveLength(2);
      expect(result[0].inventory).toBe(Inventory.HIGH);
    });
  });

  describe("smartCheckCrystalList", () => {
    it("should identify crystals previously shipped", async () => {
      // Reset the mock to use the actual implementation
      (smartCheckCrystalList as jest.Mock).mockRestore();

      // Partially mock getPreviousShipmentCrystalIds to return specific values
      (getPreviousShipmentCrystalIds as jest.Mock).mockResolvedValue([1, 2, 3]);

      const result = await smartCheckCrystalList({
        month: 2,
        year: 2024,
        cyclesArray: [1, 2],
        subscriptionId: 100,
        selectedCrystalIds: [1, 2, 4, 5],
      });

      expect(result).toEqual([1, 2]);
    });
  });
});
