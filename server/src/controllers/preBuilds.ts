import { Router, Request, Response } from "express";
import { PreBuild } from "../entity/PreBuild";
import { Subscription } from "../entity/Subscription";
import { In, ILike } from "typeorm";
import { Crystal } from "../entity/Crystal";
import { authenticateToken } from "./util/authenticateToken";
import { smartCheckCrystalList } from "../services/crystalService";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const { page = 1, pageSize = 1000, searchTerm, subscriptionId } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  let whereCondition = {};

  whereCondition = {
    ...(subscriptionId ? { subscription: { id: subscriptionId } } : {}),
    ...(searchTerm ? { name: ILike(`%${searchTerm}%`) } : {}),
  };

  const [result, total] = await PreBuild.findAndCount({
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

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const shipment = await PreBuild.findOne({
    where: { id: parseInt(req.params.id) },
    relations: { crystals: true },
  });
  if (!shipment) {
    return res.status(404).send("PreBuild not found");
  }
  res.json(shipment);
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { crystalIds, subscriptionId, ...shipmentData } = req.body;
    const subscription = await Subscription.findOneBy({ id: subscriptionId });
    const crystals = await Crystal.findBy({ id: In(crystalIds) });
    const shipment = PreBuild.create({
      ...shipmentData,
      crystals,
      subscription,
    });
    await PreBuild.save(shipment);
    const savedPrebuild = await PreBuild.findOne({
      where: { id: shipment.id },
      relations: ["crystals", "subscription"],
    });
    res.status(201).json(savedPrebuild);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const preBuildId = parseInt(req.params.id);
  let preBuild = await PreBuild.findOneBy({ id: preBuildId });
  const { crystalIds } = req.body;

  if (!preBuild) {
    return res.status(404).send("PreBuild not found");
  }

  if (crystalIds) {
    const crystals = await Crystal.findBy({ id: In(crystalIds) });
    preBuild.crystals = crystals;
  }

  if (req.body.subscriptionId) {
    const subscription = await Subscription.findOneBy({
      id: req.body.subscriptionId,
    });
    preBuild.subscription = subscription;
  }

  PreBuild.merge(preBuild, req.body);
  await PreBuild.save(preBuild);

  const savedPrebuild = await PreBuild.findOne({
    where: { id: preBuildId },
    relations: ["crystals", "subscription"],
  });

  res.json(savedPrebuild);
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const preBuild = await PreBuild.findOneBy({ id: parseInt(req.params.id) });
    if (!preBuild) {
      return res.status(404).send("PreBuild not found");
    }
    await PreBuild.remove(preBuild);
    res.json(preBuild);
  }
);

router.post(
  "/:id/smartCheck",
  authenticateToken,
  async (req: Request, res: Response) => {
    const preBuild = await PreBuild.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["crystals", "subscription"], // Load the related crystals
    });

    if (!preBuild) {
      return res.status(404).json({ message: "PreBuild not found" });
    }

    const crystalIds =
      req.body.crystalIds || preBuild.crystals.map((crystal) => crystal.id);
    const cycles = req.body.cycle || preBuild.cycle;
    const subscriptionId = req.body.subscriptionId || preBuild.subscription.id;

    // Smart check logic here
    const [barredCrystalIds, outInventoryCrystalIds] =
      await smartCheckCrystalList({
        month: req.body.month,
        year: req.body.year,
        cyclesArray: [cycles],
        subscriptionId,
        selectedCrystalIds: crystalIds,
      });

    // return list of crystal ids that do not pass smart check
    res.json({ barredCrystalIds, outInventoryCrystalIds });
  }
);

export default router;
