import { appDataSource } from "../appDataSource";
import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";
import { Subscription } from "../entity/Subscription";
import { colorData, crystalNames, subscriptions } from "./seedData";

async function seedDatabase() {
  await appDataSource.initialize();

  const crystalRepository = appDataSource.getRepository(Crystal);
  const colorRepository = appDataSource.getRepository(Color);
  const subscriptionRepository = appDataSource.getRepository(Subscription);

  // Seed subscriptions
  for (const { name, shortName, cost } of subscriptions) {
    let subscription = await subscriptionRepository.findOneBy({ name });
    if (!subscription) {
      subscription = subscriptionRepository.create({ name, shortName, cost });
    } else {
      subscription.shortName = shortName;
      subscription.cost = cost;
    }
    await subscriptionRepository.save(subscription);
  }
  console.log("Subscription types seeded!");

  // Seed colors
  for (const { name, hex } of colorData) {
    let color = await colorRepository.findOneBy({ name });
    if (!color) {
      color = colorRepository.create({ name, hex });
    } else {
      color.hex = hex;
    }
    await colorRepository.save(color);
  }
  console.log("Colors seeded!");

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
    } else {
      // Update properties if necessary
      // crystal.someProperty = "New Value"; // Example for updating an existing crystal
    }
    await crystalRepository.save(crystal);
  }
  console.log("Crystals seeded!");

  await appDataSource.destroy(); // Close the connection once done
}

seedDatabase().catch((error) => {
  console.error("Error seeding the database:", error);
});
