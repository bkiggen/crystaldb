import { Router, Request, Response } from "express";
import { PreBuild } from "../entity/PreBuild";
import { sortStringRanges } from "./util/sortStringRanges";
import { Subscription } from "../entity/Subscription";
import { In, ILike } from "typeorm";
import { Crystal } from "../entity/Crystal";
import { authenticateToken } from "./util/authenticateToken";
import { smartCheckCrystalList } from "../services/crystalService";
import { parseCycles } from "./util/parseStringToNumbersArray";
import { findConflictingPrebuilds } from "./util/prebuildUtils";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 1000, searchTerm, subscriptionId } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSizeNumber = parseInt(pageSize as string);

    let whereCondition = {};

    whereCondition = {
      ...(subscriptionId ? { subscription: { id: subscriptionId } } : {}),
      ...(searchTerm ? { cycle: ILike(`%${searchTerm}%`) } : {}),
    };

    const [result, total] = await PreBuild.findAndCount({
      where: whereCondition,
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
      order: {
        subscription: { id: "ASC" }, // Correctly order by subscriptionId
        cycle: "ASC", // Then by cycle in ascending order
      },
      relations: ["crystals", "subscription"],
    });

    const sortedResult = sortStringRanges(result);

    const paging = {
      totalCount: total,
      totalPages: Math.ceil(total / pageSizeNumber),
      currentPage: pageNumber,
      pageSize: pageSizeNumber,
    };

    res.json({ data: sortedResult, paging });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const shipment = await PreBuild.findOne({
      where: { id: parseInt(req.params.id) },
      relations: { crystals: true },
    });
    if (!shipment) {
      return res.status(404).send("PreBuild not found");
    }
    res.json(shipment);
  } catch (error) {
    res.status(500).send(error.message);
  }
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
  try {
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
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const preBuild = await PreBuild.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!preBuild) {
        return res.status(404).send("PreBuild not found");
      }
      await PreBuild.remove(preBuild);
      res.json(preBuild);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  "/:id/smartCheck",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
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

      const subscriptionId =
        req.body.subscriptionId || preBuild.subscription.id;

      const cyclesArray = parseCycles(cycles);

      // Smart check logic here
      const [barredCrystalIds, outInventoryCrystalIds] =
        await smartCheckCrystalList({
          month: req.body.month,
          year: req.body.year,
          cyclesArray,
          subscriptionId,
          selectedCrystalIds: crystalIds,
          lookbackLimit: req.body.lookbackLimit,
        });

      // return list of crystal ids that do not pass smart check
      res.json({ barredCrystalIds, outInventoryCrystalIds });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  "/smartCheckSelected",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // Fetch PreBuilds with related entities
      const preBuilds = await PreBuild.find({
        where: { id: In(req.body.prebuildIds) },
        relations: ["crystals", "subscription"],
      });

      if (!preBuilds.length) {
        return res.status(404).json({ message: "PreBuilds not found" });
      }

      const badPrebuilds = [];

      for (const preBuild of preBuilds) {
        const selectedCrystalIds = preBuild.crystals.map(
          (crystal) => crystal.id
        );

        // Skip processing if no crystals are present
        if (!selectedCrystalIds.length) {
          continue;
        }

        const cyclesArray = parseCycles(preBuild.cycle);

        if (cyclesArray.length) {
          // Perform the smart check
          const [barredCrystalIds, outInventoryCrystalIds] =
            await smartCheckCrystalList({
              month: req.body.month,
              year: req.body.year,
              cyclesArray,
              subscriptionId: preBuild.subscription.id,
              selectedCrystalIds,
              lookbackLimit: req.body.lookbackLimit,
            });

          const allCrystalIds = [
            ...barredCrystalIds,
            ...outInventoryCrystalIds,
          ];

          if (allCrystalIds.length > 0) {
            badPrebuilds.push({
              id: preBuild.id,
              barredCrystalIds,
              outInventoryCrystalIds,
            });
          }
        }
      }

      // Check for conflicting cycles
      const conflictingCyclePrebuilds = findConflictingPrebuilds(
        preBuilds,
        req.body.prebuildIds
      );

      res.json({ badPrebuilds, conflictingCyclePrebuilds });
    } catch (error) {
      console.error("Error in smartCheckSelected:", error);
      res.status(500).json({ message: "An internal server error occurred" });
    }
  }
);

export default router;
