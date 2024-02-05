import { Router, Request, Response } from "express";
import { Shipment } from "../entity/Shipment";
import { In } from "typeorm";
import { Crystal } from "../entity/Crystal";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const shipments = await Shipment.find({ relations: ["crystals"] });
  res.json(shipments);
});

router.get("/:id", async (req: Request, res: Response) => {
  const shipment = await Shipment.findOne({
    where: { id: parseInt(req.params.id) },
    relations: { crystals: true },
  });
  if (!shipment) {
    return res.status(404).send("Shipment not found");
  }
  res.json(shipment);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { crystalIds, ...shipmentData } = req.body;
    const crystals = await Crystal.findBy({ id: In(crystalIds) });
    const shipment = Shipment.create({ ...shipmentData, crystals });
    await Shipment.save(shipment);
    res.status(201).json(shipment);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  let shipment = await Shipment.findOneBy({ id: parseInt(req.params.id) });
  const { crystalIds } = req.body;
  if (!shipment) {
    return res.status(404).send("Shipment not found");
  }
  if (crystalIds) {
    const crystals = await Crystal.findBy({ id: In(crystalIds) });
    shipment.crystals = crystals;
  }
  Shipment.merge(shipment, req.body);
  await Shipment.save(shipment);
  res.json(shipment);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const shipment = await Shipment.findOneBy({ id: parseInt(req.params.id) });
  if (!shipment) {
    return res.status(404).send("Shipment not found");
  }
  await Shipment.remove(shipment);
  res.status(204).send();
});

export default router;
