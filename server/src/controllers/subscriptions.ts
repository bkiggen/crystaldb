import { Router, Request, Response } from "express";
import { Subscription } from "../entity/Subscription";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const subscription = await Subscription.find();
  res.json(subscription);
});

export default router;
