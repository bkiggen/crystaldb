import { Router, Request, Response } from "express";
import { Color } from "../entity/Color";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const colors = await Color.find();
  res.json(colors);
});

router.get("/:id", async (req: Request, res: Response) => {
  const color = await Color.findOneBy({ id: parseInt(req.params.id) });
  if (!color) {
    return res.status(404).send("Color not found");
  }
  res.json(color);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const color = Color.create(req.body);
    await Color.save(color);
    res.status(201).json(color);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const color = await Color.findOneBy({ id: parseInt(req.params.id) });
  if (!color) {
    return res.status(404).send("Color not found");
  }
  Color.merge(color, req.body);
  await Color.save(color);
  res.json(color);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const color = await Color.findOneBy({ id: parseInt(req.params.id) });
  if (!color) {
    return res.status(404).send("Color not found");
  }
  await Color.remove(color);
  res.status(204).send();
});

export default router;
