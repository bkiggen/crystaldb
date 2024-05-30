import { Router, Request, Response } from "express";
import { Shipment } from "../entity/Shipment";
import { Subscription } from "../entity/Subscription";
import { In, ILike } from "typeorm";
import { Crystal } from "../entity/Crystal";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const {
    page = 1,
    pageSize = 1000,
    searchTerm,
    subscriptionId,
    month,
    year,
  } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  let whereCondition: any = {};

  whereCondition = {
    ...(subscriptionId ? { subscription: { id: subscriptionId } } : {}),
    ...(month ? { month: parseInt(month as string) } : {}),
    ...(year ? { year: parseInt(year as string) } : {}),
    ...(searchTerm ? { name: ILike(`%${searchTerm}%`) } : {}),
  };

  const [result, total] = await Shipment.findAndCount({
    where: whereCondition,
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    order: {
      subscription: { id: "ASC" }, // order by subscriptionId
      cycle: "ASC", // Then by cycle in ascending order
      year: "DESC", // Then by year in descending order
      month: "DESC", // Then by month in descending order
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

router.post("/", authenticateToken, async (req: Request, res: Response) => {
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

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  let shipment = await Shipment.findOneBy({ id: parseInt(req.params.id) });
  const { crystalIds } = req.body;
  if (!shipment) {
    return res.status(404).send("Shipment not found");
  }
  if (crystalIds) {
    const crystals = await Crystal.findBy({ id: In(crystalIds) });
    shipment.crystals = crystals;
  }
  if (req.body.subscriptionId) {
    const subscription = await Subscription.findOneBy({
      id: req.body.subscriptionId,
    });
    if (subscription) {
      shipment.subscription = subscription;
    }
  }
  Shipment.merge(shipment, req.body);
  await Shipment.save(shipment);
  res.json(shipment);
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const shipment = await Shipment.findOneBy({ id: parseInt(req.params.id) });
    if (!shipment) {
      return res.status(404).send("Shipment not found");
    }
    await Shipment.remove(shipment);
    res.json(shipment);
  }
);

export default router;
