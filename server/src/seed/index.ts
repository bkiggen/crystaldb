import { appDataSource } from "../appDataSource";
import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";
import { Subscription } from "../entity/Subscription";
import { Shipment } from "../entity/Shipment";
import { In } from "typeorm";
import { colorData, crystalNames, subscriptionData } from "./seedData";
import { shipmentData } from "./shipmentSeedData";

const seedSubscriptions = async () => {
  const subscriptionRepository = appDataSource.getRepository(Subscription);
  for (const { name, shortName, cost } of subscriptionData) {
    let subscription = await subscriptionRepository.findOneBy({ name });
    if (!subscription) {
      subscription = subscriptionRepository.create({ name, shortName, cost });
    }
    await subscriptionRepository.save(subscription);
  }
  console.log("Subscription types seeded!");
};

const seedColors = async () => {
  const colorRepository = appDataSource.getRepository(Color);
  // Seed colors
  for (const { name, hex } of colorData) {
    let color = await colorRepository.findOneBy({ name });
    if (!color) {
      color = colorRepository.create({ name, hex });
    }
    await colorRepository.save(color);
  }
  console.log("Colors seeded!");
};

const seedCrystals = async () => {
  const crystalRepository = appDataSource.getRepository(Crystal);
  // Seed crystals
  for (const crystalName of crystalNames) {
    let crystal = await crystalRepository.findOneBy({ name: crystalName });
    if (!crystal) {
      crystal = crystalRepository.create({
        // @ts-ignore
        name: crystalName,
        category: null,
        rarity: "LOW",
        description: null,
        image: null,
        findAge: "NEW",
      });
    }
    await crystalRepository.save(crystal);
  }
  console.log("Crystals seeded!");
};

const seedShipments = async () => {
  const shipmentRepository = appDataSource.getRepository(Shipment);
  const subscriptionRepository = appDataSource.getRepository(Subscription);
  const crystalRepository = appDataSource.getRepository(Crystal);
  for (const shipmentDataItem of shipmentData) {
    const { month, year, cycle, crystalNames, subscriptionShortName } =
      shipmentDataItem;
    const subscription = await subscriptionRepository.findOneBy({
      shortName: subscriptionShortName,
    });
    if (!subscription) {
      throw new Error(`Subscription not found: ${subscriptionShortName}`);
    }
    const crystals = await crystalRepository.find({
      where: { name: In(crystalNames) },
    });
    if (crystals.length !== crystalNames.length) {
      throw new Error(`Some crystals not found: ${crystalNames}`);
    }
    const shipment = shipmentRepository.create({
      month,
      year,
      cycle,
      subscription,
      crystals,
    });
    await shipmentRepository.save(shipment);
  }
  console.log("Shipments seeded!");
};

const seedDatabase = async () => {
  await appDataSource.initialize();

  seedSubscriptions();
  seedColors();
  seedCrystals();
  seedShipments();

  await appDataSource.destroy(); // Close the connection once done
};

seedDatabase().catch((error) => {
  console.error("Error seeding the database:", error);
});
