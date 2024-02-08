import { appDataSource } from "../appDataSource";
import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";
import { colorData, crystalNames } from "./seedData";

async function seedDatabase() {
  await appDataSource.initialize();

  const crystalRepository = appDataSource.getRepository(Crystal);
  const colorRepository = appDataSource.getRepository(Color);

  for (const { name, hex } of colorData) {
    const colorExists = await colorRepository.findOneBy({ name });
    if (!colorExists) {
      const newColor = colorRepository.create({ name, hex });
      await colorRepository.save(newColor);
    }
  }

  for (const crystalName of crystalNames) {
    const newCrystal = crystalRepository.create({
      // @ts-ignore
      name: crystalName,
      category: null,
      rarity: "LOW",
      description: null,
      image: null,
      findAge: "NEW",
    });
    await crystalRepository.save(newCrystal);
  }

  console.log("Crystals seeded successfully.");

  await appDataSource.destroy(); // Close the connection once done
}

seedDatabase().catch((error) => {
  console.error("Error seeding the database:", error);
});
