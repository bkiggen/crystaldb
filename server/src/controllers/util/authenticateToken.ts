import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    // No token
    res.status(401).json({ message: "This action is not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // expired token
      res.status(403).json({ message: "This action is not authorized" });
    }
    req.user = user;
    next();
  });
};
