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
    const { email, password, nickname } = req.body;
    if (!(email && password && nickname)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await User.findOneBy({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const user = User.create({
      email,
      nickname,
      password: encryptedPassword,
    });

    await User.save(user);

    const token = jwt.sign({ user_id: user.id, email }, JWT_SECRET, {
      expiresIn: jwtExpirySeconds,
    });

    return res
      .status(200)
      .json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await User.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user.id, email }, JWT_SECRET, {
        expiresIn: jwtExpirySeconds,
      });

      return res
        .status(200)
        .json({ token, user: { id: user.id, email: user.email } });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
