import { Router, Request, Response } from "express";
import { Subscription } from "../entity/Subscription";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  const subscription = await Subscription.find();
  res.json(subscription);
});

export default router;
