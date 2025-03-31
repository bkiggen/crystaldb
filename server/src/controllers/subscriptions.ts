import { Router, Request, Response } from "express";
import { Subscription } from "../entity/Subscription";
import { authenticateToken } from "./util/authenticateToken";

const router = Router();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  try {
    const subscription = await Subscription.find();
    res.json(subscription);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
