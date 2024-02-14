import { Router, Request, Response } from "express";
import { Shipment } from "../entity/Shipment";
import { Subscription } from "../entity/Subscription";
import { In, ILike } from "typeorm";
import { Crystal } from "../entity/Crystal";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { page = 1, pageSize = 1000, searchTerm, subscriptionId } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  let whereCondition = {};

  whereCondition = {
    ...(subscriptionId ? { subscription: { id: subscriptionId } } : {}),
    ...(searchTerm ? { name: ILike(`%${searchTerm}%`) } : {}),
  };

  const [result, total] = await Shipment.findAndCount({
    where: whereCondition,
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    order: {
      createdAt: "ASC",
    },
    relations: ["crystals", "subscription"],
  });

  const paging = {
    totalCount: total,
    totalPages: Math.ceil(total / pageSizeNumber),
    currentPage: pageNumber,
    pageSize: pageSizeNumber,
  };

  res.json({ data: result, paging });
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
    const { crystalIds, subscriptionId, ...shipmentData } = req.body;
    const subscription = await Subscription.findOneBy({ id: subscriptionId });
    const crystals = await Crystal.findBy({ id: In(crystalIds) });
    const shipment = Shipment.create({
      ...shipmentData,
      crystals,
      subscription,
    });
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
  res.json(shipment);
});

export default router;
