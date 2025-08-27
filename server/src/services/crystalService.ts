import { Crystal, Inventory } from "../entity/Crystal";
import { Shipment } from "../entity/Shipment";
// import { PreBuild } from "../entity/PreBuild";
import { In, Not, SelectQueryBuilder } from "typeorm";

const getPreviousShipmentCrystalIds = async (
  month: number,
  year: number,
  cyclesArray: number[],
  subscriptionId: number,
  lookbackLimit = 0
) => {
  const previouslySentCrystals = [];

  for (let cycle of cyclesArray) {
    let currentCycle = cycle;
    let currentMonth = month;
    let currentYear = year;

    const minCycle = Math.max(1, currentCycle - lookbackLimit);

    while (currentCycle > minCycle) {
      currentCycle--;

      // Adjust month and year as needed
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }

      // Fetch shipments for the previous cycle
      const specificCycleShipment = await Shipment.findOne({
        where: {
          month: currentMonth,
          year: currentYear,
          cycle: currentCycle,
          subscription: {
            id: subscriptionId,
          },
        },
        relations: ["crystals"],
      });

      if (specificCycleShipment) {
        const crystalIds = specificCycleShipment.crystals.map(
          (crystal) => crystal.id
        );
        previouslySentCrystals.push(...crystalIds);
      }
    }
  }

  // Ensure unique crystal IDs
  const uniqueCrystals = [...new Set(previouslySentCrystals)];

  return uniqueCrystals;
};

// const getUpcomingPrebuildCrystalIds = async (
//   cyclesArray: number[],
//   subscriptionId: number
// ) => {
//   const crystalIds = new Set<number>()

//   for (let cycle of cyclesArray) {
//     const preBuilds = await PreBuild.find({
//       where: {
//         cycle: MoreThan(cycle),
//         subscription: {
//           id: subscriptionId,
//         },
//       },
//       relations: {
//         crystals: true,
//       },
//     })

//     preBuilds.forEach(preBuild =>
//       preBuild.crystals.forEach(crystal => crystalIds.add(crystal.id))
//     )
//   }

//   const uniqueCrystalIds = Array.from(crystalIds)

//   return uniqueCrystalIds
// }

export const addFilters = (query: SelectQueryBuilder<any>, allFilters: any) => {
  Object.keys(allFilters).forEach((filterKey) => {
    const filterValue = allFilters[filterKey];
    if (typeof filterValue === "string" && filterValue.trim() !== "") {
      const filterArray = filterValue.split(",").map((item) => item.trim());
      if (filterArray.length > 0) {
        if (filterKey === "location") {
          query = query.andWhere("location.id NOT IN (:...locationIds)", {
            locationIds: filterArray,
          });
        } else if (filterKey === "category") {
          query = query.andWhere("category.id NOT IN (:...categoryIds)", {
            categoryIds: filterArray,
          });
        } else if (filterKey === "colorId") {
          query = query.andWhere("color.id NOT IN (:...colorIds)", {
            colorIds: filterArray,
          });
        } else {
          // Default filtering
          query = query.andWhere(
            `crystal.${filterKey} NOT IN (:...${filterKey})`,
            { [filterKey]: filterArray }
          );
        }
      }
    }
  });
  return query;
};

export const suggestCrystals = async ({
  selectedCrystalIds = [],
  excludedCrystalIds = [],
  subscriptionId,
  month,
  year,
  cyclesArray = [],
  inventory,
  category,
  location,
  colorId,
  lookbackLimit,
}) => {
  const previousShipmentCrystalIds = await getPreviousShipmentCrystalIds(
    month,
    year,
    cyclesArray,
    subscriptionId,
    lookbackLimit
  );
  // const upcomingPrebuildCrystalIds = await getUpcomingPrebuildCrystalIds(
  //   cyclesArray,
  //   subscriptionId
  // )

  const barredCrystalIds = [
    ...previousShipmentCrystalIds,
    // ...upcomingPrebuildCrystalIds,
    ...excludedCrystalIds,
    ...selectedCrystalIds,
  ];

  let query = Crystal.createQueryBuilder("crystal").where({
    id: Not(In(barredCrystalIds)),
  });

  const allFilters = {
    ...(inventory && { inventory }),
    ...(category && { category }),
    ...(location && { location }),
    ...(colorId && { colorId }),
  };

  query = addFilters(query, allFilters);

  const crystalsNotInIds = await query
    .orderBy(
      `
    CASE 
      WHEN crystal.inventory = '${Inventory.HIGH}' THEN 1
      WHEN crystal.inventory = '${Inventory.MEDIUM}' THEN 2
      WHEN crystal.inventory = '${Inventory.LOW}' THEN 3
      WHEN crystal.inventory = '${Inventory.OUT}' THEN 4
      ELSE 5
    END
    `,
      "ASC"
    )
    .addOrderBy("crystal.name", "ASC")
    .leftJoinAndSelect("crystal.color", "color")
    .leftJoinAndSelect("crystal.category", "category")
    .leftJoinAndSelect("crystal.location", "location")
    .getMany();

  return crystalsNotInIds;
};

export const smartCheckCrystalList = async ({
  month,
  year,
  cyclesArray,
  subscriptionId,
  selectedCrystalIds,
  lookbackLimit,
}) => {
  const previousShipmentCrystalIds = await getPreviousShipmentCrystalIds(
    month,
    year,
    cyclesArray,
    subscriptionId,
    lookbackLimit
  );

  const shippedSelectedCrystals = selectedCrystalIds.filter((id) =>
    previousShipmentCrystalIds.includes(id)
  );

  const outInventoryCrystals = await Crystal.createQueryBuilder("crystal")
    .select("crystal.id")
    .where("crystal.id IN (:...ids)", { ids: selectedCrystalIds })
    .andWhere("crystal.inventory = :inventory", { inventory: Inventory.OUT })
    .getMany();

  const outInventoryCrystalIds = outInventoryCrystals.map((row) => row.id);

  return [shippedSelectedCrystals, outInventoryCrystalIds];
};
