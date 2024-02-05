import { Router, Request, Response } from "express";
import { Crystal } from "../entity/Crystal";
import { Color } from "../entity/Color";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const crystals = await Crystal.find({ relations: ["color"] });
  res.json(crystals);
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
