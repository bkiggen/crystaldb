import "reflect-metadata";
import express from "express";
import cors from "cors";
import { appDataSource } from "./appDataSource";
import crystalRoutes from "./controllers/crystals";
import colorRoutes from "./controllers/colors";
import shipmentRoutes from "./controllers/shipments";
import subscriptionRoutes from "./controllers/subscriptions";

const app = express();
app.use(cors());
app.use(express.json());

const main = async () => {
  try {
    await appDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.use("/crystals", crystalRoutes);
    app.use("/colors", colorRoutes);
    app.use("/shipments", shipmentRoutes);
    app.use("/subscriptions", subscriptionRoutes);

    app.listen(4000, () => {
      console.log("REST API server running at http://localhost:4000/");
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};
main();
