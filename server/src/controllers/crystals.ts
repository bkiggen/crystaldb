import { Router, Request, Response } from "express";
import { ILike } from "typeorm";
import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";
import { suggestCrystals } from "../services/crystalService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { page = 1, pageSize = 1000, searchTerm, inventory } = req.query;
  console.log("🚀 ~ router.get ~ inventory:", inventory);

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  const sortBy = req.query.sortBy || ("name" as string);
  const sortDirection = req.query.sortDirection || ("ASC" as string);

  const order = {
    // @ts-ignore
    [sortBy]: sortDirection,
  };

  let whereCondition = {};
  whereCondition = {
    ...(searchTerm ? { name: ILike(`%${searchTerm}%`) } : {}),
    ...(inventory ? { inventory: inventory } : {}),
  };

  const [result, total] = await Crystal.findAndCount({
    where: whereCondition,
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    order,
    relations: ["color"],
  });

  const paging = {
    totalCount: total,
    totalPages: Math.ceil(total / pageSizeNumber),
    currentPage: pageNumber,
    pageSize: pageSizeNumber,
  };

  res.json({ data: result, paging });
});

router.get("/suggested", async (req: Request, res: Response) => {
  const {
    page = 1,
    pageSize = 1000,
    selectedCrystalIds,
    excludedCrystalIds,
    subscriptionId,
    month,
    year,
    cycle,
  } = req.query;

  // TODO: handle cycle range

  const selectedCrystalIdsArray = selectedCrystalIds.length
    ? (selectedCrystalIds as string).split(",")
    : [];
  const excludedCrystalIdsArray = excludedCrystalIds.length
    ? (excludedCrystalIds as string).split(",")
    : [];

  const suggestions = await suggestCrystals({
    selectedCrystalIds: selectedCrystalIdsArray,
    excludedCrystalIds: excludedCrystalIdsArray,
    subscriptionId: parseInt(subscriptionId as string),
    month: parseInt(month as string),
    year: parseInt(year as string),
    cycle: parseInt(cycle as string),
  });

  const total = 100;
  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  const paging = {
    totalCount: total,
    totalPages: Math.ceil(total / pageSizeNumber),
    currentPage: pageNumber,
    pageSize: pageSizeNumber,
  };

  res.json({ data: suggestions, paging });
});

router.get("/:id", async (req: Request, res: Response) => {
  const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) });
  if (!crystal) {
    return res.status(404).send("Crystal not found");
  }
  res.json(crystal);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const color = await Color.findOneBy({ id: req.body.colorId });
    if (!color) {
      return res.status(404).send("Color not found");
    }

    const crystal = Crystal.create({ ...req.body, color });
    await Crystal.save(crystal);
    res.status(201).json(crystal);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) });
  if (!crystal) {
    return res.status(404).send("Crystal not found");
  }
  Crystal.merge(crystal, req.body);
  await Crystal.save(crystal);
  res.json(crystal);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) });
  if (!crystal) {
    return res.status(404).send("Crystal not found");
  }
  await Crystal.remove(crystal);
  res.status(204).send();
});

export default router;
