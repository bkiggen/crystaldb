import { Crystal, Inventory } from "../entity/Crystal";
import { Shipment } from "../entity/Shipment";
import { PreBuild } from "../entity/PreBuild";
import { In, Not, MoreThan } from "typeorm";

// TODO: handle cycle range

const getPreviousShipmentCrystalIds = async (
  month: number,
  year: number,
  cycle: number,
  subscriptionId: number
) => {
  const previouslySentCrystals = [];

  let currentCycle = cycle;
  let currentMonth = month;
  let currentYear = year;

  while (currentCycle > 1) {
    currentCycle--;

    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }

    const shipment = await Shipment.findOne({
      where: {
        month: currentMonth,
        year: currentYear,
        cycle: currentCycle,
        subscription: {
          id: subscriptionId,
        },
      },
      relations: {
        crystals: true,
      },
    });

    if (shipment) {
      const crystalIds = shipment?.crystals.map((crystal) => crystal.id) || [];

      previouslySentCrystals.push(...crystalIds);
    }
  }

  const uniqueCrystals = [...new Set(previouslySentCrystals)];

  return uniqueCrystals;
};

const getUpcomingPrebuildCrystalIds = async (
  cycle: number,
  subscriptionId: number
) => {
  const preBuilds = await PreBuild.find({
    where: {
      cycle: MoreThan(cycle),
      subscription: {
        id: subscriptionId,
      },
    },
    relations: {
      crystals: true,
    },
  });

  const crystalIds = new Set(
    preBuilds.flatMap((preBuild) =>
      preBuild.crystals.map((crystal) => crystal.id)
    )
  );

  const uniqueCrystalIds = Array.from(crystalIds);

  return uniqueCrystalIds;
};

export const suggestCrystals = async ({
  selectedCrystalIds = [],
  excludedCrystalIds = [],
  subscriptionId,
  month,
  year,
  cycle,
}: {
  selectedCrystalIds: string[];
  excludedCrystalIds: string[];
  subscriptionId: number;
  month: number;
  year: number;
  cycle: number;
}) => {
  const previousShipmentCrystalIds = await getPreviousShipmentCrystalIds(
    month,
    year,
    cycle,
    subscriptionId
  );
  const upcomingPrebuildCrystalIds = await getUpcomingPrebuildCrystalIds(
    cycle,
    subscriptionId
  );

  const barredCrystalIds = [
    ...previousShipmentCrystalIds,
    ...upcomingPrebuildCrystalIds,
    ...excludedCrystalIds,
    ...selectedCrystalIds,
  ];

  const crystalsNotInIds = await Crystal.createQueryBuilder("crystal")
    .where({ id: Not(In(barredCrystalIds)) })
    // Use CASE WHEN THEN END for custom sorting
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
    .getMany();

  // TODO:
  // Handle suggesting crystals they've gotten once or twice or whatever
  //
  // get all colors in existing shipment, prioritize crystals with colors that are not in the existing shipment
  //
  // get all sizes in existing shipment, prioritize crystals with sizes that are not in the existing shipment

  return crystalsNotInIds;
};
