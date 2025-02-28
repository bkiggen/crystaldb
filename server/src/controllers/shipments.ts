import { Router, Request, Response } from "express";
import { Shipment } from "../entity/Shipment";
import { Subscription } from "../entity/Subscription";
import { In } from "typeorm";
import { Crystal } from "../entity/Crystal";
import { authenticateToken } from "./util/authenticateToken";
import { parseCycleCSVToNumbersArray } from "./util/parseStringToNumbersArray";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const {
    page = 1,
    pageSize = 50,
    searchTerm,
    subscriptionId,
    month,
    year,
    cycle,
  } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  let whereCondition: any = {};

  whereCondition = {
    ...(subscriptionId ? { subscription: { id: subscriptionId } } : {}),
    ...(month ? { month: parseInt(month as string) } : {}),
    ...(year ? { year: parseInt(year as string) } : {}),
    ...(cycle ? { cycle: parseInt(cycle as string) } : {}),
    ...(searchTerm ? { groupLabel: searchTerm } : {}),
  };

  const [shipments, total] = await Shipment.findAndCount({
    where: whereCondition,
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    order: {
      subscription: { id: "ASC" }, // Correctly order by subscriptionId
      year: "DESC", // Then by year in descending order
      month: "DESC", // Then by month in descending order
      cycle: "ASC", // Then by cycle in ascending order
    },
    relations: ["crystals", "subscription"],
  });

  const paging = {
    totalCount: total,
    totalPages: Math.ceil(total / pageSizeNumber),
    currentPage: pageNumber,
    pageSize: pageSizeNumber,
  };

  res.json({ data: shipments, paging });
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const shipment = await Shipment.findOne({
    where: { id: parseInt(req.params.id) },
    relations: { crystals: true },
  });
  if (!shipment) {
    return res.status(404).send("Shipment not found");
  }
  res.json(shipment);
});

// Helper function to create and save a shipment
const createAndSaveShipment = async (
  cycle: number,
  shipmentData,
  crystals,
  subscription
) => {
  const groupLabel =
    shipmentData.groupLabel ||
    `${subscription.shortName} - ${cycle} (${shipmentData.month + 1}/${
      shipmentData.year
    })`;

  const shipment = Shipment.create({
    ...shipmentData,
    cycle,
    crystals,
    groupLabel,
    subscription,
  });
  await Shipment.save(shipment);
  return shipment;
};

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { crystalIds, subscriptionId, cycleString, ...shipmentData } =
      req.body;
    const subscription = await Subscription.findOneBy({ id: subscriptionId });
    const crystals = await Crystal.findBy({ id: In(crystalIds) });

    if (!subscription) {
      return res.status(400).send("Subscription not found");
    }

    // parse out all the cycles from the cycleString
    const cyclesArray = parseCycleCSVToNumbersArray(cycleString);

    let newShipments = [];

    if (cyclesArray.length > 0) {
      for (const cycle of cyclesArray) {
        const shipment = await createAndSaveShipment(
          cycle,
          shipmentData,
          crystals,
          subscription
        );
        newShipments.push(shipment);
      }
    } else {
      return res.status(400).send("Cycle must be provided");
    }

    res.json(newShipments);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { crystalIds, subscriptionId, isBulkEdit } = req.body;

  const shipment = await Shipment.findOne({
    where: { id: parseInt(req.params.id) },
    relations: ["subscription"],
  });

  if (!shipment) {
    return res.status(404).send("Shipment not found");
  }

  const subscription = subscriptionId
    ? await Subscription.findOneBy({
        id: subscriptionId || shipment.subscription.id,
      })
    : null;

  const crystals = crystalIds
    ? await Crystal.findBy({ id: In(crystalIds) })
    : null;

  try {
    if (isBulkEdit) {
      if (!shipment.groupLabel) {
        return res.status(400).send("groupLabel is required for bulk edits");
      }

      const shipments = await Shipment.find({
        where: { groupLabel: shipment.groupLabel },
        relations: ["subscription", "crystals"],
      });

      if (!shipments.length) {
        return res
          .status(404)
          .send("No shipments found for the provided groupLabel");
      }

      const updatedShipments = shipments.map((singleShipment) => {
        // Update associations if provided
        if (crystals) {
          singleShipment.crystals = crystals;
        }

        if (subscription) {
          singleShipment.subscription = subscription;
        }

        // Merge other fields from req.body into the shipment
        const newData = { ...req.body };
        delete newData.id;
        Shipment.merge(singleShipment, newData);

        return singleShipment;
      });

      // Save all updated shipments in bulk
      const savedShipments = await Shipment.save(updatedShipments);

      return res.json(savedShipments); // Return the updated shipments
    } else {
      // Single update logic

      // Update crystals if provided
      if (crystals) {
        shipment.crystals = crystals;
      }

      if (subscription) {
        shipment.subscription = subscription;
      }

      // Merge other fields from req.body into the shipment
      Shipment.merge(shipment, req.body);

      // Save the shipment
      const updatedShipment = await Shipment.save(shipment);

      return res.json([updatedShipment]); // Return the updated shipment
    }
  } catch (error) {
    console.error("Error updating shipment(s):", error);
    return res.status(500).send("An error occurred while updating shipment(s)");
  }
});

router.post(
  "/updateSelected",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { newData, selectedIds } = req.body;
    const { crystalIds, subscriptionId } = newData;

    const shipments = await Shipment.find({
      where: { id: In(selectedIds.map((id) => parseInt(id, 10))) },
      relations: ["subscription", "crystals"],
    });

    if (!shipments.length) {
      return res.status(404).send("Shipment not found");
    }

    const subscription = subscriptionId
      ? await Subscription.findOneBy({
          id: subscriptionId,
        })
      : null;

    const crystals = crystalIds
      ? await Crystal.findBy({ id: In(crystalIds) })
      : null;

    const updatedShipments = shipments.map((singleShipment) => {
      // Update associations if provided
      if (crystals) {
        singleShipment.crystals = crystals;
      }

      if (subscription) {
        singleShipment.subscription = subscription;
      }

      Shipment.merge(singleShipment, newData);

      return singleShipment;
    });

    // Save all updated shipments in bulk
    const savedShipments = await Shipment.save(updatedShipments);

    return res.json(savedShipments); // Return the updated shipments
  }
);

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const ids = req.params.id.split(",").map((id) => parseInt(id));
    const shipments = await Shipment.findBy({ id: In(ids) });

    if (shipments.length === 0) {
      return res.status(404).send("Shipment(s) not found");
    }

    try {
      let allShipmentsToDelete = [...shipments];

      if (req.body.isBulkDelete) {
        const relatedShipments = await Shipment.findBy({
          groupLabel: In(shipments.map((s) => s.groupLabel).filter(Boolean)),
        });

        allShipmentsToDelete = [
          ...new Set([...allShipmentsToDelete, ...relatedShipments]),
        ];
      }

      const deletedIds = allShipmentsToDelete.map((shipment) => shipment.id);

      await Shipment.remove(allShipmentsToDelete);

      res.json({ deletedIds });
    } catch (error) {
      console.error("Error during shipment deletion:", error);
      res.status(500).send("An error occurred while deleting shipments");
    }
  }
);

export default router;
