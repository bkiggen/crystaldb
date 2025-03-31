import { Router, Request, Response } from "express";
import { Color } from "../entity/Color";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  try {
    const colors = await Color.find();
    colors.sort((a, b) => a.name.localeCompare(b.name));
    res.json(colors);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const color = await Color.findOneBy({ id: parseInt(req.params.id) });
    if (!color) {
      return res.status(404).send("Color not found");
    }
    res.json(color);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const color = Color.create(req.body);
    await Color.save(color);
    res.status(201).json(color);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const color = await Color.findOneBy({ id: parseInt(req.params.id) });
    if (!color) {
      return res.status(404).send("Color not found");
    }
    Color.merge(color, req.body);
    await Color.save(color);
    res.json(color);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const color = await Color.findOneBy({ id: parseInt(req.params.id) });
      if (!color) {
        return res.status(404).send("Color not found");
      }

      await Color.remove(color);

      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

export default router;
