import { Crystal } from "../entity/Crystal";
import { Shipment } from "../entity/Shipment";
import { PreBuild } from "../entity/PreBuild";
import { In, Not, MoreThan } from "typeorm";

// TODO: handle cycle range
// TODO: limit by sub type

const getPreviousShipmentCrystalIds = async (
  month: number,
  year: number,
  cycle: number
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

const getUpcomingPrebuildCrystalIds = async (cycle: number) => {
  const preBuilds = await PreBuild.find({
    where: {
      cycle: MoreThan(cycle),
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
  subscriptionType,
  month,
  year,
  cycle,
}: {
  selectedCrystalIds: string[];
  excludedCrystalIds: string[];
  subscriptionType: string;
  month: number;
  year: number;
  cycle: number;
}) => {
  const previousShipmentCrystalIds = await getPreviousShipmentCrystalIds(
    month,
    year,
    cycle
  );
  const upcomingPrebuildCrystalIds = await getUpcomingPrebuildCrystalIds(month);

  const barredCrystalIds = [
    ...previousShipmentCrystalIds,
    ...upcomingPrebuildCrystalIds,
  ];

  const crystalsNotInIds = await Crystal.find({
    where: {
      id: Not(In(barredCrystalIds)),
    },
  });

  return crystalsNotInIds;
};

// from the current month, year, and cycle, find all previous shipments that this user group has received. i.e. if the current month is 11, year is 2023, and cycle is 3, find month 10, year 2023, cycle 2, month 9, year 2023, cycle 1, etc. Return all crystal ids from all of those shipments. There is no cycle 0. Month 11 2022 precedes month 1 2023.
//
// from the current cycle, find all future prebuilds that this user group would receive. if cycle is 4, return all crystals that exist in prebuilds with a number higher than 4. Return alal crystal ids from all of those prebuilds.
//
// get all crystals and put the ones in the above lists last
//
// order by highest inventory first
//
// get all colors in existing shipment, prioritize crystals with colors that are not in the existing shipment
//
// get all sizes in existing shipment, prioritize crystals with sizes that are not in the existing shipment
//
