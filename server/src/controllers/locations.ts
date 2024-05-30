import { Router, Request, Response } from "express";
import { Location } from "../entity/Location";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  const locations = await Location.find();
  locations.sort((a, b) => a.name.localeCompare(b.name));
  res.json(locations);
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const location = await Location.findOneBy({ id: parseInt(req.params.id) });
  if (!location) {
    return res.status(404).send("Location not found");
  }
  res.json(location);
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const location = Location.create(req.body);
    await Location.save(location);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const location = await Location.findOneBy({ id: parseInt(req.params.id) });
  if (!location) {
    return res.status(404).send("Location not found");
  }
  Location.merge(location, req.body);
  await Location.save(location);
  res.json(location);
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const location = await Location.findOneBy({ id: parseInt(req.params.id) });
    if (!location) {
      return res.status(404).send("Location not found");
    }

    await Location.remove(location);

    res.status(204).send();
  }
);

export default router;
