import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { appDataSource } from "./appDataSource";
import crystalRoutes from "./controllers/crystals";
import colorRoutes from "./controllers/colors";
import shipmentRoutes from "./controllers/shipments";
import preBuildRoutes from "./controllers/preBuilds";
import subscriptionRoutes from "./controllers/subscriptions";
import locationsRoutes from "./controllers/locations";
import categoriesRoutes from "./controllers/categories";
import userRoutes from "./controllers/users";
import crateJoyRoutes from "./controllers/crateJoy";
import shipStationRoutes from "./controllers/shipStation";

export const app = express(); // Export the app for testing
app.use(cors());
app.use(express.json());

// Initialize routes
app.use("/crystals", crystalRoutes);
app.use("/colors", colorRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/users", userRoutes);
app.use("/preBuilds", preBuildRoutes);
app.use("/locations", locationsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/crateJoy", crateJoyRoutes);
app.use("/shipStation", shipStationRoutes);

const startServer = async () => {
  try {
    await appDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(4000, () => {
      console.log("REST API server running at http://localhost:4000/");
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}
