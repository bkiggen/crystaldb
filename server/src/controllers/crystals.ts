import { Router, Request, Response } from "express";
import { ILike } from "typeorm";
import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";
import { suggestCrystals } from "../services/crystalService";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const { page = 1, pageSize = 1000, searchTerm, inventory } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);

  const sortBy = req.query.sortBy || ("name" as string);
  const sortDirection = req.query.sortDirection || ("asc" as string);

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

router.get(
  "/suggested",
  authenticateToken,
  async (req: Request, res: Response) => {
    const {
      page = 1,
      pageSize = 1000,
      selectedCrystalIds,
      excludedCrystalIds,
      subscriptionId,
      month,
      year,
      cycle,
      cycleRangeStart,
      cycleRangeEnd,
    } = req.query;

    const cycleRangeStartInt = parseInt(cycleRangeStart as string);
    const cycleRangeEndInt = parseInt(cycleRangeEnd as string);

    const selectedCrystalIdsArray = selectedCrystalIds.length
      ? (selectedCrystalIds as string).split(",")
      : [];
    const excludedCrystalIdsArray = excludedCrystalIds.length
      ? (excludedCrystalIds as string).split(",")
      : [];

    let arrayOfRangeNumbers = [];

    // TODO: FINISH THIS

    if (cycleRangeStartInt && cycleRangeEndInt) {
      arrayOfRangeNumbers = Array.from(
        { length: cycleRangeEndInt - cycleRangeStartInt + 1 },
        (_, i) => cycleRangeStartInt + i
      );
    } else {
      arrayOfRangeNumbers = [cycle];
    }

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
  }
);

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) });
  if (!crystal) {
    return res.status(404).send("Crystal not found");
  }
  res.json(crystal);
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
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

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) });
  if (!crystal) {
    return res.status(404).send("Crystal not found");
  }
  Crystal.merge(crystal, req.body);
  await Crystal.save(crystal);
  res.json(crystal);
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const crystal = await Crystal.findOneBy({ id: parseInt(req.params.id) });
    if (!crystal) {
      return res.status(404).send("Crystal not found");
    }
    await Crystal.remove(crystal);
    res.json(crystal);
  }
);

export default router;
