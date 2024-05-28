import { Router, Request, Response } from "express";
import { Category } from "../entity/Category";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const category = await Category.findOneBy({ id: parseInt(req.params.id) });
  if (!category) {
    return res.status(404).send("Category not found");
  }
  res.json(category);
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const category = Category.create(req.body);
    await Category.save(category);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const category = await Category.findOneBy({ id: parseInt(req.params.id) });
  if (!category) {
    return res.status(404).send("Category not found");
  }
  Category.merge(category, req.body);
  await Category.save(category);
  res.json(category);
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const category = await Category.findOneBy({ id: parseInt(req.params.id) });
    if (!category) {
      return res.status(404).send("Category not found");
    }

    await Category.remove(category);

    res.status(204).send();
  }
);

export default router;
