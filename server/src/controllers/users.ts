import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const saltRounds = 10; // For bcrypt password hashing
const jwtExpirySeconds = 864000; // 10 days

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { secret, password, nickname } = req.body;
    const validSecret = process.env.NEW_USER_SECRET;
    if (!(password && nickname)) {
      return res.status(400).json({ message: "All input is required" });
    }
    if (secret !== validSecret) {
      return res.status(403).json({ message: "Invalid Secret" });
    }

    const oldUser = await User.findOneBy({ nickname });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const user = User.create({
      nickname,
      password: encryptedPassword,
    });

    await User.save(user);

    const token = jwt.sign({ user_id: user.id }, JWT_SECRET, {
      expiresIn: jwtExpirySeconds,
    });

    return res
      .status(200)
      .json({ token, user: { id: user.id, nickname: user.nickname } });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { nickname, password } = req.body;

    if (!(nickname && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    const user = await User.findOneBy({ nickname });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user.id, nickname }, JWT_SECRET, {
        expiresIn: jwtExpirySeconds,
      });

      return res
        .status(200)
        .json({ token, user: { id: user.id, nickname: user.nickname } });
    }
    return res.status(400).json({ message: "Invalid Credentials" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
